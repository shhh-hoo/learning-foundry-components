import {
  COMPONENT_PROTOCOL_NAME,
  COMPONENT_PROTOCOL_VERSION,
} from "./capability";
import type {
  ComponentCapabilityManifest,
  SchemaReference,
} from "./capability";
import type { ComponentDeploymentBinding } from "./deployment";
import type {
  ComponentControlMessage,
  ComponentEvent,
  ComponentReadyMessage,
  LearningCapabilityExecution,
  LearningCapabilityExecutionResult,
} from "./runtime";

const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`FOUNDRY_PROTOCOL_CONFORMANCE: ${message}`);
}

function assertSchemaReference(reference: SchemaReference, label: string): void {
  invariant(reference.id.trim().length > 0, `${label}.id must be non-empty.`);
  invariant(SEMVER.test(reference.version), `${label}.version must be semver-like.`);
  invariant(reference.format !== "EXT:", `${label}.format contains an empty extension format.`);
  if (reference.uri !== undefined) {
    invariant(reference.uri.trim().length > 0, `${label}.uri must be non-empty when provided.`);
  }
}

function assertProtocolEnvelope(
  value: { readonly protocol: string; readonly protocolVersion: string },
  label: string,
): void {
  invariant(value.protocol === COMPONENT_PROTOCOL_NAME, `${label}.protocol must be ${COMPONENT_PROTOCOL_NAME}.`);
  invariant(value.protocolVersion === COMPONENT_PROTOCOL_VERSION, `${label}.protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`);
}

function assertExactIdentity(
  value: {
    readonly componentId: string;
    readonly componentVersion: string;
    readonly capabilityId: string;
    readonly invocationId: string;
  },
  label: string,
): void {
  invariant(value.invocationId.trim().length > 0, `${label}.invocationId must be non-empty.`);
  invariant(value.componentId.trim().length > 0, `${label}.componentId must be non-empty.`);
  invariant(SEMVER.test(value.componentVersion), `${label}.componentVersion must be an exact semver-like version.`);
  invariant(value.capabilityId.trim().length > 0, `${label}.capabilityId must be non-empty.`);
}

/**
 * Small dependency-free guardrail intended for component authors, CI and Codex.
 * Family schemas should add their own validators behind the referenced schema IDs.
 */
export function assertManifestConforms(manifest: ComponentCapabilityManifest): void {
  invariant(
    manifest.manifestSchemaVersion === COMPONENT_PROTOCOL_VERSION,
    `manifestSchemaVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  invariant(manifest.componentId.trim().length > 0, "componentId must be non-empty.");
  invariant(SEMVER.test(manifest.componentVersion), "componentVersion must be semver-like.");
  invariant(manifest.componentType.trim().length > 0, "componentType must be non-empty.");
  invariant(manifest.capabilities.length > 0, "manifest must expose at least one capability.");

  const capabilityIds = new Set<string>();
  for (const [index, capability] of manifest.capabilities.entries()) {
    const label = `capabilities[${index}]`;
    invariant(capability.capabilityId.trim().length > 0, `${label}.capabilityId must be non-empty.`);
    invariant(!capabilityIds.has(capability.capabilityId), `duplicate capabilityId ${capability.capabilityId}.`);
    capabilityIds.add(capability.capabilityId);
    invariant(capability.learningActions.length > 0, `${label}.learningActions must be non-empty.`);
    invariant(
      capability.learningActions.every((action) => action !== "EXT:"),
      `${label}.learningActions contains an empty extension action.`,
    );
    assertSchemaReference(capability.configurationSchema, `${label}.configurationSchema`);
    assertSchemaReference(capability.resultSchema, `${label}.resultSchema`);
    if (capability.stateSchema) assertSchemaReference(capability.stateSchema, `${label}.stateSchema`);

    if (capability.executionModel === "REQUEST_RESPONSE") {
      invariant(
        !capability.controls || capability.controls.length === 0,
        `${label}.controls is only valid for INTERACTIVE capabilities.`,
      );
    }

    const controlTypes = new Set<string>();
    for (const [controlIndex, control] of (capability.controls ?? []).entries()) {
      const controlLabel = `${label}.controls[${controlIndex}]`;
      invariant(control.type !== "EXT:", `${controlLabel}.type contains an empty extension control.`);
      invariant(!controlTypes.has(control.type), `${label} declares duplicate control ${control.type}.`);
      controlTypes.add(control.type);
      if (control.payloadSchema) assertSchemaReference(control.payloadSchema, `${controlLabel}.payloadSchema`);
      if (!control.type.startsWith("EXT:")) {
        invariant(!control.payloadSchema, `${controlLabel} core controls must use their protocol-defined payload semantics.`);
      }
      if (control.type === "RESTORE") {
        invariant(Boolean(capability.stateSchema), `${label} supports RESTORE but has no stateSchema.`);
      }
    }
  }
}

export function assertDeploymentBindingConforms(binding: ComponentDeploymentBinding): void {
  invariant(
    binding.bindingSchemaVersion === COMPONENT_PROTOCOL_VERSION,
    `bindingSchemaVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  invariant(binding.componentId.trim().length > 0, "deployment.componentId must be non-empty.");
  invariant(SEMVER.test(binding.componentVersion), "deployment.componentVersion must be semver-like.");
  invariant(binding.adapterId.trim().length > 0, "deployment.adapterId must be non-empty.");
  assertProtocolEnvelope(binding, "deployment");
  assertSchemaReference(binding.runtimeConfiguration.schema, "deployment.runtimeConfiguration.schema");
}

export function assertExecutionConforms(execution: LearningCapabilityExecution): void {
  assertProtocolEnvelope(execution, "execution");
  assertExactIdentity(execution, "execution");
  assertSchemaReference(execution.configuration.schema, "configuration.schema");
}

export function assertExecutionResultConforms(result: LearningCapabilityExecutionResult): void {
  assertProtocolEnvelope(result, "result");
  assertExactIdentity(result, "result");
  invariant(result.traceId.trim().length > 0, "result.traceId must be non-empty.");
  if (result.result) assertSchemaReference(result.result.schema, "result.result.schema");
  if (result.status === "COMPLETED") {
    invariant(Boolean(result.result), "COMPLETED execution results must include a schema-bound result.");
  }
  if (result.status === "FAILED") {
    invariant(Boolean(result.issues?.length), "FAILED execution results must include at least one issue.");
  }
}

export function assertReadyMessageConforms(message: ComponentReadyMessage): void {
  assertProtocolEnvelope(message, "ready");
  invariant(message.messageId.trim().length > 0, "ready.messageId must be non-empty.");
  invariant(message.componentId.trim().length > 0, "ready.componentId must be non-empty.");
  invariant(SEMVER.test(message.componentVersion), "ready.componentVersion must be semver-like.");
  invariant(!Number.isNaN(Date.parse(message.occurredAt)), "ready.occurredAt must be a parseable timestamp.");
  invariant(
    message.supportedProtocolVersions.includes(COMPONENT_PROTOCOL_VERSION),
    `ready.supportedProtocolVersions must include ${COMPONENT_PROTOCOL_VERSION}.`,
  );
}

export function assertControlMessageConforms(message: ComponentControlMessage): void {
  assertProtocolEnvelope(message, "control");
  invariant(message.messageId.trim().length > 0, "control.messageId must be non-empty.");
  assertExactIdentity(message, "control");
  invariant(message.type !== "EXT:", "control.type contains an empty extension control.");

  if (message.type === "INIT") {
    assertExecutionConforms(message.execution);
    invariant(message.execution.invocationId === message.invocationId, "INIT execution invocationId must match control invocationId.");
    invariant(message.execution.componentId === message.componentId, "INIT execution componentId must match control componentId.");
    invariant(message.execution.componentVersion === message.componentVersion, "INIT execution componentVersion must match control componentVersion.");
    invariant(message.execution.capabilityId === message.capabilityId, "INIT execution capabilityId must match control capabilityId.");
  }

  if (message.type === "RESTORE") {
    assertSchemaReference(message.state.schema, "control.state.schema");
  }

  if ("payload" in message && message.payload) {
    assertSchemaReference(message.payload.schema, "control.payload.schema");
  }
}

export function assertComponentEventConforms(event: ComponentEvent): void {
  assertProtocolEnvelope(event, "event");
  invariant(event.eventId.trim().length > 0, "event.eventId must be non-empty.");
  assertExactIdentity(event, "event");
  invariant(!Number.isNaN(Date.parse(event.occurredAt)), "event.occurredAt must be a parseable timestamp.");
  invariant(event.type !== "EXT:", "event.type contains an empty extension event.");
  if (event.payload) assertSchemaReference(event.payload.schema, "event.payload.schema");

  if (["OBSERVATION", "ATTEMPT_SUBMITTED", "STATE_CHANGED", "COMPLETED"].includes(event.type)) {
    invariant(Boolean(event.payload), `${event.type} events must include a schema-bound payload.`);
  }
  if (event.type === "ERROR") {
    invariant(Boolean(event.issues?.length), "ERROR events must include at least one issue.");
  }
}

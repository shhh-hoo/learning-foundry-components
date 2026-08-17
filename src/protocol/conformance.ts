import { COMPONENT_PROTOCOL_VERSION } from "./capability";
import type {
  ComponentCapabilityManifest,
  SchemaReference,
} from "./capability";
import type {
  ComponentControlMessage,
  ComponentEvent,
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
        !capability.supportedControls || capability.supportedControls.length === 0,
        `${label}.supportedControls is only valid for INTERACTIVE capabilities.`,
      );
    }
    if (capability.supportedControls?.includes("RESTORE")) {
      invariant(Boolean(capability.stateSchema), `${label} supports RESTORE but has no stateSchema.`);
    }
  }
}

export function assertExecutionConforms(execution: LearningCapabilityExecution): void {
  invariant(
    execution.protocolVersion === COMPONENT_PROTOCOL_VERSION,
    `protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  assertExactIdentity(execution, "execution");
  assertSchemaReference(execution.configuration.schema, "configuration.schema");
}

export function assertExecutionResultConforms(result: LearningCapabilityExecutionResult): void {
  invariant(
    result.protocolVersion === COMPONENT_PROTOCOL_VERSION,
    `result protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  invariant(result.invocationId.trim().length > 0, "result.invocationId must be non-empty.");
  invariant(result.traceId.trim().length > 0, "result.traceId must be non-empty.");
  if (result.result) assertSchemaReference(result.result.schema, "result.result.schema");
  if (result.status === "COMPLETED") {
    invariant(Boolean(result.result), "COMPLETED execution results must include a schema-bound result.");
  }
  if (result.status === "FAILED") {
    invariant(Boolean(result.issues?.length), "FAILED execution results must include at least one issue.");
  }
}

export function assertControlMessageConforms(message: ComponentControlMessage): void {
  invariant(
    message.protocolVersion === COMPONENT_PROTOCOL_VERSION,
    `control protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  invariant(message.messageId.trim().length > 0, "control.messageId must be non-empty.");
  assertExactIdentity(message, "control");

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
}

export function assertComponentEventConforms(event: ComponentEvent): void {
  invariant(
    event.protocolVersion === COMPONENT_PROTOCOL_VERSION,
    `event protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
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

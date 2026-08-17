import { COMPONENT_PROTOCOL_VERSION } from "./capability";
import type {
  ComponentCapabilityManifest,
  SchemaReference,
} from "./capability";
import type {
  ComponentEvent,
  LearningCapabilityExecution,
} from "./runtime";

const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`FOUNDARY_PROTOCOL_CONFORMANCE: ${message}`);
}

function assertSchemaReference(reference: SchemaReference, label: string): void {
  invariant(reference.id.trim().length > 0, `${label}.id must be non-empty.`);
  invariant(SEMVER.test(reference.version), `${label}.version must be semver-like.`);
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
  invariant(execution.invocationId.trim().length > 0, "invocationId must be non-empty.");
  invariant(execution.componentId.trim().length > 0, "componentId must be non-empty.");
  invariant(SEMVER.test(execution.componentVersion), "componentVersion must be an exact semver-like version.");
  invariant(execution.capabilityId.trim().length > 0, "capabilityId must be non-empty.");
  assertSchemaReference(execution.configuration.schema, "configuration.schema");
}

export function assertComponentEventConforms(event: ComponentEvent): void {
  invariant(
    event.protocolVersion === COMPONENT_PROTOCOL_VERSION,
    `event protocolVersion must be ${COMPONENT_PROTOCOL_VERSION}.`,
  );
  invariant(event.eventId.trim().length > 0, "eventId must be non-empty.");
  invariant(event.invocationId.trim().length > 0, "event invocationId must be non-empty.");
  invariant(event.componentId.trim().length > 0, "event componentId must be non-empty.");
  invariant(SEMVER.test(event.componentVersion), "event componentVersion must be semver-like.");
  invariant(event.capabilityId.trim().length > 0, "event capabilityId must be non-empty.");
  invariant(!Number.isNaN(Date.parse(event.occurredAt)), "event occurredAt must be a parseable timestamp.");
  if (event.payload) assertSchemaReference(event.payload.schema, "event.payload.schema");
  if (event.type === "ERROR") {
    invariant(Boolean(event.issues?.length), "ERROR events must include at least one issue.");
  }
}

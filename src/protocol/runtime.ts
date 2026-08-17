// Stable Learning Foundry capability execution and interactive lifecycle seam.
// Component-family-specific payload shapes are referenced, never promoted here.

import type {
  ComponentProtocolVersion,
  SchemaReference,
} from "./capability";

export type CapabilityRunMode = "PRODUCT" | "PREVIEW" | "EVAL";

export interface SchemaBoundPayload {
  readonly schema: SchemaReference;
  readonly data: unknown;
}

/**
 * Exact identity is required at the execution boundary for reproducibility.
 * Registries may resolve aliases such as "latest" before constructing this object.
 */
export interface LearningCapabilityExecution {
  readonly protocolVersion: ComponentProtocolVersion;
  readonly invocationId: string;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly capabilityId: string;
  readonly runMode: CapabilityRunMode;
  readonly configuration: SchemaBoundPayload;
}

export type LearningCapabilityExecutionStatus =
  | "STARTED"
  | "COMPLETED"
  | "FAILED";

export interface ProtocolIssue {
  readonly code: string;
  readonly message: string;
  readonly path?: string;
}

/**
 * REQUEST_RESPONSE capabilities normally return COMPLETED/FAILED directly.
 * INTERACTIVE capabilities may return STARTED and then continue through the
 * transport-neutral control/event lifecycle below.
 */
export interface LearningCapabilityExecutionResult {
  readonly protocolVersion: ComponentProtocolVersion;
  readonly invocationId: string;
  readonly traceId: string;
  readonly status: LearningCapabilityExecutionStatus;
  readonly result?: SchemaBoundPayload;
  readonly issues?: readonly ProtocolIssue[];
}

/**
 * Existing Foundry consumers can keep one small execution port. Interactive
 * transports layer control/events around the same invocation identity.
 */
export interface LearningCapabilityRuntime {
  execute(
    execution: LearningCapabilityExecution,
  ): Promise<LearningCapabilityExecutionResult>;
}

interface ComponentControlBase {
  readonly protocolVersion: ComponentProtocolVersion;
  readonly messageId: string;
  readonly invocationId: string;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly capabilityId: string;
}

/**
 * Transport-neutral host -> component lifecycle messages. INIT carries the full
 * governed invocation; subsequent controls correlate by exact invocation identity.
 */
export type ComponentControlMessage =
  | (ComponentControlBase & {
      readonly type: "INIT";
      readonly execution: LearningCapabilityExecution;
    })
  | (ComponentControlBase & {
      readonly type: "RESET" | "PAUSE" | "RESUME";
    })
  | (ComponentControlBase & {
      readonly type: "RESTORE";
      readonly state: SchemaBoundPayload;
    });

export type CoreComponentEventType =
  | "READY"
  | "OBSERVATION"
  | "ATTEMPT_SUBMITTED"
  | "STATE_CHANGED"
  | "COMPLETED"
  | "ERROR";

/** Component families may add namespaced event types without changing v1. */
export type ExtensionComponentEventType = `EXT:${string}`;
export type ComponentEventType =
  | CoreComponentEventType
  | ExtensionComponentEventType;

/**
 * Transport-neutral component -> host event envelope. The payload schema is
 * family-owned and explicitly identified so Foundry/Codex can validate it.
 */
export interface ComponentEvent {
  readonly protocolVersion: ComponentProtocolVersion;
  readonly eventId: string;
  readonly invocationId: string;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly capabilityId: string;
  readonly occurredAt: string;
  readonly type: ComponentEventType;
  readonly payload?: SchemaBoundPayload;
  readonly issues?: readonly ProtocolIssue[];
}

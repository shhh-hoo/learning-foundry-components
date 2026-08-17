// Stable Learning Foundry capability execution and interactive lifecycle seam.
// Component-family-specific payload shapes are referenced, never promoted here.

import type {
  ComponentProtocolName,
  ComponentProtocolVersion,
  ExtensionInteractiveControl,
  JsonValue,
  SchemaReference,
} from "./capability";

export type CapabilityRunMode = "PRODUCT" | "PREVIEW" | "EVAL";

/** Protocol payloads stay JSON-serializable across local, iframe and network transports. */
export interface SchemaBoundPayload {
  readonly schema: SchemaReference;
  readonly data: JsonValue;
}

interface ProtocolEnvelopeBase {
  readonly protocol: ComponentProtocolName;
  readonly protocolVersion: ComponentProtocolVersion;
}

interface ExactInvocationIdentity {
  readonly invocationId: string;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly capabilityId: string;
}

/**
 * Exact identity is required at the execution boundary for reproducibility.
 * Registries may resolve aliases such as "latest" before constructing this object.
 */
export interface LearningCapabilityExecution
  extends ProtocolEnvelopeBase,
    ExactInvocationIdentity {
  readonly runMode: CapabilityRunMode;
  readonly configuration: SchemaBoundPayload;
}

export type LearningCapabilityExecutionStatus =
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED"
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
export interface LearningCapabilityExecutionResult
  extends ProtocolEnvelopeBase,
    ExactInvocationIdentity {
  readonly traceId: string;
  readonly status: LearningCapabilityExecutionStatus;
  readonly result?: SchemaBoundPayload;
  readonly issues?: readonly ProtocolIssue[];
}

/**
 * Existing Foundry consumers can keep one small execution port. Interactive
 * transports layer readiness/control/events around the same invocation identity.
 */
export interface LearningCapabilityRuntime {
  execute(
    execution: LearningCapabilityExecution,
  ): Promise<LearningCapabilityExecutionResult>;
}

/**
 * Optional pre-INIT readiness signal for transports such as sandboxed iframes.
 * No invocationId/capabilityId is required because the component may not have
 * received the governed invocation yet. Direct/in-process adapters may not need it.
 */
export interface ComponentReadyMessage extends ProtocolEnvelopeBase {
  readonly messageId: string;
  readonly type: "READY";
  readonly componentId: string;
  readonly componentVersion: string;
  readonly occurredAt: string;
  /** Strings allow a newer implementation to advertise versions unknown to this v1 type package. */
  readonly supportedProtocolVersions: readonly string[];
}

interface ComponentControlBase
  extends ProtocolEnvelopeBase,
    ExactInvocationIdentity {
  readonly messageId: string;
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
      readonly type: "RESET" | "PAUSE" | "RESUME" | "CANCEL";
    })
  | (ComponentControlBase & {
      readonly type: "RESTORE";
      readonly state: SchemaBoundPayload;
    })
  | (ComponentControlBase & {
      readonly type: ExtensionInteractiveControl;
      readonly payload?: SchemaBoundPayload;
    });

export type CoreComponentEventType =
  | "INITIALIZED"
  | "OBSERVATION"
  | "ATTEMPT_SUBMITTED"
  | "STATE_CHANGED"
  | "COMPLETED"
  | "CANCELLED"
  | "ERROR";

/** Component families may add namespaced event types without changing v1. */
export type ExtensionComponentEventType = `EXT:${string}`;
export type ComponentEventType =
  | CoreComponentEventType
  | ExtensionComponentEventType;

/**
 * Transport-neutral post-INIT component -> host event envelope. The payload schema
 * is family-owned and explicitly identified so Foundry/Codex can validate it.
 */
export interface ComponentEvent
  extends ProtocolEnvelopeBase,
    ExactInvocationIdentity {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: ComponentEventType;
  readonly payload?: SchemaBoundPayload;
  readonly issues?: readonly ProtocolIssue[];
}

/** Optional adapter-level ports; transports may implement these with callbacks, postMessage, etc. */
export interface ComponentEventSink {
  emit(event: ComponentEvent): void | Promise<void>;
}

export interface ComponentControlHandler {
  handle(message: ComponentControlMessage): void | Promise<void>;
}

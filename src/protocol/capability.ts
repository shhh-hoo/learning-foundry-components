// Stable generic capability discovery / fit contract.
// Component-family-specific payloads belong behind schema references, not in this file.

export type ComponentProtocolVersion = "1.0.0";
export const COMPONENT_PROTOCOL_VERSION: ComponentProtocolVersion = "1.0.0";

export type CapabilityCoverage =
  | "EXACT_MATCH"
  | "PARTIAL_MATCH"
  | "UNSUPPORTED";

export type CoreLearningAction =
  | "RECALL"
  | "DISCRIMINATE"
  | "CONNECT"
  | "SEQUENCE"
  | "PREDICT"
  | "MANIPULATE"
  | "CONSTRUCT"
  | "CALCULATE"
  | "DIAGNOSE"
  | "PLAN"
  | "INTERPRET"
  | "EXPLAIN"
  | "TRANSFER";

/**
 * Core actions are intentionally small and stable. Experimental/domain-specific
 * actions may use an EXT: namespace without changing the base protocol.
 */
export type ExtensionLearningAction = `EXT:${string}`;
export type LearningAction = CoreLearningAction | ExtensionLearningAction;

export type CapabilityExecutionModel =
  | "REQUEST_RESPONSE"
  | "INTERACTIVE";

export type InteractiveControl =
  | "RESET"
  | "RESTORE"
  | "PAUSE"
  | "RESUME";

/**
 * A protocol-level pointer to a separately owned schema.
 * The base protocol never needs to know the component-family payload shape.
 */
export interface SchemaReference {
  readonly id: string;
  readonly version: string;
}

/**
 * One independently matchable capability exposed by a component.
 * Keeping inputs/outputs on the capability avoids ambiguous cartesian products
 * across component-wide arrays.
 */
export interface CapabilityDescriptor {
  readonly capabilityId: string;
  readonly learningActions: readonly LearningAction[];
  readonly executionModel: CapabilityExecutionModel;
  readonly configurationSchema: SchemaReference;
  readonly resultSchema: SchemaReference;
  readonly stateSchema?: SchemaReference;
  readonly supportedControls?: readonly InteractiveControl[];
  readonly supportedTasks?: readonly string[];
  readonly supportedInputKinds?: readonly string[];
  readonly executionRequirements?: readonly string[];
  readonly limitations?: readonly string[];
}

export interface ComponentCapabilityManifest {
  readonly manifestSchemaVersion: ComponentProtocolVersion;
  readonly componentId: string;
  /** Exact immutable version of the component implementation. */
  readonly componentVersion: string;
  readonly componentType: string;
  readonly capabilities: readonly CapabilityDescriptor[];
  readonly executionRequirements?: readonly string[];
  readonly limitations?: readonly string[];
}

/**
 * Foundry describes the need; the component reports fit facts.
 * Routing/fallback policy remains outside the component.
 */
export interface LearningRequestDescriptor {
  readonly task: string;
  readonly requestedCapabilityId?: string;
  readonly learningActions?: readonly LearningAction[];
  readonly inputKind?: string;
  readonly targetRefs?: readonly string[];
  readonly contentKind?: string;
  readonly constraints?: Readonly<Record<string, unknown>>;
}

export interface CapabilityFitResult {
  readonly coverage: CapabilityCoverage;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly capabilityId: string;
  readonly matchDimensions?: Readonly<Record<string, boolean>>;
  readonly matchedRequirements: readonly string[];
  readonly missingRequirements: readonly string[];
  readonly limitations: readonly string[];
}

/**
 * Discovery/fit is intentionally separate from execution. A component may expose
 * several capabilities; preflight returns fit facts for every relevant candidate.
 * Foundry owns the final routing decision.
 */
export interface ComponentCapabilityInspector {
  readonly manifest: ComponentCapabilityManifest;

  preflight(
    request: LearningRequestDescriptor,
  ): readonly CapabilityFitResult[];
}

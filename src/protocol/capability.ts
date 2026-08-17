// Generic capability discovery / fit contract.
// Generalized from the real Standard Trainer component contract while deliberately
// removing calculation- and chemistry-specific fields.

export type CapabilityCoverage =
  | "EXACT_MATCH"
  | "PARTIAL_MATCH"
  | "UNSUPPORTED";

export type ComponentRecommendedAction =
  | "INVOKE_COMPONENT"
  | "REQUIRE_INTERPRETER"
  | "DO_NOT_INVOKE";

export type LearningAction =
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

export interface ComponentCapabilityManifest {
  readonly manifestSchemaVersion: "1.0.0";
  readonly componentId: string;
  readonly componentVersion: string;
  readonly componentType: string;
  readonly learningActions: readonly LearningAction[];
  readonly supportedTasks: readonly string[];
  readonly operationalInputs: readonly string[];
  readonly outputs: readonly string[];
  readonly executionRequirements: readonly string[];
  readonly limitations: readonly string[];
}

export interface LearningRequestDescriptor {
  readonly task: string;
  readonly inputKind: string;
  readonly targetRefs?: readonly string[];
  readonly contentKind?: string;
  readonly constraints?: Readonly<Record<string, unknown>>;
}

export interface CapabilityFitResult {
  readonly coverage: CapabilityCoverage;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly matchDimensions?: Readonly<Record<string, boolean>>;
  readonly matchedCapabilities: readonly string[];
  readonly missingCapabilities: readonly string[];
  readonly limitations: readonly string[];
  readonly recommendedAction: ComponentRecommendedAction;
}

/**
 * Discovery/fit is intentionally separate from execution.
 * Foundry may inspect capability fit before invoking a runtime through
 * LearningCapabilityRuntime.execute(...).
 */
export interface ComponentCapabilityInspector {
  readonly manifest: ComponentCapabilityManifest;

  preflight(
    request: LearningRequestDescriptor,
  ): CapabilityFitResult;
}

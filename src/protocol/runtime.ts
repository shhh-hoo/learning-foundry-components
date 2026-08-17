// Canonical Learning Foundry capability execution seam.
// Migrated from shhh-hoo/learning-foundry-demo (main) on 2026-08-17.
// Keep this deliberately small. Component-family-specific schemas belong outside this file.

export type CapabilityRunPurpose = "PRODUCT" | "AGENT_EVAL";

export interface LearningCapabilityExecution {
  readonly capabilityId: string;
  readonly capabilityVersion?: string;
  readonly input: Record<string, unknown>;
  readonly runPurpose: CapabilityRunPurpose;
}

export interface LearningCapabilityExecutionResult {
  readonly traceId: string;
  readonly result: Record<string, unknown>;
}

export interface LearningCapabilityRuntime {
  execute(
    execution: LearningCapabilityExecution,
  ): Promise<LearningCapabilityExecutionResult>;
}

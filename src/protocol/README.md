# Component Protocol

This directory owns the smallest generic contract needed for Learning Foundry to execute a governed learning capability.

## Current canonical seam

`runtime.ts` intentionally mirrors the current Foundry application seam:

```ts
export interface LearningCapabilityExecution {
  readonly capabilityId: string;
  readonly capabilityVersion?: string;
  readonly input: Record<string, unknown>;
  readonly runPurpose: "PRODUCT" | "AGENT_EVAL";
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
```

The source-of-truth version was migrated from `shhh-hoo/learning-foundry-demo` rather than reconstructed from old chat notes.

## What was deliberately NOT promoted into the generic protocol

The old/current Foundry code also contains a rich `DiagnosticLearningComponent` contract for deterministic chemistry calculation diagnosis. It includes authored facts, targets, formula ASTs, reasoning graphs, diagnosis categories, hint policy, mark schemes, provenance, expert review, and publication metadata.

That schema is valuable, but it is a **component-family contract**, not a universal definition of every learning component.

A sorting/classification workspace should not be forced to pretend it has:

- a numerical target;
- formula definitions;
- calculation diagnosis categories;
- a mark scheme;
- Kp/MASS target kinds.

Likewise, a simulation or mechanism builder needs evidence shapes that the calculation trainer does not.

Therefore:

```text
generic runtime seam
        ↓
component-family schema
        ↓
concrete component/configuration
```

not:

```text
calculation trainer schema
        ↓
force every component into it
```

## Historical `manifest / preflight / invoke` idea

Earlier Foundry design work used a conceptual interface like:

```ts
interface LearningComponent {
  readonly manifest: ComponentManifest;
  preflight(request: LearningRequestDescriptor): CapabilityFitResult;
  invoke(request: ComponentInvocation): ComponentInvocationResult;
}
```

The important design insight remains useful: capability coverage should be explicit and honest, and Foundry should distinguish exact/partial/unsupported fits.

However, the current codebase no longer uses that exact interface as the canonical runtime seam. Do not resurrect it in parallel merely because it exists in historical design notes.

If richer discovery/inspection metadata is needed in this repository, design it as a deliberate protocol extension and then update the consuming Foundry boundary, rather than creating a second incompatible contract.

## Responsibility boundary

A learning component may own deterministic logic inside its bounded capability.

It may report:

- learner actions;
- submitted state;
- component-computed correctness or constraint violations;
- hints/scaffolds used;
- retries/changes;
- completion/error state;
- traceable structured result data.

Foundry Core generally owns:

- component/capability selection;
- durable learner interpretation;
- cross-component learner evidence aggregation;
- mastery/learner-position models;
- learning-plan changes;
- curriculum routing;
- long-term pedagogical decisions.

A specialized governed component may own a bounded deterministic diagnosis (the Standard Trainer is the existing example), but that authority must be explicit in its family contract.

## External open-source resources

Do not confuse two reuse modes:

1. **Library/engine reuse inside a Foundry component** — wrap the dependency behind this repo's component boundary.
2. **External learning component** — keep the external product/resource outside this repo and let the Foundry product layer govern link/embed/provider/package/LTI-style integration, rights, privacy, tracking, and deployment scope.

The reuse-first Codex skill covers both paths.

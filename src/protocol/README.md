# Component Protocol

This directory owns the smallest generic contract needed for Learning Foundry to **discover/match** and then **execute** a governed learning capability.

The protocol is intentionally split into two layers because that is what the existing real code already implies.

## Layer 1 — capability discovery / fit

`capability.ts` generalizes the capability-fit semantics that already exist in `shhh-hoo/standard-trainer-demo`:

```text
ComponentCapabilityManifest
        +
LearningRequestDescriptor
        ↓
preflight(...)
        ↓
EXACT_MATCH
PARTIAL_MATCH
UNSUPPORTED
```

The historical/current Standard Trainer implementation also uses:

```text
INVOKE_COMPONENT
REQUIRE_INTERPRETER
DO_NOT_INVOKE
```

Those semantics are preserved because they provide an honest boundary between what a component can execute and what Foundry must handle elsewhere.

The new generic contract deliberately removes trainer-specific assumptions such as one chemistry curriculum, one numerical problem definition, and calculation-specific input types.

## Layer 2 — governed execution

`runtime.ts` mirrors the current Foundry application execution seam:

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

This was migrated from `shhh-hoo/learning-foundry-demo/main/src/core/ports/learning-capability-runtime.ts`, not reconstructed from chat history.

The intended overall boundary is therefore:

```text
Foundry request
      ↓
manifest + preflight
      ↓
capability fit / routing decision
      ↓
LearningCapabilityRuntime.execute(...)
      ↓
traceable structured result
```

## What was deliberately NOT promoted into the generic protocol

The existing Foundry/Standard Trainer code contains a rich `DiagnosticLearningComponent` family contract for deterministic chemistry calculation diagnosis. It includes authored facts, targets, formula ASTs, reasoning graphs, diagnosis categories, hint policy, mark schemes, provenance, expert review, and publication metadata.

That schema is valuable, but it is a **component-family contract**, not a universal definition of every learning component.

A sorting/classification workspace should not be forced to pretend it has:

- a numerical target;
- formula definitions;
- calculation diagnosis categories;
- a mark scheme;
- Kp/MASS target kinds.

Likewise, a simulation, data workspace, or mechanism builder needs evidence shapes that the calculation trainer does not.

Therefore:

```text
generic capability + runtime protocol
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

## Why `invoke(...)` is not copied as the universal execution API

The current Standard Trainer has a synchronous `LearningComponent.invoke(...)` interface because it is a bounded deterministic diagnosis component.

That does not automatically fit an interactive component that may remain open while a learner drags, edits, predicts, retries, restores state, and only later submits an attempt.

So this repository preserves the useful **manifest/preflight capability-fit semantics**, while keeping the generic execution seam at `LearningCapabilityRuntime.execute(...)` until interactive lifecycle requirements are designed from real components.

Do not invent a second ad-hoc runtime protocol inside one component. If interactive session lifecycle needs a shared contract, add the smallest deliberate protocol extension here and update Foundry consumers together.

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

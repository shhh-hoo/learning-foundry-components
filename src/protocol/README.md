# Component Protocol

This directory owns the smallest stable contract needed for Learning Foundry to **discover, match, configure, execute, observe, and resume** a governed learning capability.

The design target is deliberately narrow:

- stable enough that adding normal component families should not require base-protocol changes;
- explicit enough for Agent/Codex pairing and validation;
- transport-neutral;
- agnostic to subject, UI framework, and component-family evidence shape;
- small enough that component authors do not need to learn a platform-sized framework.

## The stable v1 objects

The generic protocol has five conceptual objects:

```text
ComponentCapabilityManifest
  └─ CapabilityDescriptor[]

LearningRequestDescriptor
  └─ preflight(...) -> CapabilityFitResult[]

LearningCapabilityExecution
  └─ exact component + capability + configuration schema

ComponentControlMessage / ComponentEvent
  └─ minimal interactive lifecycle

LearningCapabilityExecutionResult
  └─ terminal or started execution result
```

Everything domain-specific belongs behind a component-family schema.

## 1. Manifest and capability descriptors

A component may expose one or more independently matchable capabilities.

Do **not** describe a component as unrelated flat arrays of actions, inputs, and outputs. That creates ambiguity about which input/output belongs to which capability.

Instead:

```ts
{
  componentId: "classification-workspace",
  componentVersion: "1.2.0",
  capabilities: [
    {
      capabilityId: "classify-items",
      learningActions: ["DISCRIMINATE"],
      executionModel: "INTERACTIVE",
      configurationSchema: {
        id: "foundry.classification.config",
        version: "1.0.0"
      },
      resultSchema: {
        id: "foundry.classification.result",
        version: "1.0.0"
      },
      stateSchema: {
        id: "foundry.classification.state",
        version: "1.0.0"
      },
      supportedControls: ["RESET", "RESTORE"]
    }
  ]
}
```

The protocol understands the schema **identity**, not its family-specific fields.

This gives Foundry and AI developers enough information to pair a capability with valid configuration/result/state schemas without forcing every component into one giant universal payload.

## 2. Learning actions are a vocabulary, not a closed ontology

The core v1 vocabulary is intentionally small:

```text
RECALL
DISCRIMINATE
CONNECT
SEQUENCE
PREDICT
MANIPULATE
CONSTRUCT
CALCULATE
DIAGNOSE
PLAN
INTERPRET
EXPLAIN
TRANSFER
```

If a component needs an experimental or domain-specific action, use a namespaced extension such as:

```text
EXT:CHEMISTRY_COMPARE_RESONANCE
```

Do not change the base protocol merely to add a niche action label. A future protocol release may promote widely reused extension vocabulary to the core list without changing component payload semantics.

## 3. Preflight reports fit facts, not orchestration policy

The historical Standard Trainer used:

```text
INVOKE_COMPONENT
REQUIRE_INTERPRETER
DO_NOT_INVOKE
```

Those decisions were useful in that bounded runtime, but they mix component capability facts with Foundry routing policy.

The generic protocol therefore keeps only:

```text
EXACT_MATCH
PARTIAL_MATCH
UNSUPPORTED
```

plus:

```text
matchedRequirements
missingRequirements
limitations
```

A component may truthfully say:

> I can perform `classify-items`, but handwriting input is not usable directly.

It should **not** decide:

> Foundry must now call an interpreter.

Foundry Core/Resolver owns invoke/interpreter/fallback policy.

Because one component may expose several capabilities, `preflight(...)` returns fit facts for the relevant candidate capabilities rather than one opaque component-wide verdict.

## 4. Exact version identity is mandatory at execution

Registries may accept convenient selectors such as:

```text
latest
stable
^1.2
```

but those aliases must be resolved **before** constructing `LearningCapabilityExecution`.

The execution boundary requires:

```text
componentId
componentVersion   // exact
capabilityId
invocationId
protocolVersion
```

This is required for:

- reproducible Agent evals;
- trace replay;
- evidence provenance;
- debugging;
- deterministic restore;
- AI-generated integration code that does not silently drift to a newer implementation.

## 5. Schema-bound payloads make generic runtime data machine-readable

The base protocol does not define a universal classification/configuration/result JSON shape.

Instead every generic payload uses:

```ts
{
  schema: {
    id: "...",
    version: "..."
  },
  data: ...
}
```

Examples of family schemas may include:

```text
foundry.classification.config@1.0.0
foundry.classification.result@1.0.0
foundry.mechanism.state@2.1.0
foundry.calculation.diagnostic-result@3.0.0
```

This is the main extensibility mechanism: new component families add schemas, **not new base-protocol fields**.

## 6. Two execution models

Every capability declares one of:

```text
REQUEST_RESPONSE
INTERACTIVE
```

### REQUEST_RESPONSE

Suitable for a bounded operation that can return a result directly, for example deterministic calculation diagnosis.

Typical execution:

```text
execute(...)
  -> COMPLETED + result
```

### INTERACTIVE

Suitable for a learner-facing component that remains active while the learner manipulates, retries, submits, resets, or restores state.

Typical execution:

```text
execute(...)
  -> STARTED + traceId

then:
ComponentEvent...
ComponentEvent...
COMPLETED
```

The current `LearningCapabilityRuntime.execute(...)` seam remains small. Transport adapters may use React callbacks, `postMessage`, iframe bridges, provider adapters, or another mechanism; the protocol standardizes the envelopes, not the transport.

## 7. Minimal interactive lifecycle

Host -> Component uses `ComponentControlMessage`:

```text
INIT
RESET
RESTORE
PAUSE
RESUME
```

A capability declares which optional controls it supports. `INIT` is represented by the governed execution itself; the INIT control envelope exists for transports that require message-based initialization.

Component -> Host uses core `ComponentEvent` types:

```text
READY
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
ERROR
```

Do **not** standardize every learner gesture globally.

For example:

```text
itemMoved
bondCreated
parameterChanged
reasoningStepAdded
spectrumRegionSelected
```

belong in family-specific payload schemas or namespaced `EXT:*` events.

The base envelope only standardizes:

```text
protocol/version identity
component/capability identity
invocation correlation
timestamp
event type
schema-bound payload
issues/errors
```

## 8. Run modes are environment-neutral

The base protocol uses:

```text
PRODUCT
PREVIEW
EVAL
```

`PREVIEW` supports Component Lab without pretending it is a production learner session.

`EVAL` is deliberately generic; the protocol should not encode one specific evaluation harness name such as `AGENT_EVAL`.

## 9. Responsibility boundary

A learning component may own deterministic logic inside its bounded capability.

It may report:

- learner actions;
- submitted state;
- component-computed correctness or constraint violations;
- hints/scaffolds used;
- retries/changes;
- completion/error state;
- bounded deterministic diagnosis explicitly assigned by a family contract;
- traceable structured result data.

Foundry Core generally owns:

- component/capability selection;
- routing and fallback decisions;
- durable learner interpretation;
- cross-component evidence aggregation;
- mastery/learner-position models;
- learning-plan changes;
- curriculum routing;
- long-term pedagogical decisions.

A component should not emit durable claims such as `mastery = 0.82` merely because one activity succeeded.

## 10. Component-family contracts remain separate

The existing Standard Trainer contains a rich `DiagnosticLearningComponent` schema with:

- authored facts;
- numerical targets;
- formula ASTs;
- reasoning graphs;
- diagnosis categories;
- hint policy;
- mark schemes;
- provenance/review/publication metadata.

That is valuable and should remain a **calculation-diagnostic family contract**.

A classification workspace should not pretend it has formula definitions; a simulation should not pretend it has a mark scheme; a mechanism builder needs evidence shapes the calculation trainer does not.

Therefore:

```text
generic protocol
      ↓
component-family schema
      ↓
concrete component/configuration
```

not:

```text
one rich component schema
      ↓
force every future component into it
```

## 11. Conformance guardrails

`conformance.ts` provides small dependency-free assertions for:

- manifest identity and versioning;
- unique capability IDs;
- non-empty learning-action declarations;
- valid schema references;
- invalid request-response controls;
- RESTORE without a state schema;
- exact version identity at execution;
- base event-envelope integrity.

These checks are intentionally generic. Each family owns additional validation for the schemas it references.

Codex/component CI should run base conformance plus family-specific validation rather than inventing component-local protocol variants.

## 12. Protocol evolution policy

The purpose of v1 stability is to make normal component growth **additive**.

### Does NOT require a base-protocol change

- a new concrete component;
- a new component-family schema;
- a new open-source adapter;
- a new namespaced learning action;
- a new namespaced event;
- new optional capability metadata;
- a new content fixture;
- a new interaction primitive.

### Compatible v1 evolution

A minor/additive change may:

- add optional fields;
- add new namespaced vocabulary conventions;
- add new helper/conformance functions;
- document stronger authoring guidance.

Existing required fields and existing semantics must not be reinterpreted.

### Requires a major protocol version

- removing or renaming a required field;
- changing the meaning of an existing field/event;
- making an optional field required for existing components;
- changing identity/version correlation semantics;
- changing schema-bound payload interpretation;
- changing lifecycle semantics incompatibly.

When a component appears to require a base change, first ask whether the need belongs in:

```text
family schema
namespaced event/action
transport adapter
Foundry orchestration
```

Only change the base protocol when none of those boundaries can express the requirement cleanly.

## 13. AI/Codex pairing model

The intended machine-readable flow is:

```text
Foundry needs:
  learning action + task + input constraints
        ↓
manifest capabilities[]
        ↓
preflight fit facts
        ↓
Foundry selects exact component@version/capability
        ↓
read configurationSchema
        ↓
generate + validate configuration
        ↓
LearningCapabilityExecution
        ↓
REQUEST_RESPONSE result
or INTERACTIVE lifecycle
        ↓
validate result/event payload by schema reference
```

This is intentionally easier for AI development than interpreting unrelated prose arrays or reverse-engineering each component's local APIs.

## 14. Open-source reuse is orthogonal to the protocol

Do not confuse two reuse modes:

1. **Library/engine reuse inside a Foundry component** — wrap the dependency behind this protocol.
2. **External learning component** — keep the external product/resource outside this repo and let the Foundry product layer govern link/embed/provider/package/LTI-style integration, rights, privacy, tracking, and deployment scope.

The repo-scoped Component Development skill owns the reuse-first workflow. Third-party implementation details must not leak into the Agent-facing contract.

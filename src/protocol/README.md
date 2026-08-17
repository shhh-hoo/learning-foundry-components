# Component Protocol

This directory owns the smallest stable contract needed for Learning Foundry to **discover, match, configure, execute, observe, restore, and terminate** a governed learning capability.

The design target is deliberately narrow:

- stable enough that adding normal component families should not require base-protocol changes;
- explicit enough for Agent/Codex pairing and validation;
- transport-neutral and JSON-serializable;
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
  └─ exact component + capability + schema-bound configuration

ComponentControlMessage / ComponentEvent
  └─ minimal interactive lifecycle

LearningCapabilityExecutionResult
  └─ started / terminal execution result
```

Everything domain-specific belongs behind a component-family schema.

## 1. Manifest and capability descriptors

A component may expose one or more independently matchable capabilities.

Do **not** describe a component as unrelated flat arrays of actions, inputs, and outputs. That creates ambiguity about which input/output belongs to which capability.

Instead:

```ts
{
  manifestSchemaVersion: "1.0.0",
  componentId: "classification-workspace",
  componentVersion: "1.2.0",
  componentType: "workspace",
  capabilities: [
    {
      capabilityId: "classify-items",
      learningActions: ["DISCRIMINATE"],
      executionModel: "INTERACTIVE",
      configurationSchema: {
        id: "foundry.classification.config",
        version: "1.0.0",
        format: "JSON_SCHEMA"
      },
      resultSchema: {
        id: "foundry.classification.result",
        version: "1.0.0",
        format: "JSON_SCHEMA"
      },
      stateSchema: {
        id: "foundry.classification.state",
        version: "1.0.0",
        format: "JSON_SCHEMA"
      },
      controls: [
        { type: "RESET" },
        { type: "RESTORE" },
        { type: "CANCEL" }
      ]
    }
  ]
}
```

The protocol understands schema **identity and interchange format**, not family-specific fields.

For family-specific host controls, the same descriptor can bind an `EXT:*` control to its payload schema:

```ts
{
  type: "EXT:SET_HINT_LEVEL",
  payloadSchema: {
    id: "foundry.classification.set-hint-level",
    version: "1.0.0",
    format: "JSON_SCHEMA"
  }
}
```

Core controls use protocol-defined payload semantics. `RESTORE` uses the capability's `stateSchema`.

This gives Foundry and AI developers enough information to pair a capability with valid configuration/result/state/control schemas without forcing every component into one giant universal payload.

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

Do not change the base protocol merely to add a niche action label. Widely reused extension vocabulary can later be promoted without changing component payload semantics.

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

Because one component may expose several capabilities, `preflight(...)` returns fit facts for relevant candidate capabilities rather than one opaque component-wide verdict.

## 4. Exact version identity is mandatory at execution

Registries may accept convenient selectors such as:

```text
latest
stable
^1.2
```

but aliases must be resolved **before** constructing `LearningCapabilityExecution`.

The execution boundary requires:

```text
componentId
componentVersion   // exact
capabilityId
invocationId
protocolVersion
```

This is required for:

- reproducible evals;
- trace replay;
- evidence provenance;
- debugging;
- deterministic restore;
- AI-generated integration code that does not silently drift to a newer implementation.

## 5. Schema-bound JSON payloads are the main extensibility mechanism

The base protocol does not define one universal classification/configuration/result object.

Every generic payload instead carries:

```ts
{
  schema: {
    id: "...",
    version: "...",
    format: "JSON_SCHEMA"
  },
  data: ... // JSON-serializable
}
```

`JSON_SCHEMA` is the baseline interchange format because it can be inspected by Foundry, Codex, validation tooling, and remote adapters without importing component implementation code. A component may still use Zod, TypeScript types, or another validator internally.

`SchemaReference.uri` is optional. A deployment may resolve `id + version` through a registry; another may publish a directly resolvable schema URI.

Protocol data is intentionally JSON-only. Browser/framework objects, DOM nodes, Files, ArrayBuffers, WebGL handles, etc. do not cross the generic boundary. Binary/media resources should be represented by stable asset IDs/URLs/references inside family schemas.

Examples:

```text
foundry.classification.config@1.0.0
foundry.classification.result@1.0.0
foundry.mechanism.state@2.1.0
foundry.calculation.diagnostic-result@3.0.0
```

This is how normal future growth should happen:

```text
new component family
→ new versioned schemas
→ same base protocol
```

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

Suitable for a learner-facing component that remains active while the learner manipulates, retries, submits, resets, restores, or exits early.

Typical execution:

```text
execute(...)
  -> STARTED + traceId

then:
ComponentEvent...
ComponentEvent...
COMPLETED / CANCELLED / ERROR
```

`LearningCapabilityRuntime.execute(...)` remains deliberately small. Transport adapters may use React callbacks, `postMessage`, iframe bridges, provider adapters, or network transports; the protocol standardizes identities and envelopes, not transport technology.

For adapters that benefit from a code-level port, v1 also exposes tiny `ComponentEventSink` and `ComponentControlHandler` interfaces without requiring any particular event bus.

## 7. Minimal interactive lifecycle

Host -> Component core controls:

```text
INIT
RESET
RESTORE
PAUSE
RESUME
CANCEL
```

Families may additionally declare:

```text
EXT:<FAMILY_CONTROL>
```

with an optional versioned payload schema in the control descriptor.

`INIT` carries the governed execution for message-based transports. `CANCEL` gives the host a cross-component way to represent an abandoned/terminated activity without pretending it completed successfully.

Component -> Host core events:

```text
READY
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
CANCELLED
ERROR
```

Families may additionally emit namespaced `EXT:*` events.

Do **not** standardize every learner gesture globally.

For example:

```text
itemMoved
bondCreated
parameterChanged
reasoningStepAdded
spectrumRegionSelected
```

belong in family-specific payload schemas or namespaced `EXT:*` events/controls.

The base envelope standardizes only:

```text
protocol/version identity
component/capability identity
invocation correlation
timestamp
event/control type
schema-bound JSON payload
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

`EVAL` is deliberately generic; the protocol should not encode one particular evaluation harness name such as `AGENT_EVAL`.

## 9. Responsibility boundary

A learning component may own deterministic logic inside its bounded capability.

It may report:

- learner actions;
- submitted state;
- component-computed correctness or constraint violations;
- hints/scaffolds used;
- retries/changes;
- completion/cancellation/error state;
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

`conformance.ts` provides dependency-free assertions for:

- manifest identity and versioning;
- unique capability IDs;
- non-empty learning-action declarations;
- valid schema identity/format references;
- invalid request-response controls;
- duplicate/invalid control descriptors;
- RESTORE without a state schema;
- exact version identity at execution;
- execution result requirements;
- INIT identity correlation;
- base event-envelope requirements.

Examples of enforced semantics include:

```text
COMPLETED result -> must contain schema-bound result
FAILED result -> must contain issue(s)
RESTORE control -> capability must declare state schema
core control -> cannot redefine its payload schema
EXT control -> may bind a family payload schema
ERROR event -> must contain issue(s)
STATE_CHANGED / ATTEMPT_SUBMITTED / COMPLETED event -> must contain payload
```

These checks are intentionally generic. Each family owns validation for the schemas it references.

Codex/component CI should run base conformance plus family-specific validation rather than inventing component-local protocol variants.

## 12. Protocol evolution policy

The purpose of v1 stability is to make normal component growth **additive**.

### Does NOT require a base-protocol change

- a new concrete component;
- a new component-family schema;
- a new open-source adapter;
- a new namespaced learning action;
- a new namespaced event;
- a new namespaced host control;
- a new namespaced schema format when genuinely needed;
- new optional capability metadata;
- a new content fixture;
- a new interaction primitive.

### Compatible v1 evolution

A minor/additive change may:

- add optional fields;
- add new namespaced vocabulary conventions;
- add helper/conformance functions;
- document stronger authoring guidance.

Existing required fields and existing semantics must not be reinterpreted.

### Requires a major protocol version

- removing or renaming a required field;
- changing the meaning of an existing field/event/control;
- making an optional field required for existing components;
- changing identity/version correlation semantics;
- changing schema-bound payload interpretation;
- changing lifecycle semantics incompatibly.

When a component appears to require a base change, first ask whether the need belongs in:

```text
family schema
namespaced event/action/control
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
resolve configurationSchema (JSON Schema baseline)
        ↓
generate + validate JSON configuration
        ↓
LearningCapabilityExecution
        ↓
REQUEST_RESPONSE result
or INTERACTIVE lifecycle
        ↓
resolve + validate result/event/control payload schemas
```

This is intentionally easier for AI development than interpreting unrelated prose arrays or reverse-engineering each component's local API.

## 14. Open-source reuse is orthogonal to the protocol

Do not confuse two reuse modes:

1. **Library/engine reuse inside a Foundry component** — wrap the dependency behind this protocol.
2. **External learning component** — keep the external product/resource outside this repo and let the Foundry product layer govern link/embed/provider/package/LTI-style integration, rights, privacy, tracking, and deployment scope.

The repo-scoped Component Development skill owns the reuse-first workflow. Third-party implementation details must not leak into the Agent-facing contract.

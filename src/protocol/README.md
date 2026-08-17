# Component Protocol v1

This directory owns the smallest stable contract Learning Foundry needs to discover, match, launch, initialize, observe, restore, and finish reusable learning components.

The base protocol is deliberately:

- subject-agnostic;
- UI/framework-agnostic;
- transport-neutral;
- JSON-serializable;
- explicit enough for Codex/Agent pairing;
- small enough that normal new Component families do not require protocol edits.

Domain-specific meaning belongs in versioned family schemas, not in the base protocol.

## 1. Stable layers

```text
Capability
  ComponentCapabilityManifest
  CapabilityDescriptor
  LearningRequestDescriptor
  CapabilityFitResult

Deployment
  ComponentDeploymentBinding

Execution
  LearningCapabilityExecution
  LearningCapabilityExecutionResult

Interactive lifecycle
  ComponentReadyMessage
  ComponentControlMessage
  ComponentEvent

Validation
  conformance.ts
```

The separation matters:

```text
what a Component can do
!=
how this deployment launches it
!=
what happened in one learner invocation
```

## 2. Capability manifest

A Component can expose several independently matchable capabilities. Each capability binds together the information an Agent needs to pair and configure it:

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

Do not return to component-wide unrelated arrays such as `learningActions[] + inputs[] + outputs[]`; that makes pairing ambiguous.

## 3. Learning actions are extensible vocabulary

Core v1 actions:

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

Use `EXT:<NAMESPACED_ACTION>` for a useful domain-specific/experimental action instead of changing the protocol.

The list is a matching vocabulary, not a complete ontology of learning.

## 4. Preflight reports facts only

`preflight(...)` returns candidate `CapabilityFitResult[]` containing:

```text
EXACT_MATCH | PARTIAL_MATCH | UNSUPPORTED
matchedRequirements
missingRequirements
limitations
```

The Component must not decide Foundry policy such as:

```text
call interpreter
fallback to chat
change learning plan
```

Foundry Core/Resolver owns those decisions.

## 5. Family schemas are the main extension mechanism

Generic payloads use:

```ts
{
  schema: {
    id: "...",
    version: "...",
    format: "JSON_SCHEMA"
  },
  data: ...
}
```

`JSON_SCHEMA` is the baseline interchange format. Local implementations may also use Zod, TypeScript, etc.

All base-protocol payloads must be JSON-serializable. Media/binary/framework objects cross the boundary by stable asset references, not as DOM/File/WebGL/etc. objects.

Normal future growth should look like:

```text
new Component family
→ new family schemas
→ same protocol
```

## 6. Exact identity before execution

Registry aliases such as `latest` may exist, but before execution Foundry must resolve exact:

```text
componentId
componentVersion
capabilityId
invocationId
```

Every runtime envelope also carries:

```text
protocol = "foundry-component"
protocolVersion = "1.0.0"
```

This supports reproducible evals, trace replay, evidence provenance, debugging, restore, and AI-generated integration code.

## 7. Capability and deployment are separate

Capability metadata should not contain `launchUrl`, iframe flags, provider endpoints, framework exports, etc.

Those belong to `ComponentDeploymentBinding`:

```ts
{
  bindingSchemaVersion: "1.0.0",
  componentId: "classification-workspace",
  componentVersion: "1.2.0",
  adapterId: "foundry.web-iframe",
  protocol: "foundry-component",
  protocolVersion: "1.0.0",
  runtimeConfiguration: {
    schema: {
      id: "foundry.web-iframe.launch",
      version: "1.0.0",
      format: "JSON_SCHEMA"
    },
    data: {
      launchUrl: "/components/classification/index.html"
    }
  }
}
```

The same Component capability can therefore be hosted through different adapters without changing its pedagogical identity.

## 8. Two execution models

### REQUEST_RESPONSE

For bounded operations such as deterministic diagnosis:

```text
execute(...)
→ COMPLETED + result
```

### INTERACTIVE

For learner-facing interactions that stay open while the learner manipulates/retries/submits:

```text
launch
→ READY
→ INIT
→ INITIALIZED
→ events / controls
→ COMPLETED | CANCELLED | ERROR
```

`LearningCapabilityRuntime.execute(...)` stays small. iframe, React callback, provider API, web module, etc. are adapter concerns.

## 9. Interactive handshake and lifecycle

This split is intentional and was validated against the existing `learning-foundry-mvp` iframe runtime.

### Pre-INIT Component → Host

```text
READY
```

`ComponentReadyMessage` does **not** require `invocationId` or `capabilityId`. A newly loaded iframe cannot know them yet.

It identifies the Component version and advertises supported protocol versions.

### Host → Component

```text
INIT
RESET
RESTORE
PAUSE
RESUME
CANCEL
EXT:<FAMILY_CONTROL>
```

`INIT` carries the exact governed execution.

`LearningCapabilityExecution` contains:

```text
configuration
optional initialState
```

`initialState` is applied as part of initialization before `INITIALIZED` is emitted. `RESTORE` is for later runtime restoration.

### Post-INIT Component → Host

```text
INITIALIZED
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
CANCELLED
ERROR
EXT:<FAMILY_EVENT>
```

`INITIALIZED` confirms that the exact invocation/configuration/optional initial state was accepted.

Do not promote every learner gesture to the base protocol. `itemMoved`, `bondCreated`, `parameterChanged`, etc. belong in family payload schemas or namespaced events.

## 10. Run modes

```text
PRODUCT
PREVIEW
EVAL
```

`PREVIEW` is for Component Lab. `EVAL` stays generic instead of encoding one evaluation harness name.

## 11. Evidence boundary

Components may report bounded facts such as:

```text
learner actions
submitted work/state
component-computed correctness/constraint violations
hints/scaffolds used
retries/changes
completion/cancellation/errors
bounded deterministic diagnosis owned by a family contract
```

Foundry Core owns:

```text
cross-component evidence aggregation
mastery / learner position
learning-plan changes
curriculum routing
long-term pedagogy
```

A Component must not infer durable `mastery = 0.82` from one activity unless a separately governed model explicitly owns that responsibility.

## 12. Family contracts stay separate

The Standard Trainer's rich chemistry calculation contract remains a calculation-diagnostic family contract. It contains facts/formula ASTs/reasoning graphs/mark schemes/hint policy/etc.

Do not force Classification, Simulation, Mechanism, Data Investigation, etc. into that schema.

```text
generic protocol
→ family schema
→ concrete Component/configuration
```

## 13. Conformance

`conformance.ts` checks base invariants including:

```text
manifest/version identity
unique capability IDs
schema references
REQUEST_RESPONSE cannot declare interactive controls
RESTORE requires state schema
exact invocation identity
protocol discriminator/version
READY compatibility
INIT identity correlation
COMPLETED requires result
FAILED/ERROR require issues
required event payloads
ComponentDeploymentBinding integrity
```

Family validators still validate family payload content.

## 14. Protocol evolution rule

Normal additions do **not** require a base change:

```text
new Component
new family schema
new deployment adapter
new EXT action/event/control
new interaction primitive
new optional metadata
```

Before proposing a base change, prove the requirement cannot live in:

```text
family schema
EXT vocabulary
deployment/transport adapter
Foundry orchestration
```

Removing/renaming required fields or changing identity/schema/lifecycle semantics requires a major protocol version.

## 15. AI/Codex pairing flow

```text
learning need
→ manifest.capabilities[]
→ preflight facts
→ Foundry selects exact component@version/capability
→ resolve JSON configuration schema
→ generate + validate configuration
→ resolve deployment binding
→ launch/execute
→ validate schema-bound events/results
```

The goal is for Codex to integrate a Component by reading contracts, not reverse-engineering custom APIs.

## 16. MVP compatibility

`learning-foundry-mvp` remains the runnable vertical-slice integration repo. Its Runtime Protocol v0.1 is deliberately not rewritten inside this PR.

See:

`docs/learning-foundry-mvp-v0.1-compatibility.md`

That document maps current MVP `runtimeSessionId`, iframe handshake, registry launch metadata, and Attempt normalization to v1 without weakening the stable Component contract.

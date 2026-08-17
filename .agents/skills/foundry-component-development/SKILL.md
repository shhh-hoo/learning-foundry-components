---
name: foundry-component-development
description: Build or extend Learning Foundry Components, interaction primitives, adapters, or component-family schemas. Use for substantial component work. Requires evidence-first design, reuse-first open-source research, the stable Foundry component protocol, machine-readable schemas, and Component Lab QA. Do not use for Foundry orchestration, learner models, curriculum planning, or Dify workflow work.
---

# Foundry Component Development

Build bounded learning capabilities behind one stable protocol. Expand learning-action coverage; do not maximize Component count.

## 1. Read the contract before coding

Read, in order:

1. `AGENTS.md`
2. every file in `src/protocol/`
3. `.agents/skills/foundry-component-development/references/learning-action-matrix.md`
4. `.agents/skills/foundry-component-development/references/component-contract-template.md`
5. relevant existing Components/primitives/adapters/family schemas

`src/protocol/` is authoritative. Never invent a parallel protocol in one Component.

## 2. Start from learning demand and evidence

Before choosing UI, write:

```text
Learning demand:
Target learner action(s):
Observable evidence wanted:
Failure / partial-success signals:
Content variability:
Domain-specific or reusable:
Likely interaction:
Existing Foundry overlap:
```

Prefer core actions when they fit:

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

Use `EXT:<NAMESPACED_ACTION>` when a genuinely useful action does not fit. Do not edit the protocol merely to add a topic-specific label.

A drag/drop widget is a primitive. `equilibrium` is content. Neither alone defines a learning Component.

## 3. Reuse before build

Search in this order:

1. existing local Component/family/primitive;
2. open-source educational tool solving the same learner action;
3. open-source interaction primitive;
4. mature domain/scientific engine;
5. only then build new.

For serious external candidates record:

```text
Candidate + version/commit
What it solves
License
Maintenance signal
Runtime/framework fit
Accessibility
Privacy/network behavior
Bundle/runtime cost
Adaptation needed
Protocol adaptation needed
Risks
Decision
```

Allowed decisions:

```text
REUSE_AS_DEPENDENCY
ADAPT_OR_WRAP
EXTERNAL_COMPONENT
REUSE_IDEA_ONLY
BUILD_NEW
```

Do not choose `BUILD_NEW` merely because writing code is faster than evaluating reuse.

Never copy code/assets with unclear rights.

## 4. Define the Component contract first

Use the contract template.

Each Component has one manifest. Each independently matchable function is one `capabilities[]` entry binding:

```text
capabilityId
learningActions
executionModel
configurationSchema
resultSchema
optional stateSchema
optional controls[]
requirements / limitations
```

Do not recreate component-wide unrelated `actions[]`, `inputs[]`, `outputs[]`.

### Family schemas

At minimum define versioned:

```text
configuration schema
result schema
```

Stateful interactive capabilities also define a state schema. Family-specific event/control payloads use their own schema IDs.

Use `JSON_SCHEMA` as the protocol-visible baseline. Local code may additionally use Zod/TypeScript.

All protocol payloads must be JSON-serializable. Use stable asset references for media/binary resources.

### Preflight

Preflight reports facts only:

```text
EXACT_MATCH
PARTIAL_MATCH
UNSUPPORTED
matchedRequirements
missingRequirements
limitations
```

It must not decide interpreter/fallback/chat/learning-plan policy.

## 5. Keep capability and deployment separate

`ComponentCapabilityManifest` describes what an exact Component version can do.

`ComponentDeploymentBinding` describes how one deployment launches it.

Do not put iframe URLs, provider endpoints, package exports, or framework-specific launch details in the capability manifest.

Use an adapter-specific schema-bound `runtimeConfiguration` instead.

## 6. Use exact identity

A registry may resolve `latest`, but execution must use exact:

```text
protocol = foundry-component
protocolVersion
componentId
componentVersion
capabilityId
invocationId
```

Never execute an unresolved version alias.

## 7. Choose the execution model

### REQUEST_RESPONSE

Use when the capability can return a bounded result directly.

### INTERACTIVE

Use when a learner remains inside the Component while manipulating/retrying/submitting/restoring.

The stable lifecycle is:

```text
pre-INIT Component -> Host
READY

Host -> Component
INIT
RESET
RESTORE
PAUSE
RESUME
CANCEL
EXT:<FAMILY_CONTROL>

post-INIT Component -> Host
INITIALIZED
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
CANCELLED
ERROR
EXT:<FAMILY_EVENT>
```

Important semantics:

- `READY` is pre-INIT and does not require invocation/capability identity.
- `INIT` carries the exact governed execution.
- execution may include `initialState`; apply it before emitting `INITIALIZED`.
- `RESTORE` is for later runtime restoration.
- do not promote domain gestures such as `itemMoved`, `bondCreated`, or `parameterChanged` into core events.

## 8. Preserve the Foundry evidence boundary

Components may own bounded deterministic logic and report:

```text
learner actions
submitted work/state
correctness/constraint violations when deterministic
assistance/hints
retries/changes
completion/cancellation/errors
family-owned bounded diagnosis
```

Foundry Core owns durable interpretation, learner position/mastery, learning-plan changes, curriculum routing, and long-term pedagogy.

Do not claim mastery from one activity.

## 9. Parameterize content

Separate:

```text
interaction engine
+
content/configuration
+
evidence mapping
```

Do not hard-code one syllabus example into generic interaction logic unless the Component is intentionally domain-specific.

## 10. Build for Component Lab

Interactive Components should run independently in `PREVIEW` mode.

Fixtures should cover as relevant:

```text
success
incorrect / partial response
repeated attempt
reset
initial state
restore
cancel/abandon
malformed input
mobile/narrow viewport
keyboard interaction
```

Passing typecheck is not visual QA. Inspect the rendered interaction.

## 11. Validate before completion

Run:

```text
assertManifestConforms
assertDeploymentBindingConforms (when deployed)
assertExecutionConforms
assertReadyMessageConforms (when handshake is used)
assertControlMessageConforms
assertComponentEventConforms
assertExecutionResultConforms
family schema validation
```

Also verify:

- exact component version;
- JSON-serializable payloads;
- declared reset/restore/cancel flows;
- accessibility basics;
- real rendered UI;
- open-source license/provenance;
- no local event bus/persistence/Agent protocol;
- no direct LLM dependency unless explicitly architected.

## 12. Treat base protocol changes as exceptional

Before proposing a base change, prove the need cannot be expressed as:

```text
family schema
EXT action/event/control
deployment/transport adapter
Foundry orchestration
```

Normal Component work should add schemas/adapters/components, not mutate v1.

For current product integration, remember `learning-foundry-mvp` is the runnable vertical slice and still uses Runtime Protocol v0.1. Read `docs/learning-foundry-mvp-v0.1-compatibility.md` when integrating with it; do not silently rewrite either repository's boundary.

## 13. Completion report

Return:

```text
Component:
Capabilities:
Learning action(s):
Execution model:
Schemas:
Deployment/reuse decision:
Evidence produced:
Controls/events:
Open-source dependencies/sources:
Files changed:
Verification:
Known limitations:
New reusable primitives:
```

If no open-source implementation was reused, list serious candidates evaluated and concrete rejection reasons.

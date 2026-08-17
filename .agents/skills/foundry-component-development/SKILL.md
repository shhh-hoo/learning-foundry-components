---
name: foundry-component-development
description: Build or extend Learning Foundry learning components, interaction primitives, or component integrations. Use for substantial component work. Requires evidence-first design, mandatory open-source reuse research, the stable Foundry component protocol, versioned family schemas, and Component Lab QA. Do not use for Foundry orchestration, learner-model, curriculum-planning, or Dify workflow work.
---

# Foundry Component Development

Build bounded learning capabilities that can be independently implemented, tested, reviewed, reused, and paired with Foundry by an AI agent.

The goal is not maximum component count. The goal is broad **learning-action coverage** behind one stable protocol.

## 1. Load the repository contract first

Before planning implementation:

1. Read `AGENTS.md`.
2. Read `src/protocol/README.md` and every file under `src/protocol/`.
3. Read `.agents/skills/foundry-component-development/references/learning-action-matrix.md`.
4. Read `.agents/skills/foundry-component-development/references/component-contract-template.md`.
5. Search this repository for an existing component, schema, adapter, or primitive that overlaps the request.

Repository protocol code is authoritative. Never create a parallel component protocol inside one task.

## 2. Define the learning demand before choosing UI

Write a compact brief:

```text
Learning demand:
Target learner action(s):
Observable evidence wanted:
Failure / partial-success signals:
Content variability:
Domain-specific or reusable:
Likely interaction modalities:
Existing Foundry overlap:
```

Prefer the core action vocabulary when it fits:

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

Use `EXT:<NAMESPACED_ACTION>` for a genuinely useful domain/experimental action instead of changing the base protocol.

Do not start from "make a drag-and-drop component" or "make an equilibrium component". Drag/drop is a primitive; equilibrium is content. A component is justified by learner action plus useful evidence.

## 3. Inspect local reuse first

Search for:

- the same learning action;
- an existing component family;
- interaction primitives;
- state/reset/restore helpers;
- family schemas and validators;
- telemetry/evidence helpers;
- design-system primitives;
- fixtures and tests.

Prefer composition and extension over duplication.

Do not independently reimplement drag/drop, graph rendering, math input, chart annotation, canvas manipulation, state restoration, validation, or accessibility helpers when a suitable local primitive already exists.

## 4. Open-source discovery is mandatory

Before substantial new implementation, search in this order.

### A. Exact or near-exact learning tool

Look for an open-source educational activity, simulator, editor, tutor, visualizer, or assessment interaction that already performs the learner action.

### B. Interaction primitive

If no suitable learning tool exists, search the underlying primitive:

```text
sortable / drag-drop / matching
node-edge graph editing
math/equation input
chart/table/spectrum annotation
2D/3D molecule rendering
canvas/object manipulation
timeline/sequence editing
```

### C. Domain engine

Before reimplementing difficult deterministic logic, search for mature engines for symbolic algebra, chemistry representation, graph algorithms, plotting, scientific simulation, geometry, or rendering.

A third-party engine may own technical machinery. Foundry still owns the learning interaction, protocol adapter, schema/evidence semantics, and learner-facing UX.

## 5. Evaluate serious reuse candidates

For every serious candidate, record:

```text
Candidate:
Repository/package:
Version or commit reviewed:
What it solves:
License:
Maintenance signal:
Runtime/framework fit:
Accessibility status:
Bundle/runtime cost:
Privacy/network behavior:
Modification needed:
Protocol adaptation needed:
Main risks:
Decision:
```

Allowed decisions:

```text
REUSE_AS_DEPENDENCY
ADAPT_OR_WRAP
EXTERNAL_COMPONENT
REUSE_IDEA_ONLY
BUILD_NEW
```

Do not default to `BUILD_NEW` merely because coding is faster than investigating reuse.

Reject reuse when rights are unclear, the project is structurally inaccessible/insecure, incompatible or abandoned, vastly oversized for the capability, or harder to adapt than a bounded clean implementation.

## 6. Define the component contract before implementation

Use `references/component-contract-template.md`.

Each concrete component must have one manifest with one or more independently matchable `capabilities[]`.

Each capability must bind together:

```text
capabilityId
learningActions
executionModel
configurationSchema
resultSchema
optional stateSchema
optional supportedControls
requirements / limitations
```

This binding is mandatory. Do not recreate the old ambiguous pattern of component-wide unrelated `learningActions[]`, `inputs[]`, and `outputs[]`.

### Family schemas

Keep payload semantics in versioned family schemas rather than adding fields to the base protocol.

At minimum define:

```text
configuration schema
result schema
```

Stateful interactive components should also define a state schema. Family-specific observations/events should identify their payload schema.

`JSON_SCHEMA` is the baseline protocol interchange format so Foundry, Codex, and runtime validation can inspect configuration/evidence shapes without importing implementation code. Local code may additionally use Zod/TypeScript/etc.

All generic protocol payloads must be JSON-serializable. Represent binary/media resources by stable asset references rather than passing framework/browser objects across the protocol.

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

It must not decide Foundry routing such as "call interpreter", "fall back to chat", or "change the learning plan".

### Exact identity

A registry may resolve aliases, but execution must use exact:

```text
componentId
componentVersion
capabilityId
invocationId
```

Never execute `latest` implicitly.

## 7. Choose the correct execution model

Use `REQUEST_RESPONSE` for bounded operations that return directly.

Use `INTERACTIVE` when a learner remains inside the component while manipulating, retrying, submitting, resetting, restoring state, or exiting early.

For interactive components use the generic lifecycle only for cross-component semantics:

```text
Host -> Component
INIT
RESET
RESTORE
PAUSE
RESUME
CANCEL

Component -> Host
READY
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
CANCELLED
ERROR
```

Do not add every domain gesture to the base protocol. Put `itemMoved`, `bondCreated`, `parameterChanged`, etc. in family-specific payload schemas or namespaced `EXT:*` events.

## 8. Implement behind the Foundry boundary

Use this shape:

```text
Foundry typed invocation
        ↓
component / adapter
        ↓
reused library, primitive, or engine
        ↓
family-owned structured observations/results
        ↓
Foundry protocol envelope
```

Foundry Components owns:

- component identity/version;
- capability descriptors;
- family schemas and validation;
- learner-facing interaction shell;
- state lifecycle when applicable;
- bounded learner observations/results;
- adapters;
- component-level tests/fixtures.

Foundry Core owns durable pedagogy and orchestration.

If a requirement appears to need a base-protocol change, first test whether it belongs in:

```text
family schema
EXT action/event
transport adapter
Foundry orchestration
```

Only propose a base change when those boundaries cannot express it cleanly. Keep the protocol change separate from the component implementation when practical.

## 9. Parameterize content

Separate:

```text
interaction engine
+
content/configuration
+
evidence mapping
```

Do not bake one textbook example into generic component logic. Subject examples belong in fixtures/configuration unless the component is intentionally domain-specific.

## 10. Build for Component Lab first

Interactive components should run without a complete Foundry learner session whenever practical.

Use `runMode: "PREVIEW"` in the lab and provide relevant fixtures for:

```text
normal success
incorrect / partial response
repeated attempt
reset
restore when supported
cancel/abandon when relevant
malformed/unsupported input
narrow/mobile viewport
keyboard interaction
```

Passing TypeScript is not visual QA. Inspect the rendered interaction.

## 11. Produce evidence, not fake learner-state certainty

Prefer bounded observations:

```text
what the learner did
submitted state/result
changes/retries
assistance used
component-computed correctness/constraints
target/configuration identity
completion/cancellation/error/timing signals
```

Do not invent durable claims such as:

```text
mastery = 0.82
student understands X
change learning plan to Y
```

unless a governed family explicitly owns a deterministic bounded diagnosis.

## 12. Verify protocol conformance

Before declaring complete:

1. run `assertManifestConforms`;
2. validate family configuration/result/state schemas;
3. ensure protocol payload data is JSON-serializable;
4. ensure execution uses an exact component version;
5. run base execution/result/event/control conformance where applicable;
6. run unit/type/build/lint checks available in the repo;
7. verify Component Lab fixtures;
8. verify reset/restore/cancel for declared controls;
9. verify keyboard/accessibility basics;
10. inspect the rendered visual interaction;
11. record reused source/license/provenance;
12. confirm no local event bus/persistence/Agent protocol was invented;
13. confirm no direct LLM dependency unless explicitly required by architecture.

## 13. Completion report

Return:

```text
Component:
Capabilities:
Learning action(s):
Execution model:
Schemas:
Evidence produced:
Reuse decision:
Open-source dependencies/sources:
Protocol integration:
Files changed:
Tests/verification:
Known limitations:
New reusable primitive(s):
```

If no open-source code was reused, list serious candidates evaluated and why each was rejected.

## Anti-patterns

Do not:

- start substantial coding before reuse research;
- create one component per syllabus topic when a parameterized capability can cover many topics;
- confuse a UI primitive with a learning capability;
- copy code/assets with unclear licensing;
- vendor an entire application for one small primitive;
- let a dependency become canonical Foundry learner/product state;
- invent component-specific base protocol fields;
- invent a component-specific event bus or persistence layer;
- let preflight make Foundry routing policy;
- execute an unresolved/latest component version;
- pass non-serializable framework/browser objects through the generic protocol;
- return only `correct: true/false` when richer bounded evidence is naturally available;
- claim mastery from one activity;
- redesign Foundry Core inside a component task.

## Default optimization order

When trade-offs are unclear, optimize in this order:

1. preserve stable protocol compatibility;
2. reuse mature open-source primitives/domain logic;
3. preserve useful structured learner evidence;
4. minimize component-specific infrastructure;
5. make the interaction reusable across content;
6. accessibility and interaction quality;
7. visual polish;
8. domain-specific convenience.

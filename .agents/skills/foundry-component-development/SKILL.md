---
name: foundry-component-development
description: Build or extend Learning Foundry learning components, interaction primitives, or component integrations. Use for any substantial component implementation. Requires evidence-first design, mandatory open-source reuse research, compliance with the existing Foundry component/runtime protocol, explicit license/provenance review, and component-level QA before integration. Do not use for Foundry orchestration, learner-model, curriculum-planning, or Dify workflow work.
---

# Foundry Component Development

Develop bounded learning capabilities that can be independently implemented, tested, reviewed, and reused.

The goal is not to maximize component count. The goal is to expand **learning-action coverage** while keeping a common protocol, evidence boundary, and development discipline.

## 1. Load the repo boundary first

Before planning implementation:

1. Read `AGENTS.md`.
2. Read `src/protocol/README.md` and the current files under `src/protocol/`.
3. Read `references/learning-action-matrix.md`.
4. Search this repository for an existing component or primitive that already covers part of the request.

Repository code is authoritative. If this skill conflicts with the current protocol, follow the current protocol and report the discrepancy rather than silently creating a parallel contract.

## 2. Define the learning demand before choosing UI

Write a compact brief:

```text
Learning demand:
Target learner action:
Evidence wanted:
Failure / partial-success signals:
Content variability:
Domain-specific or reusable:
Likely interaction modalities:
Existing Foundry overlap:
```

Use learning-action language such as:

- RECALL
- DISCRIMINATE
- CONNECT
- SEQUENCE
- PREDICT
- MANIPULATE
- CONSTRUCT
- CALCULATE
- DIAGNOSE
- PLAN
- INTERPRET
- EXPLAIN
- TRANSFER

Do not start from "make a drag-and-drop component" or "make an equilibrium component". Drag/drop is an interaction primitive; equilibrium is content. The component should be justified by a learner action and useful evidence.

## 3. Inspect what Foundry Components already has

Before external research, search the repository for:

- the same learning action;
- reusable interaction primitives;
- shared state/reset/restore logic;
- schema and validation helpers;
- telemetry/evidence helpers;
- design-system primitives;
- test fixtures for similar interactions.

Prefer composition and extension over duplication.

Do not independently reimplement drag/drop, graph rendering, math input, canvas manipulation, state restoration, validators, or accessibility helpers when a suitable local primitive already exists.

## 4. Open-source discovery is mandatory

Before writing a substantial new implementation, search for reusable open-source work in this order.

### A. Exact or near-exact learning tool

Search for an existing open-source educational activity, simulator, editor, tutor, visualizer, or assessment interaction that solves the same learner action.

Examples:

```text
open source reaction mechanism editor
open source chemistry equilibrium simulator
open source spectrum annotation tool
open source data interpretation education React
```

### B. Interaction primitive

If no suitable learning tool exists, search the underlying primitive:

- sortable / draggable / matching;
- node-edge graph editing;
- equation/math editor;
- chart plotting and annotation;
- table/spectrum viewer;
- 2D/3D molecule rendering;
- canvas/object manipulation;
- timeline/sequence editing.

### C. Domain engine

Before reimplementing hard deterministic logic, search for a mature domain engine, for example:

- symbolic algebra;
- chemistry parsing/representation;
- graph algorithms;
- plotting;
- scientific simulation;
- geometry/3D rendering.

The external engine may own the technical primitive. Foundry should still own the learning interaction, protocol adapter, evidence semantics, and product UX.

## 5. Evaluate serious reuse candidates explicitly

For every serious candidate, record:

```text
Candidate:
Repository/package:
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

### REUSE_AS_DEPENDENCY
Use a library/package directly behind a Foundry-owned component adapter.

### ADAPT_OR_WRAP
Reuse implementation or primitives but replace/wrap its product shell, state model, evidence output, styling, or integration boundary.

### EXTERNAL_COMPONENT
Do not absorb the implementation. Treat the resource as an external learning component when link/embed/provider/package/LTI-style integration is more appropriate. The Foundry product repo owns the final external-resource governance path; do not bypass rights/privacy/accessibility review.

### REUSE_IDEA_ONLY
Use the pedagogical or interaction pattern but not the code/assets. Do not copy protected implementation.

### BUILD_NEW
Use only when suitable candidates do not exist or their adaptation/licensing/accessibility/technical cost exceeds a clean bounded implementation.

Do not default to `BUILD_NEW` just because typing code is faster than evaluating reuse.

## 6. Apply a reuse gate before substantial implementation

State the chosen reuse path and why.

Prefer reuse when a candidate provides a stable tested implementation of a hard primitive or domain engine.

Prefer adaptation when the useful implementation is sound but its product architecture does not match Foundry.

Prefer a new implementation when:

- rights/license are unclear or unacceptable;
- the project is unmaintained or fundamentally incompatible;
- accessibility/security problems are structural;
- it pulls in a much larger framework than the capability needs;
- adaptation is more complex than implementing the bounded primitive;
- Foundry needs a materially different learner-evidence model.

## 7. Implement behind the Foundry protocol

Do not expose a third-party API directly to the Agent.

Use this shape:

```text
Foundry typed invocation
        ↓
component / adapter
        ↓
reused library, primitive, or engine
        ↓
normalized component result / observation
        ↓
Foundry runtime/evidence boundary
```

Third-party code may own its technical primitive.

Foundry Components owns:

- component identity and version;
- validated invocation/configuration;
- learner-facing interaction shell;
- state lifecycle and restoration;
- bounded structured result/attempt observations;
- adapter code;
- component-level tests and fixtures.

Foundry Core owns durable pedagogical interpretation and orchestration.

If the current protocol cannot safely express the new capability, do **not** add a component-local escape hatch. Document the smallest protocol extension needed and keep it separate from the component implementation whenever practical.

## 8. Parameterize content

Separate:

```text
interaction engine
+
content/configuration
+
evidence mapping
```

Do not bake one textbook example into generic component logic. Subject examples belong in fixtures/configuration unless the component is intentionally domain-specific.

## 9. Build for Component Lab first

Every interactive component should be runnable without a complete Foundry learner session whenever practical.

Provide representative fixtures for:

- normal success;
- incorrect response;
- partial response;
- repeated attempt;
- reset;
- restore;
- malformed/unsupported input;
- narrow/mobile viewport;
- keyboard interaction where relevant.

Component Lab is the primary UX review surface before Agent integration.

## 10. Return useful structured evidence, not fake learner-state certainty

Prefer bounded observations such as:

```text
what the learner did
what state/result the component computed
which items/steps were changed
what assistance was used
how many attempts occurred
which target/configuration this attempt belonged to
completion/error/timing signals when useful
```

Avoid inventing durable interpretations such as:

```text
mastery = 0.82
student understands X
update the learning plan to Y
```

unless a governed component family explicitly owns a deterministic diagnosis for that bounded capability.

## 11. Verify before declaring complete

Run the relevant checks available in the repository and verify:

1. schema/type/unit tests;
2. build/typecheck/lint where configured;
3. Component Lab fixtures;
4. protocol compatibility;
5. no duplicate local infrastructure was introduced;
6. reused source/license/provenance is recorded;
7. keyboard/accessibility basics;
8. state reset/restore for stateful components;
9. structured bounded output;
10. no direct LLM dependency unless explicitly designed;
11. actual rendered visual interaction for visual components.

Passing TypeScript is not visual QA.

## 12. Completion report

Return:

```text
Component:
Learning action(s):
Evidence produced:
Reuse decision:
Open-source dependencies/sources:
Protocol integration:
Files changed:
Tests/verification:
Known limitations:
New reusable primitive(s):
```

If no open-source implementation was reused, list the serious candidates evaluated and the concrete reason each was rejected.

## Anti-patterns

Do not:

- start substantial coding before reuse research;
- create one component per syllabus topic when a parameterized capability can cover many topics;
- confuse a UI primitive with a learning capability;
- copy code/assets with unclear licensing;
- vendor an entire application to obtain one small primitive;
- allow a dependency to become Foundry's canonical learner/product state;
- invent a component-specific event system or persistence model;
- redesign Foundry Core inside a component task;
- return only `correct: true/false` when richer bounded evidence is naturally available;
- claim mastery from one activity;
- let the component autonomously choose long-term pedagogy.

## Default optimization order

When trade-offs are unclear, optimize in this order:

1. preserve protocol compatibility;
2. reuse mature open-source primitives/domain logic;
3. preserve high-quality learner evidence;
4. minimize component-specific infrastructure;
5. make the interaction reusable across content;
6. accessibility and interaction quality;
7. visual polish;
8. domain-specific convenience.

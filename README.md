# Learning Foundry Components

Reusable learning components, interaction primitives, family schemas, and the stable component protocol for Learning Foundry.

This repository is intentionally separate from the Foundry orchestration/runtime application. Its job is to make learning capabilities independently developable, testable, reviewable, reusable, and machine-pairable by Foundry/Codex.

## Repository boundaries

- `src/protocol/` — stable generic capability, execution, lifecycle, and conformance contracts.
- `src/primitives/` — reusable interaction primitives such as sorting, graphing, math input, canvas interactions, and structured editors.
- `src/components/` — concrete learning component families, manifests, schemas, adapters, fixtures, and implementations.
- `src/lab/` — standalone component preview and QA surfaces using protocol `PREVIEW` mode.
- `.agents/skills/` — repo-scoped Codex skills. Substantial component work must use the reuse-first development skill.
- `docs/` — architecture and open-source reuse guidance.

## Core rule

Do not start from a syllabus topic or a UI widget. Start from:

```text
learning demand
-> observable learner evidence
-> interaction
-> component capability
```

Before building a substantial implementation, inspect existing Foundry code and search for suitable open-source projects, libraries, interaction primitives, or domain engines to reuse or adapt.

## Protocol rule

Normal component growth should happen through:

```text
new component / capability
+
new versioned family schemas
+
existing stable base protocol
```

Do not change the base protocol to accommodate one component-specific payload. Prefer family schemas, namespaced `EXT:*` actions/events, transport adapters, or Foundry orchestration before proposing a protocol change.

# Learning Foundry Components

Reusable learning components, interaction primitives, and the component protocol for Learning Foundry.

This repository is intentionally separate from the Foundry orchestration/runtime application. Its job is to make learning capabilities independently developable, testable, reviewable, and reusable.

## Repository boundaries

- `src/protocol/` — generic component/runtime contracts owned by this repository.
- `src/primitives/` — reusable interaction primitives such as sorting, graphing, math input, canvas interactions, and structured editors.
- `src/components/` — concrete learning components built on the protocol and primitives.
- `src/lab/` — standalone component preview and QA surfaces.
- `.agents/skills/` — repo-scoped Codex skills. Component work must use the reuse-first development skill.
- `docs/` — architecture notes and learning-action/evidence guidance.

## Core rule

Do not start from a syllabus topic or a UI widget. Start from:

```text
learning demand
-> observable learner evidence
-> interaction
-> component capability
```

Before building a substantial implementation, inspect existing Foundry code and search for suitable open-source projects, libraries, interaction primitives, or domain engines to reuse or adapt.

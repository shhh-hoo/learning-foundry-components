# Learning Foundry Components — agent instructions

This repository owns reusable learning components, interaction primitives, component-facing contracts, family schemas, and standalone component QA surfaces.

It does **not** own Learning Foundry orchestration, learner-model policy, curriculum planning, Dify workflows, or durable product-state decisions.

## Mandatory workflow for component work

For any task that creates, extends, ports, or substantially changes a learning component, use:

`.agents/skills/foundry-component-development/SKILL.md`

The workflow is intentionally reuse-first. Do not start substantial implementation before checking both this repository and suitable open-source projects/libraries.

## Stable rules

- Start from `learning demand -> observable evidence -> interaction -> component`, not from a syllabus chapter or UI widget.
- Prefer reusable learning-action coverage over one component per topic.
- Reuse or adapt mature open-source primitives/domain engines when they fit; record source, license, version/commit, and adaptation mode.
- Never copy code with unclear rights or license.
- `src/protocol/` is the authoritative stable base contract.
- Each independently matchable capability belongs in `manifest.capabilities[]` with its own learning actions, execution model, and versioned configuration/result schemas.
- Keep component-family payload semantics in family schemas; do not promote them into the base protocol merely for one component.
- Preflight reports fit facts only. Foundry owns routing/interpreter/fallback decisions.
- Resolve an exact component version before execution; do not execute `latest` implicitly.
- Interactive components use the shared lifecycle envelopes; do not invent a component-specific event bus, persistence layer, or Agent protocol.
- Use namespaced `EXT:*` actions/events before proposing a base-protocol vocabulary expansion.
- Components report bounded learner actions/results. Foundry owns durable pedagogical interpretation such as mastery, learner position, and learning-plan changes unless a governed family contract explicitly assigns deterministic bounded diagnosis responsibility.
- Do not call an LLM directly from a component unless an explicit architecture decision requires it.
- Keep content/configuration separate from the interaction engine whenever practical.
- Every interactive component should be independently previewable/testable in Component Lab using `PREVIEW` mode before full Foundry integration.
- Visual QA requires inspecting the rendered interaction, not only passing typecheck/tests.
- Preserve keyboard/accessibility basics and state reset/restore when declared by the capability.
- Run base protocol conformance plus family-schema validation before declaring a component complete.

## Protocol changes are exceptional

A component task is not permission to redesign the protocol or Foundry Core.

Before proposing a base-protocol change, prove that the requirement cannot be expressed cleanly as one of:

```text
family schema
namespaced EXT action/event
transport adapter
Foundry orchestration
```

Compatible v1 changes should be additive and optional. Never reinterpret an existing required field or lifecycle semantic in place.

If a base change is still necessary, document it separately from the component implementation and explain the compatibility impact.

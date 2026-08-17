# Learning Foundry Components — agent instructions

This repository owns reusable learning components, interaction primitives, component-facing contracts, and standalone component QA surfaces.

It does **not** own Learning Foundry orchestration, learner-model policy, curriculum planning, Dify workflows, or durable product-state decisions.

## Mandatory workflow for component work

For any task that creates, extends, ports, or substantially changes a learning component, use the repo skill:

`.agents/skills/foundry-component-development/SKILL.md`

The skill is intentionally reuse-first. Do not start a substantial implementation before checking both this repository and suitable open-source projects/libraries.

## Stable rules

- Start from `learning demand -> observable evidence -> interaction -> component`, not from a syllabus chapter or UI widget.
- Prefer reusable learning-action coverage over one component per topic.
- Reuse or adapt mature open-source primitives/domain engines when they fit; record source, license, and adaptation mode.
- Never copy code with unclear rights or license.
- The current component/runtime protocol in `src/protocol/` is authoritative for this repo.
- Do not invent a component-specific event bus, persistence layer, or Agent protocol.
- Components report bounded learner actions/results. Foundry owns durable pedagogical interpretation such as mastery, learner position, and learning-plan changes unless a governed component contract explicitly assigns a deterministic diagnosis responsibility.
- Do not call an LLM directly from a component unless an explicit architecture decision requires it.
- Keep content/configuration separate from the interaction engine whenever practical.
- Every interactive component should be independently previewable and testable in a Component Lab before full Foundry integration.
- Visual QA requires inspecting the rendered interaction, not only passing typecheck/tests.
- Preserve keyboard/accessibility basics and state reset/restore for stateful interactions.

## Architecture changes

A component task is not permission to redesign Foundry Core. If the current protocol cannot express a needed capability, document the smallest required protocol change separately instead of adding an ad-hoc escape hatch inside one component.

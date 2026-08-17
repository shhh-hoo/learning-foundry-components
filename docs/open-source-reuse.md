# Open-source reuse policy and decision log

Learning Foundry Components is **reuse-first**, not build-from-scratch-first.

For every substantial component, first look for an existing educational tool, interaction primitive, or domain engine that can be reused or adapted.

## Reuse decision template

Create a short entry in the component's README or design note using this structure:

```text
Capability / component:
Learning action:

Candidate:
Repository/package:
Version or commit reviewed:
License:
What it solves:
Maintenance signal:
Accessibility:
Runtime/framework fit:
Network/privacy behavior:
Bundle/runtime cost:
Modification needed:
Foundry protocol adaptation:
Risks:

Decision:
- REUSE_AS_DEPENDENCY
- ADAPT_OR_WRAP
- EXTERNAL_COMPONENT
- REUSE_IDEA_ONLY
- BUILD_NEW

Reason:
Attribution / notice required:
```

## Search order

1. Exact or near-exact open-source learning tool.
2. Reusable interaction primitive.
3. Mature deterministic domain/scientific engine.
4. Only then consider a new implementation.

## What must remain Foundry-owned

Even when implementation is reused, keep these boundaries under Foundry control:

- capability identity/version;
- validated component configuration;
- learner-facing learning flow;
- state/reset/restore behavior expected by Foundry;
- structured learner observations/results;
- component adapter;
- evidence semantics;
- tests/fixtures;
- product-level orchestration outside the component.

## License rule

Do not copy or vendor source code/assets with missing or unclear licensing. A useful repository with uncertain rights is a research reference, not an implementation dependency.

External resources may also be better left external and integrated through Foundry's governed external-component path rather than absorbed into this repository.

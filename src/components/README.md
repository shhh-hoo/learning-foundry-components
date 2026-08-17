# Learning Components

Concrete bounded learning capabilities live here.

Organize components by learning action/evidence capability rather than syllabus chapter whenever possible.

Preferred reasoning pattern:

```text
learning demand
-> observable evidence
-> required learning action
-> component capability
-> content/configuration
```

Examples of component families:

- Classification Workspace
- Sequence / Process Builder
- Causal Explorer
- Structured Calculation Trainer
- Mechanism Builder
- Reaction Route Planner
- Data Investigation Workspace
- Practical Reasoning Workspace
- Answer Reconstruction Trainer
- Memorization / Retrieval Trainer

Each component family should own:

```text
manifest
  -> capabilities[]

versioned family schemas
  -> configuration
  -> result
  -> optional state / observation payloads

implementation / adapters
fixtures + tests
Component Lab preview
reuse/provenance note
```

One component may expose several independently matchable capabilities, but each capability must bind its own learning actions, execution model, and schema references. Do not publish unrelated component-wide input/output arrays and expect Foundry or an AI agent to infer the pairing.

Each component should declare honest limitations, use shared primitives where possible, pass base protocol conformance, and produce bounded structured observations/results without owning long-term learner-state decisions.

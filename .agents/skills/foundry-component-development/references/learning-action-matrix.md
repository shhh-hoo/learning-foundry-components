# Learning Action → Evidence → Interaction Matrix

Use this as a development map, not a fixed taxonomy. The purpose is to avoid building components by syllabus chapter or UI gimmick.

| Learning demand | Observable evidence wanted | Useful learning action(s) | Interaction/component direction | Example uses |
|---|---|---|---|---|
| Accurate retrieval | Learner reconstructs information without recognition cues | RECALL | recall / cloze / reconstruction | definitions, reagents, conditions, observations |
| Discrimination | Learner distinguishes similar concepts/examples | DISCRIMINATE | classify / sort / match / contrast | electrophile vs nucleophile; strong vs weak acid |
| Relationship understanding | Learner builds or identifies relationships | CONNECT | mapping / linking / dependency graph | bonding → properties; variable relationships |
| Causal understanding | Learner predicts effects of changing a variable and explains why | PREDICT + MANIPULATE + EXPLAIN | causal explorer / simulation | equilibrium, rate, energetics |
| Dynamic process understanding | Learner represents how a process changes through stages/time | SEQUENCE + PREDICT | controlled animation / process builder | mechanisms, dynamic equilibrium |
| Procedure / order | Learner reconstructs correct ordering | SEQUENCE | reorder / staged construction | experiments, mechanisms, cycles |
| Spatial / structural understanding | Learner manipulates or constructs a spatial representation | CONSTRUCT | label / hotspot / rotate / build | molecular shape, apparatus, stereochemistry |
| Route planning | Learner finds a valid path through possible transformations/actions | PLAN | graph/path construction | organic synthesis, multi-step solution planning |
| Quantitative modelling | Learner converts a problem into correct dependency/quantity relationships | CALCULATE + CONSTRUCT | structured calculation workspace | Kp, titration, Hess, stoichiometry |
| Calculation diagnosis | Learner work exposes the first meaningful error and downstream consistency | DIAGNOSE | step-aware trainer | arithmetic, formula, units, ECF-style traces |
| Data interpretation | Learner extracts patterns/anomalies/inferences from presented evidence | INTERPRET | graph/table/spectrum workspace | kinetics graphs, titration curves, spectra |
| Practical reasoning | Learner selects/constructs apparatus, variables, controls, and procedure | PLAN + CONSTRUCT + DIAGNOSE | practical workspace | titration setup, rates experiments |
| Error finding | Learner identifies and repairs an incorrect worked artefact | DIAGNOSE | debugger / critique workspace | wrong mechanism, calculation, explanation |
| Assessment expression | Learner converts knowledge into scorable explanation/argument | EXPLAIN | free response + mark-point reconstruction | explain/describe/deduce exam questions |
| Transfer | Learner succeeds in a structurally similar but surface-different task | TRANSFER | terminal mode across component families | new substrate, new dataset, changed numerical context |
| Long-term retention | Learner later succeeds without the original scaffolding | RECALL + TRANSFER | delayed retrieval / delayed task | spaced review |

## Existing Foundry lineage

The historical Foundry work already established several useful component families:

- Memorization Bank → retrieval / active recall.
- Calculation Trainer → structured calculation-path diagnosis.
- Mechanism Animation → dynamic conceptual/process visualization.
- Reaction Network / path work → route planning.
- Answer Trainer → assessment-expression training.
- Concept Trainer and Practical Trainer were identified as distinct future families.

Do not treat these names as mandatory final product names. Preserve the learning mechanism and evidence semantics.

## Important distinction: interaction primitive vs learning component

Examples of **interaction primitives**:

```text
drag/drop
sortable list
slider
canvas
node-edge graph
math input
chart
hotspot
3D renderer
text editor
```

Examples of **learning components**:

```text
Classification Workspace
Causal Explorer
Mechanism Builder
Reaction Route Planner
Structured Calculation Trainer
Data Investigation Workspace
Practical Reasoning Workspace
Answer Reconstruction Trainer
```

A primitive becomes pedagogically meaningful only through a learning demand, bounded task/configuration, and observable evidence contract.

## Agent selection principle

Avoid:

```text
topic = equilibrium
→ launch equilibrium component
```

Prefer:

```text
current target
+
evidence needed
+
learner state / recent attempt
→ required learning action
→ capability match
→ component invocation
```

Example:

```text
Learner says: "I can recite Le Chatelier but I fail when the question changes."

Need evidence:
Can the learner predict a change and explain the causal chain?

Learning actions:
PREDICT + MANIPULATE + EXPLAIN

Possible component:
Causal Explorer
```

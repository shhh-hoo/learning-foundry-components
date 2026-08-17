# Interaction Primitives

Reusable technical interaction building blocks shared by multiple learning components.

Examples:

- drag/drop and sortable interactions;
- graph/node-edge editing;
- math/formula input;
- chart/table annotation;
- canvas/object manipulation;
- hotspots and labeling;
- 2D/3D rendering adapters.

A primitive is **not** itself a learning capability. It should stay content-agnostic and expose enough state/events for a learning component to construct meaningful learner evidence.

Primitives do not implement the Foundry base protocol directly. The learning component that composes them owns capability identity, family schemas, protocol envelopes, and bounded evidence semantics.

Before adding a primitive, search this repository and suitable open-source packages/projects first. Prefer a maintained, accessible dependency or wrapper over a bespoke implementation when it fits.

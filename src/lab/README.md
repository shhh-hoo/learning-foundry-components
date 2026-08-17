# Component Lab

Standalone development and QA surfaces for learning components.

A component should be reviewable here without requiring a complete Foundry learner session or Dify workflow.

Lab executions use:

```text
runMode = PREVIEW
```

and should still exercise the same manifest, family schemas, exact component version, and protocol envelopes used in product/eval modes. Preview is not permission to invent a second local API.

Representative fixtures should cover, where relevant:

- normal success;
- incorrect response;
- partial response;
- repeated attempt;
- reset;
- restore when declared by the capability;
- malformed/unsupported input;
- narrow/mobile layout;
- keyboard interaction;
- protocol/family-schema validation failure.

The lab is for fast interaction and visual review. Passing unit tests alone is not sufficient for an interactive component.

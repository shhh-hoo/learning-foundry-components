# Component Contract Template

Use this template before implementing a new component family. It is intentionally compact and machine-readable.

## 1. Learning brief

```text
Component family:
Learning demand:
Target learner action(s):
Observable evidence wanted:
Failure / partial-success signals:
Content variability:
Domain-specific or reusable:
Likely interaction modalities:
```

## 2. Reuse decision

```text
Local primitive/component checked:
Open-source candidates checked:
Chosen reuse mode:
- REUSE_AS_DEPENDENCY
- ADAPT_OR_WRAP
- EXTERNAL_COMPONENT
- REUSE_IDEA_ONLY
- BUILD_NEW
Reason:
License/provenance notes:
```

## 3. Capability manifest shape

Use one descriptor per independently matchable capability.

```ts
import type { ComponentCapabilityManifest } from "../../../src/protocol";

export const manifest: ComponentCapabilityManifest = {
  manifestSchemaVersion: "1.0.0",
  componentId: "example-component",
  componentVersion: "0.1.0",
  componentType: "workspace",
  capabilities: [
    {
      capabilityId: "example-action",
      learningActions: ["DISCRIMINATE"],
      executionModel: "INTERACTIVE",
      configurationSchema: {
        id: "foundry.example.config",
        version: "1.0.0",
      },
      resultSchema: {
        id: "foundry.example.result",
        version: "1.0.0",
      },
      stateSchema: {
        id: "foundry.example.state",
        version: "1.0.0",
      },
      supportedControls: ["RESET", "RESTORE"],
      limitations: [],
    },
  ],
};
```

Do not place family-specific payload fields in the base manifest. Put them in the referenced family schemas.

## 4. Family schemas

Every capability must define at least:

```text
configuration schema
result schema
```

Interactive stateful capabilities should also define:

```text
state schema
```

Family-specific observation/event payloads should use their own schema IDs.

Prefer stable versioned schema identities such as:

```text
foundry.classification.config@1.0.0
foundry.classification.result@1.0.0
foundry.classification.state@1.0.0
foundry.classification.observation@1.0.0
```

## 5. Preflight

`preflight(...)` reports capability facts only:

```text
EXACT_MATCH
PARTIAL_MATCH
UNSUPPORTED
```

and:

```text
matchedRequirements
missingRequirements
limitations
```

Do not return routing policy such as "call interpreter" or "fallback to chat". Foundry owns that decision.

## 6. Execution

Before execution, resolve the exact component version.

```ts
const execution = {
  protocolVersion: "1.0.0",
  invocationId: "...",
  componentId: "example-component",
  componentVersion: "0.1.0",
  capabilityId: "example-action",
  runMode: "PREVIEW",
  configuration: {
    schema: {
      id: "foundry.example.config",
      version: "1.0.0",
    },
    data: {},
  },
} as const;
```

`REQUEST_RESPONSE` normally returns `COMPLETED` or `FAILED` directly.

`INTERACTIVE` may return `STARTED` and continue through the lifecycle events.

## 7. Interactive lifecycle

Use the base lifecycle only for cross-component semantics:

```text
Host -> Component:
INIT
RESET
RESTORE
PAUSE
RESUME

Component -> Host:
READY
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
ERROR
```

Do not promote component-local gestures such as `itemMoved`, `bondCreated`, or `parameterChanged` into the generic protocol. Encode them in family-specific payload schemas or namespaced `EXT:*` events.

## 8. Required verification

Before declaring the component complete:

```text
[ ] assertManifestConforms passes
[ ] family configuration schema validation passes
[ ] family result schema validation passes
[ ] exact version is used at execution
[ ] Component Lab uses PREVIEW mode
[ ] success fixture
[ ] partial/incorrect fixture where relevant
[ ] reset fixture where relevant
[ ] restore fixture where supported
[ ] keyboard/accessibility basics
[ ] structured evidence output
[ ] open-source provenance/license recorded
[ ] no component-local event bus or persistence protocol invented
```

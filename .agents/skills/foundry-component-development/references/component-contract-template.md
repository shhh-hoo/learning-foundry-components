# Component Contract Template

Use this before implementing a new Component family.

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
Local Component/primitive checked:
Open-source candidates checked:
Decision:
- REUSE_AS_DEPENDENCY
- ADAPT_OR_WRAP
- EXTERNAL_COMPONENT
- REUSE_IDEA_ONLY
- BUILD_NEW
Reason:
License/provenance notes:
```

## 3. Capability manifest

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
        format: "JSON_SCHEMA",
      },
      resultSchema: {
        id: "foundry.example.result",
        version: "1.0.0",
        format: "JSON_SCHEMA",
      },
      stateSchema: {
        id: "foundry.example.state",
        version: "1.0.0",
        format: "JSON_SCHEMA",
      },
      controls: [
        { type: "RESET" },
        { type: "RESTORE" },
        { type: "CANCEL" },
      ],
    },
  ],
};
```

Family-specific host control example:

```ts
{
  type: "EXT:SET_HINT_LEVEL",
  payloadSchema: {
    id: "foundry.example.set-hint-level",
    version: "1.0.0",
    format: "JSON_SCHEMA",
  },
}
```

Core controls must not redefine payload schemas. `RESTORE` uses the capability `stateSchema`.

## 4. Family schemas

Required:

```text
configuration schema
result schema
```

Stateful interactive Component:

```text
state schema
```

Family-specific observation/event/control payloads use separately versioned schema IDs.

Use `JSON_SCHEMA` as the protocol-visible format. Keep payloads JSON-serializable and use asset references for binary/media resources.

## 5. Preflight

Return only fit facts:

```text
EXACT_MATCH
PARTIAL_MATCH
UNSUPPORTED
matchedRequirements
missingRequirements
limitations
```

Do not choose interpreter/fallback/chat/plan policy.

## 6. Deployment binding

Keep launch/runtime metadata separate from capability metadata.

```ts
import type { ComponentDeploymentBinding } from "../../../src/protocol";

export const deployment: ComponentDeploymentBinding = {
  bindingSchemaVersion: "1.0.0",
  componentId: "example-component",
  componentVersion: "0.1.0",
  adapterId: "foundry.web-iframe",
  protocol: "foundry-component",
  protocolVersion: "1.0.0",
  runtimeConfiguration: {
    schema: {
      id: "foundry.web-iframe.launch",
      version: "1.0.0",
      format: "JSON_SCHEMA",
    },
    data: {
      launchUrl: "/components/example/index.html",
    },
  },
};
```

## 7. Execution

Resolve the exact Component version first.

```ts
const execution = {
  protocol: "foundry-component",
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
      format: "JSON_SCHEMA",
    },
    data: {},
  },
  initialState: {
    schema: {
      id: "foundry.example.state",
      version: "1.0.0",
      format: "JSON_SCHEMA",
    },
    data: {},
  },
} as const;
```

Omit `initialState` when not resuming/initializing from saved state.

## 8. Interactive lifecycle

```text
pre-INIT Component -> Host
READY

Host -> Component
INIT
RESET
RESTORE
PAUSE
RESUME
CANCEL
EXT:<FAMILY_CONTROL>

post-INIT Component -> Host
INITIALIZED
OBSERVATION
ATTEMPT_SUBMITTED
STATE_CHANGED
COMPLETED
CANCELLED
ERROR
EXT:<FAMILY_EVENT>
```

`READY` happens before the Component knows `invocationId/capabilityId`. `INITIALIZED` happens after it accepts `INIT`, configuration, and optional initial state.

Do not promote local gestures such as `itemMoved`, `bondCreated`, or `parameterChanged` into the generic lifecycle.

## 9. Required verification

```text
[ ] assertManifestConforms
[ ] assertDeploymentBindingConforms when deployed
[ ] family config/result/state schema validation
[ ] exact componentVersion + capabilityId
[ ] protocol discriminator/version present
[ ] all protocol payloads JSON-serializable
[ ] assertReadyMessageConforms where READY handshake is used
[ ] INIT -> INITIALIZED flow
[ ] initialState fixture when stateful
[ ] reset/restore/cancel fixtures where declared
[ ] assertControlMessageConforms
[ ] assertComponentEventConforms
[ ] assertExecutionResultConforms
[ ] Component Lab PREVIEW mode
[ ] success + partial/incorrect fixtures where relevant
[ ] keyboard/accessibility basics
[ ] visual QA
[ ] structured evidence output
[ ] open-source provenance/license recorded
[ ] no Component-local replacement protocol/event bus/persistence layer
```

When integrating with `learning-foundry-mvp`, also read `docs/learning-foundry-mvp-v0.1-compatibility.md`.

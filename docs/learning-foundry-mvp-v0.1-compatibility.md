# Learning Foundry MVP v0.1 compatibility

This repository's stable component protocol is the forward component contract. `shhh-hoo/learning-foundry-mvp` already has a deliberately small runnable Runtime Protocol v0.1. The MVP must remain usable while component implementations move into this repository.

The two protocols are conceptually aligned, but they are not wire-compatible and must not both be described as the same canonical wire format.

## Existing MVP v0.1

The MVP currently proves this loop:

```text
Capability Registry
→ exact ComponentAsset id + version
→ RuntimeSession
→ sandboxed iframe
→ COMPONENT_READY
→ FOUNDRY_INIT
→ COMPONENT_INITIALIZED
→ LEARNING_EVENT / ATTEMPT_SUBMITTED / STATE_CHANGED
→ COMPONENT_COMPLETED / COMPONENT_ERROR
→ Product State
```

The MVP owns student/task/runtime-session persistence and keeps pedagogical interpretation outside the Component.

That responsibility split remains correct.

## Stable v1 mapping

### Identity

```text
MVP v0.1                     Components v1
-----------------------------------------------------
runtimeSessionId          -> invocationId (MVP may use the same UUID)
capability.id             -> componentId
capability.version        -> componentVersion
single implicit function -> capabilityId
protocol="foundry-component" -> protocol="foundry-component"
protocolVersion="0.1"    -> protocolVersion="1.0.0"
```

A future MVP RuntimeSession may store `invocationId` separately if one Product RuntimeSession ever owns multiple invocations. The current one-session/one-invocation MVP can map them 1:1.

### Lifecycle

```text
MVP v0.1                     Components v1
-----------------------------------------------------
COMPONENT_READY          -> ComponentReadyMessage / READY
FOUNDRY_INIT             -> INIT
COMPONENT_INITIALIZED    -> INITIALIZED
FOUNDRY_PAUSE            -> PAUSE
FOUNDRY_RESUME           -> RESUME
FOUNDRY_RESET            -> RESET
FOUNDRY_RESTORE          -> RESTORE
LEARNING_EVENT           -> OBSERVATION (or family EXT event)
ATTEMPT_SUBMITTED        -> ATTEMPT_SUBMITTED
STATE_CHANGED            -> STATE_CHANGED
COMPONENT_COMPLETED      -> COMPLETED
COMPONENT_ERROR          -> ERROR
(no equivalent yet)      -> CANCEL / CANCELLED
```

`READY` is intentionally a pre-INIT handshake message rather than a normal post-INIT event. An iframe can therefore announce that its listener/runtime is ready before it knows the Foundry `invocationId` or selected `capabilityId`. After `INIT`, `INITIALIZED` confirms that the governed configuration has been accepted.

This preserves the real handshake already proven by the MVP without requiring a fake `invocationId: "pending"` in v1.

## Registry and deployment

The MVP registry currently mixes two different concerns:

```text
what the component can do
+
how the current deployment launches it
```

For example it stores `id`, `version`, descriptive metadata, and:

```js
runtime: {
  type: "web",
  launchUrl: "...",
  protocolVersion: "0.1"
}
```

Components v1 deliberately separates them:

```text
ComponentCapabilityManifest
= what this exact component version can do

ComponentDeploymentBinding
= how/where this exact component version is launched in one deployment
```

For the MVP, a binding can conceptually be:

```ts
{
  bindingSchemaVersion: "1.0.0",
  componentId: "ratio-explorer",
  componentVersion: "1.0.0",
  adapterId: "foundry.web-iframe",
  protocol: "foundry-component",
  protocolVersion: "1.0.0",
  runtimeConfiguration: {
    schema: {
      id: "foundry.web-iframe.launch",
      version: "1.0.0",
      format: "JSON_SCHEMA"
    },
    data: {
      launchUrl: "/component-assets/ratio-explorer/component.html"
    }
  }
}
```

Do not add `launchUrl`, iframe sandbox flags, provider endpoints, or framework-specific entrypoints to `ComponentCapabilityManifest`. Those belong to the deployment adapter/binding.

## Capability Resolution migration

The current MVP chooses an exact component id/version. Components v1 also requires an exact `capabilityId` because one Component may expose several independently matchable capabilities.

The migration path is additive:

1. Existing MVP ComponentAssets are represented initially as manifests with one capability each.
2. Add `capabilityId` to the MVP resolution/plan/runtime session when consuming v1 manifests.
3. Dify/other orchestration receives `manifest.capabilities[]` rather than only title/tags/purpose.
4. Resolve exact `componentId + componentVersion + capabilityId` before launch.

The base component protocol should not be weakened merely because the initial MVP currently has one implicit capability per asset.

## Attempt/evidence migration

MVP v0.1 currently normalizes `ATTEMPT_SUBMITTED` into fields such as:

```text
response
correct
assistanceUsed
stateSnapshot
```

That is useful for the two seeded demo assets but is not universal enough for future Components such as simulations, mechanism construction, data investigation, or route planning.

Under v1:

```text
ATTEMPT_SUBMITTED
→ schema-bound family payload
→ Foundry-side adapter/normalizer
→ Product State Attempt / Evidence
```

Foundry Product State may keep convenient indexed fields such as `correct` when a family provides them, but it must retain the family payload/schema identity rather than requiring every Component to collapse evidence to one boolean.

This is an MVP/Product-State migration concern, not a reason to enlarge the base Component protocol.

## Migration rule

Do not rewrite the runnable MVP before new Components exist.

Use this order:

```text
merge/freeze Components v1
→ implement/migrate a real Component in learning-foundry-components
→ add a v0.1 ↔ v1 adapter or update the MVP bridge/registry
→ prove one real Component end-to-end in learning-foundry-mvp
→ migrate remaining demo assets only if useful
```

The MVP remains the vertical-slice integration test. The Components repository owns reusable component contracts and implementations. Neither repository should silently redefine the other's responsibilities.

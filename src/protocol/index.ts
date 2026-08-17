export {
  COMPONENT_PROTOCOL_NAME,
  COMPONENT_PROTOCOL_VERSION,
} from "./capability";

export type {
  CapabilityCoverage,
  CapabilityDescriptor,
  CapabilityExecutionModel,
  CapabilityFitResult,
  ComponentCapabilityInspector,
  ComponentCapabilityManifest,
  ComponentProtocolName,
  ComponentProtocolVersion,
  CoreInteractiveControl,
  CoreLearningAction,
  ExtensionInteractiveControl,
  ExtensionLearningAction,
  InteractiveControl,
  InteractiveControlDescriptor,
  JsonPrimitive,
  JsonValue,
  LearningAction,
  LearningRequestDescriptor,
  SchemaFormat,
  SchemaReference,
} from "./capability";

export type {
  ComponentDeploymentBinding,
  ComponentRuntimeConfiguration,
} from "./deployment";

export type {
  CapabilityRunMode,
  ComponentControlHandler,
  ComponentControlMessage,
  ComponentEvent,
  ComponentEventSink,
  ComponentEventType,
  ComponentReadyMessage,
  CoreComponentEventType,
  ExtensionComponentEventType,
  LearningCapabilityExecution,
  LearningCapabilityExecutionResult,
  LearningCapabilityExecutionStatus,
  LearningCapabilityRuntime,
  ProtocolIssue,
  SchemaBoundPayload,
} from "./runtime";

export {
  assertComponentEventConforms,
  assertControlMessageConforms,
  assertDeploymentBindingConforms,
  assertExecutionConforms,
  assertExecutionResultConforms,
  assertManifestConforms,
  assertReadyMessageConforms,
} from "./conformance";

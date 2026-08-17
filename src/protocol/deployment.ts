// Deployment/runtime location is deliberately separate from pedagogical capability metadata.
// A component can expose the same stable capabilities through different runtime adapters.

import type {
  ComponentProtocolName,
  ComponentProtocolVersion,
  JsonValue,
  SchemaReference,
} from "./capability";

export interface ComponentRuntimeConfiguration {
  readonly schema: SchemaReference;
  readonly data: JsonValue;
}

/**
 * Exact component identity -> concrete launch adapter/configuration.
 * Examples of adapterId: foundry.web-iframe, foundry.web-module, foundry.remote-api.
 * Adapter-specific launch fields live behind runtimeConfiguration.schema.
 */
export interface ComponentDeploymentBinding {
  readonly bindingSchemaVersion: ComponentProtocolVersion;
  readonly componentId: string;
  readonly componentVersion: string;
  readonly adapterId: string;
  readonly protocol: ComponentProtocolName;
  readonly protocolVersion: ComponentProtocolVersion;
  readonly runtimeConfiguration: ComponentRuntimeConfiguration;
  readonly limitations?: readonly string[];
}

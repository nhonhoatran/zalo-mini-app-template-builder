import { BuilderConfig } from "@zalo-builder/schema";

export interface MigrationResult {
  data: unknown;
  migrated: boolean;
  fromVersion: number;
  toVersion: number;
}

export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Migration pipeline for builder.json schema versions.
 * Safely upgrades legacy configurations to current version.
 */
export function migrateBuilderConfig(rawData: unknown): MigrationResult {
  if (!rawData || typeof rawData !== "object") {
    return {
      data: rawData,
      migrated: false,
      fromVersion: 0,
      toVersion: CURRENT_SCHEMA_VERSION,
    };
  }

  const obj = rawData as Record<string, unknown>;
  const rawVersion = typeof obj.version === "number" ? obj.version : 1;

  let currentData = { ...obj };
  let currentVersion = rawVersion;
  let migrated = false;

  // Example migration chain:
  // if (currentVersion === 1) {
  //   currentData = migrateV1ToV2(currentData);
  //   currentVersion = 2;
  //   migrated = true;
  // }

  // Ensure current version tag is set
  currentData.version = CURRENT_SCHEMA_VERSION;

  return {
    data: currentData,
    migrated,
    fromVersion: rawVersion,
    toVersion: CURRENT_SCHEMA_VERSION,
  };
}

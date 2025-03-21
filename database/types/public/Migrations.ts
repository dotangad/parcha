// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from 'zod';

/** Identifier type for public.migrations */
export type MigrationsId = number & { __brand: 'MigrationsId' };

/** Represents the table public.migrations */
export default interface Migrations {
  id: MigrationsId;

  name: string;

  hash: string;

  executedAt: Date | null;
}

/** Represents the initializer for the table public.migrations */
export interface MigrationsInitializer {
  id: MigrationsId;

  name: string;

  hash: string;

  /** Default value: CURRENT_TIMESTAMP */
  executedAt?: Date | null;
}

/** Represents the mutator for the table public.migrations */
export interface MigrationsMutator {
  id?: MigrationsId;

  name?: string;

  hash?: string;

  executedAt?: Date | null;
}

export const migrationsId = z.number() as unknown as z.Schema<MigrationsId>;

export const migrations = z.object({
  id: migrationsId,
  name: z.string(),
  hash: z.string(),
  executedAt: z.date().nullable(),
}) as unknown as z.Schema<Migrations>;

export const migrationsInitializer = z.object({
  id: migrationsId,
  name: z.string(),
  hash: z.string(),
  executedAt: z.date().optional().nullable(),
}) as unknown as z.Schema<MigrationsInitializer>;

export const migrationsMutator = z.object({
  id: migrationsId.optional(),
  name: z.string().optional(),
  hash: z.string().optional(),
  executedAt: z.date().optional().nullable(),
}) as unknown as z.Schema<MigrationsMutator>;

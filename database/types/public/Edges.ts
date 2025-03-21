// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { documentsId, type DocumentsId } from './Documents';
import { z } from 'zod';

/** Identifier type for public.edges */
export type EdgesId = string & { __brand: 'EdgesId' };

/** Represents the table public.edges */
export default interface Edges {
  id: EdgesId;

  document1: DocumentsId;

  document2: DocumentsId;

  parent: boolean | null;

  metadata: unknown | null;

  createdAt: Date;

  updatedAt: Date;
}

/** Represents the initializer for the table public.edges */
export interface EdgesInitializer {
  /** Default value: gen_random_uuid() */
  id?: EdgesId;

  document1: DocumentsId;

  document2: DocumentsId;

  /** Default value: false */
  parent?: boolean | null;

  metadata?: unknown | null;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;
}

/** Represents the mutator for the table public.edges */
export interface EdgesMutator {
  id?: EdgesId;

  document1?: DocumentsId;

  document2?: DocumentsId;

  parent?: boolean | null;

  metadata?: unknown | null;

  createdAt?: Date;

  updatedAt?: Date;
}

export const edgesId = z.string() as unknown as z.Schema<EdgesId>;

export const edges = z.object({
  id: edgesId,
  document1: documentsId,
  document2: documentsId,
  parent: z.boolean().nullable(),
  metadata: z.unknown().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) as unknown as z.Schema<Edges>;

export const edgesInitializer = z.object({
  id: edgesId.optional(),
  document1: documentsId,
  document2: documentsId,
  parent: z.boolean().optional().nullable(),
  metadata: z.unknown().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as unknown as z.Schema<EdgesInitializer>;

export const edgesMutator = z.object({
  id: edgesId.optional(),
  document1: documentsId.optional(),
  document2: documentsId.optional(),
  parent: z.boolean().optional().nullable(),
  metadata: z.unknown().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}) as unknown as z.Schema<EdgesMutator>;

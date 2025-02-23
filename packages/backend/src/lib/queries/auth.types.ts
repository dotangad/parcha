/** Types generated for queries found in "src/lib/queries/auth.ts" */

/** 'UpsertUser' parameters type */
export interface IUpsertUserParams {
  email?: string | null | void;
  google_id?: string | null | void;
  name?: string | null | void;
  picture?: string | null | void;
}

/** 'UpsertUser' return type */
export type IUpsertUserResult = void;

/** 'UpsertUser' query type */
export interface IUpsertUserQuery {
  params: IUpsertUserParams;
  result: IUpsertUserResult;
}


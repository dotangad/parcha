export type TAPIResponse<TData> = {
  success: boolean;
  message?: string;
  error?: unknown;
  data: TData;
};

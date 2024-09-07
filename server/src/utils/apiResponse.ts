export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message: string;
  errors?: Record<string, unknown>;
}

export function createSuccessResponse<T>(data: T, message: string): ApiResponse<T> {
  return {
    status: "success",
    data,
    message,
  };
}

export function createErrorResponse(
  message: string,
  errors?: Record<string, unknown>
): ApiResponse<null> {
  return {
    status: "error",
    message,
    errors,
  };
}

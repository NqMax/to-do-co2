export const errorCodes = {
  unauthorized: "UNAUTHORIZED",
  invalidCredentials: "INVALID_CREDENTIALS",
  invalidDepartment: "INVALID_DEPARTMENT",
  invalidRole: "INVALID_ROLE",
  invalidInput: "INVALID_INPUT",
  taskNotFound: "TASK_NOT_FOUND",
  internalServerError: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];

export function constructError(code: ErrorCode, message: string) {
  return {
    error: {
      code,
      message,
    },
  };
}

export function toValidationError(message: string) {
  return constructError(errorCodes.invalidInput, message);
}

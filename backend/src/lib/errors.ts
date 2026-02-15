export const errorCodes = {
  unauthorized: "UNAUTHORIZED",
  invalidCredentials: "INVALID_CREDENTIALS",
  invalidDepartment: "INVALID_DEPARTMENT",
  invalidRole: "INVALID_ROLE",
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

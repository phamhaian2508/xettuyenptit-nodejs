export function createHttpError(status, message, options = {}) {
  const error = new Error(message);
  error.status = status;
  Object.assign(error, options);
  return error;
}

export function isMysqlDuplicateError(error) {
  return error?.code === "ER_DUP_ENTRY";
}

export function isClientErrorStatus(status) {
  return Number.isInteger(status) && status >= 400 && status < 500;
}

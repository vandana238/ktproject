/**
 * List of all HTTP codes used by the application
 * @author Chandra Sekhar
 */

const HTTP_CODES = {
  OK: 200,
  NO_DATA: 204,
  MOVED_PERMANENTLY: 301,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = HTTP_CODES;

import response from '../utils/response.js';
import { ClientError } from '../exceptions/index.js';

const ErrorHandler = (error, req, res, next) => {
  if (error instanceof ClientError) {
    return response(res, error.statusCode, error.message, null);
  }

  if (error.isJoi) {
    return response(res, 400, error.details[0].message, null);
  }

  const status = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';

  console.error('Unhandled error', error);

  return response(res, status, message, null);
};

export default ErrorHandler;

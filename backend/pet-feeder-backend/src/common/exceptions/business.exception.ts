import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom business exception for domain errors.
 * Allows specifying an application-level error code and message.
 */
export class BusinessException extends HttpException {
  constructor(public code: number, message: string, status = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

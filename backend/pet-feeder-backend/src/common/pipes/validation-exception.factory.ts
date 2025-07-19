import { ValidationError } from 'class-validator';
import { BusinessException } from '../exceptions/business.exception';

/**
 * Builds a BusinessException from validation errors so the global filter
 * can format the response.
 */
export function validationExceptionFactory(errors: ValidationError[]) {
  const messages = errors
    .map((e) => Object.values(e.constraints || {}).join(', '))
    .join('; ');
  return new BusinessException(1001, messages || 'Validation failed');
}

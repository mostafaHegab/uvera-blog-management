import { ApiError } from './apiError';

export class UnauthorizedError extends ApiError {
    constructor(errorKey: string) {
        super(401, errorKey);
    }
}

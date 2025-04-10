import { ApiError } from './apiError';

export class BadRequestError extends ApiError {
    constructor(errorKey: string) {
        super(400, errorKey);
    }
}

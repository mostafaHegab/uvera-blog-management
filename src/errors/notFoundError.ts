import { ApiError } from './apiError';

export class NotFoundError extends ApiError {
    constructor(errorKey: string) {
        super(404, errorKey);
    }
}

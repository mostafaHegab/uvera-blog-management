import { ErrorMessage } from './interfaces';
import { ERROR_MESSAGES } from './messages';

export class ApiError extends Error {
    statusCode: number;
    localizedMessage: ErrorMessage;

    constructor(statusCode: number, errorKey: string) {
        super(errorKey);
        this.statusCode = statusCode;
        this.localizedMessage = ERROR_MESSAGES[errorKey];
    }
}

import { UnauthorizedError } from "../unauthorizedError";

describe('UnauthorizedError', () => {
    it('should create an instance of UnauthorizedError with the correct status code', () => {
        const errorKey = 'INVALID_INPUT';
        const error = new UnauthorizedError(errorKey);

        expect(error.statusCode).toBe(401);
    });
});
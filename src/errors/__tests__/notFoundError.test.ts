import { NotFoundError } from "../notFoundError";

describe('NotFoundError', () => {
    it('should create an instance of NotFoundError with the correct status code', () => {
        const errorKey = 'INVALID_INPUT';
        const error = new NotFoundError(errorKey);

        expect(error.statusCode).toBe(404);
    });
});
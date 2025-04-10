import { BadRequestError } from '../badRequestError';

describe('BadRequestError', () => {
    it('should create an instance of BadRequestError with the correct status code', () => {
        const errorKey = 'INVALID_INPUT';
        const error = new BadRequestError(errorKey);

        expect(error.statusCode).toBe(400);
    });
});
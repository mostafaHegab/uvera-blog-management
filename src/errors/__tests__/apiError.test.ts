import { ApiError } from '../apiError';
import { ERROR_MESSAGES } from '../messages';

describe('ApiError', () => {
    it('should create an ApiError instance with the correct statusCode and message', () => {
        const statusCode = 400;
        const errorKey = 'user_already_exists';
        const apiError = new ApiError(statusCode, errorKey);

        expect(apiError.statusCode).toBe(statusCode);
        expect(apiError.localizedMessage).toEqual(ERROR_MESSAGES[errorKey]);
    });

    it('should handle an undefined errorKey gracefully', () => {
        const mockErrorMessages = {
            INVALID_INPUT: { code: 'INVALID_INPUT', message: 'Invalid input provided' },
        };

        jest.mock('../messages', () => ({
            ERROR_MESSAGES: mockErrorMessages,
        }));

        const statusCode = 500;
        const errorKey = 'NON_EXISTENT_KEY';
        const apiError = new ApiError(statusCode, errorKey);

        expect(apiError.statusCode).toBe(statusCode);
        expect(apiError.localizedMessage).toBeUndefined();
    });
});

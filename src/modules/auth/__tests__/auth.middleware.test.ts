import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../auth.middleware';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { env } from '../../../env';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {}
        };
        mockResponse = {};
        mockNext = jest.fn();
    });

    it('should throw UnauthorizedError if no token is provided', () => {
        mockRequest.headers!.authorization = undefined;

        expect(() => authMiddleware(mockRequest as Request, mockResponse as Response, mockNext))
            .toThrowError(new UnauthorizedError('no_token_provided'));
    });

    it('should throw UnauthorizedError if token is invalid', () => {
        mockRequest.headers!.authorization = 'Bearer invalidToken';
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('invalid token');
        });

        expect(() => authMiddleware(mockRequest as Request, mockResponse as Response, mockNext))
            .toThrowError(new UnauthorizedError('invalid_token'));
    });

    it('should call next function if token is valid', () => {
        const mockDecodedUser = { id: '123', email: 'test@example.com' };
        mockRequest.headers!.authorization = 'Bearer validToken';
        (jwt.verify as jest.Mock).mockReturnValue(mockDecodedUser);

        authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', env.JWT.SECRET);
        expect((mockRequest as any).user).toEqual(mockDecodedUser);
        expect(mockNext).toHaveBeenCalled();
    });
});
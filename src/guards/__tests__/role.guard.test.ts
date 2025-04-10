import { roleGuard } from '../role.guard';
import { Request, Response, NextFunction } from 'express';
import { Roles } from '../../modules/auth/roles.enum';
import { UnauthorizedError } from '../../errors/unauthorizedError';

describe('roleGuard', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        mockNext = jest.fn();
    });

    it('should call next if user role is included in roles', () => {
        mockRequest = {
            user: { role: Roles.ADMIN },
        } as any;

        const middleware = roleGuard([Roles.ADMIN, Roles.EDITOR]);
        middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it('should throw UnauthorizedError if user role is not included in roles', () => {
        mockRequest = {
            user: { role: Roles.EDITOR },
        } as any;

        const middleware = roleGuard([Roles.ADMIN]);

        expect(() => middleware(mockRequest as Request, mockResponse as Response, mockNext)).toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if user is undefined', () => {
        mockRequest = {} as any;

        const middleware = roleGuard([Roles.ADMIN]);

        expect(() => middleware(mockRequest as Request, mockResponse as Response, mockNext)).toThrow(UnauthorizedError);
    });
});
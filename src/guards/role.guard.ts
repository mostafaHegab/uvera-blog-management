import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { Roles } from '../modules/auth/roles.enum';
import { UnauthorizedError } from '../errors/unauthorizedError';

export const roleGuard =
    (roles: Roles[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
        if (!roles.includes((req as AuthRequest).user?.role)) throw new UnauthorizedError('unauthorized');
        next();
    };

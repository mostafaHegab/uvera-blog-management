import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { AuthRequest } from '../../interfaces/authRequest.interface';
import { UnauthorizedError } from '../../errors/unauthorizedError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedError('no_token_provided');

    try {
        const decoded = jwt.verify(token, env.JWT.SECRET) as any;
        (req as AuthRequest).user = decoded;
        next();
    } catch {
        throw new UnauthorizedError('invalid_token');
    }
};

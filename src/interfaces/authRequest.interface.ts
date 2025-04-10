import { Request } from 'express';
import { Roles } from '../modules/auth/roles.enum';

export interface AuthRequest extends Request {
    user: { id: number; role: Roles };
}

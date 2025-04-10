import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.entity';
import { env } from '../../env';
import { Roles } from './roles.enum';
import { AppDataSource } from '../../db/dataSource';
import { BadRequestError } from '../../errors/badRequestError';

class AuthService {
    async register(email: string, password: string, role: Roles = Roles.EDITOR) {
        const userRepo = AppDataSource.getRepository(User);
        let user = await userRepo.findOne({ where: { email } });
        if (user) throw new BadRequestError('user_already_exists');

        const hashed = await bcrypt.hash(password, 10);
        user = userRepo.create({ email, password: hashed, role });
        return userRepo.save(user);
    }

    async login(email: string, password: string) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email }, select: ['id', 'password', 'role'] });
        if (!user) throw new BadRequestError('user_not_found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new BadRequestError('invalid_password');
        const token = jwt.sign({ id: user.id, email, role: user.role }, env.JWT.SECRET, { expiresIn: env.JWT.EXPIRE });
        return { token };
    }
}

export const authService = new AuthService();

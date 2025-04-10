import { authService } from '../auth.service';
import { AppDataSource } from '../../../db/dataSource';
import bcrypt from 'bcryptjs';
import { BadRequestError } from '../../../errors/badRequestError';
import { Roles } from '../roles.enum';

jest.mock('../../../db/dataSource', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

describe('AuthService - register', () => {
    const mockUserRepo = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepo);
    });

    it('should throw BadRequestError if user already exists', async () => {
        mockUserRepo.findOne.mockResolvedValue({ email: 'test@example.com' });

        await expect(authService.register('test@example.com', 'password123')).rejects.toThrow(BadRequestError);
        expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });

    it('should hash the password and save the user', async () => {
        mockUserRepo.findOne.mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
        mockUserRepo.create.mockReturnValue({ email: 'test@example.com', password: 'hashed_password', role: Roles.EDITOR });
        mockUserRepo.save.mockResolvedValue({ id: 1, email: 'test@example.com', role: Roles.EDITOR });

        const result = await authService.register('test@example.com', 'password123');

        expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(mockUserRepo.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashed_password', role: Roles.EDITOR });
        expect(mockUserRepo.save).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashed_password', role: Roles.EDITOR });
        expect(result).toEqual({ id: 1, email: 'test@example.com', role: Roles.EDITOR });
    });

    it('should use the provided role when creating a user', async () => {
        mockUserRepo.findOne.mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
        mockUserRepo.create.mockReturnValue({ email: 'admin@example.com', password: 'hashed_password', role: Roles.ADMIN });
        mockUserRepo.save.mockResolvedValue({ id: 2, email: 'admin@example.com', role: Roles.ADMIN });

        const result = await authService.register('admin@example.com', 'password123', Roles.ADMIN);

        expect(mockUserRepo.create).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'hashed_password', role: Roles.ADMIN });
        expect(result).toEqual({ id: 2, email: 'admin@example.com', role: Roles.ADMIN });
    });
});
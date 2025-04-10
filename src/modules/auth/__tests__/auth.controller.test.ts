import { authController } from '../auth.controller';
import { authService } from '../auth.service';

jest.mock('../auth.service');

describe('AuthController - login', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        res = {
            json: jest.fn(),
        };
    });

    it('should call authService.login with correct parameters', async () => {
        await authController.login(req, res);
        expect(authService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
    });

    it('should return the user data in the response', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        (authService.login as jest.Mock).mockResolvedValue(mockUser);

        await authController.login(req, res);

        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors thrown by authService.login', async () => {
        const mockError = new Error('Invalid credentials');
        (authService.login as jest.Mock).mockRejectedValue(mockError);

        const next = jest.fn();
        res.json = jest.fn().mockImplementation(() => {
            throw mockError;
        });

        await expect(authController.login(req, res)).rejects.toThrow('Invalid credentials');
    });
});
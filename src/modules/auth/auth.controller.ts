import { authService } from './auth.service';

class AuthController {
    async register(req: any, res: any) {
        const user = await authService.register(req.body.email, req.body.password, req.body.role);
        res.status(201).json(user);
    }

    async login(req: any, res: any) {
        const user = await authService.login(req.body.email, req.body.password);
        res.json(user);
    }
}

export const authController = new AuthController();

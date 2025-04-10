import { validateDto } from '../validator.middleware';
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

jest.mock('class-transformer', () => ({
    plainToInstance: jest.fn(),
}));

jest.mock('class-validator', () => ({
    validate: jest.fn(),
}));

describe('validateDto Middleware', () => {
    class MockDto {
        field!: string;
    }

    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should call next if validation passes', async () => {
        (plainToInstance as jest.Mock).mockReturnValue(new MockDto());
        (validate as jest.Mock).mockResolvedValue([]);

        const middleware = validateDto(MockDto);
        await middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if validation fails', async () => {
        const validationErrors = [
            { constraints: { isNotEmpty: 'field should not be empty' } },
        ];
        (plainToInstance as jest.Mock).mockReturnValue(new MockDto());
        (validate as jest.Mock).mockResolvedValue(validationErrors);

        const middleware = validateDto(MockDto);
        await middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: {
                en: 'field should not be empty',
                ar: 'field should not be empty',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });
});
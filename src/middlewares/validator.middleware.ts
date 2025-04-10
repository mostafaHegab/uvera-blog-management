import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);
        if (errors.length > 0) {
            const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
            res.status(400).json({
                message: {
                    en: messages.join(', '),
                    ar: messages.join(', '),
                },
            });
            return;
        }
        next();
    };
}

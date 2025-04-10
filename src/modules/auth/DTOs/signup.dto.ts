import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';
import { Roles } from '../roles.enum';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @IsIn(Object.values(Roles))
    role!: Roles;
}

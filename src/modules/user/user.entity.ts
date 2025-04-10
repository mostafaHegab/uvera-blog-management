import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Blog } from '../blog/blog.entity';
import { Roles } from '../auth/roles.enum';

export type UserRole = 'ADMIN' | 'EDITOR';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({ type: 'enum', enum: Object.values(Roles), default: Roles.EDITOR })
    role!: UserRole;

    @OneToMany(() => Blog, (blog) => blog.author)
    blogs!: Blog[];
}

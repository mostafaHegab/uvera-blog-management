import { blogService } from '../blog.service';
import { AppDataSource } from '../../../db/dataSource';
import redisClient from '../../../db/redis';
import { NotFoundError } from '../../../errors/notFoundError';
import { UnauthorizedError } from '../../../errors/unauthorizedError';
import { User } from '../../user/user.entity';
import { Blog } from '../blog.entity';
import { Roles } from '../../auth/roles.enum';

jest.mock('../../../db/dataSource');
jest.mock('../../../db/redis', () => {
    const mockRedisClient = {
        get: jest.fn(),
        setEx: jest.fn(),
        connect: jest.fn(),
        on: jest.fn(),
    };
    return {
        __esModule: true,
        default: mockRedisClient,
    };
});

describe('BlogService', () => {
    const mockUserRepo = {
        findOneBy: jest.fn(),
    };
    const mockBlogRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
            if (entity === User) return mockUserRepo;
            if (entity === Blog) return mockBlogRepo;
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('addBlog', () => {
        it('should create and save a new blog', async () => {
            const user = { id: 1 };
            const blog = { id: 1, title: 'Test Blog', content: 'Test Content', tags: ['test'] };
            mockUserRepo.findOneBy.mockResolvedValue(user);
            mockBlogRepo.create.mockReturnValue(blog);
            mockBlogRepo.save.mockResolvedValue(blog);

            const result = await blogService.addBlog(1, 'Test Blog', 'Test Content', ['test']);

            expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockBlogRepo.create).toHaveBeenCalledWith({
                title: 'Test Blog',
                content: 'Test Content',
                author: user,
                tags: ['test'],
            });
            expect(mockBlogRepo.save).toHaveBeenCalledWith(blog);
            expect(result).toEqual(blog);
        });
    });

    describe('updateBlog', () => {
        it('should update a blog if user is authorized', async () => {
            const user = { id: 1, role: Roles.ADMIN };
            const blog = { id: 1, author: { id: 1 }, isDeleted: false };
            mockUserRepo.findOneBy.mockResolvedValue(user);
            mockBlogRepo.findOne.mockResolvedValue(blog);
            mockBlogRepo.save.mockResolvedValue({ ...blog, title: 'Updated Title' });

            const result = await blogService.updateBlog(1, 1, { title: 'Updated Title' });

            expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockBlogRepo.findOne).toHaveBeenCalledWith({
                where: { id: 1, isDeleted: false },
                relations: ['author'],
            });
            expect(mockBlogRepo.save).toHaveBeenCalledWith({ ...blog, title: 'Updated Title' });
            expect(result).toEqual({ ...blog, title: 'Updated Title' });
        });

        it('should throw NotFoundError if blog is not found', async () => {
            mockBlogRepo.findOne.mockResolvedValue(null);

            await expect(blogService.updateBlog(1, 1, { title: 'Updated Title' })).rejects.toThrow(NotFoundError);
        });

        it('should throw UnauthorizedError if user is not authorized', async () => {
            const user = { id: 2, role: Roles.EDITOR };
            const blog = { id: 1, author: { id: 1 }, isDeleted: false };
            mockUserRepo.findOneBy.mockResolvedValue(user);
            mockBlogRepo.findOne.mockResolvedValue(blog);

            await expect(blogService.updateBlog(2, 1, { title: 'Updated Title' })).rejects.toThrow(UnauthorizedError);
        });
    });

    describe('deleteBlog', () => {
        it('should mark a blog as deleted', async () => {
            const blog = { id: 1, isDeleted: false };
            mockBlogRepo.findOne.mockResolvedValue(blog);
            mockBlogRepo.save.mockResolvedValue({ ...blog, isDeleted: true });

            const result = await blogService.deleteBlog(1);

            expect(mockBlogRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockBlogRepo.save).toHaveBeenCalledWith({ ...blog, isDeleted: true });
            expect(result).toEqual({ message: 'Deleted' });
        });

        it('should throw NotFoundError if blog is not found or already deleted', async () => {
            mockBlogRepo.findOne.mockResolvedValue(null);

            await expect(blogService.deleteBlog(1)).rejects.toThrow(NotFoundError);
        });
    });

    describe('getBlogs', () => {
        it('should return cached blogs if available', async () => {
            const cachedData = { data: [], total: 0 };
            (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

            const result = await blogService.getBlogs(1, 10);

            expect(redisClient.get).toHaveBeenCalledWith('blogs:1:10:all');
            expect(result).toEqual(cachedData);
        });

        it('should fetch blogs from database and cache the result', async () => {
            const queryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };
            mockBlogRepo.createQueryBuilder.mockReturnValue(queryBuilder);

            const result = await blogService.getBlogs(1, 10);

            expect(redisClient.get).toHaveBeenCalledWith('blogs:1:10:all');
            expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('blog.author', 'author');
            expect(queryBuilder.orderBy).toHaveBeenCalledWith('blog.createdAt', 'DESC');
            expect(queryBuilder.skip).toHaveBeenCalledWith(0);
            expect(queryBuilder.take).toHaveBeenCalledWith(10);
            expect(redisClient.setEx).toHaveBeenCalledWith('blogs:1:10:all', 600, JSON.stringify({ data: [], total: 0 }));
            expect(result).toEqual({ data: [], total: 0 });
        });
    });
});

import { User } from '../user/user.entity';
import { Blog } from './blog.entity';
import { Roles } from '../auth/roles.enum';
import { AppDataSource } from '../../db/dataSource';
import redisClient from '../../db/redis';
import { NotFoundError } from '../../errors/notFoundError';
import { UnauthorizedError } from '../../errors/unauthorizedError';

class BlogService {
    addBlog = async (userId: number, title: string, content: string, tags: string[]) => {
        const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
        const blog = AppDataSource.getRepository(Blog).create({ title, content, author: user!, tags });
        return AppDataSource.getRepository(Blog).save(blog);
    };

    updateBlog = async (userId: number, blogId: number, data: Partial<Blog>) => {
        const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
        const repo = AppDataSource.getRepository(Blog);
        const blog = await repo.findOne({ where: { id: blogId, isDeleted: false }, relations: ['author'] });
        if (!blog) throw new NotFoundError('blog_not_found');

        if (user?.role !== Roles.ADMIN && blog.author.id !== userId) throw new UnauthorizedError('unauthorized');

        Object.assign(blog, data);
        return repo.save(blog);
    };

    deleteBlog = async (blogId: number) => {
        const repo = AppDataSource.getRepository(Blog);
        const blog = await repo.findOne({ where: { id: blogId } });
        if (!blog || blog.isDeleted) throw new NotFoundError('blog_not_found');

        blog.isDeleted = true;
        await repo.save(blog);
        return { message: 'Deleted' };
    };

    async getBlogs(page: number, limit: number, tags?: string) {
        const cacheKey = `blogs:${page}:${limit}:${tags || 'all'}`;

        // Check Redis cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const repo = AppDataSource.getRepository(Blog);

        const query = repo
            .createQueryBuilder('blog')
            .leftJoinAndSelect('blog.author', 'author')
            .orderBy('blog.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (tags) {
            const tagArray = tags.split(',').map((t) => t.trim());
            query.andWhere('blog.tags && ARRAY[:...tags]', { tags: tagArray });
        }

        const [data, count] = await query.getManyAndCount();

        const result = { data, total: count };

        // Cache result for 10 minutes
        await redisClient.setEx(cacheKey, 600, JSON.stringify(result));

        return result;
    }
}

export const blogService = new BlogService();

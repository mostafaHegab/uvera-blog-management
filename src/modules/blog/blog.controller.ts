import { Request, Response } from 'express';
import { blogService } from './blog.service';
import { AuthRequest } from '../../interfaces/authRequest.interface';

class BlogController {
    async addBlog(req: Request, res: Response) {
        const saved = await blogService.addBlog(
            (req as AuthRequest).user.id,
            req.body.title,
            req.body.content,
            req.body.tags,
        );
        res.status(201).json(saved);
    }

    async updateBlog(req: Request, res: Response) {
        const saved = await blogService.updateBlog((req as AuthRequest).user.id, Number(req.params.id), req.body);
        res.json(saved);
    }

    async deleteBlog(req: Request, res: Response) {
        const deleted = await blogService.deleteBlog(Number(req.params.id));
        res.json(deleted);
    }

    async getBlogs(req: Request, res: Response) {
        const { page = 1, limit = 10, tags } = req.query;
        const blogs = await blogService.getBlogs(Number(page), Number(limit), tags as string);
        res.json(blogs);
    }
}

export const blogController = new BlogController();

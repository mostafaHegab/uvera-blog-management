import { Request, Response } from 'express';
import { blogController } from '../blog.controller';
import { blogService } from '../blog.service';
import { AuthRequest } from '../../../interfaces/authRequest.interface';
import { Roles } from '../../auth/roles.enum';

jest.mock('../blog.service', () => ({
    blogService: {
        addBlog: jest.fn(),
        updateBlog: jest.fn(),
        deleteBlog: jest.fn(),
        getBlogs: jest.fn(),
    },
}));

describe('BlogController', () => {
    let req: Partial<AuthRequest>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = {};
        res = {
            status: statusMock,
            json: jsonMock,
        };
        jest.clearAllMocks();
    });

    describe('addBlog', () => {
        it('should add a blog and return the saved blog', async () => {
            const mockBlog = { id: 1, title: 'Test Blog', content: 'Test Content', tags: ['test'] };
            (blogService.addBlog as jest.Mock).mockResolvedValue(mockBlog);

            req = {
                body: { title: 'Test Blog', content: 'Test Content', tags: ['test'] },
                user: { id: 1 },
            } as AuthRequest;

            await blogController.addBlog(req as Request, res as Response);

            expect(blogService.addBlog).toHaveBeenCalledWith(1, 'Test Blog', 'Test Content', ['test']);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockBlog);
        });
    });

    describe('updateBlog', () => {
        it('should update a blog and return the updated blog', async () => {
            const mockBlog = { id: 1, title: 'Updated Blog', content: 'Updated Content' };
            (blogService.updateBlog as jest.Mock).mockResolvedValue(mockBlog);

            req = {
                params: { id: '1' },
                body: { title: 'Updated Blog', content: 'Updated Content' },
                user: { id: 1, role: Roles.ADMIN },
            };

            await blogController.updateBlog(req as Request, res as Response);

            expect(blogService.updateBlog).toHaveBeenCalledWith(1, 1, {
                title: 'Updated Blog',
                content: 'Updated Content',
            });
            expect(jsonMock).toHaveBeenCalledWith(mockBlog);
        });
    });

    describe('deleteBlog', () => {
        it('should delete a blog and return the result', async () => {
            const mockResult = { success: true };
            (blogService.deleteBlog as jest.Mock).mockResolvedValue(mockResult);

            req = {
                params: { id: '1' },
            };

            await blogController.deleteBlog(req as Request, res as Response);

            expect(blogService.deleteBlog).toHaveBeenCalledWith(1);
            expect(jsonMock).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('getBlogs', () => {
        it('should return a list of blogs', async () => {
            const mockBlogs = [
                { id: 1, title: 'Blog 1' },
                { id: 2, title: 'Blog 2' },
            ];
            (blogService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);

            req = {
                query: { page: '1', limit: '10', tags: 'test' },
            };

            await blogController.getBlogs(req as Request, res as Response);

            expect(blogService.getBlogs).toHaveBeenCalledWith(1, 10, 'test');
            expect(jsonMock).toHaveBeenCalledWith(mockBlogs);
        });
    });
});

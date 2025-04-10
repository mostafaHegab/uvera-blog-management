import express from 'express';
import { roleGuard } from '../../guards/role.guard';
import { Roles } from '../auth/roles.enum';
import { blogController } from './blog.controller';
import { validateDto } from '../../middlewares/validator.middleware';
import { CreateBlogDto } from './DTOs/createBlog.dto';
import { UpdateBlogDto } from './DTOs/updateBlog.dto';

const router = express.Router();

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     description: Allows Admins and Editors to create a new blog post.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 authorId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Blog not saved due to invalid input
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.post('/', roleGuard([Roles.ADMIN, Roles.EDITOR]), validateDto(CreateBlogDto), blogController.addBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog post
 *     description: Allows Admins and Editors to update a blog post by its ID.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 authorId:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid data or blog could not be updated
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have permission
 *       404:
 *         description: Blog not found
 */
router.put('/:id', roleGuard([Roles.ADMIN, Roles.EDITOR]), validateDto(UpdateBlogDto), blogController.updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Allows only Admins to delete a blog post by its ID.
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted
 *       401:
 *         description: Unauthorized - JWT is missing or invalid
 *       403:
 *         description: Forbidden - User does not have permission
 *       404:
 *         description: Blog not found
 */
router.delete('/:id', roleGuard([Roles.ADMIN]), blogController.deleteBlog);

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieve a list of blog posts with optional pagination and filtering by tags.
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of blogs per page
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter blogs by tags (comma-separated)
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: Total number of blog posts matching the filter
 */
router.get('/', blogController.getBlogs);

export default router;

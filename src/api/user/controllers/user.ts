/**
 * user controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  async find(ctx) {
    // Add custom logic here if needed
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    // Add custom logic here if needed
    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },

  async create(ctx) {
    // Add custom logic here if needed
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    // Add custom logic here if needed
    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    // Add custom logic here if needed
    const response = await super.delete(ctx);
    return response;
  },

  async login(ctx: Context) {
    try {
      const { identifier, password } = ctx.request.body;

      if (!identifier || !password) {
        ctx.throw(400, 'Please provide both identifier and password');
      }

      // Find the user using entity service
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: {
          $or: [
            { email: identifier },
            { username: identifier }
          ]
        }
      });

      const user = users?.[0];

      if (!user) {
        ctx.throw(401, 'Invalid credentials');
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        ctx.throw(401, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id,
          isAdmin: user.isAdmin || false
        },
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '1d' }
      );

      // Remove sensitive data
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      ctx.body = {
        jwt: token,
        user: sanitizedUser
      };

    } catch (error) {
      ctx.throw(error.status || 500, error.message || 'Internal server error');
    }
  }
})); 
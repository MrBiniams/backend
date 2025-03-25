/**
 * slot controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::slot.slot', ({ strapi }) => ({
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
  }
})); 
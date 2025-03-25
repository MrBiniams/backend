/**
 * booking controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::booking.booking', ({ strapi }) => ({
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
    // Create the booking
    const response = await super.create(ctx);
    
    // Emit socket event
    strapi.service('api::socket.socket').emit(
      'booking-created',
      response.data.attributes.locationId,
      response.data
    );

    return response;
  },

  async update(ctx) {
    // Update the booking
    const response = await super.update(ctx);
    
    // Emit socket event
    strapi.service('api::socket.socket').emit(
      'booking-updated',
      response.data.attributes.locationId,
      response.data
    );

    return response;
  },

  async delete(ctx) {
    // Get the booking before deletion
    const booking = await strapi.entityService.findOne(
      'api::booking.booking',
      ctx.params.id,
      { populate: ['location'] }
    );

    // Delete the booking
    const response = await super.delete(ctx);
    
    // Emit socket event
    if (booking?.location?.id) {
      strapi.service('api::socket.socket').emit(
        'booking-deleted',
        booking.location.id,
        { id: ctx.params.id }
      );
    }

    return response;
  },
})); 
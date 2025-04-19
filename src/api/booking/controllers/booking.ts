/**
 * booking controller
 */

import { factories } from '@strapi/strapi';

export default {
  async create(ctx) {
    try {
      const result = await strapi.service('api::booking.booking').createBooking(ctx);
      return result;
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async updateStatus(ctx) {
    try {
      const result = await strapi.service('api::booking.booking').updateBookingStatus(ctx);
      return result;
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

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
      ctx.params.documentId,
      { populate: ['location'] }
    );

    // Delete the booking
    const response = await super.delete(ctx);
    
    // Emit socket event
    if (booking?.location?.documentId) {
      strapi.service('api::socket.socket').emit(
        'booking-deleted',
        booking.location.documentId,
        { documentId: ctx.params.documentId }
      );
    }

    return response;
  },
}; 
/**
 * booking controller
 */

export default {
  async create(ctx) {
    try {
      const result = await strapi.service('api::booking.booking').createBooking(ctx);
      return result;
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async extend(ctx) {
    try {
      const result = await strapi.service('api::booking.booking').extendBooking(ctx);
      return result;
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;

      const booking = await strapi.entityService.update('api::booking.booking', id, {
        data: {
          bookingStatus: status
        } as any,
        populate: ['user', 'slot', 'location']
      });

      // Emit socket event for real-time updates
      strapi.service('api::socket.socket').emit(
        'booking-status-updated',
        booking.location.documentId,
        booking
      );

      return { data: booking };
    } catch (err) {
      ctx.throw(500, err);
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
  async findMyBookings(ctx) {
    try {
      const userId = ctx.state.user?.documentId;
      if (!userId) {
        return ctx.unauthorized('User not authenticated');
      }

      // First get all original bookings that are active
      const originalBookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          user: {
            documentId: userId
          },
          bookingStatus: {
            $in: ['active']
          },
          endTime: {
            $gt: new Date()
          },
          originalBooking: {
            $null: true
          }
        },
        populate: ['slot.location', 'extendedBookings']
      });

      // Process each original booking to combine with its extensions
      const processedBookings = await Promise.all(originalBookings.map(async (booking) => {
        // Get all extended bookings for this original booking
        const extendedBookings = await strapi.entityService.findMany('api::booking.booking', {
          filters: {
            originalBooking: booking.id,
            bookingStatus: 'active',
            paymentStatus: 'paid'
          },
          sort: { startTime: 'asc' }
        });

        // Calculate total price
        const totalPrice = extendedBookings.reduce((sum, ext) => sum + (ext.totalPrice || 0), booking.totalPrice || 0);

        // Find the latest end time from all extended bookings
        const latestEndTime = extendedBookings.length > 0 
          ? new Date(Math.max(...extendedBookings.map(ext => new Date(ext.endTime).getTime())))
          : booking.endTime;

        // Return the combined booking data
        return {
          ...booking,
          totalPrice,
          endTime: latestEndTime,
          extendedBookings: extendedBookings.map(ext => ({
            id: ext.id,
            startTime: ext.startTime,
            endTime: ext.endTime,
            totalPrice: ext.totalPrice,
            paymentStatus: ext.paymentStatus
          }))
        };
      }));

      return { data: processedBookings };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findByUser(ctx) {
    try {
      const { userId } = ctx.params;
      const bookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          user: {
            id: userId
          }
        },
        populate: ['slot.location']
      });
      return { data: bookings };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findBySlot(ctx) {
    try {
      const { slotId } = ctx.params;
      const bookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          slot: {
            id: slotId
          }
        },
        populate: ['user', 'location']
      });
      return { data: bookings };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}; 
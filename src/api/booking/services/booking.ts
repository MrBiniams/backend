export default ({ strapi }) => ({
  async createBooking(ctx) {
    try {
      const { plateNumber, slotId } = ctx.request.body;
      const userId = ctx.state.user.documentId;

      // Validate required fields
      if (!plateNumber || !slotId) {
        return ctx.badRequest('Plate number, and slot are required');
      }

      // Check if slot exists and is available
      const slots = await strapi.entityService.findMany('api::slot.slot', {
        filters: {
          documentId: slotId, // assuming `slotId` is your custom ID
        },
        populate: ['location'],
      });

      const slot = slots[0] || null;

      if (!slot) {
        return ctx.badRequest('Slot not found');
      }

      if (slot.status !== 'available') {
        return ctx.badRequest('Slot is not available');
      }

      console.log(slot);
  
      const locationId = slot.location.documentId;

      // Create booking
      const booking = await strapi.entityService.create('api::booking.booking', {
        data: {
          plateNumber,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          status: 'pending',
          user: userId,
          location: locationId,
          slot: slotId
        }
      });

      // Update slot status to occupied
      await strapi.entityService.update('api::slot.slot', slotId, {
        data: {
          status: 'occupied'
        }
      });

      return {
        success: true,
        booking
      };
    } catch (error) {
      console.error('Booking creation error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async updateBookingStatus(ctx) {
    try {
      const { bookingId, status } = ctx.request.body;

      // Validate required fields
      if (!bookingId || !status) {
        return ctx.badRequest('Booking ID and status are required');
      }

      // Get booking with slot
      const booking = await strapi.entityService.findOne('api::booking.booking', bookingId, {
        populate: ['slot']
      });

      if (!booking) {
        return ctx.badRequest('Booking not found');
      }

      // Update booking status
      const updatedBooking = await strapi.entityService.update('api::booking.booking', bookingId, {
        data: { status }
      });

      // If status changed to active, update slot status
      if (status === 'active') {
        await strapi.entityService.update('api::slot.slot', booking.slot.id, {
          data: {
            status: 'occupied'
          }
        });
      }

      return {
        success: true,
        booking: updatedBooking
      };
    } catch (error) {
      console.error('Booking status update error:', error);
      return ctx.badRequest(error.message);
    }
  }
}); 
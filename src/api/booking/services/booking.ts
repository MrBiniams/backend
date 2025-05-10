export default ({ strapi }) => ({
  async createBooking(ctx) {
    try {
      const { plateNumber, slotId, paymentMethod } = ctx.request.body;
      const userId = ctx.state.user.documentId;

      // Validate required fields
      if (!plateNumber || !slotId) {
        return ctx.badRequest('Plate number and slot are required');
      }

      // Check if slot exists and is available
      const slots = await strapi.entityService.findMany('api::slot.slot', {
        filters: {
          documentId: slotId,
        },
        populate: ['location'],
      });

      const slot = slots[0] || null;

      if (!slot) {
        return ctx.badRequest('Slot not found');
      }

      if (slot.slotStatus !== 'available') {
        return ctx.badRequest('Slot is not available');
      }

      const locationId = slot.location.documentId;

      // Create booking
      const booking = await strapi.entityService.create('api::booking.booking', {
        data: {
          plateNumber,
          bookingStatus: 'pending',
          startTime: new Date().toISOString(),
          user: userId,
          location: locationId,
          slot: slotId,
          paymentMethod,
          paymentStatus: 'pending'
        }
      });

      // Update slot status to occupied
      await strapi.entityService.update('api::slot.slot', slotId, {
        data: {
          slotStatus: 'occupied'
        }
      });

      // If payment method is provided, initiate payment
      if (paymentMethod) {
        try {
          const amount = slot.price || 0;
          const paymentResult = await strapi.service('api::payment.payment').processPayment(
            booking.id,
            amount,
            paymentMethod
          );

          return {
            success: true,
            booking,
            payment: paymentResult
          };
        } catch (paymentError) {
          // If payment fails, update booking status
          await strapi.entityService.update('api::booking.booking', booking.id, {
            data: {
              paymentStatus: 'failed'
            }
          });

          // Revert slot status
          await strapi.entityService.update('api::slot.slot', slotId, {
            data: {
              slotStatus: 'available'
            }
          });

          throw paymentError;
        }
      }

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
            slotStatus: 'occupied'
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
import { factories } from '@strapi/strapi';

export default ({ strapi }) => ({
  async createBooking(ctx) {
    try {
      const { plateNumber, slotId, time } = ctx.request.body;
      const userId = ctx.state.user.documentId;


      // Validate required fields
      if (!plateNumber || !slotId || !time) {
        return {
          error: 'Missing required fields',
          status: 400
        };
      }

      // Validate time (1-24 hours)
      const duration = parseInt(time);
      if (isNaN(duration) || duration < 1 || duration > 24) {
        return {
          error: 'Invalid duration. Must be between 1 and 24 hours',
          status: 400
        };
      }

      // Check for existing active bookings with the same plate number
      const existingBookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          $or: [
            {
              plateNumber,
              bookingStatus: {
                $in: ['confirmed', 'active']
              },
              endTime: {
                $gt: new Date()
              }
            },
            {
              plateNumber,
              bookingStatus: 'pending',
              startTime: {
                $gt: new Date(Date.now() - 3 * 60 * 1000) // 3 minutes ago
              }
            }
          ]
        }
      });

      if (existingBookings.length > 0) {
        return {
          error: 'This plate number already has an active booking',
          status: 400
        };
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
        return {
          error: 'Slot not found',
          status: 404
        };
      }

      // Check if slot is available
      if (slot.slotStatus !== 'available') {
        return {
          error: 'Slot is not available',
          status: 400
        };
      }

      // Calculate start and end times
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      // Calculate total price
      const totalPrice = duration * slot.price;

      // Create booking
      const booking = await strapi.entityService.create('api::booking.booking', {
        data: {
          plateNumber,
          slot: slotId,
          startTime,
          endTime,
          duration,
          totalPrice,
          bookingStatus: 'pending',
          paymentStatus: 'pending',
          user: userId
        }
      });


      return {
        success: true,
        booking
      };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return {
        error: 'Failed to delete booking',
        status: 500
      };
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
      const updatedBooking = await strapi.entityService.update('api::booking.booking', booking.id, {
        data: { 
          bookingStatus: status,
          publishedAt: new Date()
        }
      });

      // If status changed to active, update slot status
      if (status === 'active') {
        await strapi.entityService.update('api::slot.slot', booking.slot.id, {
          data: {
            slotStatus: 'occupied',
            publishedAt: new Date()
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
  },

  async extendBooking(ctx) {
    try {
      const { documentId } = ctx.params;
      const { extendedTime, slotId } = ctx.request.body;
      const userId = ctx.state.user.documentId;

      // Validate required fields
      if (!extendedTime || !slotId) {
        return {
          error: 'Missing extended time or slot ID',
          status: 400
        };
      }

      // Validate extended time (1-24 hours)
      const duration = parseInt(extendedTime);
      if (isNaN(duration) || duration < 1 || duration > 24) {
        return {
          error: 'Invalid duration. Must be between 1 and 24 hours',
          status: 400
        };
      }

      // Get the original booking with its extended bookings
      const bookings = await strapi.entityService.findMany('api::booking.booking', {
        filters: {
          documentId: documentId
        },
        populate: ['slot', 'user', 'extendedBookings']
      });

      const originalBooking = bookings[0] || null;

      if (!originalBooking) {
        return {
          error: 'Booking not found',
          status: 404
        };
      }
      
      // Check if the booking belongs to the user
      if (originalBooking.user?.documentId !== userId) {
        return {
          error: 'Unauthorized to extend this booking',
          status: 403
        };
      }

      // Check if the booking is active
      if (originalBooking.bookingStatus !== 'active') {
        return {
          error: 'Can only extend active bookings',
          status: 400
        };
      }

      // Find the last extended booking if it exists
      const lastExtendedBooking = originalBooking.extendedBookings?.length 
        ? originalBooking.extendedBookings[originalBooking.extendedBookings.length - 1]
        : null;

      // Use the last extended booking's end time if it exists, otherwise use the original booking's end time
      const startTime = lastExtendedBooking ? new Date(lastExtendedBooking.endTime) : new Date(originalBooking.endTime);
      
      // Calculate new end time
      const newEndTime = new Date(startTime);
      newEndTime.setHours(newEndTime.getHours() + duration);

      // Calculate additional price
      const additionalPrice = duration * originalBooking.slot.price;

      // Create extended booking
      const extendedBooking = await strapi.entityService.create('api::booking.booking', {
        data: {
          plateNumber: originalBooking.plateNumber,
          slot: originalBooking.slot.id,
          startTime: startTime,
          endTime: newEndTime,
          duration,
          totalPrice: additionalPrice,
          bookingStatus: 'active',
          paymentStatus: 'pending',
          user: userId,
          originalBooking: documentId
        }
      });

      return {
        success: true,
        booking: extendedBooking
      };
    } catch (error) {
      console.error('Error extending booking:', error);
      return {
        error: 'Failed to extend booking',
        status: 500
      };
    }
  }
}); 
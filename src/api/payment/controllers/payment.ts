export default {
  async initiate(ctx) {
    try {
      const { bookingId, paymentMethod } = ctx.request.body;
      const userId = ctx.state.user.id;

      // Validate required fields
      if (!bookingId || !paymentMethod) {
        return ctx.badRequest('Booking ID and payment method are required');
      }

      // Validate payment method
      const validPaymentMethods = ['telebirr', 'cbe-birr'];
      const normalizedPaymentMethod = paymentMethod.toLowerCase();
      if (!validPaymentMethods.includes(normalizedPaymentMethod)) {
        return ctx.badRequest('Invalid payment method');
      }

      // Get booking details
      const booking = await strapi.entityService.findOne('api::booking.booking', bookingId, {
        populate: ['user', 'slot']
      });

      if (!booking) {
        return ctx.badRequest('Booking not found');
      }

      // Check if booking belongs to user
      if (booking.user.id !== userId) {
        return ctx.badRequest('Unauthorized');
      }

      // Check if payment already exists
      const existingPayment = await strapi.entityService.findMany('api::payment.payment', {
        filters: {
          booking: bookingId
        }
      });

      if (existingPayment.length > 0) {
        return ctx.badRequest('Payment already exists for this booking');
      }

      // Generate transaction ID
      const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create payment record
      const payment = await strapi.entityService.create('api::payment.payment', {
        data: {
          amount: booking.totalPrice,
          currency: 'ETB',
          status: 'pending',
          transactionId,
          paymentMethod: normalizedPaymentMethod,
          booking: bookingId,
          customerPhone: booking.user.phoneNumber,
          customerEmail: booking.user.email,
          customerName: booking.user.firstName ? `${booking.user.firstName} ${booking.user.lastName}` : booking.user.phoneNumber,
          metadata: {
            bookingId,
            slotId: booking.slot.id,
            locationId: booking.slot.location?.id
          },
          publishedAt: new Date(),
          description: `Payment for booking ${bookingId}`,
          paymentUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment/verify/${transactionId}`
        }
      });

      // Get payment provider service
      let paymentProvider;
      switch (normalizedPaymentMethod) {
        case 'telebirr':
          paymentProvider = strapi.service('api::payment.telebirr');
          break;
        case 'cbe-birr':
          paymentProvider = strapi.service('api::payment.cbe-birr');
          break;
        default:
          return ctx.badRequest('Invalid payment method');
      }

      if (!paymentProvider) {
        return ctx.badRequest('Payment provider not available');
      }

      // Initiate payment with provider
      const paymentResult = await paymentProvider.initiatePayment(payment);

      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          paymentUrl: paymentResult.paymentUrl
        }
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      return ctx.internalServerError('Error initiating payment');
    }
  }
}; 
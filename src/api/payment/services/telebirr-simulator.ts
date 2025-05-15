import axios from 'axios';

export default ({ strapi }) => ({
  async initiatePayment(transaction) {
    try {
      console.log('initiatePayment', transaction);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a simulated payment URL
      const paymentUrl = `${process.env.FRONTEND_URL}/payment/simulate?paymentId=${transaction.documentId}`;

      // Simulate provider response
      const providerResponse = {
        providerTransactionId: `SIM-${Date.now()}`,
        reference: `REF-${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl,
        status: 'pending'
      };

      // Update transaction with simulated provider response
      await strapi.entityService.update('api::payment.payment', transaction.id, {
        data: {
          paymentProviderResponse: providerResponse,
          paymentProviderTransactionId: providerResponse.providerTransactionId,
          paymentProviderReference: providerResponse.reference
        }
      });

      return {
        paymentUrl,
        providerTransactionId: providerResponse.providerTransactionId
      };
    } catch (error) {
      console.error('Telebirr simulator payment initiation error:', error);
      throw error;
    }
  },

  async verifyPayment(paymentId) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: {
          documentId: paymentId
        },
        populate: ['booking']
      });

      const transaction = transactions[0];

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Simulate successful payment verification
      const response = {
        status: 'success',
        message: 'Payment verified successfully',
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        timestamp: new Date().toISOString(),
        bookingId: transaction.booking.documentId
      };

      return {
        status: 'success',
        providerResponse: response,
        message: 'Payment verified successfully'
      };
    } catch (error) {
      console.error('Telebirr simulator payment verification error:', error);
      throw error;
    }
  }
}); 
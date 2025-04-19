export default {
  async initializeOtp(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        return ctx.badRequest('Phone number is required');
      }

      // Simulate sending OTP
      console.log(`Simulated OTP sent to ${phoneNumber}: 123456`);

      // Return a mock verification ID
      return {
        success: true,
        verificationId: `mock-verification-id-${Date.now()}`,
      };
    } catch (error) {
      console.error('OTP initialization error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async verifyOtp(ctx) {
    try {
      const { verificationId, otp, phoneNumber } = ctx.request.body;

      if (!verificationId || !otp || !phoneNumber) {
        return ctx.badRequest('Verification ID, OTP, and phone number are required');
      }

      // Simulate OTP verification
      if (otp !== '123456') {
        return ctx.badRequest('Invalid OTP');
      }

      // Check if user exists in Strapi
      let strapiUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { phoneNumber },
      });

      if (!strapiUser) {
        // Return success but indicate user needs to sign up
        return {
          success: true,
          needsSignup: true,
        };
      }

      // Generate JWT token for Strapi
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: strapiUser.id,
      });

      return {
        success: true,
        needsSignup: false,
        jwt,
        user: {
          id: strapiUser.id,
          username: strapiUser.username,
          email: strapiUser.email,
          phoneNumber: strapiUser.phoneNumber,
        },
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return ctx.badRequest(error.message);
    }
  },

  async verifyToken(ctx) {
    try {
      const { token } = ctx.request.body;

      if (!token) {
        return ctx.badRequest('Token is required');
      }

      // Verify the JWT token
      const decodedToken = strapi.plugins['users-permissions'].services.jwt.verify(token);

      if (!decodedToken || !decodedToken.id) {
        return ctx.unauthorized('Invalid token');
      }

      // Get user from Strapi
      const strapiUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decodedToken.id },
      });

      if (!strapiUser) {
        return ctx.unauthorized('User not found');
      }

      return {
        success: true,
        needsSignup: false,
        user: {
          id: strapiUser.id,
          username: strapiUser.username,
          email: strapiUser.email,
          phoneNumber: strapiUser.phoneNumber,
        },
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return ctx.unauthorized('Invalid token');
    }
  },
}; 
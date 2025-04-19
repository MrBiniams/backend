const { firebaseAdmin } = require('../../../../config/firebase');

export default {
  async verifyToken(ctx) {
    try {
      const { token } = ctx.request.body;

      if (!token) {
        return ctx.badRequest('Token is required');
      }

      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const firebaseUser = await firebaseAdmin.auth().getUser(decodedToken.uid);

      // Check if user exists in Strapi
      let user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { firebaseUid: decodedToken.uid },
      });

      if (!user) {
        // Create new user in Strapi
        user = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username: firebaseUser.phoneNumber,
            email: firebaseUser.email || `${firebaseUser.phoneNumber}@firebase.com`,
            provider: 'firebase',
            confirmed: true,
            blocked: false,
            firebaseUid: decodedToken.uid,
            phoneNumber: firebaseUser.phoneNumber,
          },
        });
      }

      // Generate JWT token for Strapi
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      return {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      return ctx.unauthorized(error.message);
    }
  },

  async initializeOtp(ctx) {
    try {
      const { phoneNumber } = ctx.request.body;

      if (!phoneNumber) {
        return ctx.badRequest('Phone number is required');
      }

      // Initialize Firebase Auth
      const auth = firebaseAdmin.auth();

      // Check if user already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByPhoneNumber(phoneNumber);
      } catch (error) {
        // User doesn't exist, create new user
        userRecord = await auth.createUser({
          phoneNumber,
        });
      }

      // Generate a session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await auth.createSessionCookie(userRecord.uid, { expiresIn });

      return {
        success: true,
        verificationId: sessionCookie,
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },

  async verifyOtp(ctx) {
    try {
      const { verificationId, otp } = ctx.request.body;

      if (!verificationId || !otp) {
        return ctx.badRequest('Verification ID and OTP are required');
      }

      // Initialize Firebase Auth
      const auth = firebaseAdmin.auth();

      // Verify the session cookie
      const decodedClaims = await auth.verifySessionCookie(verificationId);
      const user = await auth.getUser(decodedClaims.uid);

      // Check if user exists in Strapi
      let strapiUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: { firebaseUid: user.uid },
      });

      if (!strapiUser) {
        // Create new user in Strapi
        strapiUser = await strapi.query('plugin::users-permissions.user').create({
          data: {
            username: user.phoneNumber,
            email: user.email || `${user.phoneNumber}@firebase.com`,
            provider: 'firebase',
            confirmed: true,
            blocked: false,
            firebaseUid: user.uid,
            phoneNumber: user.phoneNumber,
          },
        });
      }

      // Generate JWT token for Strapi
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: strapiUser.id,
      });

      return {
        success: true,
        jwt,
        user: {
          id: strapiUser.id,
          username: strapiUser.username,
          email: strapiUser.email,
          phoneNumber: strapiUser.phoneNumber,
        },
      };
    } catch (error) {
      return ctx.badRequest(error.message);
    }
  },
}; 
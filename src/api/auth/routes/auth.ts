export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/send-otp',
      handler: 'auth.initializeOtp',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/verify-otp',
      handler: 'auth.verifyOtp',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/register',
      handler: 'auth.signup',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/verify-token',
      handler: 'auth.verifyToken',
      config: {
        auth: false,
      },
    },
  ],
}; 
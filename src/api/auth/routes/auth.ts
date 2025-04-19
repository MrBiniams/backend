export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/verify',
      handler: 'auth.verifyToken',
      config: {
        auth: false,
      },
    },
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
  ],
}; 
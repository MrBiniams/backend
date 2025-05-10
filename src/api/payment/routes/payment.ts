export default {
  routes: [
    {
      method: 'POST',
      path: '/payment/initiate',
      handler: 'payment.initiate',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      }
    }
  ]
}; 
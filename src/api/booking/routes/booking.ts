export default {
  routes: [
    {
      method: 'GET',
      path: '/booking',
      handler: 'booking.find',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'GET',
      path: '/booking/:id',
      handler: 'booking.findOne',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
        params: {
          id: {
            type: 'uuid',
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/booking',
      handler: 'booking.create',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'PUT',
      path: '/booking/:id/status',
      handler: 'booking.updateStatus',
      config: {
        policies: [],
        auth: {
          enabled: false
        },
      },
    },
    {
      method: 'PUT',
      path: '/booking/:id',
      handler: 'booking.update',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
        params: {
          id: {
            type: 'uuid',
          },
        },
      },
    },
    {
      method: 'DELETE',
      path: '/booking/:id',
      handler: 'booking.delete',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
        params: {
          id: {
            type: 'uuid',
          },
        },
      },
    },
  ],
}; 
export default {
  routes: [
    {
      method: 'GET',
      path: '/location',
      handler: 'location.find',
      config: {
        policies: [],
        auth: {
          enabled: false
        },
      },
    },
    {
      method: 'GET',
      path: '/location/:id',
      handler: 'location.findOne',
      config: {
        policies: [],
        auth: {
          enabled: false
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
      path: '/location',
      handler: 'location.create',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'PUT',
      path: '/location/:id',
      handler: 'location.update',
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
      path: '/location/:id',
      handler: 'location.delete',
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
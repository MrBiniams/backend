export default {
  routes: [
    {
      method: 'GET',
      path: '/slot',
      handler: 'slot.find',
      config: {
        policies: [],
        auth: {
          enabled: false
        },
      },
    },
    {
      method: 'GET',
      path: '/slot/:id',
      handler: 'slot.findOne',
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
      path: '/slot',
      handler: 'slot.create',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'PUT',
      path: '/slot/:id',
      handler: 'slot.update',
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
      path: '/slot/:id',
      handler: 'slot.delete',
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
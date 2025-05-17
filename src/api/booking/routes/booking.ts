export default {
  routes: [
    {
      method: 'GET',
      path: '/bookings',
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
      path: '/bookings/:id',
      handler: 'booking.findOne',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'GET',
      path: '/bookings/me',
      handler: 'booking.findMyBookings',
      config: {
        policies: [],
        auth: {
          enabled: true
        }
      }
    },
    {
      method: 'GET',
      path: '/bookings/user/:userId',
      handler: 'booking.findByUser',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'GET',
      path: '/bookings/slot/:slotId',
      handler: 'booking.findBySlot',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'POST',
      path: '/bookings',
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
      path: '/bookings/:id',
      handler: 'booking.update',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'PUT',
      path: '/bookings/:id/status',
      handler: 'booking.updateStatus',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
    {
      method: 'DELETE',
      path: '/bookings/:id',
      handler: 'booking.delete',
      config: {
        policies: [],
        auth: {
          enabled: true
        },
      },
    },
  ],
}; 
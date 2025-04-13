export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'user.login',
      config: {
        auth: false,
        policies: [],
        description: 'Login user',
        tag: {
          plugin: 'users-permissions',
          name: 'User',
          actionType: 'login'
        }
      }
    },
    {
      method: 'GET',
      path: '/auth/users',
      handler: 'user.find',
      config: {
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/auth/users/:id',
      handler: 'user.findOne',
      config: {
        policies: []
      }
    },
    {
      method: 'POST',
      path: '/auth/signup',
      handler: 'user.create',
      config: {
        policies: []
      }
    },
    {
      method: 'PUT',
      path: '/auth/users/:id',
      handler: 'user.update',
      config: {
        policies: []
      }
    },
    {
      method: 'DELETE',
      path: '/auth/users/:id',
      handler: 'user.delete',
      config: {
        policies: []
      }
    }
  ]
}; 
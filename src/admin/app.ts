export default {
  config: {
    // Replace the Strapi logo in the auth pages
    auth: {
      logo: '/admin/assets/logo.png',
    },
    // Replace the favicon
    head: {
      favicon: '/admin/assets/favicon.ico',
    },
    // Add a new locale to the interface
    locales: ['en'],
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: '/admin/assets/logo.png',
    },
    // Override or extend the theme
    theme: {
      colors: {
        primary100: '#f0f6ff',
        primary200: '#d9e7ff',
        primary500: '#3B82F6',
        primary600: '#4F46E5',
        primary700: '#312e81',
        danger700: '#b91c1c',
        neutral100: '#f5f5f5',
        neutral0: '#ffffff',
      },
      shadows: {
        tableShadow: '0px 1px 4px rgba(33, 33, 52, 0.1)',
      },
      sizes: {
        input: {
          S: '8px',
          M: '12px',
        },
      },
      borderRadius: '8px',
      button: {
        primary: {
          backgroundColor: '#3B82F6',
          color: '#ffffff',
        },
        secondary: {
          backgroundColor: '#4F46E5',
          color: '#ffffff',
        },
      },
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { releases: false },
  },
  bootstrap() {},
}; 
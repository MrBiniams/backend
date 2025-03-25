export default async (strapi: any) => {
  // Create Hero content (Single Type)
  await strapi.entityService.create('api::hero.hero', {
    data: {
      title: 'Smart Parking Solutions',
      description: 'Find and book parking spots in real-time. Save time and eliminate parking hassles.',
      buttons: [
        {
          text: 'Book Now',
          href: '/booking',
          primary: true
        },
        {
          text: 'Learn More',
          href: '/about',
          primary: false
        }
      ],
      publishedAt: new Date()
    }
  });

  // Create About content (Single Type)
  await strapi.entityService.create('api::about.about', {
    data: {
      title: 'About Us',
      features: [
        {
          icon: '🎯',
          title: 'Our Mission',
          description: 'To revolutionize parking management through smart technology and exceptional service.'
        },
        {
          icon: '👥',
          title: 'Our Team',
          description: 'Dedicated professionals committed to making parking hassle-free for everyone.'
        },
        {
          icon: '💡',
          title: 'Innovation',
          description: 'Leveraging cutting-edge technology to provide seamless parking solutions.'
        }
      ],
      publishedAt: new Date()
    }
  });

  // Create Footer content (Single Type)
  await strapi.entityService.create('api::footer.footer', {
    data: {
      description: 'Smart parking solutions for a better future.',
      quickLinks: [
        {
          text: 'About Us',
          href: '/about'
        },
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: 'Contact',
          href: '/contact'
        },
        {
          text: 'Blog',
          href: '/blog'
        }
      ],
      publishedAt: new Date()
    }
  });

  // Create Blog posts
  const blogPosts = [
    {
      title: 'Smart Parking Innovation',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      slug: 'smart-parking-innovation',
      publishedAt: new Date()
    },
    {
      title: 'IoT in Parking Management',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      slug: 'iot-in-parking-management',
      publishedAt: new Date()
    },
    {
      title: 'Future of Urban Parking',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      slug: 'future-of-urban-parking',
      publishedAt: new Date()
    }
  ];

  for (const post of blogPosts) {
    await strapi.entityService.create('api::blog.blog', {
      data: post
    });
  }

  // Create Testimonials
  const testimonials = [
    {
      name: 'John Doe',
      role: 'Regular User',
      content: "The best parking solution I've ever used. It saves me so much time!",
      publishedAt: new Date()
    },
    {
      name: 'Jane Smith',
      role: 'Business Owner',
      content: 'This platform has transformed how we manage parking at our facility.',
      publishedAt: new Date()
    },
    {
      name: 'Mike Johnson',
      role: 'Property Manager',
      content: 'Excellent service and very user-friendly interface. Highly recommended!',
      publishedAt: new Date()
    }
  ];

  for (const testimonial of testimonials) {
    await strapi.entityService.create('api::testimonial.testimonial', {
      data: testimonial
    });
  }

  // Create Locations with their Slots
  const locations = [
    {
      name: 'Downtown Mall',
      address: '123 Main Street, City Center',
      totalSlots: 100,
      availableSlots: 50,
      pricePerHour: 5,
      publishedAt: new Date()
    },
    {
      name: 'Airport Terminal',
      address: '456 Airport Road, Airport Area',
      totalSlots: 200,
      availableSlots: 75,
      pricePerHour: 8,
      publishedAt: new Date()
    },
    {
      name: 'Shopping Complex',
      address: '789 Retail Avenue, Shopping District',
      totalSlots: 150,
      availableSlots: 60,
      pricePerHour: 6,
      publishedAt: new Date()
    }
  ];

  for (const location of locations) {
    // Create the location first
    const createdLocation = await strapi.entityService.create('api::location.location', {
      data: location
    });

    // Create slots for this location
    const slots = [];
    for (let i = 1; i <= location.totalSlots; i++) {
      slots.push({
        number: i,
        isAvailable: i <= location.availableSlots,
        location: createdLocation.id,
        publishedAt: new Date()
      });
    }

    // Create all slots for this location
    for (const slot of slots) {
      await strapi.entityService.create('api::slot.slot', {
        data: slot
      });
    }
  }

  console.log('Seed data created successfully!');
}; 
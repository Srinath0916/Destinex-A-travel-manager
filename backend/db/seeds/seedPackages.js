const mongoose = require('mongoose');
const Package = require('../models/packageModel');
require('dotenv').config();

const travelPackages = [
  {
    name: "Golden Temple & Amritsar Heritage Tour",
    description: "Experience the spiritual heart of Sikhism with visits to Golden Temple, Jallianwala Bagh memorial, and witness the patriotic Wagah Border ceremony. Perfect for cultural and spiritual exploration.",
    image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2019/11/golden-temple-feature.jpg?tr=w-1200,q-60",
    duration: 2,
    price: 8500,
    inclusions: [
      "Accommodation for 1 night",
      "Daily breakfast and dinner",
      "Golden Temple guided tour",
      "Jallianwala Bagh entry",
      "Wagah Border ceremony transport",
      "Local transportation",
      "Professional guide"
    ],
    exclusions: [
      "Lunch meals",
      "Personal expenses",
      "Travel insurance",
      "Tips and gratuities",
      "Shopping expenses"
    ],
    itinerary: [
      {
        day: 1,
        description: "Arrival in Amritsar and Golden Temple exploration",
        activities: [
          "Check-in to hotel",
          "Visit Golden Temple complex",
          "Participate in evening prayers",
          "Experience free community kitchen (Langar)"
        ]
      },
      {
        day: 2,
        description: "Historical sites and border ceremony",
        activities: [
          "Visit Jallianwala Bagh memorial",
          "Local market exploration",
          "Travel to Wagah Border",
          "Witness flag-lowering ceremony",
          "Departure"
        ]
      }
    ],
    category: "Cultural & Spiritual",
    groupType: "Family",
    maxGroupSize: 15,
    difficulty: "Easy",
    destination: "683634d45c440606b69cae20"
  },
  {
    name: "Rishikesh Yoga & Adventure Retreat",
    description: "Combine spiritual awakening with adventure in the yoga capital of the world. Experience ancient bridges, riverside ashrams, and thrilling activities.",
    image: "https://wandersky.in/wp-content/uploads/2023/03/laxman-jhula-rishikesh.jpg",
    duration: 3,
    price: 12000,
    inclusions: [
      "Accommodation for 2 nights",
      "All vegetarian meals",
      "Daily yoga sessions",
      "Laxman Jhula and Ram Jhula visits",
      "Parmarth Niketan ashram tour",
      "Ganga Aarti ceremony",
      "River rafting (basic level)",
      "Local transportation"
    ],
    exclusions: [
      "Adventure sports insurance",
      "Personal expenses",
      "Spa treatments",
      "Private yoga sessions",
      "Shopping"
    ],
    itinerary: [
      {
        day: 1,
        description: "Arrival and spiritual introduction",
        activities: [
          "Check-in to riverside accommodation",
          "Visit Laxman Jhula suspension bridge",
          "Evening yoga session",
          "Attend Ganga Aarti at Parmarth Niketan"
        ]
      },
      {
        day: 2,
        description: "Adventure and exploration day",
        activities: [
          "Morning meditation session",
          "Visit Ram Jhula and local temples",
          "River rafting experience",
          "Explore local markets and cafes"
        ]
      },
      {
        day: 3,
        description: "Final spiritual experience and departure",
        activities: [
          "Sunrise yoga session",
          "Visit ashrams and spiritual centers",
          "Final Ganga Aarti participation",
          "Departure with spiritual souvenirs"
        ]
      }
    ],
    category: "Spiritual & Adventure",
    groupType: "Solo",
    maxGroupSize: 12,
    difficulty: "Moderate",
    destination: "683634d45c440606b69cae23"
  },
  {
    name: "Haridwar Sacred Ghat Experience",
    description: "Immerse yourself in the spiritual energy of Haridwar with temple visits, sacred baths, and the famous Ganga Aarti ceremony at Har Ki Pauri.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/har-ki-pauri-haridwar-uttarakhand-1-attr-hero?qlt=82&ts=1726645951242",
    duration: 1,
    price: 4500,
    inclusions: [
      "Same day accommodation option",
      "Breakfast and dinner",
      "Har Ki Pauri guided tour",
      "Mansa Devi Temple cable car",
      "Chandi Devi Temple visit",
      "Ganga Aarti ceremony",
      "Local transportation",
      "Spiritual guide"
    ],
    exclusions: [
      "Lunch",
      "Personal offerings at temples",
      "Additional cable car rides",
      "Shopping",
      "Tips"
    ],
    itinerary: [
      {
        day: 1,
        description: "Complete spiritual immersion in one day",
        activities: [
          "Early morning sacred bath at Har Ki Pauri",
          "Cable car ride to Mansa Devi Temple",
          "Visit Chandi Devi Temple",
          "Explore local spiritual markets",
          "Evening Ganga Aarti ceremony",
          "Spiritual consultation with local priests"
        ]
      }
    ],
    category: "Spiritual",
    groupType: "Family",
    maxGroupSize: 20,
    difficulty: "Easy",
    destination: "683634d45c440606b69cae26"
  },
  {
    name: "Shimla Colonial Heritage & Hill Station Tour",
    description: "Discover the charm of the former British summer capital with colonial architecture, scenic viewpoints, and delightful mountain weather.",
    image: "https://www.trawell.in/admin/images/upload/531957519Ridge_Main.jpg",
    duration: 4,
    price: 18000,
    inclusions: [
      "Accommodation for 3 nights",
      "Daily breakfast and dinner",
      "The Ridge and Mall Road guided tours",
      "Jakhu Temple visit with transport",
      "Toy train experience (if available)",
      "Colonial architecture walking tour",
      "Local transportation",
      "Professional guide"
    ],
    exclusions: [
      "Lunch meals",
      "Shopping expenses",
      "Personal expenses",
      "Adventure activities",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        description: "Arrival and Ridge exploration",
        activities: [
          "Check-in to hill station hotel",
          "Visit The Ridge for panoramic views",
          "Explore Christ Church",
          "Evening stroll on Mall Road"
        ]
      },
      {
        day: 2,
        description: "Temple visit and highest point exploration",
        activities: [
          "Morning visit to Jakhu Temple",
          "See the giant Hanuman statue",
          "Enjoy mountain views from highest point",
          "Explore local markets and cafes"
        ]
      },
      {
        day: 3,
        description: "Colonial heritage and leisure",
        activities: [
          "Colonial architecture walking tour",
          "Visit Viceregal Lodge",
          "Toy train experience",
          "Shopping for local handicrafts"
        ]
      },
      {
        day: 4,
        description: "Final exploration and departure",
        activities: [
          "Last-minute shopping on Mall Road",
          "Photography session at scenic spots",
          "Check-out and departure"
        ]
      }
    ],
    category: "Hill Station & Heritage",
    groupType: "Couple",
    maxGroupSize: 10,
    difficulty: "Easy",
    destination: "683634d45c440606b69cae29"
  },
  {
    name: "Manali Adventure & Mountain Escape",
    description: "Ultimate Himalayan adventure combining ancient temples, thrilling sports in Solang Valley, and the breathtaking Rohtang Pass experience.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/hidimba-temple-manali-himachal-pradesh-5-musthead-hero?qlt=82&ts=1726730757462",
    duration: 5,
    price: 25000,
    inclusions: [
      "Accommodation for 4 nights",
      "All meals (breakfast, lunch, dinner)",
      "Hadimba Temple guided tour",
      "Solang Valley adventure activities",
      "Rohtang Pass excursion (weather permitting)",
      "Paragliding experience",
      "Local sightseeing transport",
      "Adventure gear and safety equipment"
    ],
    exclusions: [
      "Personal adventure insurance",
      "Extra adventure activities",
      "Shopping expenses",
      "Tips and gratuities",
      "Personal expenses"
    ],
    itinerary: [
      {
        day: 1,
        description: "Arrival and temple exploration",
        activities: [
          "Check-in to mountain resort",
          "Visit ancient Hadimba Temple",
          "Walk through cedar forests",
          "Evening leisure at Mall Road Manali"
        ]
      },
      {
        day: 2,
        description: "Solang Valley adventure day",
        activities: [
          "Travel to Solang Valley",
          "Paragliding experience",
          "Zorbing and cable car rides",
          "Mountain photography session"
        ]
      },
      {
        day: 3,
        description: "Rohtang Pass expedition",
        activities: [
          "Early morning departure to Rohtang Pass",
          "Snow activities and glacier views",
          "High altitude mountain experience",
          "Return and rest"
        ]
      },
      {
        day: 4,
        description: "Local culture and relaxation",
        activities: [
          "Visit local Tibetan monasteries",
          "Explore Old Manali",
          "River Beas activities",
          "Local shopping and cafes"
        ]
      },
      {
        day: 5,
        description: "Final adventure and departure",
        activities: [
          "Last-minute adventure activities",
          "Souvenir shopping",
          "Check-out and departure"
        ]
      }
    ],
    category: "Adventure & Mountains",
    groupType: "Friends",
    maxGroupSize: 8,
    difficulty: "Challenging",
    destination: "683634d45c440606b69cae2d"
  },
  {
    name: "Complete North India Spiritual & Adventure Circuit",
    description: "Comprehensive 7-day journey covering the spiritual heartlands of Haridwar-Rishikesh and the mountain adventures of Shimla-Manali with cultural stops.",
    image: "https://jannattravelguru.com/wp-content/uploads/2023/03/Rohtang-pass.jpg",
    duration: 7,
    price: 35000,
    inclusions: [
      "Accommodation for 6 nights",
      "All meals throughout the journey",
      "All transportation between cities",
      "Professional guides at each destination",
      "All temple and monument entries",
      "Adventure activities in Solang Valley",
      "Ganga Aarti ceremonies",
      "Cultural performances",
      "Travel insurance"
    ],
    exclusions: [
      "Personal shopping",
      "Additional adventure activities",
      "Spa treatments",
      "Personal expenses",
      "Tips beyond included amount"
    ],
    itinerary: [
      {
        day: 1,
        description: "Haridwar spiritual immersion",
        activities: [
          "Arrival and check-in",
          "Sacred bath at Har Ki Pauri",
          "Mansa Devi Temple cable car",
          "Evening Ganga Aarti ceremony"
        ]
      },
      {
        day: 2,
        description: "Rishikesh yoga and adventure",
        activities: [
          "Travel to Rishikesh",
          "Laxman Jhula and Ram Jhula exploration",
          "Yoga session at Parmarth Niketan",
          "River rafting experience"
        ]
      },
      {
        day: 3,
        description: "Journey to hill stations",
        activities: [
          "Travel to Shimla",
          "Check-in to hill station hotel",
          "The Ridge evening exploration",
          "Colonial architecture introduction"
        ]
      },
      {
        day: 4,
        description: "Shimla heritage and culture",
        activities: [
          "Jakhu Temple visit",
          "Mall Road shopping and dining",
          "Toy train experience",
          "Colonial heritage walking tour"
        ]
      },
      {
        day: 5,
        description: "Manali temple and nature",
        activities: [
          "Travel to Manali",
          "Hadimba Temple in cedar forests",
          "Local market exploration",
          "Mountain acclimatization"
        ]
      },
      {
        day: 6,
        description: "Ultimate mountain adventure",
        activities: [
          "Solang Valley adventure sports",
          "Rohtang Pass expedition",
          "Snow activities and glacier views",
          "Farewell dinner with cultural program"
        ]
      },
      {
        day: 7,
        description: "Departure and memories",
        activities: [
          "Final shopping and souvenirs",
          "Photography session",
          "Check-out and departure",
          "End of memorable journey"
        ]
      }
    ],
    category: "Complete Tour",
    groupType: "Family",
    maxGroupSize: 6,
    difficulty: "Moderate",
    destination: "683634d45c440606b69cae2a"
  },
  {
    name: "Weekend Amritsar Cultural Deep Dive",
    description: "Intensive cultural exploration of Amritsar focusing on Sikh heritage, Punjabi cuisine, and the emotional journey through India's freedom struggle history.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/jallianwala-bagh-amritsar-punjab-1-attr-hero?qlt=82&ts=1726662275638",
    duration: 3,
    price: 13500,
    inclusions: [
      "Heritage hotel accommodation for 2 nights",
      "All traditional Punjabi meals",
      "Golden Temple detailed guided tour",
      "Jallianwala Bagh historical presentation",
      "Wagah Border premium seating",
      "Traditional Punjabi cultural show",
      "Local transportation in AC vehicles",
      "Professional cultural guide"
    ],
    exclusions: [
      "Personal shopping",
      "Additional cultural shows",
      "Tips and gratuities",
      "Personal expenses",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        description: "Golden Temple spiritual immersion",
        activities: [
          "Early morning Golden Temple visit",
          "Participate in community service",
          "Learn about Sikh philosophy",
          "Evening prayers and Langar experience"
        ]
      },
      {
        day: 2,
        description: "Historical exploration and patriotic experience",
        activities: [
          "Jallianwala Bagh memorial with historical context",
          "Local heritage walk",
          "Traditional Punjabi lunch",
          "Wagah Border ceremony with premium viewing"
        ]
      },
      {
        day: 3,
        description: "Cultural deep dive and departure",
        activities: [
          "Visit local Sikh museums",
          "Traditional craft workshops",
          "Cultural performance and folk dance",
          "Departure with cultural souvenirs"
        ]
      }
    ],
    category: "Cultural Heritage",
    groupType: "Couple",
    maxGroupSize: 12,
    difficulty: "Easy",
    destination: "683634d45c440606b69cae22"
  },
  {
    name: "Manali Extreme Adventure Challenge",
    description: "High-intensity adventure package for thrill-seekers featuring advanced activities in Solang Valley, challenging treks, and extreme sports in the Himalayas.",
    image: "https://media1.thrillophilia.com/filestore/yflt72cqagt3eytr7hs2poazvmgi_1575709709_shutterstock_752913262.jpg",
    duration: 6,
    price: 32000,
    inclusions: [
      "Adventure lodge accommodation for 5 nights",
      "High-energy meals and nutrition supplements",
      "Professional adventure instructors",
      "All safety equipment and gear",
      "Advanced paragliding and skiing",
      "Mountain biking and rock climbing",
      "Rohtang Pass adventure activities",
      "Emergency medical support"
    ],
    exclusions: [
      "Personal adventure insurance (mandatory)",
      "Personal safety gear",
      "Medical expenses",
      "Personal expenses",
      "Additional extreme activities"
    ],
    itinerary: [
      {
        day: 1,
        description: "Arrival and adventure preparation",
        activities: [
          "Check-in to adventure lodge",
          "Safety briefing and equipment fitting",
          "Basic skill assessment",
          "Evening team building activities"
        ]
      },
      {
        day: 2,
        description: "Solang Valley extreme sports",
        activities: [
          "Advanced paragliding sessions",
          "Zorbing and bungee jumping",
          "Mountain biking trails",
          "Evening skill development"
        ]
      },
      {
        day: 3,
        description: "High altitude challenges",
        activities: [
          "Rohtang Pass extreme activities",
          "Snow skiing and snowboarding",
          "High altitude trekking",
          "Photography and survival skills"
        ]
      },
      {
        day: 4,
        description: "Rock climbing and rappelling",
        activities: [
          "Rock climbing instruction",
          "Rappelling from cliffs",
          "River crossing techniques",
          "Navigation and wilderness skills"
        ]
      },
      {
        day: 5,
        description: "Multi-activity challenge day",
        activities: [
          "Combined adventure circuit",
          "Team challenges and competitions",
          "Solo skill demonstrations",
          "Celebration and certificate ceremony"
        ]
      },
      {
        day: 6,
        description: "Final challenge and departure",
        activities: [
          "Final skill assessment",
          "Adventure photography session",
          "Gear return and feedback",
          "Departure with adventure certificates"
        ]
      }
    ],
    category: "Extreme Adventure",
    groupType: "Friends",
    maxGroupSize: 6,
    difficulty: "Difficult",
    destination: "683634d45c440606b69cae2e"
  }
];

const seedPackages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://ravish99055:Ravish%4099055.@cluster0.llvgerm.mongodb.net/destinex");
    console.log('Connected to MongoDB');

    // Log the number of packages we're trying to insert
    console.log(`Attempting to insert ${travelPackages.length} packages`);

    // Insert new packages
    const result = await Package.insertMany(travelPackages, { ordered: false });
    console.log(`Successfully seeded ${result.length} packages`);

    // Verify the insertion by counting documents
    const count = await Package.countDocuments();
    console.log(`Total packages in database: ${count}`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    if (error.writeErrors) {
      console.error('Write errors:', error.writeErrors);
    }
    
    process.exit(1);
  }
};

// Run the seed function
seedPackages(); 
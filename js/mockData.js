/* ==========================================================================
   GlobeTrotter Pre-Populated Seed Data
   ========================================================================== */

export const INITIAL_USER = {
  id: "user-1",
  name: "Meet",
  email: "meet@globetrotter.io",
  profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  language: "English (US)",
  currency: "USD ($)",
  created_at: "2026-01-15T00:00:00Z"
};

export const INITIAL_CITIES = [
  {
    id: "city-paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "The City of Light boasts world-class museums, iconic landmarks, exquisite dining, and romantic boulevards.",
    cost_index: "$$$$",
    popularity: 9.8,
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: "city-amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
    description: "Famous for its canal network, historic townhouses, vibrant biking culture, and rich art museums.",
    cost_index: "$$$",
    popularity: 9.3,
    lat: 52.3676,
    lng: 4.9041
  },
  {
    id: "city-rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "An open-air museum where ancient ruins like the Colosseum meet bustling piazzas and world-renowned pasta.",
    cost_index: "$$$",
    popularity: 9.6,
    lat: 41.9028,
    lng: 12.4964
  },
  {
    id: "city-tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "A dazzling metropolis blending ultramodern skyscrapers with historic temples, anime subcultures, and Michelin dining.",
    cost_index: "$$$$",
    popularity: 9.9,
    lat: 35.6762,
    lng: 139.6503
  },
  {
    id: "city-kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Japan's cultural heartland, famed for classical Buddhist temples, gardens, imperial palaces, and geisha districts.",
    cost_index: "$$$",
    popularity: 9.5,
    lat: 35.0116,
    lng: 135.7681
  },
  {
    id: "city-osaka",
    name: "Osaka",
    country: "Japan",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80",
    description: "Japan's street food capital, famous for Dotonbori nightlife, Osaka Castle, and friendly locals.",
    cost_index: "$$",
    popularity: 9.2,
    lat: 34.6937,
    lng: 135.5023
  },
  {
    id: "city-dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic skyline featuring the Burj Khalifa, luxury shopping, desert safaris, and pristine beach resorts.",
    cost_index: "$$$$",
    popularity: 9.7,
    lat: 25.2048,
    lng: 55.2708
  },
  {
    id: "city-london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    description: "Dynamic global capital with West End theatre, Royal Parks, historic Big Ben, and world-class culinary scenes.",
    cost_index: "$$$$",
    popularity: 9.8,
    lat: 51.5074,
    lng: -0.1278
  },
  {
    id: "city-barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
    description: "Gaudí architecture, Mediterranean beaches, tapas bars, and vibrant Gothic Quarter alleyways.",
    cost_index: "$$$",
    popularity: 9.4,
    lat: 41.3851,
    lng: 2.1734
  },
  {
    id: "city-singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    description: "Garden city with iconic Gardens by the Bay, Hawker food markets, Marina Bay Sands, and lush greenery.",
    cost_index: "$$$$",
    popularity: 9.5,
    lat: 1.3521,
    lng: 103.8198
  },
  {
    id: "city-ny",
    name: "New York",
    country: "USA",
    region: "North America",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    description: "The city that never sleeps: Broadway shows, Central Park, Statue of Liberty, and diverse neighborhoods.",
    cost_index: "$$$$",
    popularity: 9.9,
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: "city-bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Tropical paradise of lush rice terraces, sacred Hindu temples, surfing beaches, and spiritual wellness retreats.",
    cost_index: "$$",
    popularity: 9.6,
    lat: -8.4095,
    lng: 115.1889
  }
];

export const INITIAL_ACTIVITIES = [
  // Paris
  {
    id: "act-paris-1",
    city_id: "city-paris",
    name: "Eiffel Tower Sunset Summit",
    category: "Sightseeing",
    description: "Ascend to the top of the Eiffel Tower during golden hour for panoramic Parisian views.",
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
    duration: "2.5 hrs",
    estimated_cost: 45,
    rating: 4.9
  },
  {
    id: "act-paris-2",
    city_id: "city-paris",
    name: "Louvre Museum Guided Masterpieces",
    category: "Culture",
    description: "Skip the line and explore the Mona Lisa, Venus de Milo, and iconic classical art.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
    duration: "3 hrs",
    estimated_cost: 65,
    rating: 4.8
  },
  {
    id: "act-paris-3",
    city_id: "city-paris",
    name: "Montmartre Pastry & Bakery Walk",
    category: "Food",
    description: "Tasting tour of fresh croissants, macarons, and artisan cheeses in Montmartre.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    duration: "2 hrs",
    estimated_cost: 55,
    rating: 4.9
  },
  // Amsterdam
  {
    id: "act-amsterdam-1",
    city_id: "city-amsterdam",
    name: "Historic Canal Cruise with Wine & Cheese",
    category: "Relaxation",
    description: "Glide past 17th-century canal houses while savoring Dutch gouda and wine.",
    image: "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?auto=format&fit=crop&w=600&q=80",
    duration: "1.5 hrs",
    estimated_cost: 38,
    rating: 4.7
  },
  {
    id: "act-amsterdam-2",
    city_id: "city-amsterdam",
    name: "Rijksmuseum & Van Gogh Museum Tour",
    category: "Culture",
    description: "Immerse yourself in Dutch Golden Age masterpieces and Van Gogh's vibrant canvases.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
    duration: "3 hrs",
    estimated_cost: 50,
    rating: 4.9
  },
  // Rome
  {
    id: "act-rome-1",
    city_id: "city-rome",
    name: "Colosseum & Roman Forum Underground",
    category: "Sightseeing",
    description: "Walk in gladiator footsteps through the Colosseum underground chambers.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    duration: "3 hrs",
    estimated_cost: 75,
    rating: 4.9
  },
  {
    id: "act-rome-2",
    city_id: "city-rome",
    name: "Trastevere Pasta & Gelato Masterclass",
    category: "Food",
    description: "Hands-on pasta making workshop paired with Chianti wine in historic Trastevere.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    duration: "3.5 hrs",
    estimated_cost: 85,
    rating: 5.0
  },
  // Tokyo
  {
    id: "act-tokyo-1",
    city_id: "city-tokyo",
    name: "Shibuya Crossing & Harajuku Culture Tour",
    category: "Sightseeing",
    description: "Navigate the famous scramble crossing and discover quirky Takeshita Street fashion.",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80",
    duration: "2.5 hrs",
    estimated_cost: 30,
    rating: 4.8
  },
  {
    id: "act-tokyo-2",
    city_id: "city-tokyo",
    name: "TeamLab Planets Immersive Digital Art",
    category: "Culture",
    description: "Step inside mind-bending body-immersive digital installations floating in water.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    duration: "2 hrs",
    estimated_cost: 40,
    rating: 4.9
  },
  // Dubai
  {
    id: "act-dubai-1",
    city_id: "city-dubai",
    name: "Burj Khalifa 148th Floor Sky Lounge",
    category: "Sightseeing",
    description: "Unrivaled 360-degree views from the world's tallest outdoor observation deck.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    duration: "2 hrs",
    estimated_cost: 110,
    rating: 4.9
  },
  {
    id: "act-dubai-2",
    city_id: "city-dubai",
    name: "Desert Safari, Dune Bashing & BBQ Dinner",
    category: "Adventure",
    description: "4x4 dune bashing, camel riding, falconry, and traditional Arabian night feast.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    duration: "6 hrs",
    estimated_cost: 95,
    rating: 4.9
  }
];

export const INITIAL_TRIPS = [
  {
    id: "trip-1",
    user_id: "user-1",
    name: "European Summer Escape",
    description: "A dream journey across romantic Paris, vibrant Amsterdam canals, and ancient Rome.",
    cover_image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    start_date: "2026-09-01",
    end_date: "2026-09-11",
    budget: 3500,
    estimated_cost: 3240,
    status: "Upcoming",
    share_id: "euro-summer-2026",
    created_at: "2026-02-01T10:00:00Z"
  },
  {
    id: "trip-2",
    user_id: "user-1",
    name: "Japan Explorer",
    description: "An immersive autumn trip exploring Tokyo neon lights, Kyoto shrines, and Osaka cuisine.",
    cover_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    start_date: "2026-10-15",
    end_date: "2026-10-23",
    budget: 3000,
    estimated_cost: 2820,
    status: "Upcoming",
    share_id: "japan-autumn-2026",
    created_at: "2026-02-10T14:30:00Z"
  },
  {
    id: "trip-3",
    user_id: "user-1",
    name: "Dubai Weekend Getaway",
    description: "Luxury relaxation, desert dunes, and skyline views in futuristic Dubai.",
    cover_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    start_date: "2026-11-20",
    end_date: "2026-11-24",
    budget: 2000,
    estimated_cost: 1850,
    status: "Draft",
    share_id: "dubai-weekend-2026",
    created_at: "2026-02-18T09:15:00Z"
  }
];

export const INITIAL_TRIP_STOPS = [
  // European Summer Escape stops
  {
    id: "stop-1-paris",
    trip_id: "trip-1",
    city_id: "city-paris",
    arrival_date: "2026-09-01",
    departure_date: "2026-09-04",
    order_index: 0
  },
  {
    id: "stop-1-amsterdam",
    trip_id: "trip-1",
    city_id: "city-amsterdam",
    arrival_date: "2026-09-04",
    departure_date: "2026-09-07",
    order_index: 1
  },
  {
    id: "stop-1-rome",
    trip_id: "trip-1",
    city_id: "city-rome",
    arrival_date: "2026-09-07",
    departure_date: "2026-09-11",
    order_index: 2
  },

  // Japan Explorer stops
  {
    id: "stop-2-tokyo",
    trip_id: "trip-2",
    city_id: "city-tokyo",
    arrival_date: "2026-10-15",
    departure_date: "2026-10-18",
    order_index: 0
  },
  {
    id: "stop-2-kyoto",
    trip_id: "trip-2",
    city_id: "city-kyoto",
    arrival_date: "2026-10-18",
    departure_date: "2026-10-21",
    order_index: 1
  },
  {
    id: "stop-2-osaka",
    trip_id: "trip-2",
    city_id: "city-osaka",
    arrival_date: "2026-10-21",
    departure_date: "2026-10-23",
    order_index: 2
  },

  // Dubai stops
  {
    id: "stop-3-dubai",
    trip_id: "trip-3",
    city_id: "city-dubai",
    arrival_date: "2026-11-20",
    departure_date: "2026-11-24",
    order_index: 0
  }
];

export const INITIAL_ITINERARY_ACTIVITIES = [
  // European Trip Activities
  {
    id: "itin-act-1",
    trip_stop_id: "stop-1-paris",
    activity_id: "act-paris-1",
    date: "2026-09-01",
    start_time: "18:00",
    order_index: 0,
    custom_cost: 45
  },
  {
    id: "itin-act-2",
    trip_stop_id: "stop-1-paris",
    activity_id: "act-paris-2",
    date: "2026-09-02",
    start_time: "10:00",
    order_index: 0,
    custom_cost: 65
  },
  {
    id: "itin-act-3",
    trip_stop_id: "stop-1-paris",
    activity_id: "act-paris-3",
    date: "2026-09-03",
    start_time: "14:00",
    order_index: 0,
    custom_cost: 55
  },
  {
    id: "itin-act-4",
    trip_stop_id: "stop-1-amsterdam",
    activity_id: "act-amsterdam-1",
    date: "2026-09-05",
    start_time: "17:30",
    order_index: 0,
    custom_cost: 38
  },
  {
    id: "itin-act-5",
    trip_stop_id: "stop-1-amsterdam",
    activity_id: "act-amsterdam-2",
    date: "2026-09-06",
    start_time: "11:00",
    order_index: 0,
    custom_cost: 50
  },
  {
    id: "itin-act-6",
    trip_stop_id: "stop-1-rome",
    activity_id: "act-rome-1",
    date: "2026-09-08",
    start_time: "09:30",
    order_index: 0,
    custom_cost: 75
  },
  {
    id: "itin-act-7",
    trip_stop_id: "stop-1-rome",
    activity_id: "act-rome-2",
    date: "2026-09-09",
    start_time: "17:00",
    order_index: 0,
    custom_cost: 85
  }
];

export const INITIAL_EXPENSES = [
  { id: "exp-1", trip_id: "trip-1", category: "Transportation", amount: 620, description: "Flights & Eurostar Train Pass", date: "2026-09-01" },
  { id: "exp-2", trip_id: "trip-1", category: "Accommodation", amount: 1450, description: "Boutique hotels in Paris, Amsterdam & Rome", date: "2026-09-01" },
  { id: "exp-3", trip_id: "trip-1", category: "Activities", amount: 480, description: "Museum passes & guided tours", date: "2026-09-02" },
  { id: "exp-4", trip_id: "trip-1", category: "Meals", amount: 520, description: "Bistros, trattorias & fine dining", date: "2026-09-03" },
  { id: "exp-5", trip_id: "trip-1", category: "Miscellaneous", amount: 170, description: "Souvenirs & local SIM cards", date: "2026-09-05" }
];

export const INITIAL_SAVED_DESTINATIONS = [
  { id: "saved-1", user_id: "user-1", city_id: "city-tokyo" },
  { id: "saved-2", user_id: "user-1", city_id: "city-paris" },
  { id: "saved-3", user_id: "user-1", city_id: "city-barcelona" }
];

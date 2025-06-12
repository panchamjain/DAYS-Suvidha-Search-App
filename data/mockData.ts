// Mock data for DAYS Ahmedabad Suvidha Card app

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: any;
  description: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  image?: any;
  description: string;
  discounts: Discount[];
  locations: Location[];
  rating: number;
  reviews: number;
  popular: boolean;
}

export interface Discount {
  id: string;
  title: string;
  description: string;
  percentage: number;
  validUntil: string;
  terms?: string;
}

export interface Location {
  id: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  website?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timings?: string;
}

// Categories
export const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Restaurants',
    icon: 'food',
    image: require('../assets/images/category-restaurant.jpg'),
    description: 'Exclusive dining discounts at top restaurants in Ahmedabad',
  },
  {
    id: 'cat2',
    name: 'Healthcare',
    icon: 'hospital',
    image: require('../assets/images/category-healthcare.jpg'),
    description: 'Special offers on healthcare services and consultations',
  },
  {
    id: 'cat3',
    name: 'Shopping',
    icon: 'shopping',
    image: require('../assets/images/category-shopping.jpg'),
    description: 'Great deals at popular shopping destinations',
  },
  {
    id: 'cat4',
    name: 'Entertainment',
    icon: 'movie',
    image: require('../assets/images/category-entertainment.jpg'),
    description: 'Discounts on movies, events, and recreational activities',
  },
  {
    id: 'cat5',
    name: 'Education',
    icon: 'school',
    image: require('../assets/images/category-education.jpg'),
    description: 'Special offers on courses, workshops, and educational materials',
  },
];

// Merchants
export const merchants: Merchant[] = [
  // Restaurants
  {
    id: 'mer1',
    name: 'Shree Ram Restaurant',
    category: 'Restaurants',
    categoryId: 'cat1',
    description: 'Authentic Gujarati thali and North Indian cuisine',
    discounts: [
      {
        id: 'disc1',
        title: '20% off on total bill',
        description: 'Get 20% discount on your total bill value',
        percentage: 20,
        validUntil: '2023-12-31',
        terms: 'Not valid on weekends and public holidays. Cannot be combined with other offers.',
      },
      {
        id: 'disc2',
        title: 'Buy 1 Get 1 on Desserts',
        description: 'Buy one dessert and get another one free',
        percentage: 100,
        validUntil: '2023-12-31',
        terms: 'Valid only on selected desserts. Subject to availability.',
      },
    ],
    locations: [
      {
        id: 'loc1',
        address: '123, Shivranjani Cross Roads',
        area: 'Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        phone: '+91 9876543210',
        email: 'info@shreeram.com',
        website: 'www.shreeramrestaurant.com',
        coordinates: {
          latitude: 23.0225,
          longitude: 72.5714,
        },
        timings: '11:00 AM - 11:00 PM',
      },
      {
        id: 'loc2',
        address: '45, Prahlad Nagar Road',
        area: 'Prahlad Nagar',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        phone: '+91 9876543211',
        coordinates: {
          latitude: 23.0125,
          longitude: 72.5114,
        },
        timings: '11:00 AM - 11:00 PM',
      },
    ],
    rating: 4.5,
    reviews: 128,
    popular: true,
  },
  {
    id: 'mer2',
    name: 'Gordhan Thal',
    category: 'Restaurants',
    categoryId: 'cat1',
    description: 'Premium Gujarati thali experience with authentic flavors',
    discounts: [
      {
        id: 'disc3',
        title: '15% off on total bill',
        description: 'Get 15% discount on your total bill value',
        percentage: 15,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc3',
        address: '78, CG Road',
        area: 'Navrangpura',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380009',
        phone: '+91 9876543212',
        coordinates: {
          latitude: 23.0395,
          longitude: 72.5660,
        },
        timings: '11:30 AM - 10:30 PM',
      },
    ],
    rating: 4.3,
    reviews: 95,
    popular: true,
  },
  
  // Healthcare
  {
    id: 'mer3',
    name: 'Apollo Hospital',
    category: 'Healthcare',
    categoryId: 'cat2',
    description: 'Leading multi-specialty hospital with advanced medical facilities',
    discounts: [
      {
        id: 'disc4',
        title: '10% off on consultations',
        description: 'Get 10% discount on doctor consultations',
        percentage: 10,
        validUntil: '2023-12-31',
      },
      {
        id: 'disc5',
        title: '15% off on lab tests',
        description: 'Get 15% discount on all laboratory tests',
        percentage: 15,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc4',
        address: '102, SG Highway',
        area: 'Bodakdev',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
        phone: '+91 9876543213',
        email: 'info@apolloahmedabad.com',
        website: 'www.apollohospitals.com',
        coordinates: {
          latitude: 23.0469,
          longitude: 72.5316,
        },
        timings: '24 hours',
      },
    ],
    rating: 4.7,
    reviews: 215,
    popular: true,
  },
  {
    id: 'mer4',
    name: 'Zydus Hospital',
    category: 'Healthcare',
    categoryId: 'cat2',
    description: 'State-of-the-art healthcare facility with expert doctors',
    discounts: [
      {
        id: 'disc6',
        title: '12% off on health checkups',
        description: 'Get 12% discount on comprehensive health checkup packages',
        percentage: 12,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc5',
        address: '45, Thaltej Cross Roads',
        area: 'Thaltej',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380059',
        phone: '+91 9876543214',
        coordinates: {
          latitude: 23.0459,
          longitude: 72.5286,
        },
        timings: '24 hours',
      },
    ],
    rating: 4.6,
    reviews: 178,
    popular: true,
  },
  
  // Shopping
  {
    id: 'mer5',
    name: 'Ahmedabad One Mall',
    category: 'Shopping',
    categoryId: 'cat3',
    description: 'Premium shopping mall with international and national brands',
    discounts: [
      {
        id: 'disc7',
        title: '10% off at select stores',
        description: 'Get 10% discount at participating stores in the mall',
        percentage: 10,
        validUntil: '2023-12-31',
        terms: 'Valid at participating stores only. See store list for details.',
      },
    ],
    locations: [
      {
        id: 'loc6',
        address: 'Vastrapur Lake, Vastrapur',
        area: 'Vastrapur',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        phone: '+91 9876543215',
        website: 'www.ahmedabadone.com',
        coordinates: {
          latitude: 23.0359,
          longitude: 72.5293,
        },
        timings: '10:00 AM - 10:00 PM',
      },
    ],
    rating: 4.4,
    reviews: 320,
    popular: true,
  },
  {
    id: 'mer6',
    name: 'Iscon Mall',
    category: 'Shopping',
    categoryId: 'cat3',
    description: 'Popular shopping destination with entertainment options',
    discounts: [
      {
        id: 'disc8',
        title: '15% off at food court',
        description: 'Get 15% discount at all food court outlets',
        percentage: 15,
        validUntil: '2023-12-31',
      },
      {
        id: 'disc9',
        title: '5% off on shopping',
        description: 'Get 5% discount at select retail stores',
        percentage: 5,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc7',
        address: 'Iscon Cross Roads, SG Highway',
        area: 'Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        phone: '+91 9876543216',
        coordinates: {
          latitude: 23.0229,
          longitude: 72.5083,
        },
        timings: '10:30 AM - 9:30 PM',
      },
    ],
    rating: 4.2,
    reviews: 245,
    popular: false,
  },
  
  // Entertainment
  {
    id: 'mer7',
    name: 'PVR Cinemas',
    category: 'Entertainment',
    categoryId: 'cat4',
    description: 'Premium multiplex chain with the latest movies',
    discounts: [
      {
        id: 'disc10',
        title: '20% off on movie tickets',
        description: 'Get 20% discount on movie tickets from Monday to Thursday',
        percentage: 20,
        validUntil: '2023-12-31',
        terms: 'Valid from Monday to Thursday only. Not applicable on holidays and weekends.',
      },
      {
        id: 'disc11',
        title: '10% off on food and beverages',
        description: 'Get 10% discount on food and beverages at the concession stand',
        percentage: 10,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc8',
        address: 'Acropolis Mall, Thaltej',
        area: 'Thaltej',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380059',
        phone: '+91 9876543217',
        website: 'www.pvrcinemas.com',
        coordinates: {
          latitude: 23.0459,
          longitude: 72.5286,
        },
        timings: '9:00 AM - 1:00 AM',
      },
      {
        id: 'loc9',
        address: 'Ahmedabad One Mall, Vastrapur',
        area: 'Vastrapur',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        phone: '+91 9876543218',
        coordinates: {
          latitude: 23.0359,
          longitude: 72.5293,
        },
        timings: '9:00 AM - 1:00 AM',
      },
    ],
    rating: 4.5,
    reviews: 310,
    popular: true,
  },
  
  // Education
  {
    id: 'mer8',
    name: 'British Council Library',
    category: 'Education',
    categoryId: 'cat5',
    description: 'International library and cultural center',
    discounts: [
      {
        id: 'disc12',
        title: '15% off on membership',
        description: 'Get 15% discount on annual membership fees',
        percentage: 15,
        validUntil: '2023-12-31',
      },
      {
        id: 'disc13',
        title: '10% off on workshops',
        description: 'Get 10% discount on all workshops and events',
        percentage: 10,
        validUntil: '2023-12-31',
      },
    ],
    locations: [
      {
        id: 'loc10',
        address: 'Prestige Point, Ellis Bridge',
        area: 'Ellis Bridge',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380006',
        phone: '+91 9876543219',
        email: 'info.ahmedabad@britishcouncil.org',
        website: 'www.britishcouncil.in',
        coordinates: {
          latitude: 23.0259,
          longitude: 72.5715,
        },
        timings: '10:00 AM - 6:00 PM, Closed on Sundays',
      },
    ],
    rating: 4.6,
    reviews: 85,
    popular: false,
  },
];

// Helper functions
export const getMerchantsByCategory = (categoryId: string): Merchant[] => {
  return merchants.filter(merchant => merchant.categoryId === categoryId);
};

export const getMerchantById = (id: string): Merchant | undefined => {
  return merchants.find(merchant => merchant.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const searchMerchants = (query: string): Merchant[] => {
  const lowercaseQuery = query.toLowerCase();
  return merchants.filter(merchant => 
    merchant.name.toLowerCase().includes(lowercaseQuery) ||
    merchant.category.toLowerCase().includes(lowercaseQuery) ||
    merchant.description.toLowerCase().includes(lowercaseQuery) ||
    merchant.locations.some(location => 
      location.area.toLowerCase().includes(lowercaseQuery) ||
      location.city.toLowerCase().includes(lowercaseQuery)
    ) ||
    merchant.discounts.some(discount => 
      discount.title.toLowerCase().includes(lowercaseQuery) ||
      discount.description.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const getPopularMerchants = (): Merchant[] => {
  return merchants.filter(merchant => merchant.popular);
};

export const searchSuggestions = (query: string): Array<{type: string, text: string, id?: string}> => {
  const lowercaseQuery = query.toLowerCase();
  const results: Array<{type: string, text: string, id?: string}> = [];
  
  // Category suggestions
  categories.forEach(category => {
    if (category.name.toLowerCase().includes(lowercaseQuery)) {
      results.push({
        type: 'category',
        text: `${category.name} in Category`,
        id: category.id
      });
    }
  });
  
  // Merchant suggestions
  merchants.forEach(merchant => {
    if (merchant.name.toLowerCase().includes(lowercaseQuery)) {
      results.push({
        type: 'merchant',
        text: `${merchant.name} in ${merchant.category}`,
        id: merchant.id
      });
    }
  });
  
  // Location suggestions
  const locationSet = new Set<string>();
  merchants.forEach(merchant => {
    merchant.locations.forEach(location => {
      if (location.area.toLowerCase().includes(lowercaseQuery) && !locationSet.has(location.area)) {
        locationSet.add(location.area);
        results.push({
          type: 'location',
          text: `${location.area} in Location`,
          id: location.id
        });
      }
    });
  });
  
  // Discount suggestions
  merchants.forEach(merchant => {
    merchant.discounts.forEach(discount => {
      if (discount.title.toLowerCase().includes(lowercaseQuery) || 
          discount.description.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          type: 'discount',
          text: `${discount.percentage}% off at ${merchant.name}`,
          id: discount.id
        });
      }
    });
  });
  
  return results.slice(0, 10); // Limit to 10 suggestions
};
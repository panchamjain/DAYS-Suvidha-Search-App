export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  contact: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  isMainBranch: boolean;
  amenities: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Merchant {
  id: number;
  name: string;
  category?: string;
  category_slug?: string;
  address?: string; // Main branch address for backward compatibility
  contact?: string; // Main branch contact for backward compatibility
  discount?: string;
  description?: string;
  rating?: number; // Made optional since API might not always provide this
  branches?: Branch[];
  totalBranches?: number; // Made optional with fallback
  establishedYear?: number;
  website?: string;
  image?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Keep existing mock data for fallback during transition
export const categories: Category[] = [
  {
    id: '1',
    name: 'Restaurants',
    slug: 'eatery',
    icon: 'restaurant',
    description: 'Exclusive dining discounts at top restaurants in Ahmedabad'
  },
  {
    id: '2',
    name: 'Healthcare',
    slug: 'hospital',
    icon: 'medical-services',
    description: 'Special offers on medical services and consultations'
  },
  {
    id: '3',
    name: 'Shopping',
    slug: 'automobile',
    icon: 'shopping-bag',
    description: 'Discounts at popular retail stores and malls'
  },
  {
    id: '4',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'movie',
    description: 'Special prices for movies, events and attractions'
  },
  {
    id: '5',
    name: 'Pharmacy',
    slug: 'pharmacy',
    icon: 'local-pharmacy',
    description: 'Discounts on medicines and healthcare products'
  },
  {
    id: '6',
    name: 'Imaging',
    slug: 'imaging',
    icon: 'medical-services',
    description: 'Special offers on medical imaging and diagnostics'
  },
  {
    id: '7',
    name: 'Dental Clinic',
    slug: 'dental-clinic',
    icon: 'medical-services',
    description: 'Dental care services with exclusive discounts'
  },
  {
    id: '8',
    name: 'Automotive',
    slug: 'automobile',
    icon: 'directions-car',
    description: 'Discounts on car services, accessories and more'
  }
];

// Keep existing merchants for fallback with corrected IDs
export const merchants: Merchant[] = [
  {
    id: 101,
    name: 'Café Ahmedabad',
    category: '1',
    address: '123 SG Highway, Ahmedabad',
    contact: '+91 9876543210',
    discount: '15% off on total bill',
    description: 'A cozy café offering a variety of cuisines and beverages with a pleasant ambiance.',
    rating: 4.5,
    totalBranches: 3,
    establishedYear: 2018,
    website: 'www.cafeahmedabad.com',
    branches: [
      {
        id: 1011,
        name: 'SG Highway Branch',
        address: '123 SG Highway, Ahmedabad',
        contact: '+91 9876543210',
        coordinates: { latitude: 23.0225, longitude: 72.5714 },
        operatingHours: {
          weekdays: '8:00 AM - 11:00 PM',
          weekends: '8:00 AM - 12:00 AM'
        },
        isMainBranch: true,
        amenities: ['WiFi', 'Parking', 'AC', 'Outdoor Seating']
      },
      {
        id: 1012,
        name: 'CG Road Branch',
        address: '45 CG Road, Navrangpura, Ahmedabad',
        contact: '+91 9876543211',
        coordinates: { latitude: 23.0395, longitude: 72.5553 },
        operatingHours: {
          weekdays: '9:00 AM - 10:30 PM',
          weekends: '9:00 AM - 11:30 PM'
        },
        isMainBranch: false,
        amenities: ['WiFi', 'AC', 'Takeaway']
      },
      {
        id: 1013,
        name: 'Satellite Branch',
        address: '78 Satellite Road, Ahmedabad',
        contact: '+91 9876543212',
        coordinates: { latitude: 23.0258, longitude: 72.5194 },
        operatingHours: {
          weekdays: '8:30 AM - 10:00 PM',
          weekends: '8:30 AM - 11:00 PM'
        },
        isMainBranch: false,
        amenities: ['WiFi', 'Parking', 'AC', 'Home Delivery']
      }
    ]
  },
  {
    id: 102,
    name: 'Spice Garden Restaurant',
    category: '1',
    address: '45 CG Road, Ahmedabad',
    contact: '+91 9876543211',
    discount: '10% off on food items',
    description: 'Authentic Indian cuisine with a modern twist, known for its flavorful dishes.',
    rating: 4.2,
    totalBranches: 2,
    establishedYear: 2015,
    branches: [
      {
        id: 1021,
        name: 'CG Road Main',
        address: '45 CG Road, Ahmedabad',
        contact: '+91 9876543211',
        coordinates: { latitude: 23.0395, longitude: 72.5553 },
        operatingHours: {
          weekdays: '11:00 AM - 11:00 PM',
          weekends: '11:00 AM - 12:00 AM'
        },
        isMainBranch: true,
        amenities: ['AC', 'Parking', 'Family Dining', 'Private Rooms']
      },
      {
        id: 1022,
        name: 'Vastrapur Branch',
        address: '89 Vastrapur, Ahmedabad',
        contact: '+91 9876543213',
        coordinates: { latitude: 23.0395, longitude: 72.5240 },
        operatingHours: {
          weekdays: '12:00 PM - 10:30 PM',
          weekends: '12:00 PM - 11:30 PM'
        },
        isMainBranch: false,
        amenities: ['AC', 'Takeaway', 'Home Delivery']
      }
    ]
  }
];


export interface Trustee {
  id: number;
  name: string;
  position: string;
  contact?: string;
  email?: string;
}

export interface Temple {
  id: number;
  name: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  mainImage: string;
  additionalImages: string[];
  description: string;
  deity: string;
  establishedYear?: number;
  hasDharamshala: boolean;
  dharamshalaDetails?: {
    rooms: number;
    contactPerson: string;
    contact: string;
    bookingRequired: boolean;
    charges?: string;
  };
  trustees: Trustee[];
  timings: {
    morning: string;
    evening: string;
    aarti?: {
      morning?: string;
      evening?: string;
    };
  };
  festivals: string[];
  facilities: string[];
  contact: string;
  website?: string;
  category: 'Ancient' | 'Modern' | 'Heritage' | 'Popular';
  rating?: number;
  visitorsPerDay?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DaysEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  category: 'Workshop' | 'Networking' | 'Cultural' | 'Business' | 'Community';
  isRegistrationRequired: boolean;
  registrationLink?: string;
  contact: string;
  organizer: string;
  maxParticipants?: number;
  currentParticipants?: number;
  isFree: boolean;
  price?: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface DaysNews {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  publishedDate: string;
  category: 'Announcement' | 'Partnership' | 'Update' | 'Achievement' | 'Community';
  tags: string[];
  readTime: number; // in minutes
  isImportant: boolean;
  views?: number;
}

// Mock data for temples
export const temples: Temple[] = [
  {
    id: 1,
    name: "Swaminarayan Akshardham",
    address: "Sector 20, Gandhinagar",
    area: "Gandhinagar",
    city: "Gandhinagar",
    pincode: "382020",
    coordinates: { latitude: 23.2156, longitude: 72.6369 },
    mainImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
    additionalImages: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800"
    ],
    description: "A magnificent temple complex showcasing Indian culture, spirituality, and architecture.",
    deity: "Swaminarayan",
    establishedYear: 1992,
    hasDharamshala: true,
    dharamshalaDetails: {
      rooms: 50,
      contactPerson: "Dharamshala Manager",
      contact: "+91 79 2323 5555",
      bookingRequired: true,
      charges: "₹500-1500 per room"
    },
    trustees: [
      { id: 1, name: "Pramukh Swami Maharaj Trust", position: "Main Trustee", contact: "+91 79 2323 5555" }
    ],
    timings: {
      morning: "9:30 AM - 6:30 PM",
      evening: "Closed",
      aarti: {
        morning: "10:00 AM",
        evening: "6:00 PM"
      }
    },
    festivals: ["Janmashtami", "Ram Navami", "Diwali"],
    facilities: ["Parking", "Restaurant", "Gift Shop", "Garden", "Museum"],
    contact: "+91 79 2323 5555",
    website: "www.akshardham.com",
    category: "Modern",
    rating: 4.8,
    visitorsPerDay: 5000
  },
  {
    id: 2,
    name: "Jagannath Temple",
    address: "Jamalpur, Ahmedabad",
    area: "Jamalpur",
    city: "Ahmedabad",
    pincode: "380022",
    coordinates: { latitude: 23.0395, longitude: 72.5653 },
    mainImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800",
    additionalImages: [
      "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=800"
    ],
    description: "Ancient temple dedicated to Lord Jagannath with beautiful traditional architecture.",
    deity: "Jagannath",
    establishedYear: 1622,
    hasDharamshala: false,
    trustees: [
      { id: 2, name: "Jagannath Temple Trust", position: "Chairman", contact: "+91 79 2550 1234" }
    ],
    timings: {
      morning: "5:00 AM - 12:00 PM",
      evening: "4:00 PM - 9:00 PM",
      aarti: {
        morning: "6:00 AM",
        evening: "7:00 PM"
      }
    },
    festivals: ["Rath Yatra", "Janmashtami", "Ekadashi"],
    facilities: ["Parking", "Prasadam Counter", "Donation Counter"],
    contact: "+91 79 2550 1234",
    category: "Ancient",
    rating: 4.5,
    visitorsPerDay: 2000
  },
  {
    id: 3,
    name: "Hutheesing Jain Temple",
    address: "Shahibaug, Ahmedabad",
    area: "Shahibaug",
    city: "Ahmedabad",
    pincode: "380004",
    coordinates: { latitude: 23.0395, longitude: 72.5653 },
    mainImage: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800",
    additionalImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"
    ],
    description: "Beautiful Jain temple known for its intricate marble carvings and peaceful atmosphere.",
    deity: "Dharmanatha",
    establishedYear: 1848,
    hasDharamshala: true,
    dharamshalaDetails: {
      rooms: 20,
      contactPerson: "Temple Secretary",
      contact: "+91 79 2286 5432",
      bookingRequired: true,
      charges: "₹300-800 per room"
    },
    trustees: [
      { id: 3, name: "Hutheesing Jain Temple Trust", position: "President", contact: "+91 79 2286 5432" }
    ],
    timings: {
      morning: "6:00 AM - 12:00 PM",
      evening: "3:00 PM - 8:00 PM",
      aarti: {
        morning: "7:00 AM",
        evening: "6:30 PM"
      }
    },
    festivals: ["Mahavir Jayanti", "Paryushan", "Diwali"],
    facilities: ["Parking", "Library", "Meditation Hall", "Garden"],
    contact: "+91 79 2286 5432",
    category: "Heritage",
    rating: 4.6,
    visitorsPerDay: 1500
  }
];

// Mock data for DAYS events
export const daysEvents: DaysEvent[] = [
  {
    id: 1,
    title: "DAYS Business Networking Meet",
    description: "Connect with fellow DAYS cardholders and local business owners in this exclusive networking event.",
    date: "2024-02-15",
    time: "6:00 PM - 9:00 PM",
    venue: "Hotel Hyatt, SG Highway",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    category: "Networking",
    isRegistrationRequired: true,
    registrationLink: "https://daysahmedabad.com/events/networking-meet",
    contact: "+91 79 4000 1234",
    organizer: "DAYS Ahmedabad Team",
    maxParticipants: 100,
    currentParticipants: 67,
    isFree: true,
    status: "Upcoming"
  },
  {
    id: 2,
    title: "Digital Marketing Workshop",
    description: "Learn the latest digital marketing strategies to grow your business in the digital age.",
    date: "2024-02-20",
    time: "10:00 AM - 4:00 PM",
    venue: "CEPT University, Navrangpura",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    category: "Workshop",
    isRegistrationRequired: true,
    registrationLink: "https://daysahmedabad.com/events/digital-marketing",
    contact: "+91 79 4000 1234",
    organizer: "DAYS Education Wing",
    maxParticipants: 50,
    currentParticipants: 32,
    isFree: false,
    price: 999,
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Cultural Evening - Navratri Special",
    description: "Celebrate the spirit of Navratri with traditional music, dance, and authentic Gujarati cuisine.",
    date: "2024-03-10",
    time: "7:00 PM - 11:00 PM",
    venue: "Karnavati Club, SG Highway",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    category: "Cultural",
    isRegistrationRequired: true,
    contact: "+91 79 4000 1234",
    organizer: "DAYS Cultural Committee",
    maxParticipants: 200,
    currentParticipants: 145,
    isFree: false,
    price: 1500,
    status: "Upcoming"
  }
];

// Mock data for DAYS news
export const daysNews: DaysNews[] = [
  {
    id: 1,
    title: "DAYS Partners with 50+ New Restaurants",
    summary: "We're excited to announce new partnerships with premium restaurants across Ahmedabad.",
    content: "DAYS Ahmedabad has successfully onboarded 50+ new restaurant partners this month, bringing exclusive dining discounts to our valued cardholders. The new partners include popular chains like Mainland China, Barbeque Nation, and local favorites like Agashiye and Vishalla. Cardholders can now enjoy up to 25% discounts at these establishments.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    author: "DAYS Team",
    publishedDate: "2024-01-15",
    category: "Partnership",
    tags: ["restaurants", "discounts", "partnerships"],
    readTime: 3,
    isImportant: true,
    views: 1250
  },
  {
    id: 2,
    title: "Mobile App Update 2.0 Released",
    summary: "Enhanced user experience with new features including temple directory and event booking.",
    content: "We're thrilled to announce the release of DAYS Mobile App 2.0! This major update includes a comprehensive temple directory for Ahmedabad, integrated event booking system, improved search functionality, and a modern redesigned interface. The app now also supports offline mode for viewing saved merchants and temples.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    author: "Tech Team",
    publishedDate: "2024-01-10",
    category: "Update",
    tags: ["app", "update", "features"],
    readTime: 2,
    isImportant: true,
    views: 2100
  },
  {
    id: 3,
    title: "DAYS Achieves 50,000 Active Users Milestone",
    summary: "Celebrating our growing community of satisfied customers across Ahmedabad.",
    content: "We're proud to announce that DAYS Ahmedabad has reached 50,000 active users! This milestone reflects the trust and satisfaction of our community. To celebrate, we're launching special offers and exclusive events for our members throughout February.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    author: "Marketing Team",
    publishedDate: "2024-01-05",
    category: "Achievement",
    tags: ["milestone", "users", "celebration"],
    readTime: 2,
    isImportant: false,
    views: 890
  }
];

import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { authAPI, experiencesAPI, itinerariesAPI, imagesAPI, updatesAPI, setAuthToken } from './services/api';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

export type Region = 'North' | 'South' | 'East' | 'West';

export type User = {
  email: string;
  role: 'admin' | 'user';
  name: string;
};

export type Experience = {
  id: string;
  destination: string;
  region: Region;
  title: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
  createdAt: number;
};

export type Itinerary = {
  id: string;
  destination: string;
  region: Region;
  title: string;
  duration: string;
  days: { day: number; activities: string[] }[];
  imageUrl?: string;
  createdAt: number;
};

export type DestinationImage = {
  id: string;
  destination: string;
  region: Region;
  url: string;
  caption: string;
  createdAt: number;
};

export type UpdateType = 'newsletter' | 'travel-trend' | 'new-experience';

export type Update = {
  id: string;
  type: UpdateType;
  title: string;
  content: string;
  externalUrl?: string; // New field for external blog/post URL
  createdAt: number;
};

export type AppData = {
  experiences: Experience[];
  itineraries: Itinerary[];
  images: DestinationImage[];
  updates: Update[]; // Add updates to AppData
};

// Mock users for authentication - this will be replaced with API calls
const mockUsers = [
  { email: 'admin@dashboard.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
  { email: 'user@dashboard.com', password: 'user123', role: 'user' as const, name: 'John Doe' }
];

// Sample images data with real and unique Indian destination images
const sampleImages: DestinationImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
    destination: 'Ladakh',
    region: 'North',
    caption: 'Breathtaking mountain landscapes of Ladakh with snow-capped peaks and pristine lakes',
    createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&q=80',
    destination: 'Goa',
    region: 'West',
    caption: 'Golden sandy beaches and crystal clear waters of Goa coastline',
    createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop&q=80',
    destination: 'Kerala',
    region: 'South',
    caption: 'Serene backwaters of Kerala with traditional houseboats and lush greenery',
    createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop&q=80',
    destination: 'Rajasthan',
    region: 'West',
    caption: 'Majestic palaces and forts showcasing the royal heritage of Rajasthan',
    createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop&q=80',
    destination: 'Kashmir',
    region: 'North',
    caption: 'Paradise on Earth - Kashmir valley with its pristine lakes and snow-covered mountains',
    createdAt: Date.now() - (4 * 24 * 60 * 60 * 1000)
  },
  // {
  //   id: '6',
  //   url: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop&q=80',
  //   destination: 'Himachal Pradesh',
  //   region: 'North',
  //   caption: 'Scenic hill stations and mountain villages of Himachal Pradesh',
  //   createdAt: Date.now() - (6 * 24 * 60 * 60 * 1000)
  // },
  // {
  //   id: '7',
  //   url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop&q=80',
  //   destination: 'Varanasi',
  //   region: 'North',
  //   caption: 'Ancient ghats of Varanasi along the sacred Ganges river',
  //   createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  // },
  // {
  //   id: '8',
  //   url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
  //   destination: 'Tamil Nadu',
  //   region: 'South',
  //   caption: 'Magnificent temples and cultural heritage of Tamil Nadu',
  //   createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000)
  // },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop&q=80',
    destination: 'Mumbai',
    region: 'West',
    caption: 'Iconic skyline and vibrant city life of Mumbai, the financial capital',
    createdAt: Date.now() - (9 * 24 * 60 * 60 * 1000)
  },
  // {
  //   id: '10',
  //   url: 'https://images.unsplash.com/photo-1599735479942-9cbd1a28c0b0?w=800&h=600&fit=crop&q=80',
  //   destination: 'Darjeeling',
  //   region: 'East',
  //   caption: 'Rolling tea gardens and mountain railways of Darjeeling',
  //   createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000)
  // },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=800&h=600&fit=crop&q=80',
    destination: 'Kolkata',
    region: 'East',
    caption: 'Cultural capital of India with colonial architecture and traditional heritage',
    createdAt: Date.now() - (11 * 24 * 60 * 60 * 1000)
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop&q=80',
    destination: 'Agra',
    region: 'North',
    caption: 'The magnificent Taj Mahal - symbol of eternal love and architectural marvel',
    createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000)
  },
  {
    id: '13',
    url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop&q=80',
    destination: 'Andaman',
    region: 'South',
    caption: 'Pristine beaches and coral reefs of Andaman and Nicobar Islands',
    createdAt: Date.now() - (13 * 24 * 60 * 60 * 1000)
  },
  // {
  //   id: '14',
  //   url: 'https://images.unsplash.com/photo-1544986581-efac024b4963?w=800&h=600&fit=crop&q=80',
  //   destination: 'Rishikesh',
  //   region: 'North',
  //   caption: 'Spiritual capital and adventure sports hub in the foothills of Himalayas',
  //   createdAt: Date.now() - (14 * 24 * 60 * 60 * 1000)
  // },
  // {
  //   id: '15',
  //   url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop&q=80',
  //   destination: 'Mysore',
  //   region: 'South',
  //   caption: 'Royal palaces and gardens of Mysore showcasing South Indian architecture',
  //   createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000)
  // }
];

// Initial data for the application
const initialData: AppData = {
  experiences: [
    {
      id: '1',
      destination: 'Goa',
      region: 'West',
      title: 'Coastal Paradise & Beach Vibes',
      description: 'Experience the perfect blend of Portuguese heritage, pristine beaches, and vibrant nightlife in Goa. Enjoy water sports, beach shacks, and stunning sunsets.',
      highlights: ['Beach hopping at Baga & Anjuna', 'Water sports & parasailing', 'Visit historic churches', 'Sunset cruises on Mandovi River'],
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
      createdAt: Date.now() - 86400000 * 10
    },
    {
      id: '2',
      destination: 'Ladakh',
      region: 'North',
      title: 'Himalayan Adventure',
      description: 'Explore the breathtaking landscapes of Ladakh with its high mountain passes, pristine lakes, and ancient Buddhist monasteries.',
      highlights: ['Pangong Lake visit', 'Khardung La pass', 'Buddhist monastery tours', 'Mountain biking adventures'],
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      createdAt: Date.now() - 86400000 * 8
    },
    {
      id: '3',
      destination: 'Kerala',
      region: 'South',
      title: 'Backwater Serenity',
      description: 'Immerse yourself in the tranquil backwaters of Kerala, experience traditional houseboats, and enjoy Ayurvedic wellness treatments.',
      highlights: ['Houseboat cruise in Alleppey', 'Ayurvedic spa treatments', 'Tea plantation tours', 'Kathakali dance performance'],
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
      createdAt: Date.now() - 86400000 * 12
    },
    {
      id: '4',
      destination: 'Darjeeling',
      region: 'East',
      title: 'Tea Garden Retreat',
      description: 'Discover the charm of Darjeeling with its rolling tea gardens, toy train rides, and stunning views of Kanchenjunga.',
      highlights: ['Tiger Hill sunrise', 'Toy train ride', 'Tea estate visits', 'Himalayan Mountaineering Institute'],
      imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop',
      createdAt: Date.now() - 86400000 * 15
    }
  ],
  itineraries: [
    {
      id: '1',
      destination: 'Goa',
      region: 'West',
      title: '5-Day Goa Beach Escape',
      duration: '5 Days / 4 Nights',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
      days: [
        { day: 1, activities: ['Arrival at Goa Airport', 'Check-in to beach resort', 'Evening at Calangute Beach', 'Dinner at beach shack'] },
        { day: 2, activities: ['North Goa tour - Fort Aguada', 'Visit Anjuna Flea Market', 'Water sports at Baga Beach', 'Sunset at Vagator'] },
        { day: 3, activities: ['South Goa churches tour', 'Visit Basilica of Bom Jesus', 'Lunch at Panjim', 'Evening river cruise'] },
        { day: 4, activities: ['Dudhsagar Waterfalls excursion', 'Spice plantation visit', 'Traditional Goan lunch', 'Beach relaxation'] },
        { day: 5, activities: ['Morning yoga on beach', 'Last-minute shopping', 'Departure transfer'] }
      ],
      createdAt: Date.now() - 86400000 * 9
    },
    {
      id: '2',
      destination: 'Ladakh',
      region: 'North',
      title: '7-Day Ladakh Expedition',
      duration: '7 Days / 6 Nights',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
      days: [
        { day: 1, activities: ['Arrival in Leh', 'Acclimatization day', 'Visit Leh Market', 'Shanti Stupa sunset'] },
        { day: 2, activities: ['Leh Palace visit', 'Thiksey Monastery', 'Hemis Monastery', 'Back to Leh'] },
        { day: 3, activities: ['Drive to Nubra Valley via Khardung La', 'Diskit Monastery', 'Camel safari at Hunder', 'Stay in Nubra'] },
        { day: 4, activities: ['Return to Leh via Khardung La', 'Leisure time', 'Local market shopping'] },
        { day: 5, activities: ['Early morning to Pangong Lake', 'Lunch at Pangong', 'Photography session', 'Return to Leh'] },
        { day: 6, activities: ['Visit Alchi Monastery', 'Magnetic Hill', 'Gurudwara Pathar Sahib', 'Evening free'] },
        { day: 7, activities: ['Departure from Leh'] }
      ],
      createdAt: Date.now() - 86400000 * 7
    },
    {
      id: '3',
      destination: 'Kerala',
      region: 'South',
      title: '6-Day Kerala Backwaters',
      duration: '6 Days / 5 Nights',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
      days: [
        { day: 1, activities: ['Arrival in Kochi', 'Visit Fort Kochi', 'Chinese fishing nets', 'Kathakali performance'] },
        { day: 2, activities: ['Drive to Munnar', 'Tea plantation visit', 'Mattupetty Dam', 'Echo Point'] },
        { day: 3, activities: ['Eravikulam National Park', 'Tea museum visit', 'Local market shopping', 'Evening at leisure'] },
        { day: 4, activities: ['Drive to Alleppey', 'Check-in to houseboat', 'Backwater cruise', 'Overnight on houseboat'] },
        { day: 5, activities: ['Morning on backwaters', 'Village visit', 'Check-in to resort', 'Ayurvedic massage'] },
        { day: 6, activities: ['Beach relaxation', 'Departure transfer'] }
      ],
      createdAt: Date.now() - 86400000 * 11
    }
  ],
  images: sampleImages,
  updates: [
    {
      id: '1',
      type: 'newsletter',
      title: 'Winter Travel Advisory for Himalayan Regions',
      content: 'Important updates on weather conditions and travel advisories for Ladakh, Kashmir, and other high-altitude destinations during winter months.',
      externalUrl: 'https://example.com/winter-travel-advisory',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: '2',
      type: 'travel-trend',
      title: 'Sustainable Tourism is on the Rise',
      content: 'Eco-friendly travel practices are becoming more popular among travelers. Learn about sustainable accommodations and responsible tourism.',
      externalUrl: 'https://example.com/sustainable-tourism-trends',
      createdAt: Date.now() - 86400000 * 5
    },
    {
      id: '3',
      type: 'new-experience',
      title: 'Introducing Digital Detox Retreats in Rishikesh',
      content: 'New wellness experiences now available! Disconnect from technology and reconnect with nature through yoga, meditation, and mindful living.',
      createdAt: Date.now() - 86400000 * 1
    }
  ]
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState({
    experiences: [],
    itineraries: [],
    images: [],
    updates: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setAuthToken(token);
      setUser(JSON.parse(storedUser));
      fetchAllData();
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [experiences, itineraries, images, updates] = await Promise.all([
        experiencesAPI.getAll().then(res => res.data),
        itinerariesAPI.getAll().then(res => res.data),
        imagesAPI.getAll().then(res => res.data),
        updatesAPI.getAll().then(res => res.data)
      ]);
      
      setData({
        experiences,
        itineraries,
        images,
        updates
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token); // For our API service
    setUser(userData);
    fetchAllData();
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    authAPI.logout();
    setUser(null);
    setData({
      experiences: [],
      itineraries: [],
      images: [],
      updates: []
    });
  };
  
  const handleUpdateData = (newData: any) => {
    setData(newData);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        data={data}
        onLogout={handleLogout}
        onUpdateData={handleUpdateData}
      />
    );
  }

  return (
    <UserDashboard
      user={user}
      data={data}
      onLogout={handleLogout}
    />
  );
}

export default App;

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

// Production-ready App component
// All data is fetched from backend API - no mock data needed
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

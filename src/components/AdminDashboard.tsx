import { useState } from 'react';
import { User, AppData, Region } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LogOut, Search, Sparkles, Calendar, Image as ImageIcon } from 'lucide-react';
import { ExperienceManager } from './ExperienceManager';
import { ItineraryManager } from './ItineraryManager';
import { ImageManager } from './ImageManager';
import { SearchResults } from './SearchResults';
import { RegionFilter } from './RegionFilter';
import { UpdatesManager } from './UpdatesManager';
import elephantLogo from '../logo1.png';

type AdminDashboardProps = {
  user: User;
  data: AppData;
  onLogout: () => void;
  onUpdateData: (data: AppData) => void;
};

type Section = 'experiences' | 'itineraries' | 'images' | 'search';

export function AdminDashboard({ user, data, onLogout, onUpdateData }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('experiences');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSection('search');
    }
  };

  const filteredData = {
    experiences: selectedRegion === 'All' 
      ? (data.experiences || [])
      : (data.experiences || []).filter(exp => exp.region === selectedRegion),
    itineraries: selectedRegion === 'All' 
      ? (data.itineraries || [])
      : (data.itineraries || []).filter(it => it.region === selectedRegion),
    images: selectedRegion === 'All' 
      ? (data.images || [])
      : (data.images || []).filter(img => img.region === selectedRegion)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-6">
            
            {/* Left: Logo and user */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img src={elephantLogo} alt="Immerse India" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-orange-900 font-semibold">Immerse India </h1>
                <p className="text-slate-600 text-sm">Welcome, {user.name}</p>
              </div>
            </div>
      
            {/* Middle: Search Bar */}
            <form onSubmit={handleSearch} className="flex-grow max-w-3xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by destination (e.g., Goa, Ladakh, Kerala...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>
      
            {/* Right: Logout button */}
            <Button onClick={onLogout} variant="outline" className="flex-shrink-0">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Content - Main Dashboard */}
          <div className="lg:col-span-3">
            {/* Navigation Tabs - increased width */}
            <div className="flex gap-4 mb-8 overflow-x-auto">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg min-w-[290px] ${
                  activeSection === 'experiences'? ' bg-orange-50': ''}`}
                onClick={() => setActiveSection('experiences')}>
                <CardHeader className="flex items-center h-full p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-orange-600" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <CardTitle className="leading-tight font-semibold text-lg">Experiences</CardTitle>
                      <CardDescription className="text-base">
                        {filteredData.experiences?.length || 0} items
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg min-w-[290px] ${activeSection === 'itineraries' ? ' bg-purple-50' : ''}`}
                onClick={() => setActiveSection('itineraries')}
              >
                <CardHeader className="flex items-center h-full p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <CardTitle className="leading-tight font-semibold text-lg">Itineraries</CardTitle>
                      <CardDescription className="text-base">
                        {filteredData.itineraries?.length || 0} items
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg min-w-[290px] ${activeSection === 'images' ? ' bg-cyan-50' : ''}`}
                onClick={() => setActiveSection('images')}
              >
                <CardHeader className="flex items-center h-full p-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-cyan-600" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <CardTitle className="leading-tight font-semibold text-lg">Images</CardTitle>
                      <CardDescription className="text-base">
                        {filteredData.images?.length || 0} items
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Tab Content - existing code */}
            <div className="space-y-8">
              {/* Content Area */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                {activeSection === 'experiences' && (
                  <ExperienceManager data={{ ...data, experiences: filteredData.experiences }} onUpdateData={onUpdateData} />
                )}

                {activeSection === 'itineraries' && (
                  <ItineraryManager data={{ ...data, itineraries: filteredData.itineraries }} onUpdateData={onUpdateData} />
                )}

                {activeSection === 'images' && (
                  <ImageManager data={{ ...data, images: filteredData.images }} onUpdateData={onUpdateData} />
                )}

                {activeSection === 'search' && (
                  <SearchResults searchQuery={searchQuery} data={data} isAdmin={true} onUpdateData={onUpdateData} />
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Updates Management */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-7rem)] mb-2.5">
              <UpdatesManager data={data} onUpdateData={onUpdateData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

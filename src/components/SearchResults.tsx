import { useMemo } from 'react';
import { AppData } from '../App';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExperienceViewer } from './ExperienceViewer';
import { ItineraryViewer } from './ItineraryViewer';
import { ImageViewer } from './ImageViewer';
import { ExperienceManager } from './ExperienceManager';
import { ItineraryManager } from './ItineraryManager';
import { ImageManager } from './ImageManager';
import { Search } from 'lucide-react';

type SearchResultsProps = {
  searchQuery: string;
  data: AppData;
  isAdmin: boolean;
  onUpdateData?: (data: AppData) => void;
};

export function SearchResults({ searchQuery, data, isAdmin, onUpdateData }: SearchResultsProps) {
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return {
      experiences: data.experiences.filter(exp =>
        exp.destination.toLowerCase().includes(query) ||
        exp.title.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.region.toLowerCase().includes(query)
      ),
      itineraries: data.itineraries.filter(it =>
        it.destination.toLowerCase().includes(query) ||
        it.title.toLowerCase().includes(query) ||
        it.region.toLowerCase().includes(query)
      ),
      images: data.images.filter(img =>
        img.destination.toLowerCase().includes(query) ||
        img.caption.toLowerCase().includes(query) ||
        img.region.toLowerCase().includes(query)
      )
    };
  }, [searchQuery, data]);

  const totalResults = filteredData.experiences.length + 
                      filteredData.itineraries.length + 
                      filteredData.images.length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-slate-500" />
          <h2 className="text-slate-900">Search Results for "{searchQuery}"</h2>
        </div>
        <p className="text-slate-600">
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} across all categories
        </p>
      </div>

      {totalResults === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">
              No results found for "{searchQuery}". Try searching for destinations like Goa, Ladakh, Kerala, or Darjeeling.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="experiences" className="space-y-6">
          <TabsList>
            <TabsTrigger value="experiences">
              Experiences ({filteredData.experiences.length})
            </TabsTrigger>
            <TabsTrigger value="itineraries">
              Itineraries ({filteredData.itineraries.length})
            </TabsTrigger>
            <TabsTrigger value="images">
              Images ({filteredData.images.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experiences">
            {isAdmin && onUpdateData ? (
              <ExperienceManager
                data={{ ...data, experiences: filteredData.experiences }}
                onUpdateData={onUpdateData}
              />
            ) : (
              <ExperienceViewer experiences={filteredData.experiences} />
            )}
          </TabsContent>

          <TabsContent value="itineraries">
            {isAdmin && onUpdateData ? (
              <ItineraryManager
                data={{ ...data, itineraries: filteredData.itineraries }}
                onUpdateData={onUpdateData}
              />
            ) : (
              <ItineraryViewer itineraries={filteredData.itineraries} />
            )}
          </TabsContent>

          <TabsContent value="images">
            {isAdmin && onUpdateData ? (
              <ImageManager
                data={{ ...data, images: filteredData.images }}
                onUpdateData={onUpdateData}
              />
            ) : (
              <ImageViewer images={filteredData.images} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

import { useState } from 'react';
import { DestinationImage } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

type ImageViewerProps = {
  images: DestinationImage[];
};

export function ImageViewer({ images }: ImageViewerProps) {
  const [orientationFilter, setOrientationFilter] = useState<'all' | 'landscape' | 'portrait'>('all');
  const [imageOrientations, setImageOrientations] = useState<Record<string, 'landscape' | 'portrait'>>({});

  const handleImageLoad = (imageId: string, width: number, height: number) => {
    const orientation = width > height ? 'landscape' : 'portrait';
    setImageOrientations(prev => ({ ...prev, [imageId]: orientation }));
  };

  const getFilteredImages = () => {
    if (orientationFilter === 'all') return images;
    return images.filter(image => {
      const orientation = imageOrientations[image.id];
      return orientation === orientationFilter;
    });
  };
  const isNew = (createdAt: number) => {
    const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
    return createdAt > twoDaysAgo;
  };

  const handleDownload = async (image: DestinationImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.destination}-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const filteredImages = getFilteredImages();

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 font-semibold text-xl">Destination Images</h2>
            <p className="text-slate-600">Browse and download photos from various destinations</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={orientationFilter} onValueChange={(value: 'all' | 'landscape' | 'portrait') => setOrientationFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative group h-64">
              <ImageWithFallback
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  handleImageLoad(image.id, img.naturalWidth, img.naturalHeight);
                }}
              />
              {/* Move tags to bottom-left */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium">
                  <MapPin className="w-3 h-3" />
                  {image.destination}
                </div>
                <Badge variant="secondary" className="bg-white/90 text-slate-700 text-xs">
                  {image.region}
                </Badge>
              </div>
              {/* NEW badge in top-right */}
              {isNew(image.createdAt) && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">NEW</Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(image)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-slate-700">{image.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && images.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No images match the selected orientation filter.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOrientationFilter('all')}
              className="mt-2"
            >
              Show All Images
            </Button>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-slate-500">No images available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

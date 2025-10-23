import { Update } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

type UpdatesViewerProps = {
  updates: Update[];
};

export function UpdatesViewer({ updates }: UpdatesViewerProps) {
  const handleUpdateClick = (update: Update) => {
    if (update.externalUrl) {
      window.open(update.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };
  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return <BookOpen className="w-4 h-4" />;
      case 'travel-trend':
        return <TrendingUp className="w-4 h-4" />;
      case 'new-experience':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getUpdateBadgeColor = (type: string) => {
    switch (type) {
      case 'newsletter':
        return 'bg-blue-100 text-blue-800';
      case 'travel-trend':
        return 'bg-green-100 text-green-800';
      case 'new-experience':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUpdateTypeLabel = (type: string) => {
    switch (type) {
      case 'newsletter':
        return 'Newsletter';
      case 'travel-trend':
        return 'Travel Trend';
      case 'new-experience':
        return 'New Experience';
      default:
        return 'Update';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const sortedUpdates = [...updates].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Latest Updates</h3>
        <p className="text-sm text-slate-600">Stay informed with our latest news and trends</p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {sortedUpdates.map((update) => (
          <Card 
            key={update.id} 
            className={`transition-shadow flex-shrink-0 ${
              update.externalUrl 
                ? 'hover:shadow-lg cursor-pointer hover:bg-slate-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleUpdateClick(update)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`text-xs ${getUpdateBadgeColor(update.type)}`}>
                  <span className="flex items-center gap-1">
                    {getUpdateIcon(update.type)}
                    {getUpdateTypeLabel(update.type)}
                  </span>
                </Badge>
                <div className="flex items-center gap-2">
                  {update.externalUrl && (
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  )}
                  <span className="text-xs text-slate-500">{formatTimeAgo(update.createdAt)}</span>
                </div>
              </div>
              <CardTitle className="text-sm line-clamp-2 flex items-center gap-2">
                {update.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs line-clamp-3">
                {update.content}
              </CardDescription>
              {update.externalUrl && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Click to read more →
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {updates.length === 0 && (
        <Card className="flex-shrink-0">
          <CardContent className="text-center py-8">
            <p className="text-slate-500 text-sm">No updates available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
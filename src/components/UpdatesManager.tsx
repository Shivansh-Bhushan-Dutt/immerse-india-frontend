import { useState, useEffect } from 'react';
import { AppData, Update, UpdateType } from '../App';
import { updatesAPI } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Calendar, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

type UpdatesManagerProps = {
  data: AppData;
  onUpdateData: (data: AppData) => void;
};

export function UpdatesManager({ data, onUpdateData }: UpdatesManagerProps) {
  const [updates, setUpdates] = useState(data.updates || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    type: 'newsletter' as UpdateType,
    title: '',
    content: '',
    externalUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchUpdates();
  }, []);
  
  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const response = await updatesAPI.getAll();
      const updatesData = response.data || response;
      setUpdates(updatesData);
      onUpdateData({
        ...data,
        updates: updatesData
      });
    } catch (error) {
      toast.error('Failed to load updates');
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'newsletter', title: '', content: '', externalUrl: '' });
    setEditingUpdate(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setFormData({
      type: update.type,
      title: update.title,
      content: update.content,
      externalUrl: update.externalUrl || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      try {
        await updatesAPI.delete(id);
        await fetchUpdates(); // Refresh the list
        toast.success('Update deleted successfully');
      } catch (error) {
        toast.error('Failed to delete update');
        console.error('Error deleting update:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        externalUrl: formData.externalUrl || undefined
      };

      if (editingUpdate) {
        // Update existing
        await updatesAPI.update(editingUpdate.id, updateData);
        toast.success('Update modified successfully');
      } else {
        // Add new
        await updatesAPI.create(updateData);
        toast.success('Update added successfully');
      }

      // Refresh the list
      await fetchUpdates();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving update:', error);
      toast.error(`Failed to ${editingUpdate ? 'update' : 'add'} update`);
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdateIcon = (type: UpdateType) => {
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

  const getUpdateBadgeColor = (type: UpdateType) => {
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

  const getUpdateTypeLabel = (type: UpdateType) => {
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
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Manage Updates</h3>
          <p className="text-sm text-slate-600">Create and manage news, trends, and announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-1" />
              Add Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUpdate ? 'Edit Update' : 'Add New Update'}</DialogTitle>
              <DialogDescription>
                {editingUpdate ? 'Modify the update details' : 'Create a new update for users'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Update Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as UpdateType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="travel-trend">Travel Trend</SelectItem>
                    <SelectItem value="new-experience">New Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter update title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter update content (2-3 lines summary)..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalUrl">External URL (Optional)</Label>
                <Input
                  id="externalUrl"
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://example.com/blog-post"
                />
                <p className="text-xs text-slate-500">
                  Add a link to redirect users to the original blog or post
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  {editingUpdate ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {sortedUpdates.map((update) => (
          <Card key={update.id} className="hover:shadow-md transition-shadow flex-shrink-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`text-xs ${getUpdateBadgeColor(update.type)}`}>
                  <span className="flex items-center gap-1">
                    {getUpdateIcon(update.type)}
                    {getUpdateTypeLabel(update.type)}
                  </span>
                </Badge>
                <span className="text-xs text-slate-500">{formatTimeAgo(update.createdAt)}</span>
              </div>
              <CardTitle className="text-sm line-clamp-2">{update.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs line-clamp-3 mb-3">
                {update.content}
              </CardDescription>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(update)}
                  className="h-7 text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(update.id)}
                  className="h-7 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {updates.length === 0 && (
        <Card className="flex-shrink-0">
          <CardContent className="text-center py-8">
            <p className="text-slate-500 text-sm">No updates yet. Add your first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
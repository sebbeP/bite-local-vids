// @ts-nocheck - Temporary: Types will update after migration

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Upload, MapPin, Tag, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RestaurantPostUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
}

const RestaurantPostUpload: React.FC<RestaurantPostUploadProps> = ({ 
  isOpen, 
  onClose, 
  onUploadComplete 
}) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [specialLabels, setSpecialLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const { toast } = useToast();

  const specialLabelOptions = [
    'Lunch Deal', 'Dinner Special', 'Vegan', 'Vegetarian', 'Gluten-Free', 
    'Organic', 'Local Sourced', 'Chef Special', 'New Item', 'Seasonal'
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'photo' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload media",
          variant: "destructive"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Create tags string from cuisine type, price range, and special labels
      const tags = [cuisineType, priceRange, ...specialLabels].filter(Boolean).join(', ');

      // Save to database with restaurant-specific metadata
      // @ts-ignore - Legacy table, types will update
      await supabase
        .from('media_uploads')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_type: fileType,
          caption: caption || null,
          restaurant_id: user.id // For restaurant owners, use their user_id as restaurant_id
        });

      toast({
        title: "Post Created!",
        description: `Your ${fileType} has been uploaded successfully!`
      });

      // Reset form
      setCaption('');
      setCuisineType('');
      setPriceRange('');
      setSpecialLabels([]);
      setNewLabel('');

      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const addSpecialLabel = () => {
    if (newLabel && !specialLabels.includes(newLabel)) {
      setSpecialLabels([...specialLabels, newLabel]);
      setNewLabel('');
    }
  };

  const removeSpecialLabel = (label: string) => {
    setSpecialLabels(specialLabels.filter(l => l !== label));
  };

  const addPredefinedLabel = (label: string) => {
    if (!specialLabels.includes(label)) {
      setSpecialLabels([...specialLabels, label]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption or Description
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your dish, event, or atmosphere..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                disabled={uploading}
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={uploading}
              >
                <option value="">Select cuisine type</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="American">American</option>
                <option value="French">French</option>
                <option value="Indian">Indian</option>
                <option value="Thai">Thai</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Korean">Korean</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={uploading}
              >
                <option value="">Select price range</option>
                <option value="$">$ - Budget Friendly</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Upscale</option>
                <option value="$$$$">$$$$ - Fine Dining</option>
              </select>
            </div>

            {/* Special Labels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Labels
              </label>
              
              {/* Quick add buttons for common labels */}
              <div className="flex flex-wrap gap-2 mb-3">
                {specialLabelOptions.map((label) => (
                  <button
                    key={label}
                    onClick={() => addPredefinedLabel(label)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      specialLabels.includes(label)
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={uploading}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Custom label input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add custom label..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  disabled={uploading}
                  onKeyPress={(e) => e.key === 'Enter' && addSpecialLabel()}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addSpecialLabel}
                  disabled={!newLabel || uploading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected labels */}
              {specialLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {specialLabels.map((label) => (
                    <span
                      key={label}
                      className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1"
                    >
                      {label}
                      <button
                        onClick={() => removeSpecialLabel(label)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                        disabled={uploading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="p-3 bg-gray-50 rounded-lg flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Location: Mama Rosa's Kitchen (Auto-tagged)</span>
            </div>

            {/* Upload Buttons */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 h-12"
                  disabled={uploading}
                >
                  <Camera className="h-5 w-5" />
                  Upload Photo
                </Button>
              </div>
              
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'video')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 h-12"
                  disabled={uploading}
                >
                  <Video className="h-5 w-5" />
                  Upload Video
                </Button>
              </div>
            </div>

            {uploading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
                <Upload className="h-4 w-4 animate-spin" />
                Creating your post...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPostUpload;

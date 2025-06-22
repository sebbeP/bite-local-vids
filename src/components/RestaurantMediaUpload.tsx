
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Upload, MapPin, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RestaurantMediaUploadProps {
  onUploadComplete?: (fileUrl: string, fileType: 'photo' | 'video') => void;
}

const RestaurantMediaUpload: React.FC<RestaurantMediaUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [contentType, setContentType] = useState('menu_item');
  const { toast } = useToast();

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

      // Save to database with restaurant-specific metadata
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
        title: "Upload Successful",
        description: `${fileType} uploaded successfully!`
      });

      // Reset form
      setCaption('');
      setTags('');
      setVisibility('public');
      setContentType('menu_item');

      onUploadComplete?.(publicUrl, fileType);
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

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="space-y-4">
        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption for your upload..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            disabled={uploading}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., pasta, italian, homemade"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={uploading}
          />
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={uploading}
          >
            <option value="menu_item">Menu Item</option>
            <option value="behind_scenes">Behind the Scenes</option>
            <option value="atmosphere">Restaurant Atmosphere</option>
            <option value="promotion">Promotion</option>
            <option value="team">Team</option>
          </select>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={uploading}
          >
            <option value="public">Public</option>
            <option value="promotion">Promotion</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Location Info */}
        <div className="p-3 bg-gray-50 rounded-lg flex items-center">
          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">Location: Mama Rosa's Kitchen (Auto-filled)</span>
        </div>
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
            className="w-full flex items-center gap-2"
            disabled={uploading}
          >
            <Camera className="h-4 w-4" />
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
            className="w-full flex items-center gap-2"
            disabled={uploading}
          >
            <Video className="h-4 w-4" />
            Upload Video
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
          <Upload className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
};

export default RestaurantMediaUpload;

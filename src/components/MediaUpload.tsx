// @ts-nocheck - Temporary: Types will update after migration

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Video, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  onUploadComplete?: (fileUrl: string, fileType: 'photo' | 'video') => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
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

      // Save to database
      // @ts-ignore - Legacy table, types will update
      await supabase
        .from('media_uploads')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_type: fileType
        });

      toast({
        title: "Upload Successful",
        description: `${fileType} uploaded successfully!`
      });

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
    <div className="flex gap-3">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'photo')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
          Photo
        </Button>
      </div>
      
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileUpload(e, 'video')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={uploading}
        >
          <Video className="h-4 w-4" />
          Video
        </Button>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Upload className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
};

export default MediaUpload;

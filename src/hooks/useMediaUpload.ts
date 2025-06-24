
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
}

interface MediaUploadOptions {
  onUploadComplete?: (fileUrl: string, fileType: 'photo' | 'video') => void;
  maxSizeMB?: number;
}

export const useMediaUpload = (options: MediaUploadOptions = {}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const { toast } = useToast();

  const uploadFile = async (
    file: File, 
    fileType: 'photo' | 'video',
    metadata?: {
      caption?: string;
      cuisineType?: string;
      priceRange?: string;
      specialLabels?: string[];
    }
  ) => {
    if (options.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File must be less than ${options.maxSizeMB}MB`,
        variant: "destructive"
      });
      return null;
    }

    setUploadProgress({ progress: 0, status: 'uploading' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to upload media",
          variant: "destructive"
        });
        return null;
      }

      // Create file path in storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      setUploadProgress({ progress: 30, status: 'uploading' });

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('restaurant-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress({ progress: 60, status: 'processing' });

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('restaurant-media')
        .getPublicUrl(fileName);

      setUploadProgress({ progress: 80, status: 'processing' });

      // Save to database
      const { error: dbError } = await supabase
        .from('media_uploads')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_type: fileType,
          caption: metadata?.caption || null,
          restaurant_id: user.id,
          storage_path: fileName
        });

      if (dbError) throw dbError;

      setUploadProgress({ progress: 100, status: 'complete' });

      toast({
        title: "Upload Successful!",
        description: `Your ${fileType} has been uploaded successfully!`
      });

      options.onUploadComplete?.(publicUrl, fileType);
      
      // Reset progress after a brief delay
      setTimeout(() => {
        setUploadProgress({ progress: 0, status: 'idle' });
      }, 2000);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ progress: 0, status: 'error' });
      
      toast({
        title: "Upload Failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
      
      return null;
    }
  };

  const deleteFile = async (fileId: string, storagePath?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Delete from storage if path exists
      if (storagePath) {
        await supabase.storage
          .from('restaurant-media')
          .remove([storagePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_uploads')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Media has been deleted successfully."
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete media. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
    isUploading: uploadProgress.status === 'uploading' || uploadProgress.status === 'processing'
  };
};

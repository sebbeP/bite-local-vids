
-- Create a storage bucket for restaurant media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-media', 'restaurant-media', true);

-- Create policies for the storage bucket to allow restaurant owners to upload files
CREATE POLICY "Restaurant owners can upload media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'restaurant-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to view uploaded media
CREATE POLICY "Public can view restaurant media" ON storage.objects
FOR SELECT USING (bucket_id = 'restaurant-media');

-- Allow restaurant owners to delete their own media
CREATE POLICY "Restaurant owners can delete their media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'restaurant-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add indexes to media_uploads table for better performance
CREATE INDEX IF NOT EXISTS idx_media_uploads_user_id ON media_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_restaurant_id ON media_uploads(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_created_at ON media_uploads(created_at DESC);

-- Add a column for storing the storage path (optional, for better file management)
ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS storage_path TEXT;

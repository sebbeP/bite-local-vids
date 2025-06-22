
-- Create table for user interactions (likes and saves)
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'save')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, restaurant_id, interaction_type)
);

-- Create table for media uploads
CREATE TABLE public.media_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  restaurant_id TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video')),
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user profiles
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_restaurant_owner BOOLEAN DEFAULT FALSE,
  business_name TEXT,
  business_description TEXT,
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_interactions
CREATE POLICY "Users can view their own interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own interactions" 
  ON public.user_interactions 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- RLS policies for media_uploads
CREATE POLICY "Users can view their own uploads" 
  ON public.media_uploads 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own uploads" 
  ON public.media_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own uploads" 
  ON public.media_uploads 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own uploads" 
  ON public.media_uploads 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Storage policies for media bucket
CREATE POLICY "Anyone can view media files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own media files" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'media' AND auth.uid()::text = owner::text);

CREATE POLICY "Users can delete their own media files" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'media' AND auth.uid()::text = owner::text);

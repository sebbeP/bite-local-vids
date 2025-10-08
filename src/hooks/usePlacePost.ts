// @ts-nocheck - Temporary: Types will update after migration
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlacePost {
  id: number;
  uid: string;
  placeid?: string;
  pid: string;
  createddate: string;
  postourl?: string;
  suspost?: boolean;
  public?: boolean;
  private?: boolean;
  friendsonly?: boolean;
  likes?: number;
  saved?: number;
  views?: number;
  posttype?: string;
  textcontent?: string;
  headercontent?: string;
  soundid?: string;
  tags?: any;
}

export const usePlacePost = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPost = async (postData: {
    uid: string;
    posttype: 'video' | 'picture' | 'text';
    textcontent?: string;
    headercontent?: string;
    postourl?: string;
    public?: boolean;
    tags?: string[];
  }) => {
    try {
      setLoading(true);
      const pid = crypto.randomUUID();
      
      // @ts-ignore - Types will update after migration
      const { data, error } = await supabase
        .from('"Place"."Post"')
        .insert({
          pid,
          uid: postData.uid,
          posttype: postData.posttype,
          textcontent: postData.textcontent,
          headercontent: postData.headercontent,
          postourl: postData.postourl,
          public: postData.public ?? true,
          private: false,
          friendsonly: false,
          likes: 0,
          saved: 0,
          views: 0,
          suspost: false,
          createddate: new Date().toISOString().split('T')[0],
          tags: postData.tags ? JSON.stringify(postData.tags) : null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Post created!',
        description: 'Your post has been published successfully.',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Failed to create post',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (filters?: {
    uid?: string;
    public?: boolean;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      // @ts-ignore - Types will update after migration
      let query = supabase
        .from('"Place"."Post"')
        .select('*')
        .order('createddate', { ascending: false });

      if (filters?.uid) {
        query = query.eq('uid', filters.uid);
      }

      if (filters?.public !== undefined) {
        query = query.eq('public', filters.public);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PlacePost[];
    } catch (error: any) {
      toast({
        title: 'Failed to load posts',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (pid: string, currentLikes: number) => {
    try {
      // @ts-ignore - Types will update after migration
      const { error } = await supabase
        .from('"Place"."Post"')
        .update({ likes: currentLikes + 1 })
        .eq('pid', pid);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Failed to like post',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const incrementViews = async (pid: string, currentViews: number) => {
    try {
      // @ts-ignore - Types will update after migration
      const { error} = await supabase
        .from('"Place"."Post"')
        .update({ views: currentViews + 1 })
        .eq('pid', pid);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  return {
    loading,
    createPost,
    getPosts,
    likePost,
    incrementViews,
  };
};

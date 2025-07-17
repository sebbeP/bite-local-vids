import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLikesAndSaves = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserLikesAndSaves();
  }, []);

  const loadUserLikesAndSaves = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load likes
      const { data: likes } = await supabase
        .from('likes')
        .select('media_id')
        .eq('user_id', user.id);

      // Load saves
      const { data: saves } = await supabase
        .from('saved_posts')
        .select('media_id')
        .eq('user_id', user.id);

      setLikedPosts(new Set(likes?.map(like => like.media_id) || []));
      setSavedPosts(new Set(saves?.map(save => save.media_id) || []));
    } catch (error) {
      console.error('Error loading likes and saves:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (mediaId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to like posts",
          variant: "destructive"
        });
        return;
      }

      const isLiked = likedPosts.has(mediaId);

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId);

        if (error) throw error;

        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(mediaId);
          return newSet;
        });
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            media_id: mediaId
          });

        if (error) throw error;

        setLikedPosts(prev => new Set([...prev, mediaId]));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const toggleSave = async (mediaId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save posts",
          variant: "destructive"
        });
        return;
      }

      const isSaved = savedPosts.has(mediaId);

      if (isSaved) {
        // Remove save
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId);

        if (error) throw error;

        setSavedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(mediaId);
          return newSet;
        });
      } else {
        // Add save
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: user.id,
            media_id: mediaId
          });

        if (error) throw error;

        setSavedPosts(prev => new Set([...prev, mediaId]));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      });
    }
  };

  return {
    likedPosts,
    savedPosts,
    loading,
    toggleLike,
    toggleSave,
    isLiked: (mediaId: string) => likedPosts.has(mediaId),
    isSaved: (mediaId: string) => savedPosts.has(mediaId)
  };
};
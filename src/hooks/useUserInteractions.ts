
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserInteractions = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const getLikedRestaurants = async () => {
    if (!userId) return [];
    
    const { data } = await supabase
      .from('user_interactions')
      .select('restaurant_id')
      .eq('user_id', userId)
      .eq('interaction_type', 'like');
    
    return data?.map(item => item.restaurant_id) || [];
  };

  const getSavedRestaurants = async () => {
    if (!userId) return [];
    
    const { data } = await supabase
      .from('user_interactions')
      .select('restaurant_id')
      .eq('user_id', userId)
      .eq('interaction_type', 'save');
    
    return data?.map(item => item.restaurant_id) || [];
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      // Load existing interactions when userId is set
      const loadInteractions = async () => {
        const [likedData, savedData] = await Promise.all([
          getLikedRestaurants(),
          getSavedRestaurants()
        ]);
        setLikedPosts(new Set(likedData));
        setSavedPosts(new Set(savedData));
      };
      loadInteractions();
    }
  }, [userId]);

  const toggleLike = async (restaurantId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like restaurants",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
        .eq('interaction_type', 'like')
        .single();

      if (existing) {
        // Remove like
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_id', userId)
          .eq('restaurant_id', restaurantId)
          .eq('interaction_type', 'like');
        return false;
      } else {
        // Add like
        await supabase
          .from('user_interactions')
          .insert({
            user_id: userId,
            restaurant_id: restaurantId,
            interaction_type: 'like'
          });
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleSave = async (restaurantId: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save restaurants",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check if already saved
      const { data: existing } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
        .eq('interaction_type', 'save')
        .single();

      if (existing) {
        // Remove save
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_id', userId)
          .eq('restaurant_id', restaurantId)
          .eq('interaction_type', 'save');
        return false;
      } else {
        // Add save
        await supabase
          .from('user_interactions')
          .insert({
            user_id: userId,
            restaurant_id: restaurantId,
            interaction_type: 'save'
          });
        return true;
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      });
      return false;
    }
  };


  const likePost = async (postId: string) => {
    const result = await toggleLike(postId);
    if (result) {
      setLikedPosts(prev => new Set([...prev, postId]));
    } else {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const savePost = async (postId: string) => {
    const result = await toggleSave(postId);
    if (result) {
      setSavedPosts(prev => new Set([...prev, postId]));
    } else {
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const isLiked = (postId: string) => likedPosts.has(postId);
  const isSaved = (postId: string) => savedPosts.has(postId);

  return {
    toggleLike,
    toggleSave,
    likePost,
    savePost,
    isLiked,
    isSaved,
    getLikedRestaurants,
    getSavedRestaurants,
    userId
  };
};

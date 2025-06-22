
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserInteractions = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

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

  return {
    toggleLike,
    toggleSave,
    getLikedRestaurants,
    getSavedRestaurants,
    userId
  };
};

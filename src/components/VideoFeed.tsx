import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MediaCard from './MediaCard';

const VideoFeed = () => {
  const [mediaUploads, setMediaUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Example restaurant data for demo/first-time users
  const exampleRestaurants = [
    {
      id: 'demo-1',
      file_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      file_type: 'photo',
      caption: 'Fresh wood-fired pizza straight from our oven! 🔥 Try our signature Margherita today',
      user_id: 'demo-restaurant-1',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      demo_profile: {
        name: 'Bella Vista Pizzeria',
        username: 'bellavista_pizza',
        avatar_url: null,
        business_name: 'Bella Vista Pizzeria',
        business_description: 'Authentic Italian pizza in the heart of Båstad'
      }
    },
    {
      id: 'demo-2',
      file_url: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop',
      file_type: 'photo',
      caption: 'Sunday brunch is back! Join us for fresh pastries and artisan coffee ☕️',
      user_id: 'demo-restaurant-2',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      demo_profile: {
        name: 'Seaside Café',
        username: 'seaside_cafe',
        avatar_url: null,
        business_name: 'Seaside Café',
        business_description: 'Cozy beachfront café serving fresh local ingredients'
      }
    },
    {
      id: 'demo-3',
      file_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      file_type: 'photo',
      caption: 'New Nordic menu launching this week! Book your table now 🌿',
      user_id: 'demo-restaurant-3',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      demo_profile: {
        name: 'Nordic Kitchen',
        username: 'nordic_kitchen',
        avatar_url: null,
        business_name: 'Nordic Kitchen',
        business_description: 'Modern Scandinavian cuisine with a sustainable twist'
      }
    },
    {
      id: 'demo-4',
      file_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      file_type: 'photo',
      caption: 'Handmade pasta daily! Tonight\'s special: truffle linguine 🍝',
      user_id: 'demo-restaurant-1',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      demo_profile: {
        name: 'Bella Vista Pizzeria',
        username: 'bellavista_pizza',
        avatar_url: null,
        business_name: 'Bella Vista Pizzeria',
        business_description: 'Authentic Italian pizza in the heart of Båstad'
      }
    },
    {
      id: 'demo-5',
      file_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
      file_type: 'photo',
      caption: 'Weekend special: locally caught fish with seasonal vegetables 🐟',
      user_id: 'demo-restaurant-2',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
      demo_profile: {
        name: 'Seaside Café',
        username: 'seaside_cafe',
        avatar_url: null,
        business_name: 'Seaside Café',
        business_description: 'Cozy beachfront café serving fresh local ingredients'
      }
    }
  ];

  useEffect(() => {
    loadMediaUploads();
  }, []);

  const loadMediaUploads = async () => {
    try {
      const { data } = await supabase
        .from('media_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      setMediaUploads(data || []);
    } catch (error) {
      console.error('Error loading media uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  // Show example restaurants if no real uploads exist
  const displayContent = mediaUploads.length > 0 ? mediaUploads : exampleRestaurants;

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="pt-4">
          {displayContent.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;

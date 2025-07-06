import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MediaCard from './MediaCard';

const VideoFeed = () => {
  const [mediaUploads, setMediaUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {mediaUploads.length > 0 ? (
          <div className="pt-4">
            {mediaUploads.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center text-center px-4">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No content yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your food discoveries!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoFeed;

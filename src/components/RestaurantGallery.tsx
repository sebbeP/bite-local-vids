import React, { useState, useEffect } from 'react';
import { Camera, Heart, MessageCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MediaPost {
  id: string;
  file_url: string;
  file_type: 'photo' | 'video';
  caption: string | null;
  created_at: string;
}

const RestaurantGallery: React.FC = () => {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure file_type matches our interface
      const typedPosts = (data || []).map(post => ({
        ...post,
        file_type: post.file_type as 'photo' | 'video'
      }));
      
      setPosts(typedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500">Start sharing your restaurant's story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Gallery</h3>
        <span className="text-sm text-gray-500">{posts.length} posts</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
              {post.file_type === 'photo' ? (
                <img
                  src={post.file_url}
                  alt={post.caption || 'Restaurant post'}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center relative">
                  <video
                    src={post.file_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {post.file_type}
              </div>
            </div>

            {post.caption && (
              <div className="p-3">
                <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
              </div>
            )}

            {/* Engagement placeholder */}
            <div className="px-3 pb-3 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {Math.floor(Math.random() * 500) + 50}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {Math.floor(Math.random() * 50) + 5}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {Math.floor(Math.random() * 20) + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantGallery;

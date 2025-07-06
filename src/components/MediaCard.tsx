import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MediaCardProps {
  media: {
    id: string;
    file_url: string;
    file_type: string;
    caption: string | null;
    user_id: string;
    created_at: string;
  };
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [media.user_id]);

  const loadUserProfile = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('name, username, avatar_url')
        .eq('user_id', media.user_id)
        .single();
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* User Header */}
      <div className="flex items-center p-4 pb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>
        <div className="ml-3 flex-1">
          <p className="font-semibold text-gray-900 text-sm">
            {userProfile?.name || 'User'}
          </p>
          <p className="text-gray-500 text-xs">
            @{userProfile?.username || 'username'}
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(media.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Media Content */}
      <div className="relative">
        {media.file_type === 'photo' ? (
          <img
            src={media.file_url}
            alt="User uploaded content"
            className="w-full h-80 object-cover"
          />
        ) : (
          <video
            src={media.file_url}
            className="w-full h-80 object-cover"
            controls
            playsInline
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">42</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm font-medium">12</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`${saved ? 'text-yellow-500' : 'text-gray-600'}`}
          >
            <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        {media.caption && (
          <div className="text-sm text-gray-900">
            <span className="font-semibold">@{userProfile?.username || 'username'}</span>{' '}
            {media.caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCard;
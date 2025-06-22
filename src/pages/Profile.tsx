
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MapPin, Settings, Camera, Share2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import MediaUpload from '@/components/MediaUpload';
import ProfileEdit from '@/components/ProfileEdit';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mediaUploads, setMediaUploads] = useState<any[]>([]);

  const savedRestaurants = [
    {
      id: '1',
      name: "Mama Rosa's Kitchen",
      cuisine: 'Italian',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      priceRange: '$$',
      distance: '0.3 mi'
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      cuisine: 'Japanese',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      priceRange: '$$$',
      distance: '0.7 mi'
    },
    {
      id: '3',
      name: 'Burger Paradise',
      cuisine: 'American',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      priceRange: '$',
      distance: '1.2 mi'
    }
  ];

  const likedRestaurants = [
    {
      id: '1',
      name: "Mama Rosa's Kitchen",
      cuisine: 'Italian',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      priceRange: '$$',
      distance: '0.3 mi'
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      cuisine: 'Japanese',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      priceRange: '$$$',
      distance: '0.7 mi'
    }
  ];

  useEffect(() => {
    loadUserProfile();
    loadMediaUploads();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadMediaUploads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('media_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setMediaUploads(data || []);
    } catch (error) {
      console.error('Error loading media uploads:', error);
    }
  };

  const handleUploadComplete = () => {
    loadMediaUploads(); // Refresh media uploads
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userProfile?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {userProfile?.name || 'Alex Johnson'}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">Brooklyn, NY</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span><strong>127</strong> places saved</span>
                <span><strong>89</strong> places visited</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">47</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{mediaUploads.filter(m => m.file_type === 'video').length}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">834</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <ProfileEdit />
            <Button variant="outline" className="flex-1 rounded-full font-semibold">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Upload Media</h3>
            <MediaUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'saved'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Bookmark className="h-5 w-5 mx-auto mb-1" />
              Saved
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'liked'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Heart className="h-5 w-5 mx-auto mb-1" />
              Liked
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'photos'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Camera className="h-5 w-5 mx-auto mb-1" />
              My Media
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Saved Places</h3>
              <span className="text-sm text-gray-500">{savedRestaurants.length} places</span>
            </div>
            
            {savedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⭐ {restaurant.rating}</span>
                        <span>•</span>
                        <span>{restaurant.priceRange}</span>
                        <span>•</span>
                        <span>{restaurant.distance}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Liked Places</h3>
              <span className="text-sm text-gray-500">{likedRestaurants.length} places</span>
            </div>
            
            {likedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⭐ {restaurant.rating}</span>
                        <span>•</span>
                        <span>{restaurant.priceRange}</span>
                        <span>•</span>
                        <span>{restaurant.distance}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Media</h3>
              <span className="text-sm text-gray-500">{mediaUploads.length} files</span>
            </div>
            
            {mediaUploads.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {mediaUploads.map((media) => (
                  <div key={media.id} className="relative bg-white rounded-xl overflow-hidden shadow-sm">
                    {media.file_type === 'photo' ? (
                      <img
                        src={media.file_url}
                        alt="Uploaded media"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {media.file_type}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No media yet</h3>
                <p className="text-gray-500">Upload photos and videos using the buttons above!</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

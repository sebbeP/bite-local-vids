
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MapPin, Settings, Camera, Share2, Edit3 } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('saved');

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

  return (
    <div className="min-h-screen bg-gray-50">
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
              A
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold text-gray-900">Alex Johnson</h2>
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
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">834</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-full">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1 rounded-full font-semibold">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
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
              My Food List
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
              My Photos
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
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No liked places yet</h3>
            <p className="text-gray-500">Start exploring and like your favorite spots!</p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-500">Share your food adventures with photos!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

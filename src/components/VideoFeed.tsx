
import React, { useState } from 'react';
import { Heart, Bookmark, Share2, Calendar, MapPin, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  video: string;
  thumbnail: string;
  likes: number;
  description: string;
  isLiked: boolean;
  isSaved: boolean;
  rating: number;
  priceRange: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mama Rosa\'s Kitchen',
    cuisine: 'Italian',
    distance: '0.3 mi',
    video: '/api/placeholder/400/600',
    thumbnail: '/api/placeholder/400/600',
    likes: 1247,
    description: 'Handmade pasta that melts in your mouth 🍝 Family recipes passed down 3 generations',
    isLiked: false,
    isSaved: false,
    rating: 4.8,
    priceRange: '$$'
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    cuisine: 'Japanese',
    distance: '0.7 mi',
    video: '/api/placeholder/400/600',
    thumbnail: '/api/placeholder/400/600',
    likes: 892,
    description: 'Fresh sashimi cut right in front of you 🍣 The chef trained in Tokyo for 10 years',
    isLiked: true,
    isSaved: false,
    rating: 4.9,
    priceRange: '$$$'
  },
  {
    id: '3',
    name: 'Burger Paradise',
    cuisine: 'American',
    distance: '1.2 mi',
    video: '/api/placeholder/400/600',
    thumbnail: '/api/placeholder/400/600',
    likes: 2156,
    description: 'Double smash burger with secret sauce 🍔 Viral TikTok sensation!',
    isLiked: false,
    isSaved: true,
    rating: 4.6,
    priceRange: '$'
  }
];

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleLike = (id: string) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isLiked: !restaurant.isLiked, likes: restaurant.isLiked ? restaurant.likes - 1 : restaurant.likes + 1 }
        : restaurant
    ));
  };

  const handleSave = (id: string) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isSaved: !restaurant.isSaved }
        : restaurant
    ));
  };

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentRestaurant = restaurants[currentIndex];

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center"
          style={{
            backgroundImage: `url(${currentRestaurant.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white border-none"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
      </Button>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">{currentRestaurant.distance}</span>
              <span className="text-sm text-white/70">•</span>
              <span className="text-sm text-white/70">{currentRestaurant.priceRange}</span>
              <span className="text-sm text-white/70">•</span>
              <span className="text-sm text-white/70">⭐ {currentRestaurant.rating}</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{currentRestaurant.name}</h2>
            <p className="text-sm text-white/80 mb-3">{currentRestaurant.cuisine}</p>
            <p className="text-sm leading-relaxed">{currentRestaurant.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full">
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full"
              onClick={() => handleLike(currentRestaurant.id)}
            >
              <Heart className={`h-6 w-6 ${currentRestaurant.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <span className="text-sm text-white/80 ml-1">{currentRestaurant.likes}</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
          onClick={() => handleSave(currentRestaurant.id)}
        >
          <Bookmark className={`h-6 w-6 ${currentRestaurant.isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Swipe Navigation */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-8 h-8 p-0"
          onClick={() => handleSwipe('down')}
          disabled={currentIndex === 0}
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-8 h-8 p-0"
          onClick={() => handleSwipe('up')}
          disabled={currentIndex === restaurants.length - 1}
        >
          ↓
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
        {restaurants.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Bookmark, Calendar, MapPin, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserInteractions } from '@/hooks/useUserInteractions';

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
  },
  {
    id: '4',
    name: 'Taco Libre',
    cuisine: 'Mexican',
    distance: '0.5 mi',
    video: '/api/placeholder/400/600',
    thumbnail: '/api/placeholder/400/600',
    likes: 1834,
    description: 'Authentic street tacos with abuela\'s recipes 🌮 Late night munchies sorted!',
    isLiked: false,
    isSaved: false,
    rating: 4.7,
    priceRange: '$'
  },
  {
    id: '5',
    name: 'The Noodle House',
    cuisine: 'Asian Fusion',
    distance: '0.8 mi',
    video: '/api/placeholder/400/600',
    thumbnail: '/api/placeholder/400/600',
    likes: 967,
    description: 'Hand-pulled noodles made fresh daily 🍜 Watch the master at work!',
    isLiked: true,
    isSaved: false,
    rating: 4.5,
    priceRange: '$$'
  }
];

const VideoFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedRestaurants, setLikedRestaurants] = useState<string[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const { toggleLike, toggleSave, getLikedRestaurants, getSavedRestaurants } = useUserInteractions();

  useEffect(() => {
    const loadUserInteractions = async () => {
      const liked = await getLikedRestaurants();
      const saved = await getSavedRestaurants();
      setLikedRestaurants(liked);
      setSavedRestaurants(saved);
    };
    loadUserInteractions();
  }, []);

  const handleLike = async (id: string) => {
    const isLiked = await toggleLike(id);
    
    // Update local state
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id 
        ? { 
            ...restaurant, 
            isLiked: isLiked,
            likes: isLiked ? restaurant.likes + 1 : restaurant.likes - 1
          }
        : restaurant
    ));

    // Update liked restaurants list
    if (isLiked) {
      setLikedRestaurants(prev => [...prev, id]);
    } else {
      setLikedRestaurants(prev => prev.filter(rid => rid !== id));
    }
  };

  const handleSave = async (id: string) => {
    const isSaved = await toggleSave(id);
    
    // Update local state
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isSaved: isSaved }
        : restaurant
    ));

    // Update saved restaurants list
    if (isSaved) {
      setSavedRestaurants(prev => [...prev, id]);
    } else {
      setSavedRestaurants(prev => prev.filter(rid => rid !== id));
    }
  };

  const handleNavigate = (restaurantName: string) => {
    const query = encodeURIComponent(restaurantName);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  const goToNext = () => {
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const endY = e.changedTouches[0].clientY;
    const deltaY = startY.current - endY;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Swiped up - go to next
        goToNext();
      } else {
        // Swiped down - go to previous
        goToPrevious();
      }
    }

    isDragging.current = false;
  };

  // Mouse wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const threshold = 10;
    
    if (e.deltaY > threshold) {
      goToNext();
    } else if (e.deltaY < -threshold) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const currentRestaurant = restaurants[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center transition-all duration-300"
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
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-full">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Actions - Vertical Stack */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-20">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
            onClick={() => handleLike(currentRestaurant.id)}
          >
            <Heart className={`h-6 w-6 ${likedRestaurants.includes(currentRestaurant.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-xs text-white/80 mt-1">{currentRestaurant.likes}</span>
        </div>
        
        {/* Save Button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
          onClick={() => handleSave(currentRestaurant.id)}
        >
          <Bookmark className={`h-5 w-5 ${savedRestaurants.includes(currentRestaurant.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>

        {/* Go There Button - Icon Only */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none rounded-full w-12 h-12 shadow-lg"
          onClick={() => handleNavigate(currentRestaurant.name)}
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      {/* Scroll Hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-center animate-bounce">
          <div className="text-xs">Swipe up for more</div>
          <div className="text-lg">↑</div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;

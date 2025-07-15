import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Phone, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  phone: string;
  menuUrl?: string;
  address: string;
  images: string[];
  description: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

// Mock data for nearby restaurants
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mama Rosa\'s Kitchen',
    cuisine: 'Italian',
    distance: '0.3 mi',
    phone: '+1234567890',
    menuUrl: 'https://example.com/menu',
    address: '123 Main St, City, State',
    images: ['/api/placeholder/400/600'],
    description: 'Authentic Italian cuisine with handmade pasta 🍝 Family recipes passed down 3 generations',
    likes: 1247,
    isLiked: false,
    isSaved: false
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    cuisine: 'Japanese',
    distance: '0.7 mi',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State',
    images: ['/api/placeholder/400/600'],
    description: 'Fresh sashimi cut right in front of you 🍣 The chef trained in Tokyo for 10 years',
    likes: 892,
    isLiked: true,
    isSaved: false
  },
  {
    id: '3',
    name: 'Burger Paradise',
    cuisine: 'American',
    distance: '1.2 mi',
    phone: '+1234567892',
    address: '789 Elm St, City, State',
    images: ['/api/placeholder/400/600'],
    description: 'Double smash burger with secret sauce 🍔 Viral TikTok sensation!',
    likes: 2156,
    isLiked: false,
    isSaved: true
  }
];

const HungryModeFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const currentRestaurant = restaurants[currentIndex];

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleLike = (id: string) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === id 
        ? { 
            ...restaurant, 
            isLiked: !restaurant.isLiked,
            likes: restaurant.isLiked ? restaurant.likes - 1 : restaurant.likes + 1
          }
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

  // Touch handlers for swipe navigation
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
        goToNext();
      } else {
        goToPrevious();
      }
    }

    isDragging.current = false;
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

  if (!currentRestaurant) {
    return (
      <div className="h-full flex items-center justify-center bg-black text-white">
        <p>No restaurants found nearby</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Restaurant Image/Video */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center"
          style={{
            backgroundImage: `url(${currentRestaurant.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="absolute bottom-0 left-0 right-20 p-6 text-white z-20">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-orange-400">{currentRestaurant.distance}</span>
            <span className="text-sm text-white/70">•</span>
            <span className="text-sm text-white/70">{currentRestaurant.cuisine}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{currentRestaurant.name}</h2>
          <p className="text-sm leading-relaxed mb-3">{currentRestaurant.description}</p>
          <p className="text-xs text-white/60">{currentRestaurant.address}</p>
        </div>
      </div>

      {/* Right Side Action Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-20">
        {/* Like */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
            onClick={() => handleLike(currentRestaurant.id)}
          >
            <Heart className={`h-5 w-5 ${currentRestaurant.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-xs text-white/80 mt-1">{currentRestaurant.likes}</span>
        </div>

        {/* Comment */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {/* Save */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
          onClick={() => handleSave(currentRestaurant.id)}
        >
          <Bookmark className={`h-5 w-5 ${currentRestaurant.isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>

        {/* Go There (Google Maps) */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full w-12 h-12"
          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(currentRestaurant.address)}`, '_blank')}
        >
          <MapPin className="h-5 w-5" />
        </Button>

        {/* Call Button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white border-none rounded-full w-12 h-12"
          onClick={() => handleCall(currentRestaurant.phone)}
        >
          <Phone className="h-5 w-5" />
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

export default HungryModeFeed;
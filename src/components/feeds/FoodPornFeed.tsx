import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FoodPost {
  id: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    isRestaurant: boolean;
  };
  restaurant?: {
    name: string;
    id: string;
    phone?: string;
    address?: string;
  };
  content: {
    video?: string;
    images: string[];
    description: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked: boolean;
  isSaved: boolean;
  isFollowed: boolean;
}

// Mock data for viral food content
const mockFoodPosts: FoodPost[] = [
  {
    id: '1',
    creator: {
      name: 'FoodieJenny',
      username: '@foodiejenny',
      avatar: '/api/placeholder/40/40',
      isRestaurant: false
    },
    restaurant: {
      name: 'Mama Rosa\'s Kitchen',
      id: 'restaurant_1',
      phone: '+1234567890',
      address: '123 Main St, City, State'
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'This pasta is absolutely INSANE! 🤤 The sauce is made from scratch daily and you can taste the difference! #PastaLover #MamaRosas'
    },
    stats: {
      likes: 15420,
      comments: 892,
      shares: 234
    },
    isLiked: false,
    isSaved: false,
    isFollowed: false
  },
  {
    id: '2',
    creator: {
      name: 'Sakura Sushi Bar',
      username: '@sakurasushi',
      avatar: '/api/placeholder/40/40',
      isRestaurant: true
    },
    restaurant: {
      name: 'Sakura Sushi Bar',
      id: 'restaurant_2',
      phone: '+1234567891',
      address: '456 Oak Ave, City, State'
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'Watch our master chef create art with every slice 🍣 Fresh tuna flown in daily from Japan! Come experience the difference.'
    },
    stats: {
      likes: 28450,
      comments: 1540,
      shares: 678
    },
    isLiked: true,
    isSaved: false,
    isFollowed: true
  },
  {
    id: '3',
    creator: {
      name: 'BurgerKing_NYC',
      username: '@burgerking_nyc',
      avatar: '/api/placeholder/40/40',
      isRestaurant: false
    },
    restaurant: {
      name: 'Burger Paradise',
      id: 'restaurant_3',
      phone: '+1234567892',
      address: '789 Elm St, City, State'
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'The messiest burger in NYC! 🍔 This double smash burger is worth the wait. Secret sauce recipe has been in the family for 20 years!'
    },
    stats: {
      likes: 42380,
      comments: 2105,
      shares: 891
    },
    isLiked: false,
    isSaved: true,
    isFollowed: false
  }
];

const FoodPornFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState(mockFoodPosts);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const currentPost = posts[currentIndex];

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            stats: {
              ...post.stats,
              likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1
            }
          }
        : post
    ));
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const goToNext = () => {
    if (currentIndex < posts.length - 1) {
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

  if (!currentPost) {
    return (
      <div className="h-full flex items-center justify-center bg-black text-white">
        <p>No posts available</p>
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
      {/* Content Image/Video */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center"
          style={{
            backgroundImage: `url(${currentPost.content.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Creator Info */}
      <div className="absolute top-20 left-4 right-20 z-20">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src={currentPost.creator.avatar} 
            alt={currentPost.creator.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{currentPost.creator.username}</span>
              {currentPost.creator.isRestaurant && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Restaurant</span>
              )}
            </div>
            {currentPost.restaurant && (
              <span className="text-orange-400 text-sm">@ {currentPost.restaurant.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Post Description */}
      <div className="absolute bottom-0 left-0 right-20 p-6 text-white z-20">
        <p className="text-sm leading-relaxed">{currentPost.content.description}</p>
      </div>

      {/* Right Side Action Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-20">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
            onClick={() => handleLike(currentPost.id)}
          >
            <Heart className={`h-5 w-5 ${currentPost.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-xs text-white/80 mt-1">{currentPost.stats.likes}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <span className="text-xs text-white/80 mt-1">{currentPost.stats.comments}</span>
        </div>

        {/* Save Button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
          onClick={() => handleSave(currentPost.id)}
        >
          <Bookmark className={`h-5 w-5 ${currentPost.isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </Button>

        {/* Go There (Google Maps) */}
        {currentPost.restaurant?.address && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full w-12 h-12"
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(currentPost.restaurant!.address!)}`, '_blank')}
          >
            <MapPin className="h-5 w-5" />
          </Button>
        )}

        {/* Call Button */}
        {currentPost.restaurant?.phone && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-green-500 hover:bg-green-600 text-white border-none rounded-full w-12 h-12"
            onClick={() => handleCall(currentPost.restaurant?.phone)}
          >
            <Phone className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Scroll Hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-center animate-bounce">
          <div className="text-xs">Swipe up for more viral content</div>
          <div className="text-lg">↑</div>
        </div>
      )}
    </div>
  );
};

export default FoodPornFeed;
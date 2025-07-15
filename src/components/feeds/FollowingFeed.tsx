import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FollowingPost {
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
  timePosted: string;
}

// Mock data for posts from followed accounts
const mockFollowingPosts: FollowingPost[] = [
  {
    id: '1',
    creator: {
      name: 'ChefMario',
      username: '@chefmario',
      avatar: '/api/placeholder/40/40',
      isRestaurant: false
    },
    restaurant: {
      name: 'Mama Rosa\'s Kitchen',
      id: 'restaurant_1'
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'Behind the scenes: Making our famous carbonara! 👨‍🍳 The secret is in the timing and fresh pecorino romano cheese. #BehindTheScenes #Carbonara'
    },
    stats: {
      likes: 3240,
      comments: 156,
      shares: 89
    },
    isLiked: true,
    isSaved: false,
    timePosted: '2h ago'
  },
  {
    id: '2',
    creator: {
      name: 'The Local Spot',
      username: '@thelocalspot',
      avatar: '/api/placeholder/40/40',
      isRestaurant: true
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'New menu item alert! 🚨 Introducing our Korean BBQ Tacos - fusion at its finest! Available this week only. Who\'s coming to try them?'
    },
    stats: {
      likes: 1890,
      comments: 234,
      shares: 67
    },
    isLiked: false,
    isSaved: true,
    timePosted: '4h ago'
  },
  {
    id: '3',
    creator: {
      name: 'FoodCritic_Jane',
      username: '@foodcritic_jane',
      avatar: '/api/placeholder/40/40',
      isRestaurant: false
    },
    restaurant: {
      name: 'Fine Dining Experience',
      id: 'restaurant_5'
    },
    content: {
      images: ['/api/placeholder/400/600'],
      description: 'This 7-course tasting menu was absolutely phenomenal! 🌟 Each dish told a story and the plating was pure art. Definitely worth the splurge for special occasions!'
    },
    stats: {
      likes: 956,
      comments: 78,
      shares: 34
    },
    isLiked: false,
    isSaved: false,
    timePosted: '6h ago'
  }
];

const FollowingFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState(mockFollowingPosts);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this post from ${currentPost.creator.name}`,
        text: currentPost.content.description,
        url: window.location.href,
      });
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
        <div className="text-center">
          <p className="text-lg mb-2">No posts from followed accounts</p>
          <p className="text-sm text-white/60">Follow some restaurants and creators to see their latest posts here!</p>
        </div>
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
              <span className="text-white/60 text-sm">• {currentPost.timePosted}</span>
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
            <Heart className={`h-6 w-6 ${currentPost.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
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
            <MessageCircle className="h-6 w-6" />
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

        {/* Share */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
            onClick={handleShare}
          >
            <Share className="h-5 w-5" />
          </Button>
          <span className="text-xs text-white/80 mt-1">{currentPost.stats.shares}</span>
        </div>

        {/* Three Dots Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full w-12 h-12"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
            <DropdownMenuItem className="hover:bg-white/10">
              Unfollow
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10">
              Hide
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scroll Hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-center animate-bounce">
          <div className="text-xs">Swipe up for more from your follows</div>
          <div className="text-lg">↑</div>
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;
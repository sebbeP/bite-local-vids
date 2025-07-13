import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TikTokPost {
  id: string;
  file_url: string;
  file_type: string;
  caption: string;
  restaurant_name: string;
  username: string;
  location?: string;
  likes: number;
  comments: number;
  profile_image?: string;
  is_demo?: boolean;
}

const TikTokFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();

  // Demo restaurant posts with vertical content
  const demoPosts: TikTokPost[] = [
    {
      id: 'demo-1',
      file_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=1200&fit=crop',
      file_type: 'photo',
      caption: '🔥 Our famous truffle pasta is back! Limited time only',
      restaurant_name: 'Bella Vista Pizzeria',
      username: 'bellavista_pizza',
      location: 'Båstad, Sweden',
      likes: 847,
      comments: 23,
      is_demo: true
    },
    {
      id: 'demo-2',
      file_url: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=1200&fit=crop',
      file_type: 'photo',
      caption: '☕️ Sunday brunch vibes! Fresh pastries made daily',
      restaurant_name: 'Seaside Café',
      username: 'seaside_cafe',
      location: 'Båstad Harbor',
      likes: 1240,
      comments: 67,
      is_demo: true
    },
    {
      id: 'demo-3',
      file_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=1200&fit=crop',
      file_type: 'photo',
      caption: '🌿 New Nordic menu launching this week! Book now',
      restaurant_name: 'Nordic Kitchen',
      username: 'nordic_kitchen',
      location: 'Central Båstad',
      likes: 567,
      comments: 34,
      is_demo: true
    },
    {
      id: 'demo-4',
      file_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=1200&fit=crop',
      file_type: 'photo',
      caption: '🍝 Handmade pasta daily! Tonight special: linguine',
      restaurant_name: 'Bella Vista Pizzeria',
      username: 'bellavista_pizza',
      location: 'Båstad, Sweden',
      likes: 923,
      comments: 45,
      is_demo: true
    },
    {
      id: 'demo-5',
      file_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=1200&fit=crop',
      file_type: 'photo',
      caption: '🐟 Fresh catch of the day with seasonal vegetables',
      restaurant_name: 'Seaside Café',
      username: 'seaside_cafe',
      location: 'Båstad Harbor',
      likes: 1150,
      comments: 89,
      is_demo: true
    }
  ];

  // Handle scroll to change posts
  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < demoPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Handle touch events for mobile
  const [touchStartY, setTouchStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0 && currentIndex < demoPosts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleLike = (postId: string) => {
    setLiked(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleProfileClick = (username: string) => {
    // For demo purposes, show an alert. In real app, navigate to restaurant profile
    alert(`Navigate to @${username} profile`);
  };

  const currentPost = demoPosts[currentIndex];

  return (
    <div 
      className="h-screen w-full bg-black relative overflow-hidden"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Content */}
      <div className="absolute inset-0">
        {currentPost.file_type === 'photo' ? (
          <img
            src={currentPost.file_url}
            alt="Restaurant content"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={(el) => (videoRefs.current[currentIndex] = el)}
            src={currentPost.file_url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        )}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        {/* Bottom Left - Restaurant Info */}
        <div className="absolute bottom-20 left-4 text-white max-w-72">
          <h3 className="text-lg font-bold mb-2">{currentPost.restaurant_name}</h3>
          <p className="text-sm mb-2 opacity-90">{currentPost.caption}</p>
          {currentPost.location && (
            <p className="text-xs opacity-75">📍 {currentPost.location}</p>
          )}
        </div>

        {/* Right Side - Controls */}
        <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6">
          {/* Profile Image */}
          <button
            onClick={() => handleProfileClick(currentPost.username)}
            className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold hover:scale-110 transition-transform"
          >
            {currentPost.restaurant_name.charAt(0)}
          </button>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleLike(currentPost.id)}
              className={`p-3 rounded-full transition-colors ${
                liked[currentPost.id] ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart 
                className={`h-7 w-7 ${liked[currentPost.id] ? 'fill-current' : ''}`} 
              />
            </button>
            <span className="text-white text-xs mt-1">
              {liked[currentPost.id] ? currentPost.likes + 1 : currentPost.likes}
            </span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <button className="p-3 rounded-full text-white">
              <MessageCircle className="h-7 w-7" />
            </button>
            <span className="text-white text-xs mt-1">{currentPost.comments}</span>
          </div>

          {/* Share Button */}
          <button className="p-3 rounded-full text-white">
            <Share2 className="h-7 w-7" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {demoPosts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Swipe Hint */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
          Swipe up/down to navigate
        </div>
      </div>
    </div>
  );
};

export default TikTokFeed;
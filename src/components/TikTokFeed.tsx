import React, { useState, useEffect, useRef } from 'react';
import { Heart, Bookmark, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserInteractions } from '@/hooks/useUserInteractions';

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
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const navigate = useNavigate();
  const { likePost, savePost, isLiked, isSaved } = useUserInteractions();

  // No demo posts - show empty state
  const demoPosts: TikTokPost[] = [];

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

  const handleLike = async (postId: string) => {
    await likePost(postId);
  };

  const handleSave = async (postId: string) => {
    await savePost(postId);
  };

  const handleGoThere = (location: string) => {
    // Open Google Maps with navigation to the restaurant
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleProfileClick = (username: string) => {
    // For demo purposes, show an alert. In real app, navigate to restaurant profile
    alert(`Navigate to @${username} profile`);
  };

  // Early return must come after all hooks
  if (demoPosts.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-gray-400">Follow some restaurants to see their content here</p>
        </div>
      </div>
    );
  }

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
        <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4">
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
                isLiked(currentPost.id) ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart 
                className={`h-6 w-6 ${isLiked(currentPost.id) ? 'fill-current' : ''}`} 
              />
            </button>
            <span className="text-white text-xs mt-1">
              {isLiked(currentPost.id) ? currentPost.likes + 1 : currentPost.likes}
            </span>
          </div>

          {/* Save Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleSave(currentPost.id)}
              className={`p-3 rounded-full transition-colors ${
                isSaved(currentPost.id) ? 'text-yellow-400' : 'text-white'
              }`}
            >
              <Bookmark 
                className={`h-6 w-6 ${isSaved(currentPost.id) ? 'fill-current' : ''}`} 
              />
            </button>
          </div>

          {/* Go There Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleGoThere(currentPost.location || currentPost.restaurant_name)}
              className="p-2 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white hover:scale-110 transition-transform"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
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
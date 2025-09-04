// ============================================
// PROFILE PAGE COMPONENT - JavaScript Version  
// ============================================
// This component handles user profile display and management
// Organized by functionality: Profile Display, Media Management, Tab Navigation

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MapPin, Settings, Camera, Share2 } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import MediaUpload from '@/components/MediaUpload';
import ProfileEdit from '@/components/ProfileEdit';

// ============================================
// PROFILE MANAGEMENT & USER DATA
// ============================================

const Profile = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // UI State - Controls which tab is currently active
  const [activeTab, setActiveTab] = useState('myfoodporn');
  
  // User Data State - Stores user profile information from C# backend
  const [userProfile, setUserProfile] = useState(null);
  
  // Media State - Stores user's uploaded media content
  const [mediaUploads, setMediaUploads] = useState([]);

  // ============================================
  // MOCK DATA - Replace with C# API calls
  // ============================================
  
  // Mock saved restaurants data - to be fetched from C# backend
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

  // Mock liked restaurants data - to be fetched from C# backend
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

  // ============================================
  // COMPONENT LIFECYCLE & DATA LOADING
  // ============================================
  
  useEffect(() => {
    // Initialize component data when component mounts
    loadUserProfile();
    loadMediaUploads();
  }, []);

  // ============================================
  // USER PROFILE API FUNCTIONS - C# Backend Integration
  // ============================================
  
  /**
   * Loads user profile data from C# backend
   * TODO: Replace Supabase calls with C# API endpoints
   */
  const loadUserProfile = async () => {
    try {
      // TODO: Replace with C# API call
      // const response = await fetch('/api/user/profile', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const userData = await response.json();
      
      // Temporary mock data until C# backend is ready
      const mockUserData = {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        location: 'Brooklyn, NY'
      };
      
      setUserProfile(mockUserData);
    } catch (error) {
      console.error('Error loading profile:', error);
      // TODO: Add proper error handling for C# API calls
    }
  };

  /**
   * Loads user's media uploads from C# backend
   * TODO: Replace Supabase calls with C# API endpoints
   */
  const loadMediaUploads = async () => {
    try {
      // TODO: Replace with C# API call
      // const response = await fetch('/api/user/media', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const mediaData = await response.json();
      
      // Temporary empty array until C# backend is ready
      setMediaUploads([]);
    } catch (error) {
      console.error('Error loading media uploads:', error);
      // TODO: Add proper error handling for C# API calls
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  /**
   * Handles successful media upload completion
   * Refreshes the media uploads list
   */
  const handleUploadComplete = () => {
    loadMediaUploads(); // Refresh media uploads from C# backend
  };

  // ============================================
  // RENDER COMPONENT
  // ============================================
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* ============================================ */}
      {/* PROFILE HEADER SECTION */}
      {/* ============================================ */}
      
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto p-6">
          
          {/* Header with Settings Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            {/* TODO: Connect to C# backend settings API */}
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </div>

          {/* ============================================ */}
          {/* USER INFORMATION DISPLAY */}
          {/* ============================================ */}
          
          <div className="flex items-center mb-6">
            {/* User Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userProfile?.name?.charAt(0) || 'A'}
            </div>
            
            {/* User Details */}
            <div className="ml-4 flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {userProfile?.name || 'Alex Johnson'}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">Brooklyn, NY</span>
              </div>
              {/* TODO: Connect to C# backend for real stats */}
              <div className="flex gap-4 text-sm">
                <span><strong>127</strong> places saved</span>
                <span><strong>89</strong> places visited</span>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* USER STATISTICS */}
          {/* ============================================ */}
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">47</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 text-center">
              {/* Count video uploads from media data */}
              <div className="text-2xl font-bold text-red-600">
                {mediaUploads.filter(m => m.file_type === 'video').length}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">834</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>

          {/* ============================================ */}
          {/* ACTION BUTTONS */}
          {/* ============================================ */}
          
          <div className="flex gap-3 mb-6">
            {/* Profile Edit Button - TODO: Connect to C# backend */}
            <ProfileEdit />
            
            {/* Share Profile Button */}
            <Button variant="outline" className="flex-1 rounded-full font-semibold">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* ============================================ */}
          {/* MEDIA UPLOAD SECTION */}
          {/* ============================================ */}
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Upload Media</h3>
            {/* TODO: Update MediaUpload component to use C# backend */}
            <MediaUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PROFILE NAVIGATION TABS */}
      {/* ============================================ */}
      
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex">
            
            {/* My Food Porn Tab */}
            <button
              onClick={() => setActiveTab('myfoodporn')}
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'myfoodporn'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Camera className="h-5 w-5 mx-auto mb-1" />
              My Food Porn
            </button>
            
            {/* My Favourites Tab */}
            <button
              onClick={() => setActiveTab('favourites')}
              className={`flex-1 py-4 text-center font-semibold ${
                activeTab === 'favourites'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Heart className="h-5 w-5 mx-auto mb-1" />
              My Favourites
            </button>
            
            {/* Saved Posts Tab */}
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
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TAB CONTENT SECTIONS */}
      {/* ============================================ */}
      
      <div className="max-w-md mx-auto p-4">
        
        {/* ============================================ */}
        {/* MY FOOD PORN TAB - User's Own Posts */}
        {/* ============================================ */}
        
        {activeTab === 'myfoodporn' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Food Porn</h3>
              <span className="text-sm text-gray-500">{mediaUploads.length} posts</span>
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
              /* Empty State */
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500">Upload photos and videos to share!</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* MY FAVOURITES TAB - Liked Posts */}
        {/* ============================================ */}
        
        {activeTab === 'favourites' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Favourites</h3>
              <span className="text-sm text-gray-500">{likedRestaurants.length} places</span>
            </div>
            
            {/* TODO: Connect to C# backend API for liked posts */}
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
                      {/* TODO: Connect unlike functionality to C# backend */}
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

        {/* ============================================ */}
        {/* SAVED POSTS TAB - Manually Saved Content */}
        {/* ============================================ */}
        
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Saved Posts</h3>
              <span className="text-sm text-gray-500">{savedRestaurants.length} places</span>
            </div>
            
            {/* TODO: Connect to C# backend API for saved posts */}
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
                      {/* TODO: Connect unsave functionality to C# backend */}
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
      </div>

      {/* ============================================ */}
      {/* BOTTOM NAVIGATION */}
      {/* ============================================ */}
      
      <BottomNav />
    </div>
  );
};

export default Profile;
// ============================================
// MAIN FEED COMPONENT - JavaScript Version
// ============================================
// This component manages the main feed interface with tab navigation
// Organized by functionality: Tab Navigation, Feed Display, Post Creation

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HungryModeFeed from './feeds/HungryModeFeed';
import FoodPornFeed from './feeds/FoodPornFeed';
import FollowingFeed from './feeds/FollowingFeed';

// ============================================
// MAIN FEED NAVIGATION & CONTENT MANAGEMENT
// ============================================

const MainFeed = () => {
  
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Tab State - Controls which feed is currently active
  // Options: 'following', 'foodporn', 'hungry'
  const [activeTab, setActiveTab] = useState('following');

  // ============================================
  // EVENT HANDLERS - Tab Navigation
  // ============================================
  
  /**
   * Handles tab switching for different feed types
   * @param {string} tabName - Name of the tab to switch to
   */
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  /**
   * Handles post creation button click
   * TODO: Connect to C# backend for post upload functionality
   */
  const handlePostClick = () => {
    // TODO: Open post creation modal/screen
    // TODO: Connect to C# API for media upload
    console.log('Post button clicked - TODO: Connect to C# backend');
  };

  // ============================================
  // RENDER MAIN FEED INTERFACE
  // ============================================
  
  return (
    <div className="h-screen bg-black">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        
        {/* ============================================ */}
        {/* TOP NAVIGATION BAR */}
        {/* ============================================ */}
        
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex justify-center items-center relative">
            
            {/* ============================================ */}
            {/* CENTERED TAB MENU */}
            {/* ============================================ */}
            
            <div className="flex space-x-8">
              
              {/* Following Feed Tab */}
              <button
                onClick={() => handleTabChange('following')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'following' ? 'text-white' : 'text-white/60'
                }`}
              >
                Following
              </button>
              
              {/* Food Porn Feed Tab */}
              <button
                onClick={() => handleTabChange('foodporn')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'foodporn' ? 'text-white' : 'text-white/60'
                }`}
              >
                Food Porn
              </button>
              
              {/* Hungry Mode Feed Tab */}
              <button
                onClick={() => handleTabChange('hungry')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'hungry' ? 'text-white' : 'text-white/60'
                }`}
              >
                Hungry Mode
              </button>
            </div>
            
            {/* ============================================ */}
            {/* POST CREATION BUTTON */}
            {/* ============================================ */}
            
            {/* TikTok/Instagram style post button */}
            <button 
              onClick={handlePostClick}
              className="absolute right-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* FEED CONTENT SECTIONS */}
        {/* ============================================ */}

        {/* ============================================ */}
        {/* FOLLOWING FEED - Posts from Followed Users */}
        {/* ============================================ */}
        
        <TabsContent value="following" className="h-full mt-0">
          {/* TODO: Connect FollowingFeed to C# backend for followed users' posts */}
          <FollowingFeed />
        </TabsContent>
        
        {/* ============================================ */}
        {/* FOOD PORN FEED - All Food Content */}
        {/* ============================================ */}
        
        <TabsContent value="foodporn" className="h-full mt-0">
          {/* TODO: Connect FoodPornFeed to C# backend for all food posts */}
          <FoodPornFeed />
        </TabsContent>
        
        {/* ============================================ */}
        {/* HUNGRY MODE FEED - Restaurant Promotions */}
        {/* ============================================ */}
        
        <TabsContent value="hungry" className="h-full mt-0">
          {/* TODO: Connect HungryModeFeed to C# backend for restaurant content */}
          <HungryModeFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainFeed;
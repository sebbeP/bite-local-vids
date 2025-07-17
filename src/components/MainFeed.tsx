import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HungryModeFeed from './feeds/HungryModeFeed';
import FoodPornFeed from './feeds/FoodPornFeed';
import FollowingFeed from './feeds/FollowingFeed';
import PostUpload from './PostUpload';

const MainFeed = () => {
  const [activeTab, setActiveTab] = useState('following');

  return (
    <div className="h-screen bg-black">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Top Tab Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex justify-center items-center relative">
            {/* Centered Tab Menu */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('following')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'following' ? 'text-white' : 'text-white/60'
                }`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab('foodporn')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'foodporn' ? 'text-white' : 'text-white/60'
                }`}
              >
                Food Porn
              </button>
              <button
                onClick={() => setActiveTab('hungry')}
                className={`text-sm font-medium transition-colors ${
                  activeTab === 'hungry' ? 'text-white' : 'text-white/60'
                }`}
              >
                Hungry Mode
              </button>
            </div>
            
            {/* Post Button */}
            <PostUpload>
              <button className="absolute right-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </PostUpload>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="following" className="h-full mt-0">
          <FollowingFeed />
        </TabsContent>
        
        <TabsContent value="foodporn" className="h-full mt-0">
          <FoodPornFeed />
        </TabsContent>
        
        <TabsContent value="hungry" className="h-full mt-0">
          <HungryModeFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainFeed;
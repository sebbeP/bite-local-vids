import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HungryModeFeed from './feeds/HungryModeFeed';
import FoodPornFeed from './feeds/FoodPornFeed';
import FollowingFeed from './feeds/FollowingFeed';

const MainFeed = () => {
  const [activeTab, setActiveTab] = useState('hungry');

  return (
    <div className="h-screen bg-black">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        {/* Top Tab Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('hungry')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'hungry' ? 'text-white' : 'text-white/60'
              }`}
            >
              For You
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
              onClick={() => setActiveTab('following')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'following' ? 'text-white' : 'text-white/60'
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="hungry" className="h-full mt-0">
          <HungryModeFeed />
        </TabsContent>
        
        <TabsContent value="foodporn" className="h-full mt-0">
          <FoodPornFeed />
        </TabsContent>
        
        <TabsContent value="following" className="h-full mt-0">
          <FollowingFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainFeed;
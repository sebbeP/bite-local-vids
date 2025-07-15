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
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-md border border-white/10">
            <TabsTrigger 
              value="hungry" 
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              🍽️ Hungry Mode
            </TabsTrigger>
            <TabsTrigger 
              value="foodporn" 
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              🔥 For You
            </TabsTrigger>
            <TabsTrigger 
              value="following" 
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              👤 Following
            </TabsTrigger>
          </TabsList>
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
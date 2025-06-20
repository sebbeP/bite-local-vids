
import React from 'react';
import VideoFeed from '@/components/VideoFeed';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <VideoFeed />
      <BottomNav />
    </div>
  );
};

export default Index;

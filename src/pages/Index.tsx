
import React from 'react';
import VideoFeed from '@/components/VideoFeed';
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <VideoFeed />
      <AppHeader />
      <BottomNav />
    </div>
  );
};

export default Index;

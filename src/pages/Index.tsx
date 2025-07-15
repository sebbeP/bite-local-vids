
import React from 'react';
import MainFeed from '@/components/MainFeed';
import BottomNav from '@/components/BottomNav';

const Index = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <MainFeed />
      <BottomNav />
    </div>
  );
};

export default Index;


import React from 'react';
import { Home, Compass, Heart, Bookmark, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-around py-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-orange-400 hover:bg-white/10 border-none rounded-full"
          onClick={() => navigate('/feed')}
        >
          <Home className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full"
        >
          <Compass className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full"
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full"
        >
          <Bookmark className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full"
          onClick={() => navigate('/profile')}
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default BottomNav;

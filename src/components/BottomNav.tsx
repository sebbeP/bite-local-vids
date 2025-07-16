
import React from 'react';
import { Home, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10">
      <div className="flex items-center justify-center py-3 max-w-md mx-auto relative">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full absolute left-8"
          onClick={() => navigate('/search')}
        >
          <Search className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="text-orange-400 hover:bg-white/10 border-none rounded-full px-6 py-3"
          onClick={() => navigate('/feed')}
        >
          <Home className="h-8 w-8" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border-none rounded-full absolute right-8"
          onClick={() => navigate('/profile')}
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default BottomNav;

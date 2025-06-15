
import React from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppHeader = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/50 to-transparent">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-medium">Brooklyn, NY</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 border-none rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 border-none rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ChefHat, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'consumer' | 'restaurant' | null>(null);

  const handleUserTypeSelect = (type: 'consumer' | 'restaurant') => {
    setUserType(type);
    // Store user type in localStorage to use after authentication
    localStorage.setItem('selectedUserType', type);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-6 backdrop-blur-sm">
              <Sparkles className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Bite</h1>
          <p className="text-xl text-white/90 mb-8">
            Discover amazing food around you through addictive short videos
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => handleUserTypeSelect('consumer')}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-6 rounded-2xl text-lg backdrop-blur-sm border border-white/20"
          >
            <Heart className="h-6 w-6 mr-3" />
            I'm Hungry 😋
          </Button>
          
          <Button
            onClick={() => handleUserTypeSelect('restaurant')}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-6 rounded-2xl text-lg backdrop-blur-sm border border-white/20"
          >
            <ChefHat className="h-6 w-6 mr-3" />
            I Run a Place 👨‍🍳
          </Button>
        </div>

        <p className="text-white/70 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Welcome;

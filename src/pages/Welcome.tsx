
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ChefHat, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [userType, setUserType] = useState<'consumer' | 'restaurant' | null>(null);

  const handleUserTypeSelect = (type: 'consumer' | 'restaurant') => {
    setUserType(type);
    setShowAuthOptions(true);
  };

  const handleAuth = (method: string) => {
    if (userType === 'consumer') {
      navigate('/onboarding/consumer');
    } else {
      navigate('/onboarding/restaurant');
    }
  };

  if (showAuthOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {userType === 'consumer' ? (
                <Heart className="h-16 w-16 text-red-500" />
              ) : (
                <ChefHat className="h-16 w-16 text-orange-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {userType === 'consumer' ? "Let's find your next meal!" : "Share your culinary story!"}
            </h2>
            <p className="text-gray-600">
              {userType === 'consumer' 
                ? "Join thousands discovering amazing local spots" 
                : "Connect with food lovers in your area"
              }
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => handleAuth('phone')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full text-lg"
            >
              Continue with Phone
            </Button>
            
            <Button 
              onClick={() => handleAuth('email')}
              variant="outline"
              className="w-full border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-semibold py-4 rounded-full text-lg"
            >
              Continue with Email
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Button 
              onClick={() => handleAuth('google')}
              variant="outline"
              className="w-full border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-semibold py-4 rounded-full text-lg"
            >
              Continue with Google
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowAuthOptions(false)}
            className="w-full mt-6 text-gray-500 hover:text-gray-700"
          >
            ← Back to options
          </Button>
        </div>
      </div>
    );
  }

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

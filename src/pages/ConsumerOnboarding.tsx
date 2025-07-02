import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const cuisineOptions = [
  { id: 'italian', name: 'Italian', emoji: '🍝' },
  { id: 'japanese', name: 'Japanese', emoji: '🍣' },
  { id: 'mexican', name: 'Mexican', emoji: '🌮' },
  { id: 'chinese', name: 'Chinese', emoji: '🥟' },
  { id: 'american', name: 'American', emoji: '🍔' },
  { id: 'indian', name: 'Indian', emoji: '🍛' },
  { id: 'thai', name: 'Thai', emoji: '🍜' },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🥙' },
];

const priceRanges = [
  { id: 'low', name: 'Budget-friendly', emoji: '💸', description: 'Under $15' },
  { id: 'medium', name: 'Mid-range', emoji: '💰', description: '$15-30' },
  { id: 'high', name: 'Fine dining', emoji: '💎', description: '$30+' },
];

const dietaryOptions = [
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🥗' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', name: 'Gluten-free', emoji: '🌾' },
  { id: 'halal', name: 'Halal', emoji: '🕌' },
  { id: 'kosher', name: 'Kosher', emoji: '✡️' },
];

const ConsumerOnboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const toggleSelection = (id: string, currentList: string[], setter: (list: string[]) => void) => {
    if (currentList.includes(id)) {
      setter(currentList.filter(item => item !== id));
    } else {
      setter([...currentList, id]);
    }
  };

  const savePreferences = async (locationData?: { lat: number; lng: number; address?: string }) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const preferences = {
        cuisines: selectedCuisines,
        priceRanges: selectedPriceRanges,
        dietary: selectedDietary
      };

      const updateData: any = {
        preferences,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      if (locationData) {
        updateData.latitude = locationData.lat;
        updateData.longitude = locationData.lng;
        updateData.location_address = locationData.address;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Preferences Saved!",
        description: "Your food preferences have been saved successfully."
      });

      navigate('/feed');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get readable address using reverse geocoding
          let address = '';
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            address = data.city && data.principalSubdivision 
              ? `${data.city}, ${data.principalSubdivision}` 
              : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          } catch (error) {
            console.log('Geocoding failed, using coordinates');
            address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          savePreferences({ lat: latitude, lng: longitude, address });
        },
        (error) => {
          console.log('Location access denied:', error);
          toast({
            title: "Location Access Denied",
            description: "You can still use the app, but we won't be able to show location-based recommendations.",
            variant: "destructive"
          });
          savePreferences();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      savePreferences();
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What makes you hungry?</h2>
            <p className="text-gray-600">Pick 2-3 cuisines you love (you can change this later)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine.id}
                onClick={() => toggleSelection(cuisine.id, selectedCuisines, setSelectedCuisines)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedCuisines.includes(cuisine.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-3xl mb-2">{cuisine.emoji}</div>
                <div className="font-semibold text-gray-900">{cuisine.name}</div>
                {selectedCuisines.includes(cuisine.id) && (
                  <Check className="h-5 w-5 text-orange-500 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={selectedCuisines.length === 0}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full text-lg"
          >
            Continue ({selectedCuisines.length} selected)
          </Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your budget?</h2>
            <p className="text-gray-600">Select your preferred price ranges</p>
          </div>

          <div className="space-y-4 mb-8">
            {priceRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => toggleSelection(range.id, selectedPriceRanges, setSelectedPriceRanges)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedPriceRanges.includes(range.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{range.emoji}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{range.name}</div>
                      <div className="text-gray-600">{range.description}</div>
                    </div>
                  </div>
                  {selectedPriceRanges.includes(range.id) && (
                    <Check className="h-5 w-5 text-orange-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-full font-semibold"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Any dietary preferences?</h2>
            <p className="text-gray-600">Select any that apply (optional)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {dietaryOptions.map((dietary) => (
              <button
                key={dietary.id}
                onClick={() => toggleSelection(dietary.id, selectedDietary, setSelectedDietary)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedDietary.includes(dietary.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-3xl mb-2">{dietary.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm">{dietary.name}</div>
                {selectedDietary.includes(dietary.id) && (
                  <Check className="h-5 w-5 text-orange-500 mx-auto mt-2" />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1 py-4 rounded-full font-semibold"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <div className="bg-white/20 rounded-full p-8 mx-auto mb-8 backdrop-blur-sm">
          <MapPin className="h-16 w-16 text-white mx-auto" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">One last thing...</h2>
        <p className="text-xl text-white/90 mb-8">
          We need your location to show you the most delicious spots nearby
        </p>

        <Button
          onClick={handleLocationAccess}
          disabled={saving}
          className="w-full bg-white text-orange-500 hover:bg-white/90 font-semibold py-4 rounded-full text-lg mb-4"
        >
          <MapPin className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Enable Location'}
        </Button>

        <Button
          variant="ghost"
          onClick={() => savePreferences()}
          disabled={saving}
          className="w-full text-white/80 hover:text-white"
        >
          Maybe later
        </Button>
      </div>
    </div>
  );
};

export default ConsumerOnboarding;

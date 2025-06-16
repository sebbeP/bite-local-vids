
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera, MapPin, DollarSign } from 'lucide-react';

const RestaurantOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    priceLevel: '',
    description: ''
  });

  const categories = [
    'Italian', 'Japanese', 'Mexican', 'Chinese', 'American', 'Indian', 'Thai', 'Mediterranean', 'French', 'Other'
  ];

  const priceLevels = [
    { id: '$', name: 'Budget-friendly', description: 'Under $15 per person' },
    { id: '$$', name: 'Mid-range', description: '$15-30 per person' },
    { id: '$$$', name: 'Upscale', description: '$30+ per person' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your place</h2>
            <p className="text-gray-600">Help food lovers discover what makes you special</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                Restaurant Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Mario's Pizza Palace"
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-orange-500"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-2 block">
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main St, City, State"
                  className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl text-lg focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Cuisine Type *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleInputChange('category', category)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      formData.category === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.address || !formData.category}
            className="w-full mt-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full text-lg"
          >
            Continue
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Set your price range</h2>
            <p className="text-gray-600">This helps customers know what to expect</p>
          </div>

          <div className="space-y-4 mb-8">
            {priceLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleInputChange('priceLevel', level.id)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  formData.priceLevel === level.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{level.id}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{level.name}</div>
                      <div className="text-gray-600 text-sm">{level.description}</div>
                    </div>
                  </div>
                  <DollarSign className="h-5 w-5 text-gray-400" />
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
              disabled={!formData.priceLevel}
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Show off your food!</h2>
          <p className="text-gray-600">Upload your logo and first video to get started</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Restaurant Logo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Upload your logo</p>
              <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              First Video or Photo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Show your best dish</p>
              <p className="text-gray-400 text-sm">Video or photo, up to 10MB</p>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">
              Tell your story (optional)
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What makes your place special? Family recipes, unique atmosphere, story behind the restaurant..."
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-orange-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(2)}
            className="flex-1 py-4 rounded-full font-semibold"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate('/restaurant-dashboard')}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full"
          >
            Launch My Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOnboarding;

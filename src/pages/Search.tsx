
import React, { useState } from 'react';
import { MapPin, Star, Filter, List, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';

const Search = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const nearbyRestaurants = [
    {
      id: '1',
      name: "Mama Rosa's Kitchen",
      cuisine: 'Italian',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      priceRange: '$$',
      distance: '0.3 mi',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: '2',
      name: 'Sakura Sushi Bar',
      cuisine: 'Japanese',
      image: '/api/placeholder/300/200',
      rating: 4.9,
      priceRange: '$$$',
      distance: '0.7 mi',
      lat: 40.7589,
      lng: -73.9851
    },
    {
      id: '3',
      name: 'Burger Paradise',
      cuisine: 'American',
      image: '/api/placeholder/300/200',
      rating: 4.6,
      priceRange: '$',
      distance: '1.2 mi',
      lat: 40.7505,
      lng: -73.9934
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="rounded-full"
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-full"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search restaurants, users, cuisines..."
              className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          {/* Search Categories */}
          <div className="flex gap-2 mb-2">
            <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
              Restaurants
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="relative h-96 bg-gray-200 mx-4 my-4 rounded-2xl overflow-hidden">
          {/* Placeholder Map */}
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <div className="text-white text-center">
              <Map className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-semibold">Interactive Map</p>
              <p className="text-sm opacity-80">Restaurant pins would appear here</p>
            </div>
          </div>

          {/* Sample Map Pins */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Restaurant List */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Nearby Restaurants</h3>
            <span className="text-sm text-gray-500">{nearbyRestaurants.length} places</span>
          </div>
          
          {nearbyRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{restaurant.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{restaurant.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                      <span>•</span>
                      <span>{restaurant.distance}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Search;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Heart, MessageCircle, Upload, TrendingUp, Users, Camera } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import RestaurantMediaUpload from '@/components/RestaurantMediaUpload';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const myVideos = [
    {
      id: '1',
      title: 'Fresh pasta making process',
      views: 1247,
      likes: 89,
      comments: 23,
      thumbnail: '/api/placeholder/200/300'
    },
    {
      id: '2',
      title: 'Our signature pizza',
      views: 892,
      likes: 67,
      comments: 15,
      thumbnail: '/api/placeholder/200/300'
    }
  ];

  const stats = {
    totalViews: 2139,
    totalLikes: 156,
    followers: 234,
    saves: 45
  };

  const handleUploadComplete = (fileUrl: string, fileType: 'photo' | 'video') => {
    console.log('Upload complete:', fileUrl, fileType);
    // Refresh content or show success message
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Restaurant Info */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              MR
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-bold text-gray-900">Mama Rosa's Kitchen</h2>
              <p className="text-gray-600">Italian • $$ • 0.3 mi away</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">⭐ 4.8</span>
                <span className="text-gray-500 ml-2">234 followers</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{stats.totalViews}</div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">{stats.totalLikes}</div>
              <div className="text-xs text-gray-500">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">{stats.followers}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-500">{stats.saves}</div>
              <div className="text-xs text-gray-500">Saves</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 text-center font-semibold text-sm ${
                activeTab === 'overview'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <TrendingUp className="h-4 w-4 mx-auto mb-1" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 text-center font-semibold text-sm ${
                activeTab === 'content'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Camera className="h-4 w-4 mx-auto mb-1" />
              Content
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 text-center font-semibold text-sm ${
                activeTab === 'upload'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Upload className="h-4 w-4 mx-auto mb-1" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 py-4 text-center font-semibold text-sm ${
                activeTab === 'insights'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <Users className="h-4 w-4 mx-auto mb-1" />
              Insights
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">This Week</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">+23%</div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">+12</div>
                  <div className="text-sm text-gray-600">New Followers</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('upload')}
                >
                  <Upload className="h-4 w-4 mr-3" />
                  Upload New Video
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('upload')}
                >
                  <Camera className="h-4 w-4 mr-3" />
                  Update Menu Photos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-3" />
                  Respond to Reviews
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">My Content</h3>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full"
                onClick={() => setActiveTab('upload')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {myVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-20 rounded-xl object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {video.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {video.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myVideos.length === 0 && (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
                <p className="text-gray-500 mb-4">Start sharing your delicious creations!</p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full"
                  onClick={() => setActiveTab('upload')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Media</h3>
              <p className="text-gray-600 mb-6">Share photos and videos of your restaurant, food, and team</p>
              
              <RestaurantMediaUpload onUploadComplete={handleUploadComplete} />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Tips</h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">📸 Best Practices:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use natural lighting when possible</li>
                    <li>• Show the food preparation process</li>
                    <li>• Capture the atmosphere of your restaurant</li>
                    <li>• Include behind-the-scenes content</li>
                    <li>• Write engaging captions with relevant tags</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Audience</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Most active time</span>
                  <span className="font-semibold">6-8 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top age group</span>
                  <span className="font-semibold">25-34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Local followers</span>
                  <span className="font-semibold">78%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Content</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Behind-the-scenes</span>
                  <span className="font-semibold text-green-600">+45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Food close-ups</span>
                  <span className="font-semibold text-green-600">+32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chef introductions</span>
                  <span className="font-semibold text-green-600">+28%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default RestaurantDashboard;

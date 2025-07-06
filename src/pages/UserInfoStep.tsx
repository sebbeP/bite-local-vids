import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, AtSign, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserInfoStepProps {
  onComplete: (data: { name: string; username: string }) => void;
  onBack: () => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ onComplete, onBack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const checkUsername = async (usernameToCheck: string) => {
    if (!usernameToCheck) {
      setUsernameError('');
      return;
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', usernameToCheck)
      .single();

    if (data) {
      setUsernameError('Username is already taken');
    } else {
      setUsernameError('');
    }
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    if (value.length > 2) {
      await checkUsername(value);
    } else {
      setUsernameError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !username.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both name and username",
        variant: "destructive"
      });
      return;
    }

    if (usernameError) {
      toast({
        title: "Error",
        description: "Please choose a different username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Check username availability one more time
      await checkUsername(username);
      
      if (usernameError) {
        throw new Error('Username is already taken');
      }

      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: name.trim(),
          username: username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      onComplete({ name: name.trim(), username: username.trim() });
    } catch (error) {
      console.error('Error saving user info:', error);
      toast({
        title: "Error",
        description: "Failed to save user information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="ml-4">
            <h2 className="text-3xl font-bold text-gray-900">Tell us about yourself</h2>
            <p className="text-gray-600 mt-2">We need some basic info to get started</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border rounded-full focus:outline-none focus:ring-2 ${
                usernameError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-orange-500'
              }`}
              required
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-2 ml-3">{usernameError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !name.trim() || !username.trim() || !!usernameError}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-full text-lg"
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoStep;
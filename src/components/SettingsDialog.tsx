import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from 'lucide-react';

interface SettingsDialogProps {
  children: React.ReactNode;
}

const SettingsDialog = ({ children }: SettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    bio: '',
    avatar_url: '',
    is_restaurant_owner: false,
    business_name: '',
    business_description: '',
    location_address: '',
    preferences: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || '',
          email: user.email || '',
          username: data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          is_restaurant_owner: data.is_restaurant_owner || false,
          business_name: data.business_name || '',
          business_description: data.business_description || '',
          location_address: data.location_address || '',
          preferences: data.preferences || {}
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: profile.name,
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          is_restaurant_owner: profile.is_restaurant_owner,
          business_name: profile.business_name,
          business_description: profile.business_description,
          location_address: profile.location_address,
          preferences: profile.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile updated successfully"
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));

      toast({
        title: "Success!",
        description: "Profile picture updated"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0) || 'U'
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </Label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                placeholder="@username"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell people about yourself..."
                rows={3}
              />
            </div>
          </div>

          {/* Restaurant Owner Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Restaurant Owner</Label>
              <p className="text-sm text-gray-500">Are you a restaurant owner?</p>
            </div>
            <Switch
              checked={profile.is_restaurant_owner}
              onCheckedChange={(checked) => setProfile(prev => ({ ...prev, is_restaurant_owner: checked }))}
            />
          </div>

          {/* Restaurant Info (if restaurant owner) */}
          {profile.is_restaurant_owner && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Restaurant Information</h3>
              
              <div>
                <Label htmlFor="business_name">Restaurant Name</Label>
                <Input
                  id="business_name"
                  value={profile.business_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, business_name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="business_description">Description</Label>
                <Textarea
                  id="business_description"
                  value={profile.business_description}
                  onChange={(e) => setProfile(prev => ({ ...prev, business_description: e.target.value }))}
                  placeholder="Describe your restaurant..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location_address">Address</Label>
                <Input
                  id="location_address"
                  value={profile.location_address}
                  onChange={(e) => setProfile(prev => ({ ...prev, location_address: e.target.value }))}
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlaceProfile {
  id: number;
  placeid: string;
  companyownerid?: string;
  isapi?: boolean;
  name?: string;
  logopath?: string;
  header?: string;
  description?: string;
  contactinfo?: any;
  socialmedia?: any;
  location?: any;
  tags?: any;
  createddate: string;
}

export const usePlaceProfile = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createProfile = async (profileData: {
    companyownerid: string;
    name: string;
    description?: string;
    isapi?: boolean;
  }) => {
    try {
      setLoading(true);
      const placeid = crypto.randomUUID();

      // @ts-ignore - Types will update after migration
      const { data, error } = await supabase
        .from('"Place"."Profile"')
        .insert({
          placeid,
          companyownerid: profileData.companyownerid,
          name: profileData.name,
          description: profileData.description,
          isapi: profileData.isapi ?? false,
          createddate: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Profile created!',
        description: 'Your place profile has been created successfully.',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Failed to create profile',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (placeid: string) => {
    try {
      setLoading(true);
      // @ts-ignore - Types will update after migration
      const { data, error } = await supabase
        .from('"Place"."Profile"')
        .select('*')
        .eq('placeid', placeid)
        .single();

      if (error) throw error;
      return data as PlaceProfile;
    } catch (error: any) {
      toast({
        title: 'Failed to load profile',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (placeid: string, updates: Partial<PlaceProfile>) => {
    try {
      setLoading(true);
      // @ts-ignore - Types will update after migration
      const { error } = await supabase
        .from('"Place"."Profile"')
        .update(updates)
        .eq('placeid', placeid);

      if (error) throw error;

      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createProfile,
    getProfile,
    updateProfile,
  };
};

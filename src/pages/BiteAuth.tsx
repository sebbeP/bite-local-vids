import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/BiteAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

const BiteAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fname: '',
    lname: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await signUp(formData.email, formData.password, formData.fname, formData.lname);
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate('/feed');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 rounded-full p-4">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Join Bite' : 'Welcome Back'}
            </h1>
            <p className="text-white/80">
              {isSignUp ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="fname" className="text-white">First Name</Label>
                  <Input
                    id="fname"
                    type="text"
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lname" className="text-white">Last Name</Label>
                  <Input
                    id="lname"
                    type="text"
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    placeholder="Doe"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="••••••••"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-6"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/90 hover:text-white underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiteAuth;

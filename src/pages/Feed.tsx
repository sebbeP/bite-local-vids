import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/BiteAuthContext';
import { usePlacePost, PlacePost } from '@/hooks/usePlacePost';
import PostCard from '@/components/PostCard';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const { user, loading: authLoading } = useAuth();
  const { getPosts, likePost, incrementViews } = usePlacePost();
  const [posts, setPosts] = useState<PlacePost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getPosts({ public: true, limit: 50 });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (pid: string, currentLikes: number) => {
    await likePost(pid, currentLikes);
    // Update local state
    setPosts(posts.map(post => 
      post.pid === pid ? { ...post, likes: (post.likes || 0) + 1 } : post
    ));
  };

  const handleView = async (pid: string, currentViews: number) => {
    await incrementViews(pid, currentViews);
  };

  if (authLoading || loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
          <p className="text-gray-400">Be the first to share something!</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {posts.map((post) => (
        <PostCard
          key={post.pid}
          post={post}
          onLike={handleLike}
          onView={handleView}
        />
      ))}
      <BottomNav />
    </div>
  );
};

export default Feed;

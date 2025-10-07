import React, { useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { PlacePost } from '@/hooks/usePlacePost';

interface PostCardProps {
  post: PlacePost;
  onLike: (pid: string, currentLikes: number) => void;
  onView: (pid: string, currentViews: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onView }) => {
  useEffect(() => {
    // Increment view count when post is displayed
    onView(post.pid, post.views || 0);
  }, [post.pid]);

  return (
    <div className="relative h-screen w-full snap-start snap-always">
      {/* Background content */}
      {post.posttype === 'video' && post.postourl && (
        <video
          src={post.postourl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          autoPlay
          muted
          playsInline
        />
      )}
      
      {post.posttype === 'picture' && post.postourl && (
        <img
          src={post.postourl}
          alt={post.headercontent || 'Post'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {post.posttype === 'text' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-8">
          <div className="text-center text-white">
            {post.headercontent && (
              <h2 className="text-3xl font-bold mb-4">{post.headercontent}</h2>
            )}
            {post.textcontent && (
              <p className="text-xl">{post.textcontent}</p>
            )}
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-24">
        <div className="flex items-end justify-between">
          {/* Left side - Post info */}
          <div className="flex-1 text-white">
            {post.headercontent && (
              <h3 className="text-xl font-bold mb-2">{post.headercontent}</h3>
            )}
            {post.textcontent && (
              <p className="text-sm mb-3 line-clamp-2">{post.textcontent}</p>
            )}
            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {JSON.parse(post.tags as string).map((tag: string, index: number) => (
                  <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col items-center gap-6 ml-4">
            <button
              onClick={() => onLike(post.pid, post.likes || 0)}
              className="flex flex-col items-center text-white"
            >
              <Heart className="h-8 w-8 mb-1" />
              <span className="text-xs">{post.likes || 0}</span>
            </button>

            <button className="flex flex-col items-center text-white">
              <MessageCircle className="h-8 w-8 mb-1" />
              <span className="text-xs">0</span>
            </button>

            <button className="flex flex-col items-center text-white">
              <Bookmark className="h-8 w-8 mb-1" />
              <span className="text-xs">{post.saved || 0}</span>
            </button>

            <button className="flex flex-col items-center text-white">
              <Share2 className="h-8 w-8 mb-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

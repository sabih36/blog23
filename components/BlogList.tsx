
import React from 'react';
import type { Post } from '../types';

interface BlogListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onPostSelect: (id: number) => void;
}

const PostCard: React.FC<{ post: Post; onPostSelect: (id: number) => void }> = ({ post, onPostSelect }) => (
  <article 
    onClick={() => onPostSelect(post.id)}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
  >
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{post.title}</h2>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <img src={post.author?.imageUrl} alt={post.author?.fullName || ''} className="w-8 h-8 rounded-full mr-3" />
        <span>{post.author?.fullName} &middot; {new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
        {post.summary || post.content.substring(0, 150) + '...'}
      </p>
    </div>
  </article>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
  </div>
);

const BlogList: React.FC<BlogListProps> = ({ posts, loading, error, onPostSelect }) => {
  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }
  
  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 text-lg">No posts found.</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => <PostCard key={post.id} post={post} onPostSelect={onPostSelect} />)}
    </div>
  );
};

export default BlogList;

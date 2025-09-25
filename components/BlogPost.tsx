
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Post } from '../types';
import CommentSection from './CommentSection';
import MarkdownRenderer from './common/MarkdownRenderer';
import { IconChevronLeft, IconSparkles } from './common/Icons';
import Spinner from './common/Spinner';

interface BlogPostProps {
  postId: number;
  onBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ postId, onBack }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('posts').select('*').eq('id', postId);
        if (error) throw error;
        if (data && data.length > 0) {
          const postData = data[0] as Post;
          // In a real app, you might fetch user details separately or join.
          // Here, we'll use the author from the mock if available.
          const { data: authorData } = await supabase.from('users').select('*').eq('id', postData.author_id);
          if (authorData && authorData.length > 0) {
            postData.author = authorData[0];
          }
          setPost(postData);
        } else {
          throw new Error('Post not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-primary-600 dark:text-primary-400 hover:underline">
        <IconChevronLeft />
        Back to Posts
      </button>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <header className="mb-8 border-b dark:border-gray-700 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <img src={post.author?.imageUrl} alt={post.author?.fullName || ''} className="w-10 h-10 rounded-full mr-4" />
            <div>
              <p className="font-semibold">{post.author?.fullName}</p>
              <p className="text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </header>

        {post.summary && (
          <div className="mb-8 p-5 bg-primary-50 dark:bg-gray-700/50 border-l-4 border-primary-500 rounded-r-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">
              <IconSparkles />
              AI-Generated Summary
            </h3>
            <p className="text-primary-700 dark:text-primary-200 italic">{post.summary}</p>
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>

      <div className="mt-12">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};

export default BlogPost;

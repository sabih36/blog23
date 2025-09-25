
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../services/clerk';
import type { Comment } from '../types';
import Spinner from './common/Spinner';

interface CommentSectionProps {
  postId: number;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex items-start space-x-4 py-4">
    <img src={comment.author?.imageUrl} alt={comment.author?.fullName || ''} className="w-10 h-10 rounded-full" />
    <div className="flex-1">
      <div className="flex items-baseline space-x-2">
        <p className="font-semibold text-gray-800 dark:text-gray-100">{comment.author?.fullName}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
    </div>
  </div>
);

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: false });
    setComments((data as Comment[]) || []);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsPosting(true);
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      text: newComment
    });

    if (!error) {
      setNewComment('');
      await fetchComments();
    }
    setIsPosting(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-6 border-b dark:border-gray-700 pb-4">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
        <button
          type="submit"
          disabled={isPosting || !newComment.trim()}
          className="mt-3 px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-400"
        >
          {isPosting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? <Spinner /> : (
        <div className="space-y-4 divide-y dark:divide-gray-700">
          {comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
          {comments.length === 0 && <p className="text-gray-500 dark:text-gray-400">Be the first to comment.</p>}
        </div>
      )}
    </div>
  );
};

export default CommentSection;

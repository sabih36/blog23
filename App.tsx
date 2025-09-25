
import React, { useState, useCallback, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from './services/clerk';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import PostEditor from './components/PostEditor';
import type { Post } from './types';
import { supabase } from './services/supabaseClient';

type View = 
  | { name: 'list'; searchTerm: string }
  | { name: 'post'; postId: number }
  | { name: 'edit'; postId?: number };

export default function App() {
  const [view, setView] = useState<View>({ name: 'list', searchTerm: '' });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.textSearch('content', searchTerm);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      setPosts(data as Post[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view.name === 'list') {
      fetchPosts(view.searchTerm);
    }
  }, [view, fetchPosts]);

  const handlePostSave = async () => {
    setView({ name: 'list', searchTerm: '' });
    await fetchPosts(''); // Refresh list after saving
  };

  const renderContent = () => {
    switch (view.name) {
      case 'post':
        return <BlogPost postId={view.postId} onBack={() => setView({ name: 'list', searchTerm: '' })} />;
      case 'edit':
        return <PostEditor postId={view.postId} onSave={handlePostSave} onCancel={() => setView({ name: 'list', searchTerm: '' })} />;
      case 'list':
      default:
        return <BlogList posts={posts} loading={loading} error={error} onPostSelect={(id) => setView({ name: 'post', postId: id })} />;
    }
  };
  
  const handleSearch = (term: string) => {
    setView({ name: 'list', searchTerm: term });
  };

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Header 
          onNewPost={() => setView({ name: 'edit' })} 
          onHome={() => setView({ name: 'list', searchTerm: '' })}
          onSearch={handleSearch}
        />
        <main className="container mx-auto px-4 py-8">
          <SignedOut>
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Welcome to Gemini Blog</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Please sign in to read, create, and interact with posts.</p>
            </div>
          </SignedOut>
          <SignedIn>
            {renderContent()}
          </SignedIn>
        </main>
      </div>
    </ClerkProvider>
  );
}

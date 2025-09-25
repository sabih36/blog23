
import React, { useState } from 'react';
import { UserButton, SignedIn } from '../services/clerk';
import { IconSearch, IconPencil } from './common/Icons';

interface HeaderProps {
  onNewPost: () => void;
  onHome: () => void;
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewPost, onHome, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer"
            onClick={onHome}
          >
            GeminiBlog
          </div>
          <div className="flex-1 flex justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-md relative">
               <input
                 type="search"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search posts..."
                 className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
               />
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconSearch />
               </div>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <button
                onClick={onNewPost}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                <IconPencil />
                <span>Write Post</span>
              </button>
            </SignedIn>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

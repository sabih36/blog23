// This is a MOCK Clerk implementation for demonstration purposes.
// In a real application, you would use the official '@clerk/clerk-react' package.
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface ClerkContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const ClerkContext = createContext<ClerkContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'user_1',
  fullName: 'Jane Doe',
  imageUrl: 'https://picsum.photos/id/237/200/200'
};

export const ClerkProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Simulate checking auth state on mount
  useEffect(() => {
    const storedAuthState = localStorage.getItem('clerk_mock_auth');
    if (storedAuthState === 'signed_in') {
      setUser(MOCK_USER);
      setIsSignedIn(true);
    }
  }, []);

  const signIn = () => {
    localStorage.setItem('clerk_mock_auth', 'signed_in');
    setUser(MOCK_USER);
    setIsSignedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem('clerk_mock_auth');
    setUser(null);
    setIsSignedIn(false);
  };
  
  const value = { user, isSignedIn, signIn, signOut };
  
  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return React.createElement(ClerkContext.Provider, { value: value }, children);
};

export const useClerk = () => {
  const context = useContext(ClerkContext);
  if (context === undefined) {
    throw new Error('useClerk must be used within a ClerkProvider');
  }
  return context;
};

export const useUser = () => {
  const { user, isSignedIn } = useClerk();
  return { user, isSignedIn };
};

export const SignedIn = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useClerk();
  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return isSignedIn ? React.createElement(React.Fragment, null, children) : null;
};

export const SignedOut = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useClerk();
  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return !isSignedIn ? React.createElement(React.Fragment, null, children) : null;
};

export const UserButton = () => {
  const { user, isSignedIn, signIn, signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  if (!isSignedIn) {
    return React.createElement(
      "button",
      {
        onClick: signIn,
        className: "px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
      },
      "Sign In"
    );
  }

  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return React.createElement("div", { className: "relative" },
    React.createElement("button", { onClick: () => setIsOpen(!isOpen), className: "focus:outline-none" },
      React.createElement("img", { src: user?.imageUrl, alt: user?.fullName || 'User', className: "w-10 h-10 rounded-full border-2 border-primary-500 hover:border-primary-400 transition" })
    ),
    isOpen && React.createElement("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10" },
      React.createElement("div", { className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600" },
        user?.fullName
      ),
      React.createElement("button", {
          onClick: () => { signOut(); setIsOpen(false); },
          className: "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        },
        "Sign Out"
      )
    )
  );
};

// This is a MOCK Supabase client for demonstration purposes.
// In a real application, you would use the official '@supabase/supabase-js' package.
import type { Post, Comment, User } from '../types';

const MOCK_USERS: { [key: string]: User } = {
  'user_1': { id: 'user_1', fullName: 'Jane Doe', imageUrl: 'https://picsum.photos/id/237/200/200' },
  'user_2': { id: 'user_2', fullName: 'John Smith', imageUrl: 'https://picsum.photos/id/238/200/200' },
};

let posts: Post[] = [
  {
    id: 1,
    title: 'Exploring the new React 18 Features',
    content: `React 18 introduced some powerful features like automatic batching, transitions, and a new Suspense for data fetching.
    
### Automatic Batching
Before React 18, batching was only done for React event handlers. Now, state updates inside of promises, setTimeout, native event handlers, or any other event are batched automatically.

\`\`\`javascript
// Before React 18: 2 re-renders
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

\`\`\`javascript
// In React 18: Only 1 re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
\`\`\`

### Transitions
Transitions are a new concept in React to distinguish between urgent and non-urgent updates. This helps in keeping the UI responsive even during heavy rendering tasks.`,
    summary: 'React 18 brings significant improvements with features like automatic batching, which combines multiple state updates into a single re-render for better performance, and transitions, which help prioritize UI updates to keep the application responsive.',
    author_id: 'user_1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'A Guide to Modern CSS with Tailwind',
    content: `Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without ever leaving your HTML. It provides low-level utility classes that let you build completely custom designs without writing any custom CSS.

The main benefit is that you are not fighting with pre-defined component styles. Instead, you're building everything from small, composable utilities.

- **Responsive Design**: Use variants like \`md:\` and \`lg:\` to build adaptive user interfaces.
- **Dark Mode**: Tailwind has first-class support for dark mode.
- **Highly Customizable**: You can configure everything from colors to spacing via the \`tailwind.config.js\` file.`,
    summary: 'Tailwind CSS is a utility-first framework for rapid UI development. It offers low-level utility classes to build custom designs directly in your markup, featuring excellent support for responsive design, dark mode, and extensive customization.',
    author_id: 'user_2',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

let comments: Comment[] = [
  { id: 1, post_id: 1, user_id: 'user_2', text: 'Great overview of React 18!', created_at: new Date().toISOString() },
  { id: 2, post_id: 1, user_id: 'user_1', text: 'Thanks! Transitions are a game changer.', created_at: new Date().toISOString() },
];

let nextPostId = 3;
let nextCommentId = 3;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mockSupabaseClient = {
  from: (tableName: 'posts' | 'comments' | 'users') => {
    const tableData = tableName === 'posts' ? posts : tableName === 'comments' ? comments : Object.values(MOCK_USERS);

    const queryBuilder = {
      select: (columns = '*') => {
        // In a real client, you'd handle column selection. We'll return everything.
        let result = JSON.parse(JSON.stringify(tableData));
        if (tableName === 'posts') {
          result.forEach((post: Post) => post.author = MOCK_USERS[post.author_id]);
        }
        if (tableName === 'comments') {
          result.forEach((comment: Comment) => comment.author = MOCK_USERS[comment.user_id]);
        }
        
        queryBuilder._result = result;
        return queryBuilder;
      },
      insert: (newData: any) => {
        const dataToInsert = Array.isArray(newData) ? newData : [newData];
        
        if(tableName === 'posts') {
            const newPosts = dataToInsert.map(p => ({ ...p, id: nextPostId++, created_at: new Date().toISOString() }));
            posts = [...posts, ...newPosts];
            queryBuilder._result = newPosts;
        } else if (tableName === 'comments') {
            const newComments = dataToInsert.map(c => ({ ...c, id: nextCommentId++, created_at: new Date().toISOString() }));
            comments = [...comments, ...newComments];
            queryBuilder._result = newComments;
        }

        return queryBuilder;
      },
      eq: (column: string, value: any) => {
        queryBuilder._result = queryBuilder._result.filter((item: any) => item[column] === value);
        return queryBuilder;
      },
      // FIX: Added mock implementation for .single() method.
      single: () => {
        queryBuilder._result = queryBuilder._result[0] || null;
        return queryBuilder;
      },
      textSearch: (column: string, query: string) => {
        const terms = query.split(' ').filter(Boolean);
        if (!terms.length) return queryBuilder;
        queryBuilder._result = queryBuilder._result.filter((item: any) => {
          const content = (item[column] as string).toLowerCase();
          const title = (item['title'] as string)?.toLowerCase();
          return terms.every(term => content.includes(term.toLowerCase()) || (title && title.includes(term.toLowerCase())));
        });
        return queryBuilder;
      },
      order: (column: string, options: { ascending: boolean }) => {
        queryBuilder._result.sort((a: any, b: any) => {
            const valA = new Date(a[column]).getTime();
            const valB = new Date(b[column]).getTime();
            return options.ascending ? valA - valB : valB - valA;
        });
        return queryBuilder;
      },
      // This is the finalizer that returns the data in the Supabase format
      _result: [] as any[],
      async then(resolve: (value: { data: any, error: any }) => void, reject: (reason?: any) => void) {
        await delay(300); // Simulate network latency
        try {
          resolve({ data: this._result, error: null });
        } catch (e) {
          reject(e);
        }
      }
    };
    
    // Initialize with all data for the table.
    queryBuilder._result = JSON.parse(JSON.stringify(tableData));

    return queryBuilder;
  }
};

export const supabase = mockSupabaseClient;
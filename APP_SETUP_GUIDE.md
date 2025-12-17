# React + TypeScript + Vite App Setup Guide

This guide will help you set up a new React application with the same structure, tools, and styling system as the Ugly Sweater Contest App.

## Tech Stack Overview

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development server and bundler)
- **Styling**: Tailwind CSS v4 (utility-first CSS framework)
- **Icons**: Lucide React (modern icon library)
- **UI Components**: Radix UI (headless, accessible components)
- **Notifications**: Sonner (toast notifications)
- **State Management**: React hooks (useState, useEffect)
- **Storage**: localStorage (can be migrated to database later)

## Step 1: Initialize the Project

```bash
# Create new Vite project with React + TypeScript template
npm create vite@latest my-app-name -- --template react-swc-ts

# Navigate into project
cd my-app-name

# Install dependencies
npm install
```

## Step 2: Install Core Dependencies

```bash
# Tailwind CSS v4 (latest)
npm install tailwindcss@next @tailwindcss/vite@next

# React Router (if you need routing)
npm install react-router-dom

# Lucide React (icons)
npm install lucide-react

# Radix UI components (install as needed)
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-alert-dialog

# Sonner (toast notifications)
npm install sonner

# Class variance authority (for component variants)
npm install class-variance-authority clsx tailwind-merge

# Date handling (if needed)
npm install date-fns
```

## Step 3: Configure Vite

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

## Step 4: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Step 5: Set Up Tailwind CSS v4

Create `src/index.css`:

```css
@import "tailwindcss";

/* Custom CSS variables for your color scheme */
:root {
  /* Example: Holiday theme colors */
  --primary: #C41E3A;
  --primary-hover: #A01729;
  --secondary: #0F7041;
  --secondary-hover: #0A5230;
  --accent: #D4AF37;
  --accent-hover: #B8941F;

  /* Or use your own custom colors */
  --brand-primary: #3B82F6;
  --brand-primary-hover: #2563EB;
  --brand-secondary: #10B981;
  --brand-secondary-hover: #059669;
}

/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

## Step 6: Project Structure

Set up your folder structure:

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Layout.tsx      # Layout wrapper
│   └── [Feature].tsx   # Feature-specific components
├── types/              # TypeScript types/interfaces
│   └── index.ts        # Shared types
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── api/                # API client (if using backend)
│   └── client.ts
├── assets/             # Images, fonts, etc.
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Step 7: Create Utility Functions

Create `src/utils/helpers.ts`:

```typescript
// Combine class names (useful with Tailwind)
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

// Generate random IDs
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

// Format dates
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

## Step 8: Create Custom Hooks

Create `src/hooks/useLocalStorage.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## Step 9: Update Main Entry Point

Update `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## Step 10: Create Base App Component

Update `src/App.tsx`:

```typescript
import { useState } from 'react';
import { Toaster } from 'sonner';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'other'>('home');

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
        {currentView === 'home' && (
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Your App
              </h1>
              <p className="text-gray-600 mb-6">
                Start building your application here!
              </p>
              <button
                onClick={() => alert('Button clicked!')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
```

## Step 11: Button Design System

Use this standardized button system throughout your app:

### Primary Buttons (Main Actions)
```tsx
<button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors">
  Primary Action
</button>
```

### Secondary Buttons (Success/Confirm)
```tsx
<button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors">
  Confirm
</button>
```

### Tertiary Buttons (Cancel/Back)
```tsx
<button className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-colors">
  Cancel
</button>
```

### Disabled State
```tsx
<button
  disabled={!isValid}
  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
>
  Submit
</button>
```

### Button with Icon
```tsx
import { Save } from 'lucide-react';

<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors flex items-center gap-2">
  <Save className="w-5 h-5" />
  Save Changes
</button>
```

## Step 12: Environment Variables

Create `.env.local`:

```env
# App Configuration
VITE_APP_NAME=My App Name
VITE_API_URL=http://localhost:3001

# Admin/Auth
VITE_ADMIN_PASSWORD=your_admin_password_here

# Feature Flags (optional)
VITE_ENABLE_DEBUG=false
```

Add to `.gitignore`:
```
.env.local
.env.*.local
```

## Step 13: Package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

## Step 14: Common TypeScript Types

Create `src/types/index.ts`:

```typescript
// Base entity type
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// User type example
export interface User extends BaseEntity {
  name: string;
  email: string;
}

// Add your domain-specific types here
export interface YourDataType extends BaseEntity {
  // your fields
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}
```

## Step 15: Run Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`

---

## Key Tailwind CSS Patterns Used

### 1. Layout & Spacing
```tsx
// Full screen with centering
<div className="min-h-screen flex items-center justify-center p-4">

// Container with max width
<div className="max-w-6xl mx-auto">

// Card/Panel
<div className="bg-white rounded-xl shadow-2xl p-8">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 2. Typography
```tsx
// Large heading
<h1 className="text-4xl font-bold text-gray-800 mb-4">

// Subheading
<h2 className="text-2xl font-semibold text-gray-700 mb-3">

// Body text
<p className="text-gray-600 text-base">
```

### 3. Forms
```tsx
// Input field
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  placeholder="Enter text"
/>

// Label
<label className="block text-gray-700 font-medium mb-2">
  Field Name
</label>
```

### 4. Backgrounds
```tsx
// Gradient background
<div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">

// Solid with opacity
<div className="bg-white/95 backdrop-blur">

// Image overlay
<div className="absolute inset-0 bg-black/50">
```

### 5. Responsive Design
```tsx
// Mobile first, then tablet, then desktop
<div className="flex flex-col sm:flex-row md:gap-6 lg:gap-8">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="block md:hidden">
```

---

## Important Notes

### 1. **Use Standard Tailwind Classes**
- Always use `bg-red-600` instead of `bg-[var(--custom-color)]`
- CSS variables in arbitrary values don't work reliably in Tailwind v4
- If you need custom colors, add them to Tailwind config

### 2. **Button Best Practices**
- Always include `font-bold` for button text
- Use `transition-colors` for smooth hover effects
- Include `shadow-lg` or `shadow-md` for depth
- Add `disabled:` variants for disabled states

### 3. **Component Organization**
- Keep components small and focused (under 300 lines)
- Extract reusable UI into `/components/ui`
- Use TypeScript interfaces for all props
- Add JSDoc comments for complex components

### 4. **State Management**
- Start with `useState` for local state
- Use `useLocalStorage` hook for persistence
- Consider Context API for global state
- Only add Redux/Zustand if truly needed

### 5. **Performance**
- Use `React.memo()` for expensive components
- Lazy load routes with `React.lazy()`
- Optimize images (WebP format, proper sizing)
- Use `useCallback` and `useMemo` sparingly (only when needed)

---

## Example Component Template

```typescript
import { useState } from 'react';
import { Save, X } from 'lucide-react';

interface MyComponentProps {
  title: string;
  onSave: (data: string) => void;
  onCancel: () => void;
}

export function MyComponent({ title, onSave, onCancel }: MyComponentProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) {
      alert('Please enter a value');
      return;
    }
    onSave(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Enter Value
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Type here..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}
```

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name

# Remove package
npm uninstall package-name

# Update all packages
npm update

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## Prompt for Claude Code

**To set up a new app using this guide, use this prompt:**

> "I want to create a new React + TypeScript + Vite app following the APP_SETUP_GUIDE.md structure.
>
> Please:
> 1. Initialize the project with all dependencies from Step 2
> 2. Configure Vite and TypeScript as shown in Steps 3-4
> 3. Set up Tailwind CSS v4 with the index.css from Step 5
> 4. Create the project structure from Step 6
> 5. Add utility functions and hooks from Steps 7-8
> 6. Set up the base App.tsx from Step 10
> 7. Create .env.local with appropriate variables
>
> My app is for: [DESCRIBE YOUR APP PURPOSE]
>
> Use the button design system from Step 11 for all buttons, and follow the Tailwind patterns from the guide."

---

## Troubleshooting

### Vite can't find modules
```bash
npm install
# If that doesn't work:
rm -rf node_modules package-lock.json
npm install
```

### Tailwind classes not working
1. Check that `@import "tailwindcss"` is in `src/index.css`
2. Verify Vite config includes `tailwindcss()` plugin
3. Restart dev server

### TypeScript errors
1. Check `tsconfig.json` is configured correctly
2. Run `npm install -D typescript @types/react @types/react-dom`
3. Restart VS Code

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or change port in vite.config.ts
```

---

## Next Steps

After setup:

1. **Define your data models** in `src/types/`
2. **Create your main components** in `src/components/`
3. **Build your features** one at a time
4. **Add routing** if you need multiple pages
5. **Connect to backend** when ready (replace localStorage)
6. **Deploy** to Vercel, Netlify, or your hosting provider

Good luck building your app! 🚀

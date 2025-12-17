import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Card, Button, Input, Header } from './ui';
import { ADMIN_PASSWORD } from '@/types';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
  showAlert: (message: string, variant: 'info' | 'success' | 'warning' | 'error') => void;
}

export function AdminLogin({ onLogin, onBack, showAlert }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminAuthTime', Date.now().toString());
      showAlert('Welcome, Admin!', 'success');
      onLogin();
    } else {
      showAlert('Incorrect password', 'error');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Header title="Admin Login" subtitle="Enter password to access the dashboard" />

      <Card>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Admin Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter admin password"
          />
          <Button type="submit" fullWidth variant="primary" disabled={loading || !password.trim()}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button onClick={onBack} variant="ghost" fullWidth icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

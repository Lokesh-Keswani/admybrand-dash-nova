import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔍 AuthPage - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('⏳ AuthPage - Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/5 to-accent/5">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    console.log('✅ AuthPage - User is authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }

  console.log('📝 AuthPage - Showing auth form');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            AdMyBrand
          </h1>
          <p className="text-muted-foreground mt-2">
            Your Marketing Analytics Dashboard
          </p>
        </div>

        {/* Form */}
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2024 AdMyBrand. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 
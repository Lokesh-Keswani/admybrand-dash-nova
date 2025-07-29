import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsSubmittingForm(true);
    
    try {
      // Call login function from AuthContext
      const result = await login(data.email, data.password);
      
      if (!result.success) {
        // Show error message without affecting global loading state
        const errorMessage = result.error || 'Invalid Email or Password';
        setError(errorMessage);
        // Make sure we're not in submitting state
        setIsSubmittingForm(false);
        return;
      }
      
      // Success - AuthContext will handle redirect
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsSubmittingForm(false);
    }
    // Don't set setIsSubmittingForm(false) here for success case
    // Let the AuthContext handle the transition
  };

  // Handle form submission with explicit preventDefault
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  const demoCredentials = [
    { email: 'demo@admybrand.com', password: 'demo123', role: 'Demo Admin' }
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your AdMyBrand account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
            <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Credentials */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Demo Credentials:</p>
          {demoCredentials.map((cred, index) => (
            <div key={index} className="text-xs text-muted-foreground mb-1">
              <strong>{cred.role}:</strong> {cred.email} / {cred.password}
            </div>
          ))}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              disabled={isSubmittingForm}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                disabled={isSubmittingForm}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmittingForm}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={onSwitchToSignup}
            disabled={isSubmittingForm}
            className="text-sm"
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
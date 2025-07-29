import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for stored token and validate on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('admybrand_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('admybrand_token');
            localStorage.removeItem('admybrand_user');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('admybrand_token');
          localStorage.removeItem('admybrand_user');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Set loading to false when user state changes (for login success)
  useEffect(() => {
    if (user && isLoading && isLoggingIn) {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  }, [user, isLoading, isLoggingIn]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return { success: false, error: 'Server response error. Please try again.' };
      }

      if (response.ok && data.success) {
        // Only set loading state when we're about to succeed
        setIsLoading(true);
        setIsLoggingIn(true);
        
        setUser(data.user);
        localStorage.setItem('admybrand_token', data.token);
        localStorage.setItem('admybrand_user', JSON.stringify(data.user));
        // Don't set loading to false here - let the user state update handle it
        return { success: true };
      } else {
        // For failed login, don't affect global loading state
        // Return error immediately
        const errorMessage = data.message || 'Login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setIsLoggingIn(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('admybrand_token', data.token);
        localStorage.setItem('admybrand_user', JSON.stringify(data.user));
        // Don't set loading to false on success - let the user state update trigger the redirect
        return { success: true };
      } else {
        setIsLoading(false);
        setIsLoggingIn(false);
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      setIsLoggingIn(false);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admybrand_token');
    localStorage.removeItem('admybrand_user');
  };

  const updateProfile = async (name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('admybrand_token');
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('admybrand_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('admybrand_token');
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Password change failed' };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('admybrand_token');
      if (!token) {
        return { success: false, error: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clear user data and logout
        setUser(null);
        localStorage.removeItem('admybrand_token');
        localStorage.removeItem('admybrand_user');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Account deletion failed' };
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
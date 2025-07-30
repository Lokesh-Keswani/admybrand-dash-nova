import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
      console.log('🔍 Checking authentication status...');
      const token = localStorage.getItem('admybrand_token');
      console.log('🔑 Token found:', !!token);
      
      if (token) {
        try {
          console.log('🔗 Validating token with backend...');
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('📡 Profile response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Token valid, user data:', data.user);
            setUser(data.user);
          } else {
            console.log('❌ Token invalid, removing from storage');
            // Token is invalid, remove it
            localStorage.removeItem('admybrand_token');
            localStorage.removeItem('admybrand_user');
          }
        } catch (error) {
          console.error('❌ Error validating token:', error);
          localStorage.removeItem('admybrand_token');
          localStorage.removeItem('admybrand_user');
        }
      } else {
        console.log('🔑 No token found in storage');
      }
      console.log('🏁 Authentication check complete');
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
      console.log('🔗 Attempting to connect to:', API_BASE_URL);
      console.log('📧 Login attempt for:', email);
      console.log('📤 Sending login request with data:', { email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      console.log('📡 Response ok:', response.ok);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        if (responseText) {
          data = JSON.parse(responseText);
          console.log('📄 Parsed response data:', data);
        } else {
          console.log('❌ Empty response received');
          return { success: false, error: 'Empty response from server' };
        }
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        return { success: false, error: 'Server response error. Please try again.' };
      }

      if (response.ok && data.success) {
        console.log('✅ Login successful, setting user data');
        // Only set loading state when we're about to succeed
        setIsLoading(true);
        setIsLoggingIn(true);
        
        setUser(data.user);
        localStorage.setItem('admybrand_token', data.token);
        localStorage.setItem('admybrand_user', JSON.stringify(data.user));
        // Don't set loading to false here - let the user state update handle it
        return { success: true };
      } else {
        console.log('❌ Login failed:', data.message);
        // For failed login, don't affect global loading state
        // Return error immediately
        const errorMessage = data.message || 'Login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('❌ Login network error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔗 Starting signup process for:', email);
    setIsLoading(true);
    setIsLoggingIn(true);
    
    try {
      console.log('🔗 Attempting to connect to:', API_BASE_URL);
      console.log('📤 Sending signup request with data:', { name, email, password: '***' });
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      console.log('📡 Signup response status:', response.status);
      console.log('📡 Signup response headers:', response.headers);
      console.log('📡 Signup response ok:', response.ok);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        if (responseText) {
          data = JSON.parse(responseText);
          console.log('📄 Parsed response data:', data);
        } else {
          console.log('❌ Empty response received');
          setIsLoading(false);
          setIsLoggingIn(false);
          return { success: false, error: 'Empty response from server' };
        }
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        setIsLoading(false);
        setIsLoggingIn(false);
        return { success: false, error: 'Invalid response from server' };
      }

      if (response.ok && data.success) {
        console.log('✅ Signup successful, setting user data');
        setUser(data.user);
        localStorage.setItem('admybrand_token', data.token);
        localStorage.setItem('admybrand_user', JSON.stringify(data.user));
        // Set loading to false on success to allow navigation
        setIsLoading(false);
        setIsLoggingIn(false);
        return { success: true };
      } else {
        console.log('❌ Signup failed:', data.message);
        setIsLoading(false);
        setIsLoggingIn(false);
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('❌ Signup network error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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
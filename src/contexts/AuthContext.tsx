import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('admybrand_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('admybrand_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll use mock authentication
      // In a real app, this would make an API call to your backend
      
      // Demo credentials
      const demoUsers = [
        { id: '1', email: 'admin@admybrand.com', password: 'admin123', name: 'Admin User', role: 'admin' },
        { id: '2', email: 'user@admybrand.com', password: 'user123', name: 'Regular User', role: 'user' },
        { id: '3', email: 'demo@admybrand.com', password: 'demo123', name: 'Demo User', role: 'demo' }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('admybrand_user', JSON.stringify(userWithoutPassword));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, auto-create user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user'
      };

      setUser(newUser);
      localStorage.setItem('admybrand_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admybrand_user');
  };

  const updateProfile = async (name: string, email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Update user data
      const updatedUser = {
        ...user,
        name,
        email
      };

      setUser(updatedUser);
      localStorage.setItem('admybrand_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // For demo purposes, just simulate password update
      // In a real app, this would verify the current password and update it
      if (currentPassword.length < 3) {
        return { success: false, error: 'Current password is incorrect' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long' };
      }

      // Password updated successfully (in a real app, this would update the backend)
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update password. Please try again.' };
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
    updatePassword
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
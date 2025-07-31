import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User, { getUserModel } from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    { expiresIn: '7d' }
  );
};

// Get the appropriate User model (real or mock)
const getCurrentUserModel = () => {
  return getUserModel();
};

// Register new user
router.post('/signup', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists (including soft-deleted users)
    const UserModel = getCurrentUserModel();
    const existingUser = await UserModel.findByEmailIncludingDeleted(email);
    
    if (existingUser) {
      // If user exists but is soft-deleted, we can reactivate the account
      if (existingUser.deletedAt) {
        // Reactivate the soft-deleted account
        existingUser.deletedAt = null;
        existingUser.isActive = true;
        existingUser.name = name;
        existingUser.password = password; // This will be hashed by the pre-save hook
        existingUser.lastLogin = new Date();
        await existingUser.save();

        // Generate token
        const token = generateToken(existingUser._id);

        res.status(200).json({
          success: true,
          message: 'Account reactivated successfully',
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
          }
        });
        return;
      } else {
        // User exists and is active
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Check if we're using mock data
    const isUsingMockData = global.MockUser !== undefined;
    
    if (isUsingMockData) {
      // Check if there's a soft-deleted mock user with this email
      global.mockUsers = global.mockUsers || [];
      const softDeletedUser = global.mockUsers.find(u => 
        u.email === email.toLowerCase() && u.deletedAt
      );
      
      if (softDeletedUser) {
        // Reactivate the soft-deleted mock user
        softDeletedUser.deletedAt = null;
        softDeletedUser.isActive = true;
        softDeletedUser.name = name;
        softDeletedUser.password = password;
        softDeletedUser.lastLogin = new Date();
        softDeletedUser.updatedAt = new Date();
        
        // Generate token
        const token = generateToken(softDeletedUser._id);
        
        res.status(200).json({
          success: true,
          message: 'Account reactivated successfully',
          token,
          user: {
            id: softDeletedUser._id,
            name: softDeletedUser.name,
            email: softDeletedUser.email,
            role: softDeletedUser.role
          }
        });
        return;
      }
      
      // Create new mock user
      const mockUserId = 'user-' + Date.now();
      const mockUser = {
        _id: mockUserId,
        name,
        email: email.toLowerCase(),
        password: password, // Store plain password for mock comparison
        role: 'user',
        isActive: true,
        deletedAt: null,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // Mock methods
        comparePassword: async function(candidatePassword) {
          return candidatePassword === this.password; // Compare with stored password
        },
        
        save: async function() {
          // Add to mock users array
          global.mockUsers = global.mockUsers || [];
          const index = global.mockUsers.findIndex(u => u._id === this._id);
          if (index !== -1) {
            global.mockUsers[index] = { ...this };
          } else {
            global.mockUsers.push({ ...this });
          }
          return this;
        }
      };
      
      // Add to mock users
      global.mockUsers.push(mockUser);
      
      // Generate token
      const token = generateToken(mockUser._id);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    } else {
      // Create new user with MongoDB
      const user = new User({
        name,
        email,
        password,
        role: 'user'
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Set last login
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

  } catch (error) {
    console.error('❌ Backend: Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active and not deleted
    if (!user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated or deleted'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    const { name, email } = req.body;

    // Check if email already exists (if changing email)
    if (email && email !== user.email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// Change password
router.put('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
});

// Test Delete Account Route
router.delete('/delete-account-test', async (req, res) => {
  res.json({ success: true, message: 'Test route works' });
});

// Delete Account
router.delete('/delete-account', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find and soft delete the user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Soft delete by setting deletedAt timestamp
    user.deletedAt = new Date();
    user.isActive = false;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during account deletion' 
    });
  }
});

// Get notification preferences
router.get('/notification-preferences', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    res.json({
      success: true,
      data: user.notificationPreferences || {
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true
      }
    });

  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification preferences'
    });
  }
});

// Update notification preferences
router.put('/notification-preferences', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.slice(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user
    const UserModel = getCurrentUserModel();
    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    const { emailNotifications, pushNotifications, weeklyReports } = req.body;

    // Update notification preferences
    user.notificationPreferences = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.notificationPreferences?.emailNotifications ?? true,
      pushNotifications: pushNotifications !== undefined ? pushNotifications : user.notificationPreferences?.pushNotifications ?? false,
      weeklyReports: weeklyReports !== undefined ? weeklyReports : user.notificationPreferences?.weeklyReports ?? true
    };

    await user.save();

    res.json({
      success: true,
      data: user.notificationPreferences,
      message: 'Notification preferences updated successfully'
    });

  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification preferences'
    });
  }
});

export default router; 
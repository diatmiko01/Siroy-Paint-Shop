const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth service handlers
const AuthService = {
  // User registration
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone } = req.body;

      // Check if user already exists (in production, check database)
      // const existingUser = await User.findOne({ email });
      // if (existingUser) {
      //   return res.status(400).json({ message: 'User already exists' });
      // }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user data
      const userData = {
        id: `user_${Date.now()}`,
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        isActive: true
      };

      // In production, save to database
      // const user = await User.create(userData);

      // Generate JWT token
      const token = jwt.sign(
        { userId: userData.id, email: userData.email, role: userData.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Remove password from response
      const { password: _, ...userResponse } = userData;

      res.status(201).json({
        success: true,
        data: {
          user: userResponse,
          token
        },
        message: 'User registered successfully'
      });

    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Registration failed' 
      });
    }
  },

  // User login
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // In production, find user in database
      // const user = await User.findOne({ email });
      
      // Simulate user data for demo
      const user = {
        id: 'user_1703123456789',
        name: 'John Doe',
        email: email,
        password: await bcrypt.hash('password123', 12), // Demo password
        role: 'user',
        isActive: true
      };

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        data: {
          user: userResponse,
          token
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Login failed' 
      });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const { userId } = req.user; // From JWT middleware

      // In production, fetch from database
      // const user = await User.findById(userId).select('-password');
      
      // Simulate user data
      const user = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+62812345678',
        role: 'user',
        createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
        isActive: true
      };

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get profile' 
      });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;
      const { name, phone } = req.body;

      // In production, update database
      // const updatedUser = await User.findByIdAndUpdate(
      //   userId,
      //   { name, phone, updatedAt: new Date() },
      //   { new: true, select: '-password' }
      // );

      const updatedUser = {
        id: userId,
        name,
        phone,
        email: 'john@example.com', // Keep existing email
        role: 'user',
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update profile' 
      });
    }
  },

  // Change password
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.user;
      const { currentPassword, newPassword } = req.body;

      // In production, get user from database
      // const user = await User.findById(userId);
      
      // Simulate current password check
      const user = {
        password: await bcrypt.hash('password123', 12) // Demo current password
      };

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // In production, update password in database
      // await User.findByIdAndUpdate(userId, { 
      //   password: hashedNewPassword, 
      //   updatedAt: new Date() 
      // });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change Password Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to change password' 
      });
    }
  }
};

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes with validation
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required')
], AuthService.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], AuthService.login);

router.get('/profile', authenticateToken, AuthService.getProfile);

router.put('/profile', authenticateToken, [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
], AuthService.updateProfile);

router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], AuthService.changePassword);

module.exports = router;

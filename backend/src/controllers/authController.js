const User = require('../models/User');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  generateEmailVerificationToken 
} = require('../utils/jwt');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    // Generate email verification token if email verification is enabled
    if (process.env.SMTP_HOST) {
      user.emailVerificationToken = generateEmailVerificationToken();
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    } else {
      user.isEmailVerified = true; // Skip verification if email not configured
    }

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    user.generateRefreshToken();
    await user.save();

    // Send email verification if configured
    if (process.env.SMTP_HOST && user.emailVerificationToken) {
      // TODO: Send verification email
      console.log('Email verification would be sent here');
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        discriminator: user.discriminator,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Clean expired refresh tokens
    user.cleanExpiredTokens();

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add new refresh token
    user.generateRefreshToken();
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        discriminator: user.discriminator,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        customStatus: user.customStatus
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed'
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid refresh token'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(
      t => t.token === token && t.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({
        error: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
    user.generateRefreshToken();
    await user.save();

    res.json({
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid refresh token'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token && req.user) {
      // Remove the refresh token from user's tokens
      req.user.refreshTokens = req.user.refreshTokens.filter(
        t => t.token !== token
      );
      await req.user.save();
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        discriminator: user.discriminator,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        status: user.status,
        customStatus: user.customStatus,
        isEmailVerified: user.isEmailVerified,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, bio, status, customStatus } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (status) updates.status = status;
    if (customStatus !== undefined) updates.customStatus = customStatus;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        discriminator: user.discriminator,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        status: user.status,
        customStatus: user.customStatus,
        isEmailVerified: user.isEmailVerified,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Email verification failed'
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  verifyEmail
};
const Bot = require('../models/Bot');
const Guild = require('../models/Guild');
const crypto = require('crypto');

// Get all bots for a guild
exports.getGuildBots = async (req, res) => {
  try {
    const { guildId } = req.params;
    
    const bots = await Bot.find({ guildId })
      .select('-token') // Don't send tokens in list
      .populate('createdBy', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.json(bots);
  } catch (error) {
    console.error('Error fetching guild bots:', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
};

// Create a new bot
exports.createBot = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { name, description, permissions } = req.body;
    const userId = req.user._id;
    
    // Generate bot token
    const token = crypto.randomBytes(32).toString('hex');
    
    const bot = new Bot({
      name,
      description,
      permissions: permissions || [],
      token,
      guildId,
      createdBy: userId,
      isActive: true
    });
    
    await bot.save();
    
    // Return bot without token for security
    const botResponse = bot.toObject();
    delete botResponse.token;
    
    res.status(201).json(botResponse);
  } catch (error) {
    console.error('Error creating bot:', error);
    res.status(500).json({ error: 'Failed to create bot' });
  }
};

// Get bot by ID
exports.getBot = async (req, res) => {
  try {
    const { botId } = req.params;
    
    const bot = await Bot.findById(botId)
      .select('-token') // Don't send token
      .populate('createdBy', 'username avatar')
      .populate('guildId', 'name');
    
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    
    res.json(bot);
  } catch (error) {
    console.error('Error fetching bot:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
};

// Update bot
exports.updateBot = async (req, res) => {
  try {
    const { botId } = req.params;
    const { name, description, permissions, isActive } = req.body;
    
    const bot = await Bot.findById(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    
    // Update fields
    if (name !== undefined) bot.name = name;
    if (description !== undefined) bot.description = description;
    if (permissions !== undefined) bot.permissions = permissions;
    if (isActive !== undefined) bot.isActive = isActive;
    
    await bot.save();
    
    // Return bot without token
    const botResponse = bot.toObject();
    delete botResponse.token;
    
    res.json(botResponse);
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ error: 'Failed to update bot' });
  }
};

// Delete bot
exports.deleteBot = async (req, res) => {
  try {
    const { botId } = req.params;
    
    const bot = await Bot.findByIdAndDelete(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    
    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
};

// Regenerate bot token
exports.regenerateToken = async (req, res) => {
  try {
    const { botId } = req.params;
    
    const bot = await Bot.findById(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    
    // Generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    bot.token = newToken;
    await bot.save();
    
    res.json({ 
      message: 'Token regenerated successfully',
      token: newToken // Only return token on regeneration
    });
  } catch (error) {
    console.error('Error regenerating bot token:', error);
    res.status(500).json({ error: 'Failed to regenerate token' });
  }
};
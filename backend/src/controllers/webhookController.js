const Webhook = require('../models/Webhook');
const crypto = require('crypto');

// Get all webhooks for a guild
exports.getGuildWebhooks = async (req, res) => {
  try {
    const { guildId } = req.params;
    
    const webhooks = await Webhook.find({ guildId })
      .populate('createdBy', 'username avatar')
      .populate('channelId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(webhooks);
  } catch (error) {
    console.error('Error fetching guild webhooks:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
};

// Create a new webhook
exports.createWebhook = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { name, channelId, avatar } = req.body;
    const userId = req.user.id;
    
    // Generate webhook URL
    const webhookId = crypto.randomBytes(16).toString('hex');
    const webhookUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/webhooks/${webhookId}`;
    
    const webhook = new Webhook({
      name,
      channelId,
      avatar,
      guildId,
      createdBy: userId,
      webhookId,
      webhookUrl,
      isActive: true
    });
    
    await webhook.save();
    
    res.status(201).json(webhook);
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
};

// Get webhook by ID
exports.getWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    
    const webhook = await Webhook.findById(webhookId)
      .populate('createdBy', 'username avatar')
      .populate('channelId', 'name')
      .populate('guildId', 'name');
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    res.json(webhook);
  } catch (error) {
    console.error('Error fetching webhook:', error);
    res.status(500).json({ error: 'Failed to fetch webhook' });
  }
};

// Update webhook
exports.updateWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const { name, channelId, avatar, isActive } = req.body;
    
    const webhook = await Webhook.findById(webhookId);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    // Update fields
    if (name !== undefined) webhook.name = name;
    if (channelId !== undefined) webhook.channelId = channelId;
    if (avatar !== undefined) webhook.avatar = avatar;
    if (isActive !== undefined) webhook.isActive = isActive;
    
    await webhook.save();
    
    res.json(webhook);
  } catch (error) {
    console.error('Error updating webhook:', error);
    res.status(500).json({ error: 'Failed to update webhook' });
  }
};

// Delete webhook
exports.deleteWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    
    const webhook = await Webhook.findByIdAndDelete(webhookId);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
};

// Execute webhook
exports.executeWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const { content, embeds, username, avatar_url } = req.body;
    
    const webhook = await Webhook.findOne({ webhookId });
    if (!webhook || !webhook.isActive) {
      return res.status(404).json({ error: 'Webhook not found or inactive' });
    }
    
    // Create message in the webhook's channel
    const Message = require('../models/Message');
    const message = new Message({
      content: content || '',
      author: {
        id: webhook.createdBy,
        username: username || webhook.name,
        avatar: avatar_url || webhook.avatar
      },
      channelId: webhook.channelId,
      guildId: webhook.guildId,
      isWebhook: true,
      webhookId: webhook._id
    });
    
    await message.save();
    
    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(webhook.channelId).emit('message:created', message);
    }
    
    res.json({ message: 'Webhook executed successfully' });
  } catch (error) {
    console.error('Error executing webhook:', error);
    res.status(500).json({ error: 'Failed to execute webhook' });
  }
};
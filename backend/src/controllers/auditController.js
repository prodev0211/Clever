const AuditLog = require('../models/AuditLog');

// Get audit logs for a guild
exports.getGuildAuditLogs = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { limit = 50, before, actionType, userId } = req.query;
    
    // Build query
    let query = { guildId };
    if (before) {
      query._id = { $lt: before };
    }
    if (actionType) {
      query.actionType = actionType;
    }
    if (userId) {
      query.executorId = userId;
    }
    
    const auditLogs = await AuditLog.find(query)
      .populate('executorId', 'username avatar')
      .populate('targetId', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

// Get audit log by ID
exports.getAuditLog = async (req, res) => {
  try {
    const { logId } = req.params;
    
    const auditLog = await AuditLog.findById(logId)
      .populate('executorId', 'username avatar')
      .populate('targetId', 'username')
      .populate('guildId', 'name');
    
    if (!auditLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }
    
    res.json(auditLog);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
};
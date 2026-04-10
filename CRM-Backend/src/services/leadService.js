const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

exports.createLead = async (leadData) => {
    const lead = await Lead.create(leadData);
    await ActivityLog.create({ leadId: lead._id, action: 'LEAD_CAPTURED', details: 'Captured' });
    return lead;
};

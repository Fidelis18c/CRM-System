const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');
const Note = require('../models/Note');

exports.createLead = async (leadData) => {
    const lead = await Lead.create(leadData);
    await ActivityLog.create({
        leadId: lead._id,
        action: 'LEAD_CAPTURED',
        details: `Lead captured from ${lead.source || 'Website'}`
    });
    return lead;
};

exports.getAllLeads = async (queryObj, sort, skip, limit) => {
    return await Lead.find(queryObj).sort(sort).skip(skip).limit(limit);
};

exports.updateLeadStatus = async (id, status, adminId) => {
    const lead = await Lead.findById(id);
    if (!lead) return null;

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await ActivityLog.create({
        leadId: lead._id,
        action: 'STATUS_UPDATED',
        details: `Status changed from ${oldStatus} to ${status}`,
        adminId
    });

    return lead;
};

exports.addNote = async (leadId, adminId, content) => {
    const note = await Note.create({ leadId, adminId, content });
    await ActivityLog.create({
        leadId,
        action: 'NOTE_ADDED',
        details: 'A new follow-up note was added',
        adminId
    });
    return note;
};

exports.getAnalytics = async () => {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: 'CONVERTED' });
    
    const statusCounts = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyLeads = await Lead.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return {
        totalLeads,
        convertedLeads,
        conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0,
        statusCounts,
        dailyLeads
    };
};

exports.getLeadById = async (id) => {
    return await Lead.findById(id);
};

exports.getLeadNotes = async (leadId) => {
    return await Note.find({ leadId })
        .populate('adminId', 'firstName lastName email')
        .sort('-createdAt');
};

exports.getLeadActivities = async (leadId) => {
    return await ActivityLog.find({ leadId })
        .populate('adminId', 'firstName lastName email')
        .sort('-timestamp');
};

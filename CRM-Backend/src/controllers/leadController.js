const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create lead from public contact form
// @route   POST /api/v1/leads/public
// @access  Public
exports.createPublicLead = async (req, res, next) => {
    try {
        const { name, email, phone, source } = req.body;

        // Manual Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please add a name' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Please add a valid email' });
        }
        if (!phone) {
            return res.status(400).json({ success: false, message: 'Please add a phone number' });
        }

        // Check if lead already exists
        let lead = await Lead.findOne({ email });
        if (lead) {
            return res.status(400).json({ success: false, message: 'Lead with this email already exists' });
        }

        // Create Lead
        lead = await Lead.create({
            name,
            email,
            phone,
            source: source || 'Website'
        });

        // Create Activity Log
        await ActivityLog.create({
            leadId: lead._id,
            action: 'LEAD_CAPTURED',
            details: `Lead captured from ${lead.source}`
        });

        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private/Admin
exports.getLeads = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from filtering
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query object
        let queryObj = { ...reqQuery };

        // Handle search (Manual regex search)
        if (req.query.search) {
            queryObj.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        query = Lead.find(queryObj);

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Executing query
        const leads = await query;

        res.status(200).json({
            success: true,
            count: leads.length,
            page,
            data: leads
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update lead status
// @route   PATCH /api/v1/leads/:id/status
// @access  Private/Admin
exports.updateLeadStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: 'Please provide a status' });
        }

        let lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        const oldStatus = lead.status;
        lead.status = status;
        await lead.save();

        // Log Activity
        await ActivityLog.create({
            leadId: lead._id,
            action: 'STATUS_UPDATED',
            details: `Status changed from ${oldStatus} to ${status}`,
            adminId: req.user._id
        });

        res.status(200).json({ success: true, data: lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add note to lead
// @route   POST /api/v1/leads/:id/notes
// @access  Private/Admin
exports.addLeadNote = async (req, res, next) => {
    try {
        const { content } = req.body;
        const Note = require('../models/Note');

        if (!content) {
            return res.status(400).json({ success: false, message: 'Please add note content' });
        }

        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        const note = await Note.create({
            leadId: req.params.id,
            adminId: req.user._id,
            content
        });

        // Log Activity
        await ActivityLog.create({
            leadId: lead._id,
            action: 'NOTE_ADDED',
            details: 'A new follow-up note was added',
            adminId: req.user._id
        });

        res.status(201).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard analytics
// @route   GET /api/v1/leads/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const convertedLeads = await Lead.countDocuments({ status: 'CONVERTED' });
        
        // Group by status
        const statusCounts = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Leads over last 7 days
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

        res.status(200).json({
            success: true,
            data: {
                totalLeads,
                convertedLeads,
                conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0,
                statusCounts,
                dailyLeads
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

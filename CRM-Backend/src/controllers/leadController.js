const leadService = require('../services/leadService');
const Lead = require('../models/Lead');

// @desc    Create lead from public contact form
// @route   POST /api/v1/leads/public
// @access  Public
exports.createPublicLead = async (req, res, next) => {
    try {
        const { name, email, message, source } = req.body;

        // Manual Validation
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please add a name' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Please add a valid email' });
        }
        if (!message || message.trim() === '') {
            return res.status(400).json({ success: false, message: 'Please add a message' });
        }

        // Check if lead already exists
        let lead = await Lead.findOne({ email });
        if (lead) {
            return res.status(400).json({ success: false, message: 'Lead with this email already exists' });
        }

        const newLead = await leadService.createLead({
            name,
            email,
            message,
            source: source || 'Website'
        });

        res.status(201).json({ success: true, data: newLead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all leads
// @route   GET /api/v1/leads
// @access  Private/Admin
exports.getLeads = async (req, res, next) => {
    try {
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryObj = { ...reqQuery };
        if (req.query.search) {
            queryObj.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const sort = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const leads = await leadService.getAllLeads(queryObj, sort, skip, limit);

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
        if (!status) return res.status(400).json({ success: false, message: 'Please provide a status' });

        const lead = await leadService.updateLeadStatus(req.params.id, status, req.user._id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

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
        if (!content) return res.status(400).json({ success: false, message: 'Please add note content' });

        const note = await leadService.addNote(req.params.id, req.user._id, content);
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
        const analytics = await leadService.getAnalytics();
        res.status(200).json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

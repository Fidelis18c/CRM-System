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
        if (req.query.status) {
            const statuses = req.query.status.split(',').map(s => s.trim().toUpperCase());
            queryObj.status = { $in: statuses };
        }

        if (req.query.search) {
            queryObj.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        let sortStr = '-createdAt';
        if (req.query.sort) {
            if (req.query.sort === 'oldest') sortStr = 'createdAt';
            else if (req.query.sort === 'newest') sortStr = '-createdAt';
            else if (req.query.sort === 'name') sortStr = 'name';
            else if (req.query.sort === 'status') sortStr = 'status';
            else sortStr = req.query.sort.split(',').join(' ');
        }
        
        const sort = sortStr;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const total = await Lead.countDocuments(queryObj);
        const leads = await leadService.getAllLeads(queryObj, sort, skip, limit);

        res.status(200).json({
            success: true,
            count: total,
            page,
            data: leads
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Update a lead
// @route   PUT /api/v1/leads/:id
// @access  Private/Admin
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await leadService.updateLead(req.params.id,req.body,req.user._id);

    if (!updatedLead) {
      return res.status(404).json({ success: false,message: 'Lead not found', });
    }

    res.status(200).json({success: true,data: updatedLead,});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

// @desc    Get a single lead by ID
// @route   GET /api/v1/leads/:id
// @access  Private/Admin
exports.getLeadById = async (req, res, next) => {
    try {
        const lead = await leadService.getLeadById(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
        
        const notes = await leadService.getLeadNotes(lead._id);
        const activities = await leadService.getLeadActivities(lead._id);
        
        res.status(200).json({ success: true, data: { lead, notes, activities } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get lead notes
// @route   GET /api/v1/leads/:id/notes
// @access  Private/Admin
exports.getLeadNotes = async (req, res, next) => {
    try {
        const notes = await leadService.getLeadNotes(req.params.id);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get lead activities
// @route   GET /api/v1/leads/:id/activities
// @access  Private/Admin
exports.getLeadActivities = async (req, res, next) => {
    try {
        const activities = await leadService.getLeadActivities(req.params.id);
        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Delete a lead
// @route   DELETE /api/v1/leads/:id
// @access  Private/Admin
exports.deleteLead = async (req, res) => {
  try {
    const deleted = await leadService.deleteLead(
      req.params.id,
      req.user._id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
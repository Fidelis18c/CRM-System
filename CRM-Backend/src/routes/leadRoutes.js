const express = require('express');
const router = express.Router();
const { 
    createPublicLead, 
    getLeads, 
    updateLeadStatus, 
    addLeadNote, 
    getAnalytics 
} = require('../controllers/leadController');

const { protect } = require('../middleware/auth');

// Public route for lead capture
router.post('/public', createPublicLead);

// Protected Admin Routes
router.use(protect);

router.get('/', getLeads);
router.get('/analytics', getAnalytics);
router.patch('/:id/status', updateLeadStatus);
router.post('/:id/notes', addLeadNote);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    createPublicLead, 
    getLeads, 
    updateLeadStatus, 
    addLeadNote, 
    getAnalytics,
    getLeadById,
    getLeadNotes,
    updateLead,
    deleteLead,
    getLeadActivities
} = require('../controllers/leadController');

const { protect } = require('../middleware/auth');

// Public route for lead capture
router.post('/public', createPublicLead);

// Protected Admin Routes
router.use(protect);

router.get('/', getLeads);
router.get('/analytics', getAnalytics);


router.get('/:id/notes', getLeadNotes);
router.post('/:id/notes', addLeadNote);

router.get('/:id/activities', getLeadActivities);

router.patch('/:id/status', updateLeadStatus);

router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

router.get('/:id', getLeadById);

module.exports = router;

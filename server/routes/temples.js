const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/temples
// @desc    Get all approved temples (with optional search query)
// @access  Public
router.get('/', async (req, res) => {
    try {
        console.log('>>> GET /api/temples called');
        const temples = await Temple.find({});
        console.log('>>> Found temples:', temples.length);
        res.json(temples);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error fetching temples' });
    }
});

// @route   GET /api/temples/featured
// @desc    Get featured approved temples
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const temples = await Temple.find({ status: 'approved', isFeatured: true }).limit(6);
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching featured temples' });
    }
});

// @route   GET /api/temples/admin/all
// @desc    Get ALL temples (including pending) for admin dashboard
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const temples = await Temple.find({}).sort({ createdAt: -1 });
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all temples' });
    }
});

// @route   GET /api/temples/:id
// @desc    Get a specific temple
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id).populate('circuit', 'name description');
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        // Optional: ensure only admins can view pending temples
        res.json(temple);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching temple' });
    }
});

// @route   POST /api/temples
// @desc    Create a new temple (Defaults to pending)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const temple = new Temple(req.body);
        const createdTemple = await temple.save();
        res.status(201).json(createdTemple);
    } catch (error) {
        res.status(400).json({ message: 'Invalid temple data', error: error.message });
    }
});

// @route   PUT /api/temples/:id
// @desc    Update a temple
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json(temple);
    } catch (error) {
        res.status(400).json({ message: 'Invalid temple data' });
    }
});

// @route   PUT /api/temples/:id/approve
// @desc    Approve or reject a temple
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const temple = await Temple.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json(temple);
    } catch (error) {
        res.status(400).json({ message: 'Invalid action' });
    }
});

// @route   DELETE /api/temples/:id
// @desc    Delete a temple
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const temple = await Temple.findByIdAndDelete(req.params.id);
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json({ message: 'Temple removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting temple' });
    }
});

// @route   POST /api/temples/:id/rate
// @desc    Submit a rating for a temple (1-5)
// @access  Public
router.post('/:id/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ message: 'Temple not found' });

        if (!temple.ratings) temple.ratings = [];
        temple.ratings.push({ value: Number(rating) });
        const total = temple.ratings.reduce((sum, r) => sum + r.value, 0);
        temple.averageRating = Math.round((total / temple.ratings.length) * 10) / 10;

        // Remove invalid location (missing coordinates) to avoid 2dsphere index error
        if (temple.location && (!temple.location.coordinates || temple.location.coordinates.length === 0)) {
            temple.location = undefined;
        }

        await temple.save();

        res.json({ averageRating: temple.averageRating, totalRatings: temple.ratings.length });
    } catch (error) {
        console.error('Rating error:', error.message);
        res.status(500).json({ message: 'Server error saving rating' });
    }
});

module.exports = router;
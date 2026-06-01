const express = require('express');
const router  = express.Router();
const Temple  = require('../models/Temple');
const { protect, admin } = require('../middleware/auth');

// GET /api/temples
router.get('/', async (req, res) => {
    try {
        const { search, state, deity, lat, lng, radius } = req.query;
        let query = { status: 'approved' };

        if (state) query.state   = { $regex: state, $options: 'i' };
        if (deity) query.deities = { $regex: deity, $options: 'i' };

        if (lat && lng) {
            const radiusInMeters = (parseFloat(radius) || 50) * 1000;
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: radiusInMeters
                }
            };
        }

        if (search) {
            query.$or = [
                { name:  { $regex: search, $options: 'i' } },
                { city:  { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
                { deities: { $regex: search, $options: 'i' } }
            ];
            // Remove state filter when searching to avoid conflict
            delete query.state;
        }

        const temples = await Temple.find(query).sort({ averageRating: -1, createdAt: -1 });
        res.json(temples);
    } catch (error) {
        console.error('GET /api/temples error:', error.message);
        res.status(500).json({ message: 'Server error fetching temples' });
    }
});

// GET /api/temples/featured
router.get('/featured', async (req, res) => {
    try {
        const temples = await Temple.find({ status: 'approved', isFeatured: true }).limit(6);
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/temples/states
router.get('/states', async (req, res) => {
    try {
        const states = await Temple.distinct('state', { status: 'approved' });
        res.json(states.sort());
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/temples/admin/all
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const temples = await Temple.find({}).sort({ createdAt: -1 });
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/temples/:id/rate
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

// PUT /api/temples/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ message: 'Temple not found' });

        temple.status = status;

        if (temple.location && (!temple.location.coordinates || temple.location.coordinates.length === 0)) {
            temple.location = undefined;
        }

        await temple.save();
        res.json(temple);
    } catch (error) {
        console.error('Status update error:', error.message);
        res.status(500).json({ message: 'Server error updating status' });
    }
});

// GET /api/temples/:id
router.get('/:id', async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id).populate('circuit', 'name description');
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json(temple);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/temples
router.post('/', protect, admin, async (req, res) => {
    try {
        const temple        = new Temple(req.body);
        const createdTemple = await temple.save();
        res.status(201).json(createdTemple);
    } catch (error) {
        res.status(400).json({ message: 'Invalid temple data', error: error.message });
    }
});

// PUT /api/temples/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json(temple);
    } catch (error) {
        res.status(400).json({ message: 'Invalid temple data' });
    }
});

// DELETE /api/temples/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const temple = await Temple.findByIdAndDelete(req.params.id);
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json({ message: 'Temple removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
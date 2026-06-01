const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const Temple   = require('../models/Temple');
const Circuit  = require('../models/Circuit');
const { protect, admin } = require('../middleware/auth');
const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
    durationSeconds: { type: Number, required: true },
    path:  { type: String },
    createdAt: { type: Date, default: Date.now }
});
const EngagementLog = mongoose.models.EngagementLog || mongoose.model('EngagementLog', engagementSchema);

// POST /api/analytics/engagement
router.post('/engagement', async (req, res) => {
    try {
        const { durationSeconds, path } = req.body;
        if (durationSeconds > 0) await EngagementLog.create({ durationSeconds, path });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/analytics/kpis
router.get('/kpis', protect, admin, async (req, res) => {
    try {
        const totalTemples    = await Temple.countDocuments({});
        const approvedTemples = await Temple.countDocuments({ status: 'approved' });
        const pendingTemples  = await Temple.countDocuments({ status: 'pending' });
        const totalUsers      = await User.countDocuments({});
        const totalCircuits   = await Circuit.countDocuments({});

        // Count total saves across all users
        const usersWithSaves  = await User.find({ savedTemples: { $exists: true, $not: { $size: 0 } } });
        const totalSaves      = usersWithSaves.reduce((sum, u) => sum + (u.savedTemples ? u.savedTemples.length : 0), 0);

        // Average rating across all temples
        const ratedTemples    = await Temple.find({ 'ratings.0': { $exists: true } });
        let totalRating = 0, ratingCount = 0;
        ratedTemples.forEach(t => {
            t.ratings.forEach(r => { totalRating += r.value; ratingCount++; });
        });
        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A';

        res.json({
            totalTemples,
            approvedTemples,
            pendingTemples,
            totalUsers,
            totalCircuits,
            totalSaves,
            avgRating
        });
    } catch (error) {
        console.error('KPI error:', error.message);
        res.status(500).json({ message: 'Server error fetching KPIs' });
    }
});

module.exports = router;
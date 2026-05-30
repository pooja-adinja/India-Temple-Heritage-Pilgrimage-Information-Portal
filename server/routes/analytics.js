const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Temple = require('../models/Temple');
const SearchLog = require('../models/SearchLog');
const { protect, admin } = require('../middleware/auth');
const mongoose = require('mongoose');

const engagementSchema = new mongoose.Schema({
    durationSeconds: { type: Number, required: true },
    path: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const EngagementLog = mongoose.models.EngagementLog || mongoose.model('EngagementLog', engagementSchema);

// @route   POST /api/analytics/engagement
// @desc    Log time spent on a page
// @access  Public
router.post('/engagement', async (req, res) => {
    try {
        const { durationSeconds, path } = req.body;
        if (durationSeconds > 0) {
            await EngagementLog.create({ durationSeconds, path });
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Error logging engagement:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/analytics/kpis
// @desc    Get all KPIs for Admin Dashboard
// @access  Private/Admin
router.get('/kpis', protect, admin, async (req, res) => {
    try {
        // 1. Number of Temples Listed
        const listedTemples = await Temple.countDocuments({ status: 'approved' });

        // 2. Monthly Active Users
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const mau = await User.countDocuments({ lastActiveAt: { $gte: thirtyDaysAgo } });

        // 3. Search Success Rate
        const totalSearches = await SearchLog.countDocuments();
        const successfulSearches = await SearchLog.countDocuments({ resultsCount: { $gt: 0 } });
        let searchSuccessRate = 0;
        if (totalSearches > 0) {
            searchSuccessRate = Math.round((successfulSearches / totalSearches) * 100);
        }

        // 4. Page Engagement Time (Average)
        const engagements = await EngagementLog.find();
        let avgEngagementSeconds = 0;
        if (engagements.length > 0) {
            const totalTime = engagements.reduce((sum, log) => sum + log.durationSeconds, 0);
            avgEngagementSeconds = Math.round(totalTime / engagements.length);
        }

        // 5. User Satisfaction Score
        const temples = await Temple.find({ 'ratings.0': { $exists: true } });
        let totalRating = 0;
        let ratingCount = 0;
        temples.forEach(t => {
            t.ratings.forEach(r => {
                totalRating += r.rating;
                ratingCount++;
            });
        });
        
        let userSatisfactionScore = 0;
        if (ratingCount > 0) {
            userSatisfactionScore = (totalRating / ratingCount).toFixed(1);
        }

        res.json({
            listedTemples,
            monthlyActiveUsers: mau,
            searchSuccessRate: `${searchSuccessRate}%`,
            avgEngagementTime: `${avgEngagementSeconds}s`,
            userSatisfactionScore: `${userSatisfactionScore} / 5.0`
        });

    } catch (error) {
        console.error("Error fetching KPIs:", error);
        res.status(500).json({ message: 'Server error fetching KPIs' });
    }
});

module.exports = router;

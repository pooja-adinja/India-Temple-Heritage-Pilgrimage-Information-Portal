const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Temple = require('../models/Temple');
const { protect } = require('../middleware/auth');

// @route   POST /api/users/save-temple/:id
// @desc    Toggle saving/unsaving a temple
// @access  Private
router.post('/save-temple/:id', protect, async (req, res) => {
    try {
        const templeId = req.params.id;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSaved = user.savedTemples.some(id => id.toString() === templeId);

        if (isSaved) {
            // Remove from saved
            user.savedTemples = user.savedTemples.filter(id => id.toString() !== templeId);
            await user.save();
            return res.json({ message: 'Temple removed from saved list', isSaved: false });
        } else {
            // Add to saved
            const temple = await Temple.findById(templeId);
            if (!temple) return res.status(404).json({ message: 'Temple not found' });

            user.savedTemples.push(templeId);
            await user.save();
            return res.json({ message: 'Temple saved', isSaved: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving temple' });
    }
});

// @route   GET /api/users/saved-temples
// @desc    Get user's saved temples
// @access  Private
router.get('/saved-temples', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedTemples');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.savedTemples);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching saved temples' });
    }
});

// @route   GET /api/users/me
// @desc    Get current user profile (including saved temples array for UI toggle)
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update activity
        user.lastActiveAt = Date.now();
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
});

module.exports = router;

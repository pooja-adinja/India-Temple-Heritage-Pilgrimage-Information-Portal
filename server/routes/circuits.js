const express = require('express');
const router  = express.Router();
const Circuit = require('../models/Circuit');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/circuits
// @desc    Get all circuits
// @access  Public
router.get('/', async (req, res) => {
    try {
        const circuits = await Circuit.find({}).populate('temples', 'name city state');
        res.json(circuits);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching circuits' });
    }
});

// @route   POST /api/circuits
// @desc    Create a new circuit
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const circuit = new Circuit(req.body);
        const createdCircuit = await circuit.save();
        res.status(201).json(createdCircuit);
    } catch (error) {
        res.status(400).json({ message: 'Invalid circuit data', error: error.message });
    }
});

// @route   DELETE /api/circuits/:id
// @desc    Delete a circuit
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const circuit = await Circuit.findByIdAndDelete(req.params.id);
        if (!circuit) return res.status(404).json({ message: 'Circuit not found' });
        res.json({ message: 'Circuit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting circuit' });
    }
});

module.exports = router;
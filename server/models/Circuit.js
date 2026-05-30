const mongoose = require('mongoose');

const circuitSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    region: { type: String },
    temples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Temple' }],
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Circuit', circuitSchema);

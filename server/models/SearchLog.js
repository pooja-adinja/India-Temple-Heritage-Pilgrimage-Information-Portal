const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
    queryText: { type: String, required: true },
    resultsCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchLog', searchLogSchema);

console.log("Temple model loaded");
const mongoose = require('mongoose');

const ritualSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timing: { type: String, required: true },
    description: { type: String }
});

const festivalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOrMonth: { type: String, required: true },
    description: { type: String }
});

const templeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    history: { type: String, required: true },
    significance: { type: String },
    deities: [{ type: String }],
    darshanTimings: { type: String, required: true },
    rituals: [ritualSchema],
    festivals: [festivalSchema],
    visitorGuidelines: { type: String },
    dressCode: { type: String },
    nearbyFacilities: { type: String },
    images: [{ type: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isFeatured: { type: Boolean, default: false },
    circuit: { type: mongoose.Schema.Types.ObjectId, ref: 'Circuit' },
    ratings: [{ value: { type: Number, min: 1, max: 5 }, createdAt: { type: Date, default: Date.now } }],
    averageRating: { type: Number, default: 0 },
    // GeoJSON location for geospatial queries
    //location: {
        //type: {
            //type: String,
            //enum: ['Point'],
            //default: 'Point'
        //},
        //coordinates: {
            //type: [Number], // [longitude, latitude]
            //default: undefined
        //}
    //},
    createdAt: { type: Date, default: Date.now }
});

// 2dsphere index for location-based queries
//templeSchema.index({ location: '2dsphere' });

// Text index for full-text search across name, city, state, history, deities
templeSchema.index({
    name: 'text',
    city: 'text',
    state: 'text',
    history: 'text',
    deities: 'text'
});

module.exports = mongoose.model('Temple', templeSchema);
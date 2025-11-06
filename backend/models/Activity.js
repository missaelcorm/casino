const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    BetStatus: {
        type: Boolean,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    dateGame: {
        type: Date,
        required: true,
    },
    nameGame: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
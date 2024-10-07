const mongoose = require('mongoose');

const tileSchema = new mongoose.Schema({
    color: {
        type: String,
        enum: ['red', 'blue', 'green', 'yellow', 'purple'],
        required: true
    },
    matched: {
        type: Boolean,
        default: false
    }
});

const gameSchema = new mongoose.Schema({
    board: [[tileSchema]],
    score: {
        type: Number,
        default: 0
    },
    moves: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date
});

module.exports = mongoose.model('Game', gameSchema);
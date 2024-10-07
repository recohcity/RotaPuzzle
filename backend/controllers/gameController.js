const Game = require('../models/Game');

exports.initializeGame = async (req, res) => {
    try {
        const game = new Game();
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error initializing game', error });
    }
};

exports.getGameState = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game state', error });
    }
};

exports.updateGameState = async (req, res) => {
    try {
        const { board, score, moves } = req.body;
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            { board, score, moves },
            { new: true }
        );
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error updating game state', error });
    }
};

exports.endGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error ending game', error });
    }
};

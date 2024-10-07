const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.initializeGame);
router.get('/:id', gameController.getGameState);
router.put('/:id', gameController.updateGameState);
router.put('/:id/end', gameController.endGame);

module.exports = router;

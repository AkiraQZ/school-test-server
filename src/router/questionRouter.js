const express = require('express');
const router = express.Router();
const QuestionsController = require('../databases/questionsController');

router.get('/', async (req, res) => {
  try {
    const questionsController = await QuestionsController();
    await questionsController.getAll(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting questions' });
  }
});

module.exports = router;

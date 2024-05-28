const express = require('express');
const router = express.Router();
const StudentsCodesController = require('../databases/studentsController');

router.get('/', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.getAll(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting students' });
  }
});

router.get('/one', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.getOne(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting students' });
  }
});

router.get('/some', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.getSome(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting student' });
  }
});

router.get('/:className', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.getSome(req, res);
  }
  catch (err) {
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.create(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating)' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.update(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating student' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const studentController = await StudentsCodesController();
    await studentController.delete(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

module.exports = router;
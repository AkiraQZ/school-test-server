const express = require('express');
const router = express.Router();
const TeacherCodesController = require('../databases/teacherController');

router.get('/', async (req, res) => {
  try {
    const teacherController = await TeacherCodesController();
    await teacherController.getAll(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting teachers' });
  }
});

router.get('/one', async (req, res) => {
  try {
    const teacherController = await TeacherCodesController();
    await teacherController.getOne(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting teacher' });
  }
});

router.post('/', async (req, res) => {
  try {
    const teacherController = await TeacherCodesController();
    await teacherController.create(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating teacher' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const teacherController = await TeacherCodesController();
    await teacherController.update(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating teacher' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const teacherController = await TeacherCodesController();
    await teacherController.delete(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting teacher' });
  }
});

module.exports = router;
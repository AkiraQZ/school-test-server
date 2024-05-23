const ObjectId = require('mongodb').ObjectId;
const { client, connectToDatabase } = require('./client');
const ShortUniqueId  = require('short-unique-id');
const uid = new ShortUniqueId({length: 10});

class TeacherCodesController {
  client = null;
  db = null;
  collection = null;

  async initialize() {
    this.client = client;
    this.db = this.client.db('users');
    this.collection = this.db.collection("teacher");
  }

  async getAll(req, res) {
    try {
      const response = await this.collection.find({}).toArray();
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting teachers' });
    }
  }

  async getOne(req, res) {
    try {
      const { id, fullName } = req.query;
      const query = {};
      if (id) query._id = new ObjectId(id);
      if (fullName) query.fullName = fullName;
      const response = await this.collection.findOne(query);
      if (!response) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting teacher' });
    }
  }

  async create(req, res) {
    try {
      let query = {};
      const {fullName, className } = req.body;
      if (!fullName || !className) {
        return res.status(400).json({ error: "Missing required fields"})
      }
      query.fullName = fullName;
      query.class = className;
      query.code = uid.rnd();
      query.role = 'teacher';
      const result = await this.collection.insertOne(query);
      return res.status(201).json({ message: 'Teacher created', id: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating teacher' });
    }
  }

  async update(req, res) {
    try {
      let query = {};
      const { id } = req.params;
      const { fullName, results, className } = req.body;

      if (results) query.results = results;
      if (fullName) query.fullName = fullName;
      if (className) query.class = className;

      const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: query});
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      return res.status(200).json({ message: 'Teacher updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating teacher' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      return res.status(200).json({ message: 'Teacher deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting teacher' });
    }
  }

  async close() {
    await this.client.close();
  }
}

module.exports = async () => {
  try {
    await connectToDatabase();
    const teacherController = new TeacherCodesController();
    await teacherController.initialize();
    return teacherController;
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
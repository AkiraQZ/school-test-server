const ObjectId = require('mongodb').ObjectId;
const { client, connectToDatabase } = require('./client');
const ShortUniqueId  = require('short-unique-id');
const uid = new ShortUniqueId({length: 10});

class StudentsCodesController {
  client = null;
  db = null;
  collection = null;

  async initialize() {
    this.client = client;
    this.db = this.client.db('users');
    this.collection = this.db.collection("students");
  }

  async getAll(req, res) {
    try {
      const response = await this.collection.find({}).toArray();
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting students' });
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
        return res.status(404).json({ error: 'Student not found' });
      }
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting student' });
    }
  }

  async getSome(req, res) {
    function compareByLastName(a, b) {
      const fullNameA = a.fullName.split(' ').pop();
      const fullNameB = b.fullName.split(' ').pop();
      if (fullNameA < fullNameB) return -1;
      if (fullNameA > fullNameB) return 1;
      return 0;
    }
    try {
      const { className } = req.query;
      if (!className) {
        if (!className) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
      }
      const query = {};
      query.class = className;
      const response = await this.collection.find(query).toArray();
      response.sort(compareByLastName);
      if (!response) {
        return res.status(404).json({ error: 'Student not found' });
      }
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting student' });
    }
  }

  async create(req, res) {
    try {
      let query = {}
      const { fullName, className } = req.query;
      if (!fullName || !className) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      query.fullName = fullName;
      query.class = className;
      query.code = uid.rnd();
      query.role = 'student';
      const result = await this.collection.insertOne(query);
      return res.status(201).json({ message: 'Student created', id: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating student' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { results, fullName, className } = req.body;
      
      let query = {};
      if (results) query.results = results;
      if (fullName) query.fullName = fullName;
      if (className) query.class = className;
  
      const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: query });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      return res.status(200).json({ message: 'Student updated' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating student' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.query;
      const result = await this.collection.deleteOne({ _id:  new ObjectId(id)});
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'student not found' });
      }
      return res.status(200).json({ message: 'student deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting student' });
    }
  }

  async close() {
    await this.client.close();
  }
}

module.exports = async () => {
  try {
    await connectToDatabase();
    const studentController = new StudentsCodesController();
    await studentController.initialize();
    return studentController;
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
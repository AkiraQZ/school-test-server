const {  client, connectToDatabase} = require('./client');

class QuestionsController {
  client = null;
  db = null;
  collection = null;

  async initialize() {
    this.client = client
    this.db = this.client.db('questions');
    this.collection = this.db.collection("stepanov's_test");
  }

  async getAll(req, res) {
    try {
      const questions = await this.collection.find({}).toArray();
      return res.status(200).json(questions);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error getting questions' });
    }
  }

 async close() {
    await this.client.close();
  }
}

module.exports = async () => {
  try {
    await connectToDatabase();
    const questionsController = new QuestionsController();
    await questionsController.initialize();
    return questionsController;
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
};
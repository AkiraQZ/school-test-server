require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const questionsRouter = require('./router/questionRouter');
const teacherCodesRouter = require('./router/teacherCodesRouter');
const studentsRouter = require('./router/studentRouter');
const fileActionsRouter = require('./router/fileActionsRouter');


const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
  res.send({ express: 'Connected' });
});
app.use('/questions', questionsRouter);
app.use('/teacher', teacherCodesRouter);
app.use('/student', studentsRouter);
app.use('/upload', fileActionsRouter)

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

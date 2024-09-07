const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const cors = require('cors');
app.use(cors()); // Middleware to allow requests from other origins
const UserRouter = require('./router/UserRouter');
const CourseRouter = require('./router/CourseRouter');
const AssignmentRouter = require('./router/AssignmentRouter');
const SessionRouter = require('./router/SessionRouter');
const ExamRouter = require('./router/ExamRouter');
app.use(UserRouter);
app.use(CourseRouter); app.use(AssignmentRouter);
app.use(SessionRouter); app.use(ExamRouter);
const port = 3008;

app.get((req, res, next) => {
    // Middleware to monitor requests and responses
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    res.end();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
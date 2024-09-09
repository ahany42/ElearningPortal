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

// Middleware to monitor requests and responses
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    next();
});

app.use(UserRouter);
app.use(CourseRouter); app.use(AssignmentRouter);
app.use(SessionRouter); app.use(ExamRouter);

const port = 3008;

// Middleware to catch any errors
app.use((req, res) => {
    console.log(`ERROR IN => Request URL: ${req.url}, Request Method: ${req.method}`);
    res.end();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
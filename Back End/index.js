const express = require('express');
const app = express();
const ENV = require('../env');
const port = ENV.Back_Port;
const { Session } = require('./db/Database');

// Middleware to parse JSON request bodies
app.use(express.json());
const cors = require('cors');

// Middleware to allow requests from other origins
app.use(cors({
    origin: ENV.Front_Origin,
    credentials: true
}));

// Importing routers
const UserRouter = require('./router/UserRouter');
const CourseRouter = require('./router/CourseRouter');
const AssignmentRouter = require('./router/AssignmentRouter');
const ExamRouter = require('./router/ExamRouter');

// Middleware to monitor requests and responses
app.use((req, res, next) => {
    console.log();
    console.warn('------------------------------------------------------');
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    console.warn('------------------------------------------------------');
    console.log();
    next();
});

// Linking routers to the app
app.use(UserRouter); app.use(CourseRouter);
app.use(AssignmentRouter); app.use(ExamRouter);

// Middleware to catch any errors
app.use((err, req, res, _) => {
    console.warn('------------------------------------------------------');
    console.error(err);
    console.warn('------------------------------------------------------');
    console.log();
    res.end();
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
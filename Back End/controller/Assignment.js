const {Assignment, AssignmentAnswer, Session, User, Course} = require('../db/Database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/assignments'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Naming the file
    }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB
});

// Test code
const oldDate = new Date();
oldDate.setTime(oldDate.getTime() + (5 * 60 * 1000));
const date = new Date();
date.setTime(oldDate.getTime() + (60 * 60 * 1000));
console.log(`(${oldDate.toUTCString()})` + "\n" + `(${date.toUTCString()})` )

// Controller for Assignments
class AssignmentController {

    // Create a new assignment
    async createAssignment(req, res, next) {
        try {
            const { courseID, startDate, duration, endDate, title } = req.body; // courseID as v4 uuid
            const document = req.file ? req.file.path : null; // Store document path from multer

            // Validate input
            if (!courseID || !startDate || !duration || !endDate || !title) {
                return res.status(200).json({ error: "All fields are required" });
            }

            // Check if the user is logged in
            if (!await Session.findOne()) {
                return res.status(200).json({ error: "You must be logged in to create an assignment" });
            }

            // Check if the assignment title already exists
            if (await Assignment.findOne({ title })) {
                return res.status(200).json({ error: "Assignment with the same title already exists" });
            }

            // Check if the end date is in the future
            if (endDate < new Date()) {
                return res.status(200).json({ error: "End date must be in the future" });
            }

            // Check if the start date is before the end date
            if (startDate > endDate) {
                return res.status(200).json({ error: "Start date must be before the end date" });
            }

            // Check if the duration is greater than 0
            if (duration <= 0) {
                return res.status(200).json({ error: "Duration must be greater than 0" });
            }

            // Check if the start date is in the future
            if (startDate < new Date()) {
                return res.status(200).json({error: "Start date must be in the future"});
            }

            // Check if the course exists
            const course = await Course.findOne({ id: courseID });
            if (!course) {
                return res.status(200).json({ error: "Course not found" });
            }

            // Check if the assignment already exists
            if (await Assignment.findOne({ courseID: course._id, startDate, endDate })) {
                return res.status(200).json({error: "Assignment with the same start and end date already exists"});
            }

            // check sql injection
            if (title.includes("'") || title.includes(";") || title.includes("--") ||
                startDate.toString().includes("'") || startDate.toString().includes(";") || startDate.toString().includes("--") ||
                endDate.toString().includes("'") || endDate.toString().includes(";") || endDate.toString().includes("--") ||
                duration.toString().includes("'") || duration.toString().includes(";") || duration.toString().includes("--") ||
                courseID.toString().includes("'") || courseID.toString().includes(";") || courseID.toString().includes("--")){
                return res.status(200).json({ error: "Invalid characters" });
            }

            let newAssignment;

            if (document) {
                // Create a new assignment object
                newAssignment = new Assignment({
                    id: uuidv4(),
                    courseID: course._id,
                    startDate,
                    duration,
                    endDate,
                    title,
                    document
                });
            } else {
                // Create a new assignment object
                newAssignment = new Assignment({
                    id: uuidv4(),
                    courseID: course._id,
                    startDate,
                    duration,
                    endDate,
                    title
                });
            }

            // Save to database
            const savedAssignment = await newAssignment.save();
            return res.status(201).json({data: savedAssignment});
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Create Assignment Function => ${err}`);
        }
    }

    // Solve (submit) an assignment
    async solveAssignment(req, res, next) {
        try {
            const { assignmentID, document } = req.body; // assignmentID as v4 uuid
            const student = await Session.findOne();

            // Check user logged in
            if (!student) {
                return res.status(200).json({ error: "You must be logged in to submit an assignment" });
            }

            // Validate input
            if (!assignmentID || !document) {
                return res.status(200).json({ error: "Assignment ID and document are required" });
            }

            // Check if the assignment exists
            const assignment =
                await Assignment.findOne({ id: assignmentID });
            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            // Check if the student has already submitted an answer for this assignment
            const existingAnswer =
                await AssignmentAnswer.findOne({ assignmentID: assignment._id, studentID: student.userID });
            if (existingAnswer) {
                return res.status(200).json({ error: "You have already submitted this assignment" });
            }

            // Create a new assignment answer submission
            const newAssignmentAnswer = new AssignmentAnswer({
                id: uuidv4(),
                document,
                assignmentID: assignment._id,
                studentID: student.userID,
                grade: null // Grade can be null initially, to be graded later by the instructor
            });

            // Save the student's answer to the database
            const savedAnswer = await newAssignmentAnswer.save();
            return res.status(201).json({ message: "Assignment submitted successfully", data: savedAnswer });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occured" });
            next(`ERROR IN: Solve Assignment Function => ${err}`);
        }
    }

    // Grade an assignment
    async gradeAssignment(req, res, next) {
        try {
            const { assignmentID, studentID, grade } = req.body; // Get the assignment ID, student ID as v4 uuid
            const instructor = await Session.findOne();

            // Check if the user is logged in
            if (!instructor) {
                return res.status(200).json({ error: "You must be logged in to grade an assignment" });
            }

            // Validate input
            if (!assignmentID || !studentID || !grade) {
                return res.status(200).json({ error: "Assignment ID, student ID, and grade are required" });
            }

            // Check if the assignment exists
            const assignment = await Assignment.findOne({ id: assignmentID });
            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            // Check if the student exists
            const student = await User.findOne({ id: studentID });
            if (!student) {
                return res.status(200).json({ error: "Student not found" });
            }

            // Check if the student has submitted an answer for this assignment
            const answer = await AssignmentAnswer.findOne({ assignmentID: assignment._id,
                            studentID: student._id });
            if (!answer) {
                return res.status(200).json({ error: "Student has not submitted an answer for this assignment" });
            }

            // Update the grade
            answer.grade = grade;
            const updatedAnswer = await answer.save();
            return res.status(201).json({ message: "Assignment graded successfully", data: updatedAnswer });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Grade Assignment Function => ${err}`);
        }
    }

    // Get all assignments
    async getAllAssignments(req, res, next) {
        try {

            // Check if the user is logged in
            if (!await Session.findOne()) {
                return res.status(200).json({ error: "You must be logged in to create an assignment" });
            }

            const assignments = await Assignment.find().populate('courseID', 'title');
            return res.status(201).json({ data: assignments });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Get All Assignments Function => ${err}`);
        }
    }

    // Get a single assignment by ID
    async getAssignmentById(req, res, next) {
        try {

            // Check if the user is logged in
            if (!await Session.findOne()) {
                return res.status(200).json({ error: "You must be logged in to create an assignment" });
            }

            const assignmentID = req.params.id;
            const assignment = await Assignment.findOne({ id: assignmentID }).populate('courseID', 'title');

            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            return res.status(201).json({data: assignment});
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Get Assignment By ID Function => ${err}`);
        }
    }

    // Update an existing assignment
    async updateAssignment(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid
            const { title, startDate, endDate, duration } = req.body;
            const document = req.file ? req.file.path : null; // Store document path from multer

            // Check if the user is logged in
            if (!await Session.findOne()) {
                return res.status(200).json({ error: "You must be logged in to create an assignment" });
            }

            // Find the assignment
            const assignment = await Assignment.findOne({ id: assignmentID });

            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            if (assignment.endDate < new Date()) {
                return res.status(200).json({error: "Assignment has ended and cannot be updated"});
            }

            if (!title || !startDate || !endDate || !duration) {
                return res.status(200).json({ error: "All fields are required" });
            }

            // Update assignment fields
            assignment.title = title; assignment.duration = duration;
            assignment.startDate = startDate; assignment.endDate = endDate;

            if (document) {
                assignment.document = document;
            }

            // Save the updated assignment
            const updatedAssignment = await assignment.save();
            return res.status(201).json({ message: "Assignment updated successfully", data: updatedAssignment });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Update Assignment Function => ${err}`);
        }
    }

    // Delete an assignment by ID
    async deleteAssignment(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid

            // Check if the user is logged in
            if (!await Session.findOne()) {
                return res.status(200).json({ error: "You must be logged in to create an assignment" });
            }

            // Find and delete the assignment
            const assignment = await Assignment.findOneAndDelete({ id: assignmentID });

            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            // Get the path to the assignment document (file)
            const filePath = assignment.document ? path.join(__dirname, '..', assignment.document) : null;

            // First, delete the assignment
            await Assignment.findOneAndDelete({ id: assignmentID });

            // If a document is associated with the assignment, delete the file from the file system
            if (filePath) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        res.status(200).json({ error: "Failed to delete associated file." });
                        next(`ERROR IN: Delete Assignment Function => ${err}`);
                        return;
                    }

                    // Return success response after the file and the assignment are deleted
                    return res.status(201).json({ message: `Assignment (${assignment.title}) and associated file deleted successfully` });
                });
            } else {
                // If there is no associated file, return success response for assignment deletion
                return res.status(201).json({ message: `Assignment (${assignment.title}) deleted successfully, no associated file found` });
            }
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Delete Assignment Function => ${err}`);
        }
    }
}

// Middleware to handle the file upload
const uploadAssignmentDoc = (req, res, next) => {
    try {

        const uploadSingle = upload.single('pdf');

        uploadSingle(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // Multer-specific error occurred
                res.status(200).json({error: err.message});
                next(`ERROR IN: uploadAssignmentDoc function => ${err.message}`);
                return;
            } else if (err) {
                // Other errors like invalid file types
                res.status(200).json({error: err.message});
                next(`ERROR IN: uploadAssignmentDoc function => ${err.message}`);
                return;
            }

            next();
        });
    } catch (e) {
        res.status(200).json({error: e.message});
        next(`ERROR IN: uploadAssignmentDoc function => ${e.message}`);
    }
};

// Export the controller instance
module.exports = { Controller: new AssignmentController(), uploadAssignmentDoc };
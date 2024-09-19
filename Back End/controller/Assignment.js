const {Assignment, AssignmentAnswer, Session, User, Course} = require('../db/Database');
const { v4: uuidv4 } = require('uuid');

// Controller for Assignments
class AssignmentController {

    // Create a new assignment
    async createAssignment(req, res, next) {
        try {
            const { courseID, startDate, duration, endDate, title, document } = req.body; // courseID as v4 uuid

            // Validate input
            if (!courseID || !startDate || !duration || !endDate || !title || !document) {
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
                document.toString().includes("'") || document.toString().includes(";") || document.toString().includes("--") ||
                startDate.toString().includes("'") || startDate.toString().includes(";") || startDate.toString().includes("--") ||
                endDate.toString().includes("'") || endDate.toString().includes(";") || endDate.toString().includes("--") ||
                duration.toString().includes("'") || duration.toString().includes(";") || duration.toString().includes("--") ||
                courseID.toString().includes("'") || courseID.toString().includes(";") || courseID.toString().includes("--")){
                return res.status(200).json({ error: "Invalid characters" });
            }

            // Create a new assignment object
            const newAssignment = new Assignment({
                id: uuidv4(),
                courseID: course._id,
                startDate,
                duration,
                endDate,
                title,
                document
            });

            // Save to database
            const savedAssignment = await newAssignment.save();
            return res.status(201).json({data: savedAssignment});
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occured" });
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
            res.status(200).json({ error: "Unexpected Error Occured" });
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
            res.status(200).json({ error: "Unexpected Error Occured" });
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
            res.status(200).json({ error: "Unexpected Error Occured" });
            next(`ERROR IN: Get Assignment By ID Function => ${err}`);
        }
    }

    // Update an existing assignment
    async updateAssignment(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid
            const { title, document, startDate, endDate, duration } = req.body;

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

            if (!title || !document || !startDate || !endDate || !duration) {
                return res.status(200).json({ error: "All fields are required" });
            }

            // Update assignment fields
            assignment.title = title; assignment.document = document;
            assignment.startDate = startDate; assignment.endDate = endDate;
            assignment.duration = duration;

            // Save the updated assignment
            const updatedAssignment = await assignment.save();
            return res.status(201).json({ message: "Assignment updated successfully", data: updatedAssignment });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occured" });
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

            return res.status(201).json({ message: `Assignment (${assignment.title}) deleted successfully` });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occured" });
            next(`ERROR IN: Delete Assignment Function => ${err}`);
        }
    }
}

// Export the controller instance
module.exports = new AssignmentController();
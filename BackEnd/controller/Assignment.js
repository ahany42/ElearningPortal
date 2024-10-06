const {Assignment, AssignmentAnswer, User, Course, Student_Course, Instructor_Course} = require('../db/Database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for assignment uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/assignments'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Naming the file
    }
});

// Configure multer for assignments solution uploads
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/assignments_solutions'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Naming the file
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

const assignment_doc_upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB
});

const assignment_answer_upload = multer({
    storage: storage2,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB
});

// Controller for Assignments
class AssignmentController {

    // Create a new assignment
    async createAssignment(req, res, next) {
        try {
            const { courseID, startDate, duration, endDate, title, description } = req.body; // courseID as v4 uuid
            const document = req.file ? req.file.path : null; // Store document path from multer

            // Validate input
            if (!courseID || !startDate || !duration || !endDate || !title) {
                return deleteAssociateFiles(document, "All fields are required", res, next);
            }

            // Check if the assignment title already exists
            if (await Assignment.findOne({ title })) {
                return deleteAssociateFiles(document, "Assignment with the same title already exists", res, next);
            }

            // Check if the end date is in the future
            if (endDate < new Date()) {
                return deleteAssociateFiles(document, "End date must be in the future", res, next);
            }

            // Check if the start date is before the end date
            if (startDate > endDate) {
                return deleteAssociateFiles(document, "Duration must be greater than 0", res, next);
            }

            // Check if the duration is greater than 0
            if (duration <= 0) {
                return deleteAssociateFiles(document, "Duration must be greater than 0", res, next);
            }

            // Check if the start date is in the future
            if (startDate < new Date()) {
                return deleteAssociateFiles(document, "Start date must be in the future", res, next);
            }

            // Check if the course exists
            const course = await Course.findOne({ id: courseID });
            if (!course) {
                return deleteAssociateFiles(document, "Course not found", res, next);
            }

            // Check if the assignment already exists
            if (await Assignment.findOne({ courseID: course._id, startDate, endDate })) {
                return deleteAssociateFiles(document,
                    "Assignment with the same start and end date already exists", res, next);
            }

            // check sql injection
            if (title.includes("'") || title.includes(";") || title.includes("--") ||
                startDate.toString().includes("'") || startDate.toString().includes(";") || startDate.toString().includes("--") ||
                endDate.toString().includes("'") || endDate.toString().includes(";") || endDate.toString().includes("--") ||
                duration.toString().includes("'") || duration.toString().includes(";") || duration.toString().includes("--") ||
                courseID.toString().includes("'") || courseID.toString().includes(";") || courseID.toString().includes("--")){
                return deleteAssociateFiles(document, "Invalid characters", res, next);
            }

            let newAssignment;

            // Create a new assignment object
            newAssignment = new Assignment({
                id: uuidv4(),
                courseID: course._id,
                startDate,
                duration,
                endDate,
                title,
                description,
                document
            });

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
            const { assignmentID } = req.body; // assignmentID as v4 uuid
            const document = req.file ? req.file.path : null; // Store document path from multer
            const student = req.user;

            const user = await User.findOne({ id: student.id });

            // Validate input
            if (!assignmentID || !document) {
                return deleteAssociateFiles(document, "Assignment ID and document are required", res, next);
            }

            if (student.role.toLowerCase() !== "student") {
                return deleteAssociateFiles(document, "Invalid role, students only can solve", res, next);
            }

            // Check if the assignment exists
            const assignment =
                await Assignment.findOne({ id: assignmentID });
            if (!assignment) {
                return deleteAssociateFiles(document, "Assignment not found", res, next);
            }

            // Check if the student has already submitted an answer for this assignment
            const existingAnswer =
                await AssignmentAnswer.findOne({ assignmentID: assignment._id, studentID: user._id });
            if (existingAnswer) {
                return deleteAssociateFiles(document, "You have already submitted this assignment", res, next);
            }

            // Create a new assignment answer submission
            const newAssignmentAnswer = new AssignmentAnswer({
                id: uuidv4(),
                document,
                assignmentID: assignment._id,
                studentID: user._id,
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

    // Delete an assignment answer by assignment id & logged in student
    async deleteAssignmentAnswer(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid
            const { studentID } = req.body;

            // Validate input
            if (!assignmentID || !studentID) {
                return res.status(200).json({ error: "Assignment ID & Student ID are required" });
            }

            const student = await User.findOne({ id: studentID });
            if (!student) {
                return res.status(200).json({ error: "Student not found" });
            }

            // Check if the assignment exists
            const assignment =
                await Assignment.findOne({ id: assignmentID });
            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }
            console.log(assignment._id, student._id)

            // Check if the student has already submitted an answer for this assignment
            const existingAnswer =
                await AssignmentAnswer.findOne({ assignmentID : assignment._id, studentID: student._id });
            if (!existingAnswer) {
                return res.status(200).json({ error: "You have not submitted this assignment" });
            }

            // Delete the student's answer file from the file system
            const filePath = existingAnswer.document ? path.join(__dirname, '..', existingAnswer.document) : null;
            if (filePath) {
                fs.unlink(filePath, async (err) => {
                    if (err) {
                        next(`WARNING IN: Delete Assignment Answer Function => ${err}`);
                        await AssignmentAnswer.findOneAndDelete({ _id: existingAnswer._id });
                        return res.status(201).json({ message: "Assignment answer deleted successfully" });
                    }
                });
            }

            // Delete the student's answer from the database
            await AssignmentAnswer.findOneAndDelete({ _id: existingAnswer._id });
            return res.status(201).json({ message: "Assignment answer deleted successfully" });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occured" });
            next(`ERROR IN: Delete Assignment Answer Function => ${err}`);
        }
    }

    // Grade an assignment
    async gradeAssignment(req, res, next) {
        try {
            const { assignmentID, studentID, grade } = req.body; // Get the assignment ID, student ID as v4 uuid
            const instructor = req.user;

            if (instructor.role.toLowerCase() !== "instructor") {
                return res.status(200).json({ error: "Invalid role of instructorId" });
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

            if (student.role.toLowerCase() !== "student") {
                return res.status(200).json({ error: "Invalid role of studentId" });
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
            const assignments = await Assignment.find().populate('courseID', 'id');
            const user = await User.findOne({ id: req.user.id });

            if (user.role.toLowerCase() === "student") {
                let myAssignments = [];
                for (const assignment of assignments) {
                    if (await Student_Course.findOne({ studentID: user._id, courseID: assignment.courseID })) {
                        myAssignments.push({
                            id: assignment.id,
                            title: assignment.title,
                            startDate: assignment.startDate,
                            endDate: assignment.endDate,
                            duration: assignment.duration,
                            document: assignment.document,
                            description: assignment.description,
                            courseID: assignment.courseID.id
                        });
                    }
                }
                return res.status(201).json({ data: myAssignments });
            } else if (user.role.toLowerCase() === "instructor") {
                let myAssignments = [];
                for (const assignment of assignments) {
                    if (await Instructor_Course.findOne({ studentID: user._id, courseID: assignment.courseID })) {
                        myAssignments.push({
                            id: assignment.id,
                            title: assignment.title,
                            startDate: assignment.startDate,
                            endDate: assignment.endDate,
                            duration: assignment.duration,
                            document: assignment.document,
                            description: assignment.description,
                            courseID: assignment.courseID.id
                        });
                    }
                }
                return res.status(201).json({ data: myAssignments });
            } else {
                return res.status(201).json({ data:
                    assignments.map(assignment => ({
                        id: assignment.id,
                        title: assignment.title,
                        startDate: assignment.startDate,
                        endDate: assignment.endDate,
                        duration: assignment.duration,
                        document: assignment.document,
                        description: assignment.description,
                        courseID: assignment.courseID.id
                    }))
                });
            }

        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Get All Assignments Function => ${err}`);
        }
    }

    // Get a single assignment by ID
    async getAssignmentById(req, res, next) {
        try {
            const assignmentID = req.params.id;
            const assignment = await Assignment.findOne({ id: assignmentID }).populate('courseID', 'id');

            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            return res.status(201).json({data: {
                id: assignment.id,
                title: assignment.title,
                startDate: assignment.startDate,
                endDate: assignment.endDate,
                duration: assignment.duration,
                document: assignment.document,
                courseID: assignment.courseID.id
            }});
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Get Assignment By ID Function => ${err}`);
        }
    }

    // Update an existing assignment
    async updateAssignment(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid
            const { title, startDate, endDate, duration, description } = req.body;
            const document = req.file ? req.file.path : null; // Store document path from multer

            // Find the assignment
            const assignment = await Assignment.findOne({ id: assignmentID });

            if (!assignment) {
                return deleteAssociateFiles(document, "Assignment not found", res, next);
            }

            if (!title || !startDate || !endDate || !duration) {
                return deleteAssociateFiles(document, "All fields are required", res, next);
            }

            // Delete the old assignment document (file) from the file system (if it exists)
            if (assignment.document) {
                fs.unlink(assignment.document, (err) => {
                    if (err) {
                        return deleteAssociateFiles(document, "Error updating assignment", res, next);
                    }
                });
            }

            // Update assignment fields
            assignment.title = title; assignment.duration = duration;
            assignment.startDate = startDate; assignment.endDate = endDate;
            assignment.document = document; assignment.description = description;

            // Save the updated assignment
            const updatedAssignment = await assignment.save();
            return res.status(201).json({ message: "Assignment updated successfully", data: updatedAssignment });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Update Assignment Function => ${err}`);
        }
    }

    // Update an existing assignment solution
    async updateAssignmentAnswer(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid
            const document = req.file ? req.file.path : null; // Store document path from multer

            if (req.user.role.toLowerCase() === "student") {
                // Find the assignment
                const assignment = await Assignment.findOne({ id: assignmentID });

                if (!assignment) {
                    return deleteAssociateFiles(document, "Assignment not found", res, next);
                }

                const student = await User.findOne({ id: req.user.id });

                if (!student) {
                    return deleteAssociateFiles(document, "Student not found", res, next);
                }

                if (!document) {
                    return deleteAssociateFiles(document, "All fields are required", res, next);
                }

                const assignmentAnswer =
                    await AssignmentAnswer.findOne({ assignmentID: assignment._id, studentID: student._id});

                if (!assignmentAnswer) {
                    return deleteAssociateFiles(document, "Assignment answer not found", res, next);
                }

                if (assignmentAnswer.document) {
                    fs.unlink(assignmentAnswer.document, (err) => {
                        if (err) {
                            return deleteAssociateFiles(document, "Error updating assignment answer", res, next);
                        }
                    });
                }

                // Update assignment answer document (For both Instructor and Student)
                assignmentAnswer.document = document;

                // Save the updated assignment
                const updatedAssignmentAnswer = await assignmentAnswer.save();
                return res.status(201).json(
                    { message: "Assignment answer updated successfully", data: updatedAssignmentAnswer });
            } else {
                return deleteAssociateFiles(document, "You are not authorised", res, next);
            }
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Update Assignment Function => ${err}`);
        }
    }

    // Delete an assignment by ID
    async deleteAssignment(req, res, next) {
        try {
            const assignmentID = req.params.id; // assignmentID as v4 uuid

            // Find and delete the assignment
            const assignment = await Assignment.findOne({ id: assignmentID });

            if (!assignment) {
                return res.status(200).json({ error: "Assignment not found" });
            }

            // Get the path to the assignment document (file)
            const filePath = assignment.document ? path.join(__dirname, '..', assignment.document) : null;

            // If a document is associated with the assignment, delete the file from the file system
            if (filePath) {
                fs.unlink(filePath, async (err) => {
                    if (err) {
                        next(`WARNING IN: Delete Assignment Function => ${err}`);
                        // CREATE FUNCTION TO DELETE THE FILE & ALL ANSWERS RELATED TO THE ASSIGNMENT
                        await deleteAssignmentFiles(assignment._id);
                        await Assignment.findOneAndDelete({ id: assignmentID });
                        return res.status(201).json({ message: `Assignment (${assignment.title}) deleted successfully` });
                    }
                });
            }
            // CREATE FUNCTION TO DELETE THE FILE & ALL ANSWERS RELATED TO THE ASSIGNMENT
            await deleteAssignmentFiles(assignment._id);
            await Assignment.findOneAndDelete({ id: assignmentID });
            return res.status(201).json({ message: `Assignment (${assignment.title}) deleted successfully` });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Delete Assignment Function => ${err}`);
        }
    }
}

// FUNCTION TO DELETE THE FILE & ALL ANSWERS RELATED TO THE ASSIGNMENT
async function deleteAssignmentFiles(assignmentID) {
    const assignmentAnswers = await AssignmentAnswer.find({ assignmentID: assignmentID });
    let errors = [];

    // Delete all answers related to the assignment
    for (const answer of assignmentAnswers) {
        await AssignmentAnswer.findOneAndDelete({ _id: answer._id });

        // Get the path to the assignment answer document (file)
        const filePath = answer.document ? path.join(__dirname, '..', answer.document) : null;

        // If a document is associated with the assignment answer, delete the file from the file system
        if (filePath) {
            fs.unlink(filePath, async (err) => {
                if (err) {
                    errors.push(`WARNING IN: Delete Assignment File Function => ${err}`);
                }
            });
        }
    }

    if (errors.length > 0) {
        return {error: errors };
    } else {
        return {message: "Assignment file and all related answers deleted successfully"};
    }
}

// Function to delete associated files if error
function deleteAssociateFiles(document, errMsg, res, next) {
    if (document) {
        fs.unlink(document, (err) => {
            if (err) {
                next(`WARNING IN: Delete Assignment Answer Function => ${err}`);
                return res.status(200).json({ error: errMsg });
            }
        });
    }
    return res.status(200).json({ error: errMsg });
}

// Middleware to handle the file upload
const uploadAssignmentDoc = (req, res, next) => {
    try {

        const uploadSingle = assignment_doc_upload.single('pdf');

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

// Middleware to handle the file upload
const uploadAssignmentAnswerDoc = (req, res, next) => {
    try {
        const uploadSingle = assignment_answer_upload.single('pdf');

        uploadSingle(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // Multer-specific error occurred
                res.status(200).json({error: err.message});
                next(`ERROR IN: uploadAssignmentAnswerDoc function => ${err.message}`);
                return;
            } else if (err) {
                // Other errors like invalid file types
                res.status(200).json({error: err.message});
                next(`ERROR IN: uploadAssignmentAnswerDoc function => ${err.message}`);
                return;
            }

            next();
        });
    } catch (e) {
        res.status(200).json({error: e.message});
        next(`ERROR IN: uploadAssignmentAnswerDoc function => ${e.message}`);
    }
};

// Export the controller instance
module.exports = { Controller: new AssignmentController(), uploadAssignmentDoc, uploadAssignmentAnswerDoc };
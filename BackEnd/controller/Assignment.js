const {Assignment, AssignmentAnswer, User, Course,
    Student_Course, Instructor_Course, Exam} = require('../db/Database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");

// Configure multer for assignment uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/assignments'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.replaceAll(' ', '_')}`); // Naming the file
    }
});

// Configure multer for assignments solution uploads
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/assignments_solutions'); // Folder where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.replaceAll(' ', '_')}`); // Naming the file
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
            res.status(200).json({ error: "Unexpected Error Occurred" });
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

            // Check if the student has already submitted an answer for this assignment
            const existingAnswer =
                await AssignmentAnswer.findOne({ assignmentID : assignment._id, studentID: student._id });
            if (!existingAnswer) {
                return res.status(200).json({ error: "You have not submitted this assignment" });
            }

            // Delete the student's answer file from the file system
            const filePath = existingAnswer.document ? path.join(__dirname, '..', existingAnswer.document) : null;
            if (filePath && fs.existsSync(filePath)) {
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

    // Get all assignments/exams progress for a student
    async getStudentProgress(req, res, next) {
        try {
            const { studentID } = req.query; // studentID as v4 uuid

            const user = await User.findOne({ id: studentID, role: "Student" });
            if (!user) {
                return res.status(200).json({ error: "Invalid Student ID" });
            }

            const assignments = await Assignment.aggregate([
                {
                    $lookup: {
                        from: "assignmentanswers",
                        localField: "_id",
                        foreignField: "assignmentID",
                        as: "assignment_answers"
                    },
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseID',
                        foreignField: '_id',
                        as: 'course',
                    }
                },
                {
                    $addFields: {
                        course: { $arrayElemAt: ["$course.id", 0] } // Extract only courseID from the course array
                    }
                },
                {
                    $addFields: {
                        isExam: false
                    }
                },
                {
                    $project: {
                        id: 1,
                        title: 1,
                        course: 1,
                        isExam: 1,
                        deadline: {
                            $dateToString: {
                                format: "%d-%m-%Y %H:%M",
                                date: "$endDate",
                                timezone: "Egypt"
                            }
                        },
                        grade: {
                            $cond: {
                                if: { $ne: [{ $size: "$assignment_answers" }, 0] },
                                then: { $arrayElemAt: ["$assignment_answers.grade", 0] },
                                else: null
                            }
                        },
                        isSubmitted: {
                            $cond: {
                                if: { $eq: [{ $size: "$assignment_answers" }, 0] },
                                then: false,
                                else: true
                            }
                        },
                        assignmentAnswer: {
                            $cond: {
                                if: { $gt: [{ $size: "$assignment_answers" }, 0] },
                                then: { $arrayElemAt: ["$assignment_answers.document", 0] },
                                else: null
                            }
                        }
                    }
                }
            ]);

            const exams = await Exam.aggregate([
                {
                    $lookup: {
                        from: "studentexams",
                        let: { examId: "$_id", userId: user._id }, // Passing both examID and userID as variables
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$examID", "$$examId"] },  // Match examID
                                            { $eq: ["$studentID", "$$userId"] }  // Match studentID
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "student_exams"
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseID',
                        foreignField: '_id',
                        as: 'course',
                    }
                },
                {
                    $addFields: {
                        course: { $arrayElemAt: ["$course.id", 0] } // Extract course ID from course array
                    }
                },
                {
                    $addFields: {
                        isExam: true
                    }
                },
                {
                    $addFields: {
                        isSubmitted: {
                            $cond: {
                                if: { $gt: [{ $size: "$student_exams" }, 0] },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $project: {
                        id: 1,
                        title: 1,
                        course: 1,
                        isExam: 1,
                        deadline: {
                            $dateToString: {
                                format: "%d-%m-%Y %H:%M",
                                date: "$endDate",
                                timezone: "Egypt"
                            }
                        },
                        grade: {
                            $cond: {
                                if: { $ne: [{ $size: "$student_exams" }, 0] },
                                then: { $arrayElemAt: ["$student_exams.grade", 0] },
                                else: null
                            }
                        },
                        isSubmitted: 1
                    }
                }
            ]);

            res.status(201).json({ data: [...assignments, ...exams] });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: Get Student Progress Function => ${err}`);
        }
    }

    // Get all course materials
    async getCourseMaterials(req, res, next) {
        try {
            const { courseId } = req.query;

            const course = await Course.findOne({ id: courseId });
            if (!course || !course.id) {
                return res.status(200).json({ error: "Course ID is required" });
            }

            // Aggregation pipeline to get course materials
            const courseMaterials = await Course.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(course._id) }
                },
                {
                    $lookup: {
                        from: "assignments",
                        localField: "_id",
                        foreignField: "courseID",
                        as: "assignments"
                    }
                },
                {
                    $lookup: {
                        from: "assignmentanswers",
                        localField: "assignments._id",
                        foreignField: "assignmentID",
                        as: "assignmentAnswers"
                    }
                },
                {
                    $lookup: {
                        from: "exams",
                        localField: "_id",
                        foreignField: "courseID",
                        as: "exams"
                    }
                },
                {
                    $lookup: {
                        from: "studentexams",
                        localField: "exams._id",
                        foreignField: "examID",
                        as: "examAnswers"
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "_id",
                        foreignField: "courseId",
                        as: "posts"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "posts.creatorId",
                        foreignField: "_id",
                        as: "postCreators"
                    }
                },
                {
                    $lookup: {
                        from: "instructor_courses",
                        localField: "_id",
                        foreignField: "courseID",
                        as: "instructorCourses"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "instructorCourses.instructorID",
                        foreignField: "_id",
                        as: "instructors"
                    }
                },
                {
                    $project: {
                        assignments: {
                            $map: {
                                input: "$assignments",
                                as: "assignment",
                                in: {
                                    id: "$$assignment.id",
                                    materialType: "assignment",
                                    submitted: {
                                        $cond: {
                                            if: {
                                                $gt: [
                                                    {
                                                        $size: {
                                                            $filter: {
                                                                input: { $ifNull: ["$assignmentAnswers", []] },
                                                                as: "answer",
                                                                cond: { $eq: ["$$answer.assignmentID", "$$assignment._id"] }
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            then: true,
                                            else: false
                                        }
                                    },
                                    title: "$$assignment.title",
                                    startDate: {
                                        $dateToString: {
                                            format: "%d %b %Y (%H:%M)",
                                            date: "$$assignment.startDate",
                                            timezone: "Egypt"
                                        }
                                    },
                                    endDate: {
                                        $dateToString: {
                                            format: "%d %b %Y (%H:%M)",
                                            date: "$$assignment.endDate",
                                            timezone: "Egypt"
                                        }
                                    }
                                }
                            }
                        },
                        exams: {
                            $map: {
                                input: "$exams",
                                as: "exam",
                                in: {
                                    id: "$$exam.id",
                                    materialType: "exam",
                                    submitted: {
                                        $cond: {
                                            if: {
                                                $gt: [
                                                    {
                                                        $size: {
                                                            $filter: {
                                                                input: { $ifNull: ["$examAnswers", []] },
                                                                as: "answer",
                                                                cond: { $eq: ["$$answer.examID", "$$exam._id"] }
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            },
                                            then: true,
                                            else: false
                                        }
                                    },
                                    title: "$$exam.title",
                                    startDate: {
                                        $dateToString: {
                                            format: "%d %b %Y (%H:%M)",
                                            date: "$$exam.startDate",
                                            timezone: "Egypt"
                                        }
                                    },
                                    endDate: {
                                        $dateToString: {
                                            format: "%d %b %Y (%H:%M)",
                                            date: "$$exam.endDate",
                                            timezone: "Egypt"
                                        }
                                    }
                                }
                            }
                        },
                        posts: {
                            $map: {
                                input: "$posts",
                                as: "post",
                                in: {
                                    id: "$$post.id",
                                    materialType: "post",
                                    creator: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$postCreators",
                                                    as: "creator",
                                                    cond: { $eq: ["$$creator._id", "$$post.creatorId"] }
                                                }
                                            },
                                            0
                                        ]
                                    },
                                    createdAt: {
                                        $dateToString: {
                                            format: "%d %b %Y (%H:%M)",
                                            date: "$$post.createdAt",
                                            timezone: "Egypt"
                                        }
                                    },
                                    editedAt: {
                                        $cond: {
                                            if: { $ifNull: ["$$post.editedAt", false] },
                                            then: {
                                                $dateToString: {
                                                    format: "%d %b %Y (%H:%M)",
                                                    date: "$$post.editedAt",
                                                    timezone: "Egypt"
                                                }
                                            },
                                            else: null
                                        }
                                    },
                                    description: "$$post.title"
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        materials: {
                            $concatArrays: ["$assignments", "$exams", "$posts"]
                        }
                    }
                },
                {
                    $unwind: "$materials"
                },
                {
                    $group: {
                        _id: "$materials.id",
                        material: { $first: "$materials" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$material" }
                },
                {
                    $sort: { startDate: 1 }
                }
            ]);

            return res.status(201).json({ data: courseMaterials });
        } catch (err) {
            res.status(200).json({ error: "Unexpected Error Occurred" });
            next(`ERROR IN: getCourseMaterials function => ${err}`);
        }
    }

    // Get all assignments
    async getAllAssignments(req, res, next) {
        try {
            const user = await User.findOne({ id: req.user.id });

            // Determine the role of the user
            const role = user.role.toLowerCase();

            // Create an aggregation pipeline
            let matchStage = {};

            if (role === "student") {
                // Filter assignments for the student
                matchStage = {
                    $lookup: {
                        from: 'student_courses',
                        localField: 'courseID',
                        foreignField: 'courseID',
                        as: 'studentCourses',
                        pipeline: [
                            { $match: { studentID: user._id } }
                        ]
                    }
                };
            } else if (role === "instructor") {
                // Filter assignments for the instructor
                matchStage = {
                    $lookup: {
                        from: 'instructor_courses',
                        localField: 'courseID',
                        foreignField: 'courseID',
                        as: 'instructorCourses',
                        pipeline: [
                            { $match: { instructorID: user._id } }
                        ]
                    }
                };
            }

            // Aggregation pipeline for assignments
            const assignments = await Assignment.aggregate([
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseID',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                {
                    $unwind: '$course'
                },
                ...(Object.keys(matchStage).length ? [matchStage] : []),
                {
                    $addFields: {
                        courseID: '$course.id'
                    }
                },
                {
                    $project: {
                        id: 1,
                        title: 1,
                        startDate: {
                            $dateToString: {
                                format: "%d-%m-%Y\n(%H:%M)",
                                date: "$startDate",
                                timezone: "Egypt"
                            }
                        },
                        endDate: {
                            $dateToString: {
                                format: "%d-%m-%Y\n(%H:%M)",
                                date: "$endDate",
                                timezone: "Egypt"
                            }
                        },
                        duration: 1,
                        document: 1,
                        description: 1,
                        courseID: 1,
                        studentCourses: 1,
                        instructorCourses: 1
                    }
                }
            ]);

            // Filter results based on the user's role
            let filteredAssignments = assignments;
            if (role === "student") {
                filteredAssignments = assignments.filter((assignment, i) => {
                    if (assignment.studentCourses.length > 0) {
                        ['_id', 'studentCourses'].forEach(prop =>
                            delete assignments[i][prop]);
                        return true;
                    }
                    return false;
                });
            } else if (role === "instructor") {
                filteredAssignments = assignments.filter((assignment, i) => {
                    if (assignment.instructorCourses.length > 0) {
                        ['_id', 'instructorCourses'].forEach(prop =>
                            delete assignments[i][prop]);
                        return true;
                    }
                    return false;
                });
            }

            // Return the filtered assignments
            return res.status(201).json({ data: filteredAssignments });

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
            if (assignment.document && fs.existsSync(assignment.document)) {
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

                if (assignmentAnswer.document && fs.existsSync(assignmentAnswer.document)) {
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
            if (filePath && fs.existsSync(filePath)) {
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
        if (filePath && fs.existsSync(filePath)) {
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
    if (document && fs.existsSync(document)) {
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
const { Course, Student_Course, Instructor_Course, Exam, Assignment, User } = require('../db/Database');
const multer = require('multer');
const { v4 } = require('uuid');

// Configure multer for image uploads
const storage = multer.diskStorage({
       destination: function (req, file, cb) {
              cb(null, 'static/courses'); // Folder where images will be stored
       },
       filename: function (req, file, cb) {
              cb(null, Date.now() + '-' + file.originalname); // Naming the file
       }
});

const upload = multer({ storage: storage });

/*
    Functions to be implemented:
    - createCourse: (Done)
    - enrollCourse
    - getCourse
    - getStudentCourses
    - getInstructorCourses
    - getCourseExams
    - getCourseAssignments
    - getCourseStudents
    - getCourseInstructors
    - number of enrolled students in each course
    - is student enrolled in course
*/

class CourseController {

       async createCourse(req, res, next) {
              // Image handling added here
              const { title, desc, hours, instructorId } = req.body;
              const image = req.file ? req.file.path : null; // Store image path from multer
              const id = v4();

              const user =
                  await User.findOne({ id: instructorId });

              if (!title || !desc || !hours || !user) {
                     return res.status(200).json({ error: "All fields are required" });
              }

              if (user.role.toLowerCase() !== "instructor") {
                     return res.status(200).json({error: "Invalid role of instructorId"});
              }

              try {
                     const course = await Course.create({
                            title,
                            desc,
                            id,
                            hours,
                            image // Save the image path to the database
                     });

                     // Optionally, create an Instructor_Course association
                     await Instructor_Course.create({
                            instructorID: user._id,
                            courseID: course._id,
                            duration: hours
                     });

                     res.status(201).json({data: course, message: `Course (${title}) created successfully`});
              } catch (error) {
                     res.status(200).json({ error: error.message });
                     next(`ERROR IN: login function => ${error.message}`);
              }
       }

       async enrollCourse(req, res) {
              const { studentId, courseId } = req.body;
              try {
                     const studentCourse = await Student_Course.create({
                            studentID: studentId,
                            courseID: courseId
                     });
                     res.status(200).json(studentCourse);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }

       async getCourse(req, res) {
              const { courseId } = req.params;
              try {
                     const course = await Course.findOne({ _id: courseId });
                     res.status(200).json(course);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }

       async getStudentCourses(req, res) {
              const { studentId } = req.params;
              try {
                     const studentCourses = await Student_Course.find({ studentID: studentId });
                     res.status(200).json(studentCourses);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }

       async getInstructorCourses(req, res) {
              const { instructorId } = req.params;
              try {
                     const instructorCourses = await Instructor_Course.find({ instructorID: instructorId });
                     res.status(200).json(instructorCourses);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }

       async getCourseExams(req, res) {
              const { courseId } = req.params;
              try {
                     const courseExams = await Exam.find({ courseID: courseId });
                     res.status(200).json(courseExams);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }

       async getCourseAssignments(req, res) {
              const { courseId } = req.params;
              try {
                     const courseAssignments = await Assignment.find({ courseID: courseId });
                     res.status(200).json(courseAssignments);
              } catch (error) {
                     res.status(400).json({ error: error.message });
              }
       }
}

// Middleware for uploading course image
const uploadCourseImage = upload.single('image');

// Export the controller and middleware
module.exports = { Controller: new CourseController(), uploadCourseImage };
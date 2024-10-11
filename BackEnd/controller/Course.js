const { Course, Student_Course, Instructor_Course, Exam, Assignment, User } = require('../db/Database');
const multer = require('multer');
const { v4 } = require('uuid');
const path = require("path");
const fs = require("fs");

// Configure multer for image uploads
const storage = multer.diskStorage({
       destination: function (req, file, cb) {
              cb(null, 'static/courses'); // Folder where images will be stored
       },
       filename: function (req, file, cb) {
              cb(null, `${Date.now()}_${file.originalname.replaceAll(' ', '_')}`); // Naming the file
       }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
       // Accept image extensions: jpg, jpeg, png, gif, webp
       const filetypes = /jpg|jpeg|png|gif|webp|svg/;
       const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
       const mimetype = filetypes.test(file.mimetype);

       if (mimetype && extname) {
              return cb(null, true);
       } else {
              cb(new Error('Only image files are allowed!'), false);
       }
};

const upload = multer({
       storage: storage,
       fileFilter: fileFilter,
       limits: { fileSize: 1024 * 1024 * 50 }, // Limit file size to 50MB
});

/*
    Functions to be implemented:
    - createCourse: (Done)
    - updateCourse: (Done)
    - enrollCourse: (Done)
    - getCourse: (Done)
    - getStudentCourses: (Done)
    - getInstructorCourses: (Done)
    - getCourseStudents: (Done)
    - getCourseInstructors: (Done)
    - number of enrolled students in each course: (Done)
    - is student enrolled in course: (Done)
    - getCourseExams
    - getCourseAssignments
*/

class CourseController {

       async createCourse(req, res, next) {
              try {
                     // Image handling added here
                     const { title, desc, hours, instructorId } = req.body;
                     const image = req.file ? req.file.path : null; // Store image path from multer
                     const id = v4();

                     const user =
                         await User.findOne({ id: instructorId });

                     if (!title || !desc || !hours) {
                            return deleteAssociateFiles(image, "All fields are required", res, next);
                     }

                     if (user && user.role.toLowerCase() !== "instructor") {
                            return deleteAssociateFiles(image, "Invalid role of instructorId", res, next);
                     }
                     const course = await Course.create({
                            title,
                            desc,
                            id,
                            hours,
                            image
                     });

                     if (user)
                         // Optional create an Instructor_Course association
                            await Instructor_Course.create({
                                   instructorID: user._id,
                                   courseID: course._id,
                                   duration: hours
                            });

                     res.status(201).json({data: course, message: `Course (${title}) created successfully`});
              } catch (error) {
                     res.status(200).json({ error: error.message });
                     next(`ERROR IN: Create Course function => ${error.message}`);
              }
       }

       async updateCourse(req, res, next) {
              try {
                     // Image handling added here
                     const { title, desc, hours, instructorId } = req.body;
                     const { courseId } = req.params;
                     const image = req.file ? req.file.path : null; // Store image path from multer

                     const course = await Course.findOne({ id: courseId });
                     if (!course) {
                            return deleteAssociateFiles(image, "Invalid Course", res, next);
                     }

                     const user =
                         await User.findOne({ id: instructorId });

                     if (!title || !desc || !hours) {
                            return deleteAssociateFiles(image, "All fields are required", res, next);
                     }

                     if ( isNaN(hours) || (!isNaN(hours) && (hours < 0) )) {
                            return deleteAssociateFiles(image, "Invalid hours", res, next);
                     }

                     if (user && user.role.toLowerCase() !== "instructor") {
                            return deleteAssociateFiles(image, "Invalid role of instructorId", res, next);
                     }

                     // Delete the old course image (file) from the file system (if it exists)
                     if (course.image && fs.existsSync(course.image)) {
                            fs.unlink(course.image, (err) => {
                                   if (err) {
                                          return deleteAssociateFiles(course.image, "Error updating course image", res, next);
                                   }
                            });
                     }
                     const updatedCourse = await Course.findOne({ _id: course._id });

                     updatedCourse.title = title; updatedCourse.desc = desc;
                     updatedCourse.hours = hours; updatedCourse.image = image;


                     if (user) {
                            // Optional create an Instructor_Course association
                            await Instructor_Course.findOneAndUpdate({courseID: updatedCourse._id}, {
                                   instructorID: user._id,
                                   courseID: updatedCourse._id,
                                   duration: hours
                            });
                     } else {
                            // If no instructor is provided, remove the Instructor_Course association
                            await Instructor_Course.findOneAndDelete({courseID: updatedCourse._id});
                     }

                     updatedCourse.save();

                     res.status(201).json({data: updatedCourse, message: `Course (${title}) updated successfully`});
              } catch (error) {
                     res.status(200).json({ error: error.message });
                     next(`ERROR IN: Update Course function => ${error.message}`);
              }
       }

       async enrollCourse(req, res) {
              const { courseId, duration } = req.body;

              const user = req.user;

              if (!user) {
                     return res.status(200).json({ error: "Invalid studentId" });
              }

              if (user.role.toLowerCase() !== "student") {
                     return res.status(200).json({ error: "Invalid role of studentId" });
              }

              const course = await Course.findOne({ id: courseId });
              if (!course) {
                     return res.status(200).json({ error: "Course is required" });
              }

              if (!duration) {
                     return res.status(200).json({error: "Duration is required"});
              }

              if (isNaN(duration) || (!isNaN(duration) && (duration < 0))) {
                     return res.status(200).json({error: "Invalid duration"});
              }

              const student = await User.findOne({ id: user.id });

              try {
                     const studentCourse = await Student_Course.create({
                            studentID: student._id,
                            courseID: course._id,
                            duration
                     });
                     res.status(201).json({ data: studentCourse, message: `You Enrolled Successfully` });
              } catch (error) {
                     res.status(200).json({ error: error.message });
              }
       }

       async getCourse(req, res) {
              try {
                     const { courseId } = req.params;

                     // Use MongoDB aggregation to get the course details along with student and instructor counts
                     const courseData = await Course.aggregate([
                            {
                                   $match: { id: courseId }  // Match the specific course by courseId
                            },
                            {
                                   // Join with Student_Course to get the number of students
                                   $lookup: {
                                          from: 'student_courses',
                                          localField: '_id',
                                          foreignField: 'courseID',
                                          as: 'students',
                                   }
                            },
                            {
                                   // Join with Instructor_Course to get the number of instructors
                                   $lookup: {
                                          from: 'instructor_courses',
                                          localField: '_id',
                                          foreignField: 'courseID',
                                          as: 'instructors',
                                   }
                            },
                            {
                                   // Project the course data along with the counts of students and instructors
                                   $project: {
                                          title: 1,
                                          desc: 1,
                                          id: 1,
                                          hours: 1,
                                          image: 1,
                                          numStudents: { $size: '$students' }, // Count students
                                          numInstructors: { $size: '$instructors' }, // Count instructors
                                   }
                            }
                     ]);

                     // If courseData is empty, course doesn't exist
                     if (!courseData.length) {
                            return res.status(200).json({ error: "Invalid course" });
                     }

                     // Return course details with student and instructor counts
                     res.status(201).json({ data: courseData[0] });
              } catch (error) {
                     res.status(200).json({ error: error.message });
              }
       }


       async getAllCourses(req, res) {
              try {
                     const { userId } = req.body;

                     // If a user is provided
                     if (userId) {
                            const user = await User.findOne({ id: userId });

                            if (!user) {
                                   return res.status(200).json({ error: "Invalid userId" });
                            }

                            let Mycourses = [];
                            if (user.role.toLowerCase() === "student") {
                                   // Get student's enrolled courses
                                   const studentCourses = await Student_Course.find({ studentID: user._id });
                                   Mycourses = studentCourses.map(sc => sc.courseID);
                            } else if (user.role.toLowerCase() === "instructor") {
                                   // Get instructor's assigned courses
                                   const instructorCourses = await Instructor_Course.find({ instructorID: user._id });
                                   Mycourses = instructorCourses.map(ic => ic.courseID);
                            }

                            // Get all courses with aggregated student and instructor counts
                            let Allcourses = await Course.aggregate([
                                   {
                                          $lookup: {
                                                 from: 'student_courses',
                                                 localField: '_id',
                                                 foreignField: 'courseID',
                                                 as: 'students',
                                          }
                                   },
                                   {
                                          $lookup: {
                                                 from: 'instructor_courses',
                                                 localField: '_id',
                                                 foreignField: 'courseID',
                                                 as: 'instructors',
                                          }
                                   },
                                   {
                                          $project: {
                                                 title: 1,
                                                 desc: 1,
                                                 id: 1,
                                                 hours: 1,
                                                 image: 1,
                                                 numStudents: { $size: '$students' }, // Count of students
                                                 numInstructors: { $size: '$instructors' }, // Count of instructors
                                          }
                                   }
                            ]);

                            // Mark which courses the user is enrolled in
                            Allcourses = Allcourses.map(course => {
                                   const isEnrolled = Mycourses.some(myCourseId => String(myCourseId) === String(course._id));
                                   return { ...course, isEnrolled };
                            });

                            return res.status(201).json({ data: Allcourses });

                     } else { // Guest user
                            let courses = await Course.aggregate([
                                   {
                                          $lookup: {
                                                 from: 'student_courses',
                                                 localField: '_id',
                                                 foreignField: 'courseID',
                                                 as: 'students',
                                          }
                                   },
                                   {
                                          $lookup: {
                                                 from: 'instructor_courses',
                                                 localField: '_id',
                                                 foreignField: 'courseID',
                                                 as: 'instructors',
                                          }
                                   },
                                   {
                                          $project: {
                                                 title: 1,
                                                 desc: 1,
                                                 id: 1,
                                                 hours: 1,
                                                 image: 1,
                                                 numStudents: { $size: '$students' }, // Count of students
                                                 numInstructors: { $size: '$instructors' }, // Count of instructors
                                          }
                                   }
                            ]);
                            return res.status(201).json({ data: courses });
                     }
              } catch (error) {
                     res.status(200).json({ error: error.message });
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

// Function to delete associated files if error
function deleteAssociateFiles(document, errMsg, res, next) {
       if (document && fs.existsSync(document)) {
              fs.unlink(document, (err) => {
                     if (err) {
                            next(`WARNING IN: Delete Course Image Function => ${err}`);
                            return res.status(200).json({ error: errMsg });
                     }
              });
       }
       return res.status(200).json({ error: errMsg });
}

// Middleware to handle the file upload
const uploadCourseImage = (req, res, next) => {
       try {

              const uploadSingle = upload.single('image');

              uploadSingle(req, res, function (err) {
                     if (err instanceof multer.MulterError) {
                            // Multer-specific error occurred
                            res.status(200).json({error: err.message});
                            next(`ERROR IN: uploadCourseImage function => ${err.message}`);
                            return;
                     } else if (err) {
                            // Other errors like invalid file types
                            res.status(200).json({error: err.message});
                            next(`ERROR IN: uploadCourseImage function => ${err.message}`);
                            return;
                     }

                     next();
              });
       } catch (e) {
              res.status(200).json({error: e.message});
              next(`ERROR IN: uploadCourseImage function => ${e.message}`);
       }
};

// Export the controller and middleware
module.exports = { Controller: new CourseController(), uploadCourseImage };
const { Router } = require('express');
const { Controller, uploadCourseImage } = require('../controller/Course');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/create-course', verifyToken("Admin"), uploadCourseImage, Controller.createCourse);
router.post('/enroll-course', verifyToken("Student"), Controller.enrollCourse);
router.get('/course/:courseId', Controller.getCourse);
router.get('/student-courses/:studentId', Controller.getStudentCourses);
router.get('/instructor-courses/:instructorId', Controller.getInstructorCourses);
router.get('/course-exams/:courseId', Controller.getCourseExams);
router.get('/course-assignments/:courseId', Controller.getCourseAssignments);

module.exports = router;
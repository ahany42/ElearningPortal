const { Router } = require('express');
const { Controller, uploadCourseImage } = require('../controller/Course');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/create-course', verifyToken("Admin"), uploadCourseImage, Controller.createCourse);
router.put('/update-course/:courseId', verifyToken("Admin"), uploadCourseImage, Controller.updateCourse);
router.post('/enroll-course', verifyToken("Student"), Controller.enrollCourse);
router.get('/getCourse/:courseId', verifyToken(), Controller.getCourse);
router.post('/getCourses', Controller.getAllCourses);
router.get('/student-courses/:studentId', Controller.getStudentCourses);
router.get('/instructor-courses/:instructorId', Controller.getInstructorCourses);
router.get('/course-exams/:courseId', Controller.getCourseExams);
router.get('/course-assignments/:courseId', Controller.getCourseAssignments);

module.exports = router;
const { Router } = require('express');
const { Controller, uploadCourseImage } = require('../controller/Assignment');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/createAssignment', verifyToken("Admin"), uploadCourseImage, Controller.createAssignment);
router.post('/solveAssignment', verifyToken("Student"), Controller.solveAssignment);
router.post('/gradeAssignment', verifyToken("Instructor"), Controller.gradeAssignment);
router.put('/updateAssignment/:id', verifyToken("Instructor"), uploadCourseImage, Controller.updateAssignment);
router.get('/getAssignments', Controller.getAllAssignments);
router.get('/getAssignment/:id', Controller.getAssignmentById);
router.delete('/deleteAssignment/:id', verifyToken("Instructor"), Controller.deleteAssignment);

module.exports = router;





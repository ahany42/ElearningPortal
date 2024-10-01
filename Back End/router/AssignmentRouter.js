const { Router } = require('express');
const { Controller, uploadAssignmentDoc } = require('../controller/Assignment');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/createAssignment', verifyToken("Admin"), uploadAssignmentDoc, Controller.createAssignment);
router.post('/solveAssignment', verifyToken("Student"), Controller.solveAssignment);
router.post('/gradeAssignment', verifyToken("Instructor"), Controller.gradeAssignment);
router.put('/updateAssignment/:id', verifyToken("Instructor"), uploadAssignmentDoc, Controller.updateAssignment);
router.get('/getAssignments', Controller.getAllAssignments);
router.get('/getAssignment/:id', Controller.getAssignmentById);
router.delete('/deleteAssignment/:id', verifyToken("Instructor"), Controller.deleteAssignment);

module.exports = router;





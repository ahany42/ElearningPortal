const { Router } = require('express');
const { Controller, uploadAssignmentDoc,
    uploadAssignmentAnswerDoc} = require('../controller/Assignment');
const verifyToken = require('../controller/VerifyToken');
const router = Router();

router.post('/createAssignment', verifyToken("Admin"), uploadAssignmentDoc, Controller.createAssignment);
router.post('/solveAssignment', verifyToken("Student"), uploadAssignmentAnswerDoc, Controller.solveAssignment);
router.delete('/deleteAssignmentSolution/:id', verifyToken("Student"), Controller.deleteAssignmentAnswer);
router.post('/gradeAssignment', verifyToken("Instructor"), Controller.gradeAssignment);
router.put('/updateAssignment/:id', verifyToken("Instructor"), uploadAssignmentDoc, Controller.updateAssignment);
router.get('/getAssignments', verifyToken(), Controller.getAllAssignments);
router.get('/getAssignment/:id', verifyToken(), Controller.getAssignmentById);
router.delete('/deleteAssignment/:id', verifyToken("Instructor"), Controller.deleteAssignment);

module.exports = router;





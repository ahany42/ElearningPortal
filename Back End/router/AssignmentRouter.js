const { Router } = require('express');
const  Controller = require('../controller/Assignment');
const router = Router();

router.post('/createAssignment', Controller.createAssignment);
router.post('/solveAssignment', Controller.solveAssignment);
router.put('/updateAssignment/:id', Controller.updateAssignment);
router.get('/getAssignments', Controller.getAllAssignments);
router.get('/getAssignment/:id', Controller.getAssignmentById);
router.delete('/deleteAssignment/:id', Controller.deleteAssignment);

module.exports = router;





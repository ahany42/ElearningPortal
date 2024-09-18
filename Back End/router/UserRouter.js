const { Router } = require("express");
const Controller = require("../controller/User");
const router = Router();
const VerifyToken=require('../VerifyToken')
router.post("/login", Controller.login); // verified
router.post("/logout", Controller.logout); //verified
router.post("/register", Controller.register); // verified
router.get("/getUser",VerifyToken, Controller.getUser); // verified
router.get("/getUsers",VerifyToken, Controller.getUsers); // verified
router.put("/updateUser/:id", Controller.updateUser); //verified
router.post("/deleteUser", Controller.deleteUser); // verified
router.post("/forgotPassword", Controller.forgotPassword); // verified

module.exports = router;

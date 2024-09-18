const { Router } = require("express");
const Controller = require("../controller/User");
const router = Router();
const VerifyToken=require('../controller/VerifyToken')

router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/register", Controller.register);
router.get("/getUser",VerifyToken, Controller.getUser);
router.get("/getUsers", VerifyToken, Controller.getUsers);
router.put("/updateUser/:id", Controller.updateUser);
router.post("/deleteUser", Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword);

module.exports = router;

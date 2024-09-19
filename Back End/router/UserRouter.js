const { Router } = require("express");
const Controller = require("../controller/User");
const VerifyToken=require('../controller/VerifyToken')
const router = Router();

router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/register", Controller.register);
router.get("/getUser",VerifyToken, Controller.getUser);
router.get("/getUsers", VerifyToken, Controller.getUsers);
router.put("/updateUser/:id", Controller.updateUser);
router.delete("/deleteUser/:id", Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword);

module.exports = router;

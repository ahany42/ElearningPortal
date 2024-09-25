const { Router } = require("express");
const Controller = require("../controller/User");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/register", Controller.register);
router.get("/getUser", verifyToken("Admin"), Controller.getUser); // for admin
router.get("/getUsers", verifyToken("Admin"), Controller.getUsers);
router.put("/updateUser/:id", Controller.updateUser);
router.delete("/deleteUser/:id", Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword);

// Reset password route
router.post('/reset-password/:token', Controller.resetPassword);

module.exports = router;

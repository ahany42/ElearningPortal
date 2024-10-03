const { Router } = require("express");
const Controller = require("../controller/User");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/register", Controller.register);
router.get("/getUser", verifyToken("Admin"), Controller.getUser); // for admin
router.get("/getUsers", verifyToken("Admin"), Controller.getUsers);
router.put("/updateUser/:id", verifyToken(), Controller.updateUser);
router.delete("/deleteUser/:id", verifyToken("Admin"), Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword);

// Reset password route
router.post("/resetPassword/:token", Controller.resetPassword);
router.post("/verifyRestToken/:token", Controller.verifyResetToken);

module.exports = router;

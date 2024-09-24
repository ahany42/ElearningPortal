const { Router } = require("express");
const Controller = require("../controller/User");
const { VerifyTokenForAdmin } = require("../controller/VerifyToken");
const CheckToken = require("../controller/CheckToken");
const router = Router();

router.post("/login", Controller.login);
router.post("/logout", Controller.logout);
router.post("/register", Controller.register);
router.get("/getUser", VerifyTokenForAdmin, Controller.getUser); // for admin
router.get("/getUsers", VerifyTokenForAdmin, Controller.getUsers);
router.put("/updateUser/:id", Controller.updateUser);
router.delete("/deleteUser/:id", Controller.deleteUser);
router.post("/forgotPassword", Controller.forgotPassword);
// Reset password route
router.post('/reset-password/:token', Controller.resetPassword);
router.get("/checkToken", CheckToken);

module.exports = router;

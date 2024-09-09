const { Router } = require("express");
const Controller = require("../controller/User");
const router = Router();

/*
 * URLS to be implemented:
 */

router.post("/login", Controller.login); // verified
router.post("/logout", Controller.logout);
router.post("/register", Controller.register); // verified
router.get("/getUser", Controller.getUser); // verified
router.get("/getUsers", Controller.getUsers); // verified
router.put("/updateUser", Controller.updateUser);
router.delete("/deleteUser", Controller.deleteUser);

module.exports = router;

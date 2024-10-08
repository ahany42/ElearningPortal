const { Router } = require("express");
const Controller = require("../controller/Post");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post(
  "/createPost/:creatorId",
  verifyToken("Instructor"),
  Controller.createPost
); //verified
router.get("/getPosts", verifyToken(), Controller.getPosts); //verified
router.put(
  "/updatePost/:userId",
  verifyToken("Instructor"),
  Controller.updatePost
); //verified
router.delete(
  "/deletePost/:userId",
  verifyToken("Instructor"),
  Controller.deletePost
); //verified
module.exports = router;

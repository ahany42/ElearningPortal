const { Router } = require("express");
const Controller = require("../controller/comment");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post(
  "/createComment/:creatorId",
  verifyToken(),
  Controller.createComment
); //verified
router.get("/getComments/:userId", verifyToken(), Controller.getComments); //verified
router.put("/updateComment/:userId", verifyToken(), Controller.updateComment); //verified
router.delete(
  "/deleteComment/:userId",
  verifyToken(),
  Controller.deleteComment
); //verified
module.exports = router;

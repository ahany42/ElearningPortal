const { Router } = require("express");
const Controller = require("../controller/Announcement");
const verifyToken = require("../controller/VerifyToken");
const router = Router();

router.post(
  "/createAnnouncement/:creatorId",
  verifyToken("Instructor"),
  Controller.createAnnouncement
); //verified
router.get("/getAnnouncements", verifyToken(), Controller.getAnnouncements); //verified
router.put(
  "/updateAnnouncement/:userId",
  verifyToken("Instructor"),
  Controller.updateAnnouncement
); //verified
router.delete(
  "/deleteAnnouncement/:userId",
  verifyToken("Instructor"),
  Controller.deleteAnnouncement
); //verified
module.exports = router;

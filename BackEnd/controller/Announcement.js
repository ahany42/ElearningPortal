const {
  Announcement,
  User,
  Course,
  Instructor_Course,
  Student_Course,
} = require("../db/Database");
const { v4: uuidv4 } = require("uuid");

function findUserById(id) {
  return User.findOne({ id });
}

function findCourseByTitle(title) {
  return Course.findOne({ title });
}

module.exports = {
  createAnnouncement: async (req, res, next) => {
    try {
      const { creatorId } = req.params;
      const { title, courseTitle } = req.body;
      if (!title || title === "") {
        return res.status(200).json({ error: "Title is required" });
      }
      if (!courseTitle || courseTitle === "") {
        return res.status(200).json({ error: "Course title is required" });
      }

      const user = await findUserById(creatorId);
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }

      const course = await findCourseByTitle(courseTitle);
      if (!course) {
        return res.status(200).json({ error: "Course not found" });
      }

      const id = uuidv4();
      const announcement = new Announcement({
        id,
        title,
        courseId: course._id,
        creatorId: user._id,
      });
      await announcement.save();
      res.status(201).json({ message: "Announcement created successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Create Assignment Function => ${err}`);
    }
  },

  updateAnnouncement: async (req, res) => {
    try {
      const { userId } = req.params;
      const { id, newTitle } = req.body;
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      if (!id || id === "") {
        return res.status(200).json({ error: "Announcement ID is required" });
      }
      const announcement = await Announcement.findOne({ id });
      if (!announcement) {
        return res.status(200).json({ error: "Announcement not found" });
      }
      if (announcement.creatorId.toString() !== user._id.toString()) {
        console.log(announcement.creatorId, user._id.toString());
        return res.status(200).json({ error: "User not authorized" });
      }
      if (!newTitle || newTitle === "") {
        return res.status(200).json({ error: "Title is required" });
      }

      announcement.title = newTitle;
      announcement.editedAt = Date.now();
      announcement.isEdited = true;
      await announcement.save();
      res.status(201).json({ message: "Announcement updated successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Announcement Function => ${err}`);
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const { userId } = req.params;
      const { id } = req.body;
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }
      if (!id || id === "") {
        return res.status(200).json({ error: "Announcement ID is required" });
      }
      const announcement = await Announcement.findOne({ id });
      if (!announcement) {
        return res.status(200).json({ error: "Announcement not found" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      if (user.role.toLowerCase() !== "admin") {
        if (user._id.toString() !== announcement.creatorId.toString()) {
          return res.status(200).json({ error: "User not authorized" });
        }
      }
      await Announcement.deleteOne({ id });
      res.status(201).json({ message: "Announcement deleted successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Delete Announcement Function => ${err}`);
    }
  },

  getAnnouncements: async (req, res) => {
    const { courseId, userId } = req.body;
    if (!courseId || courseId === "") {
      return res.status(200).json({ error: "Course ID is required" });
    }

    if (!userId || userId === "") {
      return res.status(200).json({ error: "User ID is required" });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(200).json({ error: "Course not found" });
    }
    if (user.role.toLowerCase() === "instructor") {
      if (
        Instructor_Course.find({ instructorID: user._id, courseID: course._id })
          .length === 0
      ) {
        return res.status(200).json({ error: "User not authorized" });
      } else {
        const announcements = await Announcement.find({
          courseId: course._id,
        });
        return res.status(200).json({ data: announcements });
      }
    }
    if (user.role.toLowerCase() === "student") {
      if (
        Student_Course.find({ studentID: user._id, courseID: course._id })
          .length === 0
      ) {
        return res.status(200).json({ error: "User not authorized" });
      } else {
        const announcements = await Announcement.find({
          courseId: course._id,
        });
        return res.status(200).json({ data: announcements });
      }
    }
    const announcements = await Announcement.find({ courseId: course._id });
    return res.status(200).json({ data: announcements });
  },
};

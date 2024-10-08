const {
  Announcement,
  User,
  Post,
  Course,
  Instructor_Course,
  Student_Course,
} = require("../db/Database");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createPost: async (req, res) => {
    try {
      const { creatorId } = req.params;
      const { title, content, AnnouncementId } = req.body;

      if (!creatorId || creatorId === "") {
        return res.status(200).json({ error: "Creator ID is required" });
      }
      if (!title || title === "") {
        return res.status(200).json({ error: "Title is required" });
      }

      if (!content || content === "") {
        return res.status(200).json({ error: "Content is required" });
      }

      if (!AnnouncementId || AnnouncementId === "") {
        return res.status(200).json({ error: "Announcement ID is required" });
      }

      const user = await User.findOne({ id: creatorId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      const announcement = await Announcement.findOne({ id: AnnouncementId });
      if (!announcement) {
        return res.status(200).json({ error: "Announcement not found" });
      }

      const id = uuidv4();
      const post = new Post({
        id,
        title,
        content,
        AnnouncementId: announcement._id,
        creatorId: user._id,
      });
      await post.save();
      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Create Post Function => ${err}`);
    }
  },

  getPosts: async (req, res) => {
    try {
      const { announcementId, userId } = req.body;
      if (!announcementId || announcementId === "") {
        return res.status(200).json({ error: "Course ID is required" });
      }
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }

      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }

      const announcement = await Announcement.findOne({ id: announcementId });
      if (!announcement) {
        return res.status(200).json({ error: "Announcement not found" });
      }
      if (
        user.role.toLowerCase() !== "admin" &&
        user.role.toLowerCase() !== "superadmin"
      ) {
        if (user.role === "instructor") {
          if (
            Instructor_Course.find({
              instructorID: user._id,
              courseID: announcement.courseId,
            }).length === 0
          ) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
        if (user.role === "student") {
          if (
            Student_Course.find({
              studentID: user._id,
              courseID: announcement.courseId,
            }).length === 0
          ) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
      }

      const posts = await Post.find({ AnnouncementId: announcement._id });
      res.status(200).json({ posts });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Get Posts Function => ${err}`);
    }
  },

  deletePost: async (req, res) => {
    try {
      const { userId } = req.params;
      const { postId } = req.body;
      if (!postId || postId === "") {
        return res.status(200).json({ error: "Post ID is required" });
      }
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      const post = await Post.findOne({ id: postId });
      if (!post) {
        return res.status(200).json({ error: "Post not found" });
      }
      if (user.role !== "admin" && user.role !== "superadmin") {
        if (post.creatorId.toString() !== user._id.toString()) {
          return res.status(200).json({ error: "User not authorized" });
        }
      }
      await Post.deleteOne({ id: postId });
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Delete Post Function => ${err}`);
    }
  },

  updatePost: async (req, res) => {
    try {
      const { userId } = req.params;
      const { postId, title, content } = req.body;
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }
      if (!postId || postId === "") {
        return res.status(200).json({ error: "Post ID is required" });
      }
      if (!title || title === "") {
        return res.status(200).json({ error: "Title is required" });
      }
      if (!content || content === "") {
        return res.status(200).json({ error: "Content is required" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      const post = await Post.findOne({ id: postId });
      if (!post) {
        return res.status(200).json({ error: "Post not found" });
      }
      if (post.creatorId.toString() !== user._id.toString()) {
        return res.status(200).json({ error: "User not authorized" });
      }
      post.title = title;
      post.content = content;
      post.editedAt = Date.now();
      post.isEdited = true;
      await post.save();
      res.status(200).json({ message: "Post updated successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Post Function => ${err}`);
    }
  },
};

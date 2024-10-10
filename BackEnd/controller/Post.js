const {
  Post,
  User,
  Course,
  Instructor_Course,
  Student_Course,
} = require("../db/Database");
const { v4: uuidv4 } = require("uuid");

function findUserById(id) {
  return User.findOne({ id });
}

function findCourseById(Id) {
  return Course.findOne({ id: Id });
}

module.exports = {
  createPost: async (req, res, next) => {
    try {
      const { creatorId } = req.params;
      const { title, courseId } = req.body;
      if (!title || title === "") {
        return res.status(200).json({ error: "Title is required" });
      }
      if (!courseId || courseId === "") {
        return res.status(200).json({ error: "Course id is required" });
      }

      const user = await findUserById(creatorId);
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }

      const course = await findCourseById(courseId);
      if (!course) {
        return res.status(200).json({ error: "Course not found" });
      }

      if (
        user.role.toLowerCase() !== "admin" &&
        user.role.toLowerCase() !== "superadmin"
      ) {
        if (user.role.toLowerCase() === "instructor") {
          const InstructorCourseArray = await Instructor_Course.find({
            instructorID: user._id,
            courseID: course._id,
          });
          if (InstructorCourseArray.length === 0) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
        if (user.role.toLowerCase() === "student") {
          const studentCourseArray = await Student_Course.find({
            studentID: user._id,
            courseID: curentCourse._id,
          });
          if (studentCourseArray.length === 0) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
      }
      const id = uuidv4();
      const post = new Post({
        id,
        title,
        courseId: course._id,
        creatorId: user._id,
      });
      await post.save();
      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Create Post Function => ${err}`);
    }
  },

  updatePost: async (req, res, next) => {
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
        return res.status(200).json({ error: "Post ID is required" });
      }

      if (!newTitle || newTitle === "") {
        return res.status(200).json({ error: "Title is required" });
      }

      const post = await Post.findOne({ id });

      if (!post) {
        return res.status(200).json({ error: "Post not found" });
      }

      const postCreator = await User.findOne({
        _id: post.creatorId,
      });
      if (user.id !== postCreator.id) {
        return res.status(200).json({ error: "User not authorized" });
      }

      post.title = newTitle;
      post.editedAt = Date.now();
      post.isEdited = true;
      await post.save();
      res.status(201).json({ message: "Post updated successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Update Post Function => ${err}`);
    }
  },

  deletePost: async (req, res) => {
    try {
      const { userId } = req.params;
      const { id } = req.body;
      if (!userId || userId === "") {
        return res.status(200).json({ error: "User ID is required" });
      }
      if (!id || id === "") {
        return res.status(200).json({ error: "Post ID is required" });
      }
      const post = await Post.findOne({ id });
      if (!post) {
        return res.status(200).json({ error: "Post not found" });
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(200).json({ error: "User not found" });
      }
      if (
        user.role.toLowerCase() !== "admin" &&
        user.role.toLowerCase() !== "superadmin"
      ) {
        const postCreator = await User.findOne({
          _id: post.creatorId,
        });

        if (user.id !== postCreator.id) {
          console.log(user.id, postCreator.id);
          return res.status(200).json({ error: "User not authorized" });
        }
      }
      await Post.deleteOne({ id });
      res.status(201).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Delete Post Function => ${err}`);
    }
  },

  getPosts: async (req, res, next) => {
    try {
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
      if (
        user.role.toLowerCase() === "admin" ||
        user.role.toLowerCase() === "superadmin"
      ) {
        if (user.role.toLowerCase() === "instructor") {
          const InstructorCourseArray = await Instructor_Course.find({
            instructorID: user._id,
            courseID: curentCourse._id,
          });
          if (InstructorCourseArray.length === 0) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
        if (user.role.toLowerCase() === "student") {
          const studentCourseArray = await Student_Course.find({
            studentID: user._id,
            courseID: curentCourse._id,
          });
          if (studentCourseArray.length === 0) {
            return res.status(200).json({ error: "User not authorized" });
          }
        }
      }

      const posts = await Post.find({ courseId: course._id });
      return res.status(201).json({ data: posts });
    } catch (err) {
      res.status(200).json({ error: "Unexpected Error Occurred" });
      next(`ERROR IN: Get Post Function => ${err}`);
    }
  },
};

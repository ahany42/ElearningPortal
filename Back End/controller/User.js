const { User, Session, Assignment, AssignmentAnswer} = require("../db/Database");
const bcrypt = require("bcrypt");
const {Secret_Key}=require('../../env')
const {v4: uuidv4} = require("uuid");
const jwt = require('jsonwebtoken');

function emailAcceptance(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function passwordAcceptance(password) {
  console.log(password);
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(String(password));
}

module.exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(200).json({ error: "Invalid username" });
      }
      else if (!await bcrypt.compare(password, user.password)) {
          return res.status(200).json({ error: "Invalid password"});
      }

      else {
          const token = await jwt.sign({ username:user.username, id:user._id, role:user.role, un: uuidv4() },Secret_Key,{expiresIn:"1h"})
          await Session.insertMany([{
            token,
            createDate: Date.now()
          }]);
          res.status(201).json({ message: "Login successful", data:{ Token : token } });
      }
    }
    catch(error) {
        res.status(200).json({ error: "Unexpected Error Occurred" });
        next(`ERROR IN: login function => ${error}`);
    }
};

async function idValidation(id) {
  return !!(await User.findOne({id}));
}

module.exports.register = async (req, res, next) => {
  try {
    const { name, gender, email, username, password, role } = req.body;
    const id = uuidv4();
    const validEmail = emailAcceptance(email);
    const validPassword = passwordAcceptance(password);
    const validId = idValidation(id);
    if (!validEmail || !validPassword || !validId) {
      return res.status(200).json({ error: "Invalid email or password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      id,
      gender,
      email,
      username,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: `User (${user.name}) registered successfully` });
  }
  catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Register function => ${error}`);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(201).json({data: users});
  }
  catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getUsers function => ${error}`);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(201).json({message: "User not found"});
    }
    // Send email with password reset link

    res.status(201).json({message: "Password reset link sent successfully"});
  }
  catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: forgotPassword function => ${error}`);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    res.status(201).json({ data: user });
  }
  catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getUser function => ${error}`);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndDelete({ id });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    res.status(201).json({ message: `User (${user.name}) deleted successfully` });
  }
  catch (error) {
    console.log(`ERROR IN: deleteUser function => ${error}`);
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    await Session.deleteOne();
    res.status(201).json({ message: "Logged out successfully" });
  }
  catch (err) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Logout Function => ${err}`);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    user.name = name;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.role = role;

    await user.save();

    res.status(201).json({ message: `User (${user.name}) updated successfully` });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateUser function => ${error}`);
  }
};

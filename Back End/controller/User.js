const { User, setIntervalAndExecute, Session } = require("../db/Database");
const bcrypt = require("bcrypt");

/*
    Functions to be implemented:
    - login
    - logout
    - register
    - getUser
    - getUsers (students, instructors, admins)
    - updateUser
    - deleteUser
    - forgotPassword
*/
function emailAcceptance(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function passwordAcceptance(password) {
  console.log(password);
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(String(password));
}

function idValidation(id) {
  return User.findOne({ id }) ? true : false;
}

exports.register = async (req, res, next) => {
  try {
    const { name, id, gender, email, username, password, role } = req.body;
    console.log(email + ", " + password);
    const validEmail = emailAcceptance(email);
    const validPassword = passwordAcceptance(password);
    console.log(validEmail, validPassword);
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

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(200).json({
      message: "ERROR IN: register function => ",
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { login, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);

    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }],
      password: hashedPassword,
    });

    if (!user) {
      return res
        .status(200)
        .json({ error: "Invalid username/email or password" });
    } else {
      await Session.insertMany([
        {
          userID: user._id,
          createDate: Date.now(),
        },
      ]);
      setIntervalAndExecute(); // Start Session Timer
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.log(`ERROR IN: login function => ${error}`);
    next(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(`ERROR IN: getUsers function => ${error}`);
    next(error);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(201).json({ message: "User not found" });
  }
  res.status(200).json({ message: "Password reset link sent successfully" });
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    res.status(201).json(user);
  } catch (error) {
    console.log(`ERROR IN: getUser function => ${error}`);
    next(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    res.status(201).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(`ERROR IN: deleteUser function => ${error}`);
    next(error);
  }
};

exports.logout = async (req, res) => {
  try {
    await Session.deleteOne();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(`ERROR IN: Logout Function => ${err}`);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { name, email, password, role } = req.body;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(200).json({ error: "User not found" });
    }
    user.name = name;
    user.email = email;
    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    user.role = role;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(`ERROR IN: updateUser fuction => ${error}`);
    // next;
  }
};

const { User } = require("../db/Database");
const SessionController = require("./Session");
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


exports.login = async (req, res) => {
    const { email, password } = req.body;
    hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    } else {
        res.status(200).json({ message: "Login successful" });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, id, gender, email, username, password, role } = req.body;

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
        res
            .status(500)
            .json({ message: "Error registering user", error: error.message });
    }
};

exports.getUser = async (req, res) => {
    const { userID } = req.body;
    const user = await User.findOne({ id: userID });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
};

exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
};

exports.logout = async (req, res) => {
    const { sessionID } = req.body;
    await SessionController.deleteSession(sessionID);
    res.status(200).json({ message: "Logged out successfully" });
};

exports.updateUser = async (req, res) => {
    const { userID } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByIdAndUpdate(userID, {
        name,
        email,
        password,
        role,
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
};

exports.deleteUser = async (req, res) => {
    const { userID } = req.params;
    const user = await User.findByIdAndDelete(userID);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password reset link sent successfully" });
};

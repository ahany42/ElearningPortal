const { User, setIntervalAndExecute, Session} = require("../db/Database");
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


// exports.login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });

//         // If no user is found, return an error
//         if (!user) {
//             return res.status(200).json({ error: "Invalid email or password" });
//         }

//         // Compare the provided password with the stored hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(200).json({ error: "Invalid email or password" });
//         }

//         // If passwords match, proceed with login
//         await Session.insertMany([{
//             userID: user._id,
//             createDate: Date.now(),
//         }]);

//         setIntervalAndExecute(); // Start Session Timer
//         res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//         console.log(`ERROR IN: login function => ${error}`);
//         next(error);
//     }
// };





exports.login = async (req, res, next) => {
    try {
    const { email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email, password: hashedPassword });
    if (!user) {
        return res.status(200).json({ error: "Invalid email or password" });
    } else {
        await Session.insertMany([{
            userID: user._id,
            createDate: Date.now()
        }]);
        setIntervalAndExecute(); // Start Session Timer
        res.status(200).json({ message: "Login successful" });
    }} catch(error) {
        console.log(`ERROR IN: login function => ${error}`);
        next(error);
    }
};

exports.register = async (req, res, next) => {
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
            .status(200)
            .json({ message: "ERROR IN: register function => ", error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const {userID} = req.body;
        const user = await User.findOne({id: userID});
        if (!user) {
            return res.status(200).json({error: "User not found"});
        }
        res.status(200).json(user);
    } catch(error) {
        console.log(`ERROR IN: getUser function => ${error}`);
        next(error);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(error){
        console.log(`ERROR IN: getUsers function => ${error}`);
        next(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const {userID} = req.body;
        const user = await User.findOne({userID});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted successfully"});
    } catch(error) {
        console.log(`ERROR IN: deleteUser function => ${error}`);
        next(error);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password reset link sent successfully" });
};

exports.logout = async (req, res) => {
    try {
        await Session.deleteOne();
        res.status(200).json({message: "Logged out successfully"});
    } catch (err) {
        next(`ERROR IN: Logout Function => ${err}`);
    }
};

exports.updateUser = async (req, res) => {
    try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findByIdAndUpdate(userID, {
        name,
        email,
        password,
        role,
    });
    if (!user) {
        return res.status(200).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
        } catch(error) {
        console.lo(`ERROR IN: updateUser fuction => ${error}`);
        next
    }
};



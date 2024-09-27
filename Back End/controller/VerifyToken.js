const { Secret_Key } = require("../../env");
const jwt = require("jsonwebtoken");
const { Session } = require("../db/Database");
const {verify} = require("jsonwebtoken");

// Middle ware to verify person if it is authorized or not to join route
const VerifyTokenForAdmin = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "admin" || decoded.role === "superadmin") {
      next();
    } else {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Token expired" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid token" });
    }
    next(error);
  }
};

const VerifyTokenForInstructor = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "instructor" || decoded.role === "admin" || decoded.role === "superadmin") {
        next();
    } else {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Token expired" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid token" });
    }
    next(error);
  }
};

const VerifyTokenForStudent = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "student" || decoded.role === "admin" || decoded.role === "superadmin") {
      next();
    } else {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Token expired" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid token" });
    }
    next(error);
  }
};

const VerifyTokenForUser = async (req, res, next) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "student" || decoded.role === "instructor" ||
        decoded.role === "admin" || decoded.role === "superadmin") {
      next();
    } else {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(200).json({ error: "Token expired" });
      await Session.deleteOne({});
    } else {
      res.status(200).json({ error: "Invalid token" });
    }
    next(error);
  }
};

function verifyToken (role) {
  if (!role) {
    return VerifyTokenForUser;
  }
  role = role.toLowerCase().replaceAll(" ", "");
  if (role === "admin" || role === "superadmin") {
    return VerifyTokenForAdmin;
  } else if (role === "instructor") {
    return VerifyTokenForInstructor;
  } else {
    return VerifyTokenForStudent;
  }
}

module.exports = verifyToken;

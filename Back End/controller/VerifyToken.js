const { Secret_Key } = require("../../env");
const jwt = require("jsonwebtoken");
const { Session } = require("../db/Database");

// Middle ware to verify person if it is authorized or not to join route
const VerifyTokenForAdmin = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  console.log(authorization);
  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  // let token = authorization.split(" ")[1];
  // console.log(token);

  // Verify token is valid from jwt package:
  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    console.log(decoded);
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role !== "admin") {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    } else {
      next();
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
  console.log(authorization);
  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  // let token = authorization.split(" ")[1];
  // console.log(token);

  // Verify token is valid from jwt package:
  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    console.log(decoded);
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role !== "instructor") {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    } else {
      next();
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
  console.log(authorization);
  if (!authorization) {
    res.status(200).json({ error: "token is required" });
    next("token is required");
    return;
  }

  // let token = authorization.split(" ")[1];
  // console.log(token);

  // Verify token is valid from jwt package:
  try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    console.log(decoded);
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role !== "student") {
      res.status(200).json({ error: "Invalid role" });
      next("Invalid role");
    } else {
      next();
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

module.exports = {
  VerifyTokenForAdmin,
  VerifyTokenForInstructor,
  VerifyTokenForStudent,
};

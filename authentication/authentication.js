import database from "../database/database.js";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config({
  path: "config.env",
});

async function isLogin(req, res, next) {
  let token = req.cookies.login;
  if (token != undefined) {
    let verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    let user = await database.findById(verifyUser._id);
    if (user != null) {
      next();
    } else {
      res.json({
        success: false,
        message: "Login First",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Login First",
    });
  }
}

async function isLogout(req, res, next) {
  let token = req.cookies.login;
  if (token == undefined) {
    next();
  } else {
    res.json({
      success: false,
      message: "Logout First",
    });
  }
}

export default { isLogin, isLogout };

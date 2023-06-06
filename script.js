import express from "express";
import model from "./database/database.js";
import env from "dotenv";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import auth from "./authentication/authentication.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cookie({
    HttpOnly: false,
  })
);
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

env.config({
  path: "./config.env",
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello User",
  });
});

app.get("/logout", auth.isLogin, (req, res) => {
  res.cookie("login", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    success: true,
    message: `Logged Out Successfully`,
  });
});

app.post("/login", auth.isLogout, async (req, res) => {
  let { userid, pass } = req.body;
  let user = await model.findOne({ userid, pass });
  if (user != null) {
    res.cookie("login", user.token[0].token, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    res.json({
      success: true,
      message: `${user.userid} Logged In Successfully`,
    });
  } else {
    res.json({
      success: false,
      message: `Invalid Login Details`,
    });
  }
});

app.post("/register", auth.isLogout, async (req, res) => {
  let { userid, pass } = req.body;
  let user = model({
    userid,
    pass,
  });
  let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  user.token = user.token.concat({ token });
  await user.save();
  res.json({
    success: true,
    created: true,
    message: userid + " Account Created Successfully",
  });
});

app.post("/todo/new", auth.isLogin, async (req, res) => {
  let { userid, pass, title, message } = req.body;
  let user = await model.findOne({ userid, pass });
  if (user != null) {
    user.data.push({ title, message });
    await user.save();
    res.json({
      success: true,
      updated: true,
      message: "Todo Added Successfully",
    });
  } else {
    res.json({
      success: false,
      updated: false,
      message: "User Not Found",
    });
  }
});

app.post("/retrive/todo", auth.isLogin, async (req, res) => {
  let { userid, pass } = req.body;
  let user = await model.findOne({ userid, pass });
  if (user != null) {
    if (user.data.length != 0) {
      res.json({
        userTodo: user.data,
      });
    } else {
      res.json({
        success: false,
        updated: false,
        message: "No Todos Were Found",
      });
    }
  } else {
    res.json({
      success: false,
      updated: false,
      message: "User Not Found",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server Listening At ${process.env.PORT}`);
});

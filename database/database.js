import mongoose from "mongoose";
import env from "dotenv";

env.config({
  path: "config.env",
});
mongoose
  .connect(`${process.env.MONGODB_URL}`, { dbName: "todoapi" })
  .then(() => {
    console.log("Database Connected");
  });

let schema = new mongoose.Schema({
  userid: String,
  pass: String,
  data: [
    {
      title: String,
      message: String,
    },
  ],
  token: [
    {
      token: String,
    },
  ],
});

let model = mongoose.model("model", schema, "apiData");

export default model;

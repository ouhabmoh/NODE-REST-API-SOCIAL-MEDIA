const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL), {useNewUrlParser:true}, ()=>{
    console.log("connected to db");
};

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.listen(8000, ()=>{
    console.log("backend server is running");
})
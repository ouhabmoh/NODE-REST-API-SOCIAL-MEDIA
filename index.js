const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

app.listen(8000, ()=>{
    console.log("backend server is running");
})
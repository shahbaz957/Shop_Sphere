import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connect.js";

dotenv.config();
const app = express(); // this is your main object you can say your whole server is saved in this variable

app.use(cors());
app.use(express.json()); // for parsing incoming json data
  
app.get("/", (req, res) => {
  res.send("Your app is running ....!!!");
});

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`Server is running on Port : ${process.env.PORT}`)
);

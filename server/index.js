import express from "express";
import cors from "cors";
import {StreamChat} from "stream-chat";
// import {v4 as uuidv4} from "uuid";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
// import {z} from "zod";
// import crypto from "crypto";
import authRoutes from "./routes/auth.js";
import channelRoutes from "./routes/channel.js";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const allowedOrigins = ['https://chat.stream-io-api.com', 'https://tic-tac-toe-jade-ten.vercel.app/', 'http://localhost:3000']
app.use(cors({
    origin: allowedOrigins, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (e.g., cookies)
    optionsSuccessStatus: 204, // Set the status code for successful preflight requests to 204
  }));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/auth", authRoutes);
app.use("/channel", channelRoutes);


mongoose.connect('mongodb+srv://nandini:winxclub8@testcluster1.mbm2f.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "tic-tac-toe" });

// const signupInput = z.object({
//     username: z.string().min(4, { message: "username must be 4 or more characters long" }).max(10, { message: "username must be 10 or fewer characters long" }),
//     password: z.string().min(4, { message: "password must be 4 or more characters long" }).max(10, { message: "password must be 10 or fewer characters long" }),
//     firstName: z.string().min(4, { message: "first name must be 4 or more characters long" }).max(10, { message: "first name must be 10 or fewer characters long" }),
//     lastName: z.string().min(4, { message: "last name must be 4 or more characters long" }).max(10, { message: "last name must be 10 or fewer characters long" }),
// })

// const loginInput = z.object({
//     username: z.string().min(4, { message: "username must be 4 or more characters long" }).max(10, { message: "username must be 10 or fewer characters long" }),
//     password: z.string().min(4, { message: "password must be 4 or more characters long" }).max(10, { message: "password must be 10 or fewer characters long" }),
// })

app.get("/", (req, res) => {
    console.log("dsds")
    res.json("Hello");
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})
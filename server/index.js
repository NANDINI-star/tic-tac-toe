import express from "express";
import cors from "cors";
import {StreamChat} from "stream-chat";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
// app.use(cors())
const allowedOrigins = ['https://chat.stream-io-api.com', 'http://localhost:3000']
app.use(cors({
    origin: allowedOrigins, // Replace with the Stream Chat API domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (e.g., cookies)
    optionsSuccessStatus: 204, // Set the status code for successful preflight requests to 204
  }));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));


const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const serverClient = StreamChat.getInstance(api_key, api_secret);

// Define mongoose schemas
const userSchema = new mongoose.Schema({
    userId: String,
    username: String,
    hashedPassword: String,
    firstName: String, 
    lastName: String
});

// Define mongoose models
const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb+srv://nandini:winxclub8@testcluster1.mbm2f.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "tic-tac-toe" });


app.post("/signup", async (req, res) => {
    try{
        const {firstName, lastName, username, password} = req.body
        console.log(req.body.user)
        const user = await User.findOne({ username });
        if (user) {
            res.status(403).json({ message: 'User already exists' });
        }
        else {
            const userId = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 10);
            const token = serverClient.createToken(userId);
            const newUser = new User({userId, username, hashedPassword, firstName, lastName});
            await newUser.save();
            console.log(token);
            res.json({token, userId, firstName, lastName, username, hashedPassword})        
        }
        
    } catch (error) {
        res.json(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        console.log(user)
        if (user) {
            const token = serverClient.createToken(user.userId);
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
            console.log(passwordMatch)
            if(passwordMatch) {
                res.json({
                    token, 
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username,
                    userId: user.userId
                });
            }
        } else {
            console.log("aa")
            res.status(403).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        res.json(error);
    }
    

})

app.post('/user', async (req,res) => {
    const user = await User.findOne({ username: req.body.rivalUsername });

    res.json({user})
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})
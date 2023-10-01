import express from "express";
import cors from "cors";
import {StreamChat} from "stream-chat";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {z} from "zod";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const allowedOrigins = ['https://chat.stream-io-api.com', 'http://localhost:3000']
app.use(cors({
    origin: allowedOrigins, // Replace with the Stream Chat API domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (e.g., cookies)
    optionsSuccessStatus: 204, // Set the status code for successful preflight requests to 204
  }));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));


const api_key = "ekv4nmgd9gaf";
const api_secret = "psetvy8zkpvu2e4m5pcyw6efhdpehsabvqu7hw8fvybgfgdscyxe3ncneps5zw6j";

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

const signupInput = z.object({
    username: z.string().min(4, { message: "username must be 4 or more characters long" }).max(10, { message: "username must be 10 or fewer characters long" }),
    password: z.string().min(4, { message: "password must be 4 or more characters long" }).max(10, { message: "password must be 10 or fewer characters long" }),
    firstName: z.string().min(4, { message: "first name must be 4 or more characters long" }).max(10, { message: "first name must be 10 or fewer characters long" }),
    lastName: z.string().min(4, { message: "last name must be 4 or more characters long" }).max(10, { message: "last name must be 10 or fewer characters long" }),
})

const loginInput = z.object({
    username: z.string().min(4, { message: "username must be 4 or more characters long" }).max(10, { message: "username must be 10 or fewer characters long" }),
    password: z.string().min(4, { message: "password must be 4 or more characters long" }).max(10, { message: "password must be 10 or fewer characters long" }),
})

app.get("/", (req, res) => {
    console.log("dsds")
    res.json("Hello");
})


app.post("/signup", async (req, res) => {
    try{
        const userDetails = {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        const parsedInput = signupInput.safeParse(userDetails);

        if(Object.values(userDetails).every(value => value !== 'null')){
            if(!parsedInput.success) {
                res.status(411).json({
                    error: parsedInput.error
                })
                return;
            }
            const firstName = parsedInput.data.firstName;
            const lastName = parsedInput.data.lastName;
            const username = parsedInput.data.username;
            const password = parsedInput.data.password;
    
            
            const user = await User.findOne({ username });
            if (user) {
                res.status(403).json({ message: 'User already exists' });
            }
            else {
                const userId = uuidv4();
                const hashedPassword = await bcrypt.hashSync(password, 10);
                const token = serverClient.createToken(userId);
                const newUser = new User({userId, username, hashedPassword, firstName, lastName});
                await newUser.save();
                res.json({message: "User created successfully", token, userId, firstName, lastName, username, hashedPassword})        
            }
        }
        else {
            res.status(400).json({message: 'Required fields are empty'})
        }
        
        
    } catch (error) {
        res.json(error);
    }
})

app.post("/login", async (req, res) => {
    try {
        const parsedInput = loginInput.safeParse(req.body);
        if(Object.values(req.body).every(value => value !== 'null')){
            if(!parsedInput.success) {
                res.status(411).json({
                    error: parsedInput.error
                })
                return;
            }
            const username = parsedInput.data.username;
            const password = parsedInput.data.password;
            const user = await User.findOne({ username });
            if (user) {
                const token = serverClient.createToken(user.userId);
                const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
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
                res.status(403).json({ message: 'Invalid username or password' });
            }
        } else{
            res.status(400).json({message: 'Required fields are empty'})
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
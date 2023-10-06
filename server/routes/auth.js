import express from 'express';
import { User } from "../db/index.js";
// import {z} from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {StreamChat} from "stream-chat";

const router = express.Router();

function generateNativeUuid() {
  const data = crypto.randomBytes(16);
  data[6] = (data[6] & 0x0f) | 0x40;  
  return data.toString('hex');
}

const api_key = "ekv4nmgd9gaf";
const api_secret = "psetvy8zkpvu2e4m5pcyw6efhdpehsabvqu7hw8fvybgfgdscyxe3ncneps5zw6j";
const serverClient = StreamChat.getInstance(api_key, api_secret);


router.post("/signup", async (req, res) => {
  try{
    console.log(req.body)
      const userDetails = {
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
      };
      // const parsedInput = signupInput.safeParse(userDetails);

      if(Object.values(userDetails).every(value => value !== 'null')){
          // if(!parsedInput.success) {
          //     res.status(411).json({
          //         error: parsedInput.error
          //     })
          //     return;
          // }
          // const firstName = parsedInput.data.firstName;
          // const lastName = parsedInput.data.lastName;
          // const username = parsedInput.data.username;
          // const password = parsedInput.data.password;
  
          const username = userDetails.username;
          const firstName = userDetails.firstName;
          const lastName = userDetails.lastName;
          const password = userDetails.password;
          const user = await User.findOne({ username });
          if (user) {
              res.status(403).json({ message: 'User already exists' });
          }
          else {
              const userId = generateNativeUuid();
              console.log(userId);
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

router.post("/login", async (req, res) => {
  try {
      // const parsedInput = loginInput.safeParse(req.body);
      if(Object.values(req.body).every(value => value !== 'null')){
          // if(!parsedInput.success) {
          //     res.status(411).json({
          //         error: parsedInput.error
          //     })
          //     return;
          // }
          // const username = parsedInput.data.username;
          // const password = parsedInput.data.password;
          const username = req.body.username;
          const password = req.body.password;
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

router.post('/user', async (req,res) => {
  const user = await User.findOne({ username: req.body.rivalUsername });
  res.json({user})
})

export default router;
import express from 'express';
import { Channel } from '../db/index.js';
import { User } from '../db/index.js';

const router = express.Router();

router.get("/channel-data", async (req, res) => {
  try{
    const userId = req.query.userId1;
    
    const channel = await Channel.findOne({ userId1: userId});
    console.log(channel, userId) 
    if(channel || channel2){
      res.json({
        channelId:channel.channelId, 
        userId1: channel.userId1, 
        userId2: channel.userId2,
        gamePattern: channel.gamePattern,
        gameName: channel.gameName
      });
    }
    
  } catch(error) {
    res.status(403).json({ message: 'User not found' });
  }
})

router.post("/save-channel-data", async (req, res) => {
  try{
    const userId1 = req.body.userId1;
    const userId2 = req.body.userId2;
    const gamePattern = req.body.gamePattern;
    const gameName = req.body.gameName;
    const user = await User.findOne({ userId: userId1 });
    if(user){
      const channelId = req.body.channelId;
      const channel = await Channel.findOne({ gameName: gameName });
      if(!channel){
        Channel.deleteOne({ gameName: gameName })
      }
      const newChannel = new Channel({userId1, userId2, channelId, gamePattern, gameName});
      await newChannel.save();
      res.json({userId1, userId2, channelId, gamePattern, gameName}).status(200)
    }
    
  } catch(error) {
    res.status(403).json({ message: 'Channel was not created' });
  }
})

export default router;
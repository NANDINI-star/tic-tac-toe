import mongoose from "mongoose";

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  hashedPassword: String,
  firstName: String, 
  lastName: String,
});

const channelSchema = new mongoose.Schema({
  userId1: String,
  userId2: String,
  channelId: String,
  gameName: String,
  gamePattern: String
})

export const User = mongoose.model('User', userSchema);
export const Channel = mongoose.model('Channel', channelSchema);
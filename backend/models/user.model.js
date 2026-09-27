import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User; // Yeh line hi asal problem thi jo ab theek ho gayi hai
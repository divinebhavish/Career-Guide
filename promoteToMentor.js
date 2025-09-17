const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career_guidance';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  grade: String,
  interests: [String],
  role: { type: String, enum: ['student', 'mentor'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

async function promote(email) {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  user.role = 'mentor';
  await user.save();
  console.log(`User ${user.email} promoted to mentor.`);
  process.exit(0);
}

const email = process.argv[2];
if (!email) {
  console.log('Usage: node promoteToMentor.js user@example.com');
  process.exit(1);
}
promote(email); 
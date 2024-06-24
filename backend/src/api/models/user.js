const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, trim: true, required: true, unique: true },
  userName: { type: String, trim: true, required: true, unique: true },
  password: { type: String, trim: true, required: true },
  profilePic: { type: String, trim: true, required: false}
},{
  timestamps:true,
  collection:"users"
});

userSchema.pre("save", function() {
  this.password = bcrypt.hashSync(this.password, 10);
});


const User = mongoose.model('user',userSchema,"users");
module.exports = User;
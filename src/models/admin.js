const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  phone_number: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    enum: ["super", "admin", "member"]
  },
  permission: {
    type: Number,
    required: true,
    default: 0,
    enum: [0,1,2,3,4]
  },
  name: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: 0
  },
  is_active: {
    type: Boolean,
    required: false,
    default: 0
  },
  failedLoginAttempts: {
    type: Number,
    required: false,
    default: 0
  },
  lockUntil: { 
    type: Date 
  }
},
{
  timestamps: true
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = {
  Admin
};
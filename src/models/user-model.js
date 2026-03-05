const mongoose = require("mongoose")

const userModelSchema = new mongoose.Schema({
   firstName: String,
   lastName: String,
   role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee"
   },
   email: { type: String, require: true, unique: true },
   password: { type: String, require: true },
   dob: Date,
   department: String,
   joiningdate: Date,
   mobile1: Number,
   mobileno2: Number,
   password: String,
   address: String,
   skills: {
      frontend: [],
      backend: []
   },
   aboutme: String,
})

module.exports = mongoose.model("UserModel", userModelSchema) 
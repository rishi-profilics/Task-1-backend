const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    gender: String,
    dob: String,
    department: String,
    joiningdate: String,
    mobileno1: String,
    mobileno2: String,
    password: String,
    address1: String,
    address2: String,
    emergencycontact1: String,
    emergencycontact2: String,
    emergencycontact3: String,
    skills: [String],
    aboutme: String 
})

module.exports = mongoose.model("User" , userSchema)
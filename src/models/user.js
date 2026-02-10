const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    gender: String,
    dob: Date,
    department: String,
    joiningdate: Date,
    mobileno1: Number,
    mobileno2: Number,
    password: String,
    address1: String,
    address2: String,
    emergencycontact1: Number,
    emergencycontact2: Number,
    emergencycontact3: Number,
    skills: {
        frontend: [],
        backend: []
    },
    aboutme: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt:{ 
        type: Date,
        default: null
    },
})

module.exports = mongoose.model("User" , userSchema)
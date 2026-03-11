const mongoose = require("mongoose")

const referralSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    altPhone: {
        type: String
    },
    experience: {
        type: Number,
        required: [true, "Experience is required"]
    },
    resumUrl: {
        type: String
    },
    refferedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: [true, "User is required"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Referral", referralSchema)
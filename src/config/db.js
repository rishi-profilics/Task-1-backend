const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("D connected")
    } catch (error) {
        console.log("connection Failed", error)
        process.exit(1);    // terminate a program immidiately
    }
}

module.exports = connectDb

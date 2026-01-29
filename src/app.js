require('dotenv').config()
const express = require('express')
const cors = require('cors')
const User = require('./models/user')

const app = express()

const userData = []

app.use(cors())
app.use(express.json()) 

app.get("/users", async (req, res) => {
    try {
        const userData = await User.find()
        
        res.status(200).json({
            success: true,
            data: userData,
            count: userData.length
        })
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

})

app.post("/create", async (req, res) => {
    try{
        const user = await User.create(req.body)
        res.status(201).json({
            success: true,
            data: user
        })
    } catch(error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
})

module.exports = app
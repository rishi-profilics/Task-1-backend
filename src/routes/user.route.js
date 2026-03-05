const express = require("express")
const middleware = require("../../middleware/auth")
const { getAllUsersController } = require("../controllers/user.controller")

const userRouter = express.Router()

userRouter.get("/", middleware, getAllUsersController )

module.exports = userRouter
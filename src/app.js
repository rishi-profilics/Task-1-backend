require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const userModel = require('./models/user-model')
const jwt = require('jsonwebtoken')
const app = express()
const middleware = require('../middleware/auth')
const Activity = require('./models/activity-schema')




app.use(cors())
app.use(express.json())

app.get("/users", async (req, res) => {
    try {
        const userData = await User.find({ isDeleted: false })

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

app.get("/profile", middleware, async (req, res) => {
    const user = await userModel.findById(req.userId).select("-password")
    res.json({
        success: true,
        data: user
    })
})
app.put("/profile", middleware, async (req, res) => {
    try {
        const userData = req.body
        const user = await userModel.findByIdAndUpdate(req.userId, userData, { new: true })
        res.json({
            success: true,
            data: user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

// app.post("/activity", middleware, async (req, res) => {
//     try {

//         const userId = req.userId
//         const now = new Date()
//         const activeSession = await Activity.findOne({ user_id: userId, status: "active" })

//         if (!activeSession) {
//             const activity = await Activity.create({
//                 user_id: userId,
//                 activity_type: "punch_in",
//                 description: "Punched In",
//                 in_time: now,
//                 out_time: null,
//                 status: "active",
//                 deleted_at: null
//             })

//             return res.json({
//                 success: true,
//                 message: "Punched in successfully",
//                 data: activity
//             })
//         }

//         activeSession.activity_type = "punch_out"
//         activeSession.description = 'Punched out'
//         activeSession.out_time = now
//         activeSession.status = "complete"

//         activeSession.save()

//         res.json({
//             success: true,
//             message: "Punched out successfully",
//             data: activeSession
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

app.post("/activity", middleware, async (req, res) => {
    try {
        const userId = req.userId
        const { description, action } = req.body
        const startOfToday = new Date().setHours(0, 0, 0, 0)
        const now = new Date()

        const todaysData = await Activity.find({
            user_id: userId,
            createdAt: { $gte: startOfToday }
        }).sort({ createdAt: -1 })

        const hasPuchedIn = todaysData.find(e => e.activity_type === "punch_in" && e.status === "active")
        const hasBreakIn = todaysData.find(e => e.activity_type === "break_in" && e.status === "break")
        const hasBreakout = todaysData.find(e => e.activity_type === "break_out" && e.status === "completed")
        const hasPuchedOut = todaysData.some(e => e.activity_type === "punch_out")

        if (hasPuchedIn && hasPuchedOut) {
            return res.status(400).json({
                success: false,
                message: "You have already punched out for today"
            })
        }

        if (!hasPuchedIn && description) {
            return res.status(400).json({
                success: false,
                message: "Can't take break without punching in"
            })
        }


        if (action === "punch") {
            if (!hasPuchedIn) {
                const punchInData = await Activity.create({
                    user_id: userId,
                    activity_type: "punch_in",
                    description: "Punch In",
                    in_time: now,
                    out_time: null,
                    status: "active",
                    deleted_at: null
                })

                return res.json({
                    success: true,
                    message: "Punched in Successfully",
                    data: punchInData
                })
            }

            if (hasPuchedIn && hasBreakIn && !hasBreakout) {
                const BreakOutData = await Activity.create({
                    user_id: userId,
                    activity_type: "break_out",
                    description: "Break Out",
                    in_time: hasBreakIn.in_time,
                    out_time: now,
                    status: "completed",
                    deleted_at: null,
                    punchInRef: hasPuchedIn._id
                })
                const punchOutData = await Activity.create({
                    user_id: userId,
                    activity_type: "punch_out",
                    description: "Punch Out",
                    in_time: hasPuchedIn.in_time,
                    out_time: new Date(),
                    status: "complete",
                    deleted_at: null,
                    punchInRef: hasPuchedIn._id
                })

                hasBreakIn.status = "completed"
                await hasBreakIn.save()

                return res.json({
                    success: true,
                    message: "Break completed and Punched out",
                    data: { punchOutData, BreakOutData }
                })
            }

            const punchOutData = await Activity.create({
                user_id: userId,
                activity_type: "punch_out",
                description: "Punch Out",
                in_time: hasPuchedIn.in_time,
                out_time: new Date(),
                status: "complete",
                deleted_at: null,
                punchInRef: hasPuchedIn._id
            })

            return res.json({
                success: true,
                message: "Punched out",
                data: punchOutData
            })



        }


        if (action === "break") {

            if (!hasPuchedIn && description === "") {
                return res.status(400).json({
                    success: false,
                    message: "Please Punch in first"
                })
            }


            if (hasPuchedIn && !hasBreakIn) {
                const BreakInData = await Activity.create({
                    user_id: userId,
                    activity_type: "break_in",
                    description: description,
                    in_time: now,
                    out_time: null,
                    status: "break",
                    deleted_at: null,
                    punchInRef: hasPuchedIn._id
                })

                return res.status(201).json({
                    success: true,
                    message: "Break Started",
                    data: BreakInData
                })
            }

            if (hasPuchedIn && hasBreakIn) {
                const BreakOutData = await Activity.create({
                    user_id: userId,
                    activity_type: "break_out",
                    description: "Break Out",
                    in_time: hasBreakIn.in_time,
                    out_time: now,
                    status: "completed",
                    deleted_at: null,
                    punchInRef: hasPuchedIn._id
                })

                hasBreakIn.status = "completed"
                await hasBreakIn.save()

                return res.status(201).json({
                    success: true,
                    message: "Break ended",
                    data: BreakOutData
                })
            }

        }



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.get("/activity/today", middleware, async (req, res) => {
    try {
        const userId = req.userId
        const {fromDate, toDate} = req.query

        const startDate = fromDate ? new Date(fromDate) : new Date()
        const endDate = toDate ? new Date(toDate) : new Date()

        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        const userData = await Activity.find({ user_id: userId, deleted_at: null, createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: userData
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

})

app.get("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const getuser = await User.findById(userId)
        res.status(200).json({
            success: true,
            data: getuser
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (user) {
            return res.status(400).json({
                success: false,
                message: "user already exist"
            })
        }

        const hassedPass = await bcrypt.hash(password, 10)

        const createdUser = await userModel.create({ firstName, lastName, email, password: hassedPass })

        res.status(201).json({
            success: true,
            message: "user Created",
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        if (user && isMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res.send({ token })
        }



    } catch (error) {
        res.status(500).send(error)
    }
})

app.patch("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const userData = req.body
        console.log(userData)
        const getuser = await User.findByIdAndUpdate(userId, userData, { new: true })

        if (!getuser) {
            res.status(404).success("user not found")
        }

        res.json({
            success: true,
            data: getuser,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

app.post("/create", async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

app.patch("/deleteuser/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const getuser = await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() }, { new: true })

        if (!getuser) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.delete("/remove/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const deleteUser = await User.findByIdAndDelete(userId)

        if (!deleteUser) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid user id"
        })
    }
})

module.exports = app
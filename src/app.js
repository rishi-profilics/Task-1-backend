require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
// const User = require('./models/user')
const userModel = require('./models/user-model')
const jwt = require('jsonwebtoken')
const app = express()
const middleware = require('../middleware/auth')
const Activity = require('./models/activity-schema')
const Report = require('./models/report.model')
const Event = require('./models/event-model')
const galleryRouter = require('./routes/gallery.route')
const path = require("path")
const projectRouter = require('./routes/project.route')
const userRouter = require('./routes/user.route')
const todoRouter = require('./routes/todo.route')
const referralRouter = require('./routes/referral.route')




app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(path.join(__dirname, "../src/uploads")))  // here we are making our public folder publically accessible because by default browser cannot due to security reasons

app.use("/api/gallery", galleryRouter)

app.use("/api/project", projectRouter)

app.use("/api/user", userRouter)

app.use("/api/todo", todoRouter)

app.use("/api/referral", referralRouter)

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

app.post("/report", middleware, async (req, res) => {
    try {
        const user_id = req.userId
        const { start_time, end_time, break_duration_in_minutes, working_hours, total_hours, report } = req.body

        const currentReport = await Report.create({
            start_time, end_time, break_duration_in_minutes, report, working_hours, total_hours, user_id
        })

        res.status(201).json({
            success: true,
            message: "Report submited",
            data: currentReport
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

app.get("/report/:id", middleware, async (req, res) => {
    try {
        const reportId = req.params.id
        const report = await Report.findById(reportId)

        res.status(200).json({
            success: true,
            data: report
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

})

app.put("/report/:id", middleware, async (req, res) => {
    try {
        const reportId = req.params.id
        const data = req.body
        const reportData = await Report.findByIdAndUpdate(reportId, data, { new: true })

        if (!reportData) {
            res.status(404).success("user not found")
        }

        res.status(200).json({
            success: true,
            data: reportData,
            message: "Report Updated Successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

})

app.get("/report", middleware, async (req, res) => {
    try {
        const userId = req.userId
        const { fromDate, toDate } = req.query

        const startDate = fromDate ? new Date(fromDate) : new Date()
        const endDate = toDate ? new Date(toDate) : new Date()

        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)

        const getReport = await Report.find({ user_id: userId, deleted_at: null, createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: getReport
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: error.message
        })
    }
})

app.get("/allreport", middleware, async (req, res) => {
    try {
        const userId = req.userId


        const getReport = await Report.find({ user_id: userId, deleted_at: null }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: getReport
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            data: error.message
        })
    }
})

app.post("/events", middleware, async (req, res) => {
    try {
        const { event_on, name, event_type } = req.body
        const event = await Event.create({
            event_on,
            name,
            event_type
        })

        res.status(201).json({
            success: true,
            message: "Event Created",
            data: event
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

})

app.get("/events", middleware, async (req, res) => {
    try {
        const { event_type } = req.query

        let event = null
        if (event_type === "event") {
             event = await Event.aggregate([
                { $match: { event_type: "event"}},
                {
                    $addFields: {
                        month: { $month: "$event_on" },         // this extract month 1-12
                        day: { $dayOfMonth: "$event_on" },   // dayOfMongth extracts the month 1-31
                    }
                },
                {
                    $sort: { month: 1, day: 1 }
                }
            ])
        }

        if (event_type === "holiday") {
            const now = new Date()
            event = await Event.find({event_type: "holiday", event_on: { $gte: now}}).sort({ event_on: 1 })
        }


        res.status(200).json({
            success: true,
            data: event,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

app.delete("/holiday/:id", middleware, async (req, res) => {
    try {
        const id = req.params.id
        await Event.deleteById(id)

        return res.json({
            success: true,
            message: "user deleted"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
})

app.put("/holiday/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedHoliday = await Event.findByIdAndUpdate(
      id,
      data,
      {
        new: true,         
        runValidators: true 
      }
    );

    if (!updatedHoliday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      data: updatedHoliday,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

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
                    message: "Break completed and Report has been submitted successfully.",
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
                message: "Report has been submitted successfully.",
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
        const { fromDate, toDate } = req.query

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
            const token = jwt.sign({ userId: user._id, role: user.role, email:user.email }, process.env.JWT_SECRET)
            res.send({ token })
        }



    } catch (error) {
        res.status(500).send(error)
    }
})




// app.get("/users", async (req, res) => {
//     try {
//         const userData = await User.find({ isDeleted: false })

//         res.status(200).json({
//             success: true,
//             data: userData,
//             count: userData.length
//         })

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }

// })

// app.get("/user/:id", async (req, res) => {
//     try {
//         const userId = req.params.id
//         const getuser = await User.findById(userId)
//         res.status(200).json({
//             success: true,
//             data: getuser
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

// app.patch("/user/:id", async (req, res) => {
//     try {
//         const userId = req.params.id
//         const userData = req.body
//         console.log(userData)
//         const getuser = await User.findByIdAndUpdate(userId, userData, { new: true })

//         if (!getuser) {
//             res.status(404).success("user not found")
//         }

//         res.json({
//             success: true,
//             data: getuser,
//         })

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

// app.post("/create", async (req, res) => {
//     try {
//         const user = await User.create(req.body)
//         res.status(201).json({
//             success: true,
//             data: user
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

// app.patch("/deleteuser/:id", async (req, res) => {
//     try {
//         const userId = req.params.id
//         const getuser = await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() }, { new: true })

//         if (!getuser) {
//             res.status(404).json({
//                 success: false,
//                 message: "user not found"
//             })
//         }

//         res.json({
//             success: true,
//             message: "User deleted successfully"
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// })

// app.delete("/remove/:id", async (req, res) => {
//     try {
//         const userId = req.params.id
//         const deleteUser = await User.findByIdAndDelete(userId)

//         if (!deleteUser) {
//             res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             })
//         }

//         res.status(200).json({
//             success: true,
//             message: "User deleted successfully"
//         })

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: "Invalid user id"
//         })
//     }
// })

module.exports = app



//? There are plugins to which you can use to soft delete a document like mongoose-delete 
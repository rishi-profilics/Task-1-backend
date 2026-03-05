const express = require("express")
const middleware = require("../../middleware/auth")
const { addProjectController, getProjectController, updateProjectController, getProjectByIdController, deleteProjectController } = require("../controllers/project.controller")
const { deleteGalleryImageById } = require("../controllers/gallery.controller")
const authorize = require("../../middleware/authorize")

const projectRouter = express.Router()

projectRouter.post("/", middleware, authorize("admin") ,addProjectController)

projectRouter.get("/", middleware, getProjectController)

projectRouter.put("/:id", middleware, authorize("admin"), updateProjectController)

// projectRouter.get("/:id", middleware, getProjectByIdController)

projectRouter.delete("/:id", middleware, authorize("admin"), deleteProjectController)

module.exports = projectRouter
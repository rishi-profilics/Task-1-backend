const { default: mongoose } = require("mongoose");
const projectModel = require("../models/project.model");
const userModel = require("../models/user-model");

const addProjectController = async (req, res) => {
  const { projectname, clientname, technology, teammembers } = req.body;
  const id = req.userId;

  try {
    // const isAlreadyExist = await projectModel.findOne({
    //     user, projectname, clientname
    // })

    // if (isAlreadyExist) {
    //     return res.status(409).json({
    //         success: false,
    //         message: "Project already exist"
    //     })
    // }

    const user = await userModel.findById(id);

    const isAdmin = user.role === "admin";

    if (!isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Only admin can create a Project',
      });
    }

    const project = await projectModel.create({
      projectname,
      clientname,
      teammembers,
      technology,
      user,
    });

    return res.status(201).json({
      success: true,
      message: "Project has been added",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectController = async (req, res) => {
  const user = req.userId;
  const { fromDate, toDate } = req.query;

  const startDate = fromDate ? new Date(fromDate) : new Date();
  const endDate = toDate ? new Date(toDate) : new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  try {
    const projects = await projectModel
      .find({
        $or: [{ teammembers: new mongoose.Types.ObjectId(user) }, { user }],
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("teammembers", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(400).json({
      succes: false,
      message: error.message,
    });
  }
};

const updateProjectController = async (req, res) => {
  const data = req.body;
  const userId = req.userId;
  const id = req.params.id;

  try {
    const user = await userModel.findById(userId);

    const isAdmin = user.role === "admin";

    if (!isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Only admin can update a Project',
      });
    }

    const project = await projectModel.findById(id);

    const isAuthenticated = project.user.toString() === userId;

    if (!isAuthenticated) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    const updateProject = await projectModel.findByIdAndUpdate(id, data);

    res.status(200).json({
      success: true,
      message: "Project Details has been updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// const getProjectByIdController = async (req, res) => {
//     const user = req.userId
//     const id = req.params.id

//     try {
//         const project = await projectModel.findById(id)

//         const isAuthenticated = project.user.toString() === user

//         if (!isAuthenticated) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not authorized to access this resource"
//             })
//         }

//         res.status(200).json({
//             success: true,
//             data: project
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }

// }

const deleteProjectController = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;

  try { 
    const user = await userModel.findById(userId);

    const isAdmin = user.role === "admin";

    if (!isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Only admin can delete a Project',
      });
    }

    const project = await projectModel.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isAuthenticated = project.user.toString() === userId;

    if (!isAuthenticated) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    await projectModel.deleteById(id);

    res.status(200).json({
      success: true,
      message: "Project has been deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProjectController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
};

const userModel = require("../models/user-model");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: { $ne: "admin" } });
    const count = await userModel.countDocuments({ role: { $ne: "admin" } });

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No user exist create a user first",
      });
    }

    const formattedUsers = users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    }));

    return res.status(200).json({
      success: true,
      count,
      data: formattedUsers
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAllUsersController };

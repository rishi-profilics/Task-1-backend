const todoModel = require("../models/todo.schema");
const userModel = require("../models/user-model");

const addTodoController = async (req, res) => {
  try {
    const { task, due, priority, assignedto } = req.body;

    const todo = await todoModel.create({ task, due, priority, assignedto });

    res.status(201).json({
      success: true,
      message: "Task Created",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const completeTodoController = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await todoModel.findByIdAndUpdate(id, { status: "completed" });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "No task found",
      });
    }

    if (task.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Task has already been completed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task has been completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodoController = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    const isAdmin = user.role === "admin";

    let todoList;
    if (isAdmin) {
      todoList = await todoModel.find({status: "pending"})
    } else {
      todoList = await todoModel.find({ assignedto: userId, status: "pending" })
    }

    res.status(200).json({
      success: true,
      data: todoList,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addTodoController,
  getTodoController,
  completeTodoController,
};

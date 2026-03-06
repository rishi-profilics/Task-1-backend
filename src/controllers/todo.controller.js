const todoModel = require("../models/todo.schema");

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
    const { search } = req.query;

    const isAdmin = req.role === "admin";

    let searchFilter = {};

    if (search) {
      searchFilter.task = { $regex: search, $options: "i" };
    }

    let todoList;
    if (req.role === "admin") {
      todoList = await todoModel.find(searchFilter).sort({ status: -1, due: 1 });
    } else {
      todoList = await todoModel
        .find({ assignedto: userId })
        .sort({ status: -1, due: 1 });
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

const deleteTodoController = async (req, res) => {
    try {
      const id = req.params.id

        await todoModel.deleteById(id)

        return res.json({
            success: true,
            message: "Task has been deleted"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const updateTodoController = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body

    await todoModel.findByIdAndUpdate(id, data)

    res.status(200).json({
      success: true,
      message: "Task has been updated"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  addTodoController,
  getTodoController,
  completeTodoController,
  deleteTodoController,
  updateTodoController
};

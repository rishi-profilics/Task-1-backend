const express = require('express')
const middleware = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const { addTodoController, getTodoController, completeTodoController, deleteTodoController, updateTodoController } = require('../controllers/todo.controller')
const todoRouter = express.Router()

todoRouter.post("/", middleware, authorize("admin"), addTodoController)

todoRouter.get("/", middleware, getTodoController)

todoRouter.put("/:id", middleware, completeTodoController)

todoRouter.delete("/:id", middleware, authorize("admin"), deleteTodoController)

todoRouter.put("/update/:id", middleware, authorize("admin"), updateTodoController)

module.exports = todoRouter
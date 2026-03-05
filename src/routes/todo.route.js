const express = require('express')
const middleware = require('../../middleware/auth')
const authorize = require('../../middleware/authorize')
const { addTodoController, getTodoController, completeTodoController } = require('../controllers/todo.controller')
const todoRouter = express.Router()

todoRouter.post("/", middleware, authorize("admin"), addTodoController)

todoRouter.get("/", middleware, getTodoController)

todoRouter.put("/:id", middleware, completeTodoController)

module.exports = todoRouter
import express from "express"
import bodyParser from "body-parser"
import UserController from "../controllers/userController"

const Router = express.Router()
const { createUser, getAllUsers, getUserById } = UserController

// post create user
Router.post('/api/users', bodyParser.json(), createUser)

// get all users
Router.get('/api/users', getAllUsers)

// get user by id
Router.get('/api/users/:id', getUserById)

export default Router
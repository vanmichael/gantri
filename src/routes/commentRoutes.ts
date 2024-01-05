import express from "express"
import bodyParser from "body-parser"
import CommentController from "../controllers/commentController"

const Router = express.Router()
const { createComment } = CommentController

// post create comment
Router.post('/api/comments', bodyParser.json(), createComment)

export default Router
import express from "express"
import ArtController from "../controllers/artController"

const Router = express.Router()
const { getAllArt, getAllArtById } = ArtController

// get all art
Router.get('/api/art', getAllArt)

// get art by id
Router.get('/api/art/:id', getAllArtById)

export default Router
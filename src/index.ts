import express, { Request, Response, ErrorRequestHandler, NextFunction } from "express"
import ArtRouter from './routes/artRoutes'
import UserRouter from './routes/userRoutes'
import CommentRouter from './routes/commentRoutes'

const app = express()
const port = 3000

// routes
app.use(ArtRouter)
app.use(UserRouter)
app.use(CommentRouter)

// error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    } else {
        next()
    }
})

app.listen(port, () => {
    console.log(`Gantri app server listening on port ${port}`)
})
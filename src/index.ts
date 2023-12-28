import express, { Request, Response, ErrorRequestHandler, NextFunction } from "express"
import { PrismaClient, Prisma } from '@prisma/client'
import bodyParser from "body-parser"
import Joi from "joi"
import { excludeNullUserId } from './excludeHelpers'
import { PrismaClientKnownRequestErrorCodes } from './enums'
import { Art } from './types'

const { PrismaClientKnownRequestError } = Prisma
const prisma = new PrismaClient()
const app = express()
const port = 3000

// get all art
app.get('/api/art', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artWithComments: Art[] = await prisma.art.findMany({ select: { id: true, title: true, artist: true, year: true, comments: { select: { id: true, name: true, content: true, userId: true } } }})
        const mappedArtWithCommentsAndOptionalUserId: Art[] = artWithComments.map((art) => {
            art.comments = art.comments.map((comment) => excludeNullUserId(comment))
            return art
        });
        res.json(mappedArtWithCommentsAndOptionalUserId)
    } catch (err) {
        next(err)
    }
})

// get art by id
app.get('/api/art/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id)
        const art: Art | null = await prisma.art.findUnique({ where: { id }, select: { id: true, title: true, artist: true, year: true, comments: { select: { id: true, name: true, content: true, userId: true } } } })
        if (art && art.comments) art.comments = art.comments.map((comment) => excludeNullUserId(comment))
        res.json(art)
    } catch (err) {
        next(err)
    }
})

// post create user
app.post('/api/users', bodyParser.json(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = Joi.object().keys({
            name: Joi.string().alphanum().required(),
            age: Joi.number().required(),
            location: Joi.string(),
        }).validate(req.body);
    
        if (error) {
            res.status(422).json({ error: error.details.map(i => i.message).join(',') })
        } else {
            const user = await prisma.user.create({
                data: {
                  name: req.body.name,
                  age: req.body.age,
                  location: req.body.location,
                },
              })
            res.json(user)
        }
    } catch (err) {
        next(err)
    }
})

// get all users
app.get('/api/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (err) {
        next(err)
    }
})

// get user by id
app.get('/api/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({ where: { id } })
        if (user) {
            res.json(user)
        } else {
            res.status(404).send('User not found')
        }
    } catch (err) {
        next(err)
    }
})

// post create comment
app.post('/api/comments', bodyParser.json(), async (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.object().keys({
        artId: Joi.number().required(),
        userID: Joi.string(),
        name: Joi.string().alphanum(),
        content: Joi.string().required(),
    }).xor('userID', 'name').validate(req.body)
    if (error) {
        res.status(422).json({ error: error.details.map(i => i.message).join(',') })
    } else {
        try {
            let user
            const userId = req.body.userID
            if (userId) user = await prisma.user.findUnique({ where: { id: userId } })
            if (userId && !user) res.status(404).send('User Not found')
            const comment = await prisma.comment.create({
                data: {
                    artId: req.body.artId,
                    userId: user ? userId : null,
                    nonUserName: req.body.name && !user ? req.body.name : null, // Added property to avoid using a prisma computed property
                    name: user ? user.name : req.body.name,
                    content: req.body.content,
                },
              })
            res.json(comment)
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === PrismaClientKnownRequestErrorCodes.P2002 && err?.meta?.modelName === 'Comment') {
                    console.error({ errorCode: err.code, errorMessage: err.message, errMeta: err.meta })
                    res.status(422).json({ error: 'Only 1 comment allowed per art record and name, please create a user to comment more!'})
                } else {
                    next(err);
                }
            } else {
                next(err)
            }
        }
    }
})

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
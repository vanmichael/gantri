import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import prismaClient from '../models/db'
import { Prisma } from '@prisma/client'
const { PrismaClientKnownRequestError } = Prisma
import { PrismaClientKnownRequestErrorCodes } from '../enums'

const CommentController = {
    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = Joi.object().keys({
                artId: Joi.number().required(),
                userID: Joi.string(),
                name: Joi.string().alphanum(),
                content: Joi.string().required(),
            }).xor('userID', 'name').validate(req.body)

            if (error) {
                res.status(422).json({ error: error.details.map(i => i.message).join(',') })
            } else {
                let user
                const userId = req.body.userID
                if (userId) user = await prismaClient.user.findUnique({ where: { id: userId } })
                if (userId && !user) res.status(404).send('User Not found')
                const comment = await prismaClient.comment.create({
                    data: {
                        artId: req.body.artId,
                        userId: user ? userId : null,
                        nonUserName: req.body.name && !user ? req.body.name : null, // Added property to avoid using a prisma computed property
                        name: user ? user.name : req.body.name,
                        content: req.body.content,
                    },
                    })
                res.json(comment)
            }
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
}

export default CommentController;
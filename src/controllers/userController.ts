import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import prismaClient from '../models/db'

const UserController = {
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { error } = Joi.object().keys({
                name: Joi.string().alphanum().required(),
                age: Joi.number().required(),
                location: Joi.string(),
            }).validate(req.body);

            if (error) {
                res.status(422).json({ error: error.details.map(i => i.message).join(',') })
            } else {
                const user = await prismaClient.user.create({
                    data: {
                      name: req.body.name,
                      age: parseInt(req.body.age),
                      location: req.body.location,
                    },
                  })
                res.json(user)
            }
        } catch (err) {
            next(err)
        }
    },

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await prismaClient.user.findMany()
            res.json(users)
        } catch (err) {
            next(err)
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const user = await prismaClient.user.findUnique({ where: { id } })
            if (user) {
                res.json(user)
            } else {
                res.status(404).send('User not found')
            }
        } catch (err) {
            next(err)
        }
    }
}

export default UserController
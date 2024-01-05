import { Request, Response, NextFunction } from "express"
import { excludeIfNullFromComment } from '../excludeHelpers'
import { Art } from '../types'
import prismaClient from '../models/db'
import { allArtWithCommentsView } from '../models/prismaQueryViews'

const ArtController = {
    async getAllArt(req: Request, res: Response, next: NextFunction) {
        try {
            const artWithComments: Art[] = await prismaClient.art.findMany({ select: allArtWithCommentsView })
            const mappedArtWithCommentsAndOptionalUserId: Art[] = artWithComments.map((art) => {
                art.comments = art.comments.map((comment) => excludeIfNullFromComment(comment))
                return art
            });
            return res.json(mappedArtWithCommentsAndOptionalUserId)
        } catch (err) {
            return next(err)
        }
    },

    async getAllArtById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const art: Art | null = await prismaClient.art.findUnique({ where: { id }, select: allArtWithCommentsView })
            if (art && art.comments) art.comments = art.comments.map((comment) => excludeIfNullFromComment(comment))
            res.json(art)
        } catch (err) {
            next(err)
        }
    }
}

export default ArtController
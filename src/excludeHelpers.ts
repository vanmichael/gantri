import { Comment } from './types'

export function excludeNullUserId(comment: Comment) : Comment {
    const partialComment = { id: comment.id, name: comment.name, content: comment.content } as Comment
    if (comment.userId) partialComment.userId = comment.userId
    return partialComment
}
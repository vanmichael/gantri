import { Comment } from './types'

export function excludeIfNullFromComment<Comment>(comment: Comment): Comment {
  return Object.fromEntries(
    Object.entries(comment as Partial<Comment>).filter(([key, value]) => value !== null)
  ) as Comment
}
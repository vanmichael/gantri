export type Comment = {
    id: number,
    name: string,
    content: string,
    userId: string | null | undefined
}

export type Art = {
    id: number,
    artist: string,
    title: string | null,
    year: string | null,
    comments: Comment[]
}
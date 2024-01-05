export const allArtWithCommentsView = {
    id: true,
    title: true,
    artist: true,
    year: true,
    comments: { select: { id: true, name: true, content: true, userId: true } }
}

export interface BookInfo {
    id: string
    title: string
    description: string
    imageLinks: { thumbnail: string }
    authors: string[]
    genre: string
    publisher: string
    publishedDate: string
    pageCount: number
    maturityRating: string
    likes: number
    postedBy: string
    cloudUrl: string
}
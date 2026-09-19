export default class Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    thumbnail: string;

    constructor(_id: string, title: string, author: string, genre: string, thumbnail: string) {
        this._id = _id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.thumbnail = `https://storage.googleapis.com/${thumbnail}`;
    }
}
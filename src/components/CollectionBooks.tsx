interface Book {
    id: string
    title: string
    author: string
    genre: string
    thumbnail: string
}

interface CollectionBooksProps {
    books: Book[]
    emptyText: string
}

export default function CollectionBooks({ books, emptyText }: CollectionBooksProps) {
    if (books.length === 0) {
        return <p className="text-muted-foreground">{emptyText}</p>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
                <div key={book.id} className="relative group">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                                <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                                <p className="text-xs mt-1 line-clamp-1">{book.author}</p>
                                <span className="text-xs mt-1 px-2 py-0.5 bg-primary/20 rounded-full inline-block">
                                    {book.genre}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
interface Book {
    id: string
    title: string
    thumbnail: string
    progress: number
}

interface LastReadBooksProps {
    books: Book[]
    emptyText: string
}

export default function LastReadBooks({ books, emptyText }: LastReadBooksProps) {
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
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${book.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs mt-1">{book.progress}% complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}  
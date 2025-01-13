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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {books.map((book) => (
        <a href={`/book/${book.id}/read-book`} key={book.id} className="group relative">
          <div key={book.id} className="relative">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="font-semibold text-sm text-white line-clamp-1">{book.title}</h3>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200/30 rounded-full h-1.5">
                      <div
                        className="bg-accent h-1.5 rounded-full"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-white/90">{book.progress}% complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}


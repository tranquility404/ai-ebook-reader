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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {books.map((book) => (
          <a href={`/book/${book.id}`} key={book.id} className="group relative">
          <div key={book.id} className="relative">
            <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="font-semibold text-sm text-white line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-white/90 mt-1 line-clamp-1">{book.author}</p>
                  <span className="text-xs mt-1 px-2 py-0.5 bg-primary/20 rounded-full inline-block text-white">
                    {book.genre}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </a>
        ))}
      </div>
    )
  }
  
  
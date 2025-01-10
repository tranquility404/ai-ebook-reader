import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Book {
  id: number
  title: string
  author: string
}

interface BookListProps {
  books: Book[]
  emptyText: string
}

export default function BookList({ books, emptyText }: BookListProps) {
  if (books.length === 0) {
    return <p className="text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <Card key={book.id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


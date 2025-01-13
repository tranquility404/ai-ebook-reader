'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookDataProvider, BookInfo, useBookData } from "@/lib/bookDataContext"
import { Book, BookOpen, FileText, Flag, HelpCircle, List, ThumbsUp } from 'lucide-react'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


interface SimilarBook {
  id: string
  title: string
  thumbnail: string
}

// export default 
function BookPage({ bookId }: { bookId: string }) {
  const { fetchBook } = useBookData()
  // const { bookInfo } = useBookUILogic(bookId)
  const [book, setBook] = useState<BookInfo | null>()

  useEffect(() => {

    fetchBook(bookId).then((res) => {
      console.log('bookInfo', res);
      
      setBook(res)
    })
  } , []);

  // Replace with actual data fetching
  // const book: BookDetails = {
  //   id: '1',
  //   title: 'The Great Gatsby',
  //   description: 'A vivid and captivating story of wealth, love, and the American Dream in the Roaring Twenties.',
  //   thumbnail: '/placeholder.svg',
  //   authors: ['F. Scott Fitzgerald'],
  //   genre: 'Classic Literature',
  //   publisher: 'Scribner',
  //   publishedDate: '1925-04-10',
  //   pageCount: 180,
  //   maturityRating: 'Teen',
  //   likes: 1234,
  //   postedBy: 'John Doe'
  // }

  const similarBooks: SimilarBook[] = [
    { id: '2', title: 'To Kill a Mockingbird', thumbnail: '/placeholder.svg' },
    { id: '3', title: '1984', thumbnail: '/placeholder.svg' },
    // Add more similar books...
  ]

  return (
    book &&
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transform-gpu transition-transform hover:scale-[1.02]">
              <img
                src={book.imageLinks.thumbnail}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold">{book.title}</h1>
                <p className="text-lg text-muted-foreground mt-2">
                  by {book.authors.join(', ')}
                </p>
              </div>

              <div className="prose dark:prose-invert">
                <p className="h-48 overflow-auto">{book.description}</p>
              </div>

              <dl className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Genre</dt>
                  <dd className="font-medium">{book.genre}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Publisher</dt>
                  <dd className="font-medium">{book.publisher}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Published Date</dt>
                  <dd className="font-medium">{book.publishedDate}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Pages</dt>
                  <dd className="font-medium">{book.pageCount}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Maturity Rating</dt>
                  <dd className="font-medium">{book.maturityRating}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Posted By</dt>
                  <dd className="font-medium">{book.postedBy}</dd>
                </div>
              </dl>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {book.likes} Likes
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="h-auto p-0" variant="outline">
            <a href={`${bookId}/read-book`} className="w-full h-full py-6">
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Read Book</span>
              </div>
            </a>
            </Button>
             {/*<Button className="h-auto py-4" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Read Summary</span>
              </div>
            </Button>
            <Button className="h-auto py-4" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <Book className="h-5 w-5" />
                <span>Generate Flashcards</span>
              </div>
            </Button>
            <Button className="h-auto py-4" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <span>Try Quiz</span>
              </div>
            </Button> */}
            <Button className="h-auto p-0" variant="outline">
            <a href={`${bookId}/chapter`} className="w-full h-full py-6">
              <div className="flex flex-col items-center gap-2">
                <List className="h-5 w-5" />
                <span>View Chapter List</span>
              </div>
              </a>
            </Button>
            <Button className="h-auto py-4" variant="outline">
              <div className="flex flex-col items-center gap-2">
                <Flag className="h-5 w-5" />
                <span>Report Issue</span>
              </div>
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <h2 className="text-xl font-semibold">Similar Books</h2>
          <div className="grid gap-4">
            {similarBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img
                    src={book.thumbnail}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="font-semibold text-sm text-white line-clamp-1">
                        {book.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
};

export default function BookPageWrapper() {
  const { bookId } = useParams()

  return (
    <BookDataProvider>
      <BookPage bookId={bookId} />
    </BookDataProvider>
  )
}


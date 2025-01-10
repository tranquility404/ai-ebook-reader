import BookList from '@/components/BookList'
import Header from '@/components/Header'
import UploadButton from '@/components/UploadButton'

export default function Home() {

  // Placeholder data (replace with actual data fetching logic)
  const lastReadBooks = []
  const userCollection = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: '1984', author: 'George Orwell' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to AI Ebook Reader</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Last Read Books</h2>
            <BookList books={lastReadBooks} emptyText="No recently read books" />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Collection</h2>
            <BookList books={userCollection} emptyText="Your collection is empty" />
          </section>
        </div>
        <div className="mt-12">
          <UploadButton />
        </div>
      </main>
    </div>
  )
}


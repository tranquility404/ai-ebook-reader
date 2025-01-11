import CollectionBooks from '@/components/CollectionBooks'
import Header from '@/components/Header'
import LastReadBooks from '@/components/LastReadBooks'
import UploadButton from '@/components/UploadButton'

export default function Home() {

  // Placeholder data (replace with actual data fetching logic)
  const lastReadBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      thumbnail: '/placeholder.svg',
      progress: 75
    },
  ]
  const collectionBooks = [
    {
      id: '1',
      title: '1984',
      author: 'George Orwell',
      genre: 'Science Fiction',
      thumbnail: '/placeholder.svg'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to AI Ebook Reader</h1>
          <UploadButton />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Continue Reading</h2>
            <LastReadBooks
              books={lastReadBooks}
              emptyText="No books in progress"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Collection</h2>
            <CollectionBooks
              books={collectionBooks}
              emptyText="Your collection is empty"
            />
          </section>
        </div>
      </main>
    </div>
  )
}


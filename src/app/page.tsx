"use client"
import CollectionBooks from '@/components/CollectionBooks'
import Header from '@/components/Header'
import LastReadBooks from '@/components/LastReadBooks'
import RecentlyAddedBooks from '@/components/RecentlyAddedBooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import apiClient from '@/utils/apiClient'
import { Search, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'



const Home = () => {
  const router = useRouter()
  const [collectionBooks, setCollectionBooks] = useState([])
  const [lastReadBooks, setLastReadBooks] = useState([])
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  // Placeholder data (replace with actual data fetching logic)
  // const lastReadBooks = [
  //   {
  //     id: '1',
  //     title: 'The Great Gatsby',
  //     thumbnail: '/placeholder.svg',
  //     progress: 75
  //   },
  // ]

  useEffect(() => {
    const fetchCollectionBooks = async () => {
      try {
        const response = await apiClient.get('/book/my-collection')
        const books = response.data
        setCollectionBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };

    const fetchLastReadBooks = async () => {
      try {
        const response = await apiClient.get('/book/last-read-books')
        const books = response.data
        setLastReadBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };
    
    const fetchRecentlyUploadedBooks = async () => {
      try {
        const response = await apiClient.get('/book/recently-uploaded-books')
        const books = response.data
        setRecentlyAddedBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };

    fetchCollectionBooks();
    fetchLastReadBooks();
    fetchRecentlyUploadedBooks();
  }, []);

  const handleUpload = () => {
    router.push('/upload')
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    let query = searchQuery.trim()
    if (searchQuery.length < 100) {
      query = query.replace(/[^a-zA-Z0-9\s]/g, "")
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to AI Ebook Reader</h1>
          <div className="flex gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search books..."
                  className="w-64"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                  type="submit"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Book
              </Button>
            </div>
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

          <section>
            <h2 className="text-2xl font-semibold mb-4">Recently Added by Community</h2>
            <RecentlyAddedBooks
              books={recentlyAddedBooks}
              emptyText='No books have been added recently'
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home;

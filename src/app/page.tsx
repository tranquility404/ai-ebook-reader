"use client"
import CollectionBooks from '@/components/CollectionBooks'
import Header from '@/components/Header'
import LastReadBooks from '@/components/LastReadBooks'
import { Button } from '@/components/ui/button'
import apiClient from '@/utils/apiClient'
import { Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {

  const [collectionBooks, setCollectionBooks] = useState([])
  const [lastReadBooks, setLastReadBooks] = useState([])
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

    fetchCollectionBooks();
    fetchLastReadBooks();
  }, []);

  // const collectionBooks = [
  //   {
  //     title: '1984',
  //     author: 'George Orwell',
  //     genre: 'Science Fiction',
  //     thumbnail: '/placeholder.svg'
  //   },
  // ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to AI Ebook Reader</h1>
          <a href="/upload" className="group">
            <Button asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Add New Book
              </span>
            </Button>
          </a>
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


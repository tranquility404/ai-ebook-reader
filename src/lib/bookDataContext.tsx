'use client'

import apiClient from '@/utils/apiClient'
import React, { createContext, useContext, useState, useEffect } from 'react'

export interface BookInfo {
  id: string
  title: string
  description: string
  imageLinks: { thumbnail: string }
  authors: string[]
  genre: string
  publisher: string
  publishedDate: string
  pageCount: number
  maturityRating: string
  likes: number
  postedBy: string
  cloudUrl: string
}

interface BookDataContextType {
  bookInfo: BookInfo | undefined
  fetchBook: (bookId: string) => Promise<void>
}

const BookDataContext = createContext<BookDataContextType | undefined>(undefined)

export function BookDataProvider({ children }: { children: React.ReactNode }) {
  const [bookInfo, setBookInfo] = useState<BookInfo>()

  const fetchBook = async (bookId: string) => {
    if (bookId === null || bookId.length === 0) return

    try {
      const response = await apiClient.get(`/book/${bookId}`)
      const data = await response.data
      setBookInfo(data)
      return data
    } catch (error) {
      console.error('Error fetching book:', error)
    }
  }

  return (
    <BookDataContext.Provider value={{ bookInfo, fetchBook }}>
      {children}
    </BookDataContext.Provider>
  )
}

export function useBookData() {
  const context = useContext(BookDataContext)
  if (context === undefined) {
    throw new Error('useBookData must be used within a BookDataProvider')
  }
  return context
}


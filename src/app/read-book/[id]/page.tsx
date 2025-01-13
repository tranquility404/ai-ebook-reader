'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, Plus, Minus, Moon, Sun, Maximize, Minimize, Copy, FileText, HelpCircle, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import ProgressUI from '@/components/ProgressUI'
import AIOptionsPopup from '@/components/AIOptionsPopup'
import AIResponseDialog from '@/components/AIResponseDialog'
import Chatbot from '@/components/Chatbot'
import { useParams } from 'next/navigation'
import { BookDataProvider, BookInfo, useBookData } from '@/lib/bookDataContext'
import apiClient from '@/utils/apiClient'

const ReactReader = dynamic(() => import('react-reader').then((mod) => mod.ReactReader), { ssr: false })

// Mock book URL (replace with actual data fetching logic)
const mockBook = "/path/to/mock.epub"

// export default 
function ReadBook({ bookId }: { bookId: string }) {
  const { bookInfo, fetchBook } = useBookData()
  const [book, setBook] = useState<BookInfo>()
  const [location, setLocation] = useState<string | number>(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState(100)
  const [selectedText, setSelectedText] = useState('')
  const [showAIOptions, setShowAIOptions] = useState(false)
  const [aiResponse, setAIResponse] = useState('')
  const [showChatbot, setShowChatbot] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const renditionRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tocRef = useRef<any>(null)

  // const { data: bookUrl = mockBook, isLoading, error } = useQuery(['epub', params.id], () => 
  //   // Replace with actual API call to fetch book URL
  //   Promise.resolve(mockBook)
  // )

  useEffect(() => {
    if (bookId) {
      fetchBook(bookId).then((data) => {
        setBook(data)
      })
    }
  }, [bookId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        exitFullScreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreen])

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => {
      const newSize = Math.max(50, Math.min(200, prev + delta))
      if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${newSize}%`)
      }
      return newSize
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev
      if (renditionRef.current) {
        renditionRef.current.themes.register(newMode ? 'dark' : 'light', {
          body: {
            color: newMode ? '#ffffff !important' : '#000000 !important',
            background: newMode ? '#1a202c !important' : '#ffffff !important',
          },
        })
        renditionRef.current.themes.select(newMode ? 'dark' : 'light')
      }
      return newMode
    })
  }

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
      setIsFullScreen(true)
    } else {
      exitFullScreen()
    }
  }

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    setIsFullScreen(false)
  }

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  const handleAIAction = (action: 'summarize' | 'explain') => {
    setAIResponse(action === 'summarize' ? 'This is a summary of the selected text.' : 'This is an explanation of the selected text.')
  }

  const updateReadHistory = async (pageIdx: number) => {
    try {
      const res = await apiClient.post(`/book/${bookId}/update-read-history`,
        {
          "pageIdx": pageIdx,
          "time": new Date().toISOString()
        }
      );

      console.log('Read history updated:', res.data);
    } catch (error) {
      console.error('Error updating read history:', error);
    }

  }

  // if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  // if (error) return <div className="flex items-center justify-center h-screen">Error loading eBook</div>

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-screen w-full overflow-hidden ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      {/* Header */}
      <header className={`bg-secondary text-secondary-foreground p-4 flex justify-between items-center ${isDarkMode ? 'dark:bg-gray-800' : ''}`}>
        <h1 className="text-lg md:text-2xl font-bold truncate">
          {book?.title || 'eBook Reader'}
        </h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => speak(selectedText)}>
            <Volume2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleFontSizeChange(-10)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm">{fontSize}%</span>
            <Button variant="ghost" size="icon" onClick={() => handleFontSizeChange(10)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 h-full">
        <ReactReader
          url={book?.cloudUrl}
          location={location}
          locationChanged={(loc: string) => setLocation(loc)}
          getRendition={rendition => {
            renditionRef.current = rendition
            rendition.themes.fontSize(`${fontSize}%`)
            
            if (isDarkMode) {
              rendition.themes.register('dark', {
                body: { 
                  color: '#ffffff !important',
                  background: '#1a202c !important',
                }
              })
              rendition.themes.select('dark')
            }

            rendition.on('selected', (cfiRange: string, contents: any) => {
              const text = rendition.getRange(cfiRange).toString()
              if (text.length > 0) {
                setSelectedText(text)
                setShowAIOptions(true)
              } else {
                setShowAIOptions(false)
              }

              contents.document.addEventListener('mouseup', () => {
                if (contents.window.getSelection()?.toString().length === 0) {
                  setSelectedText('')
                  setShowAIOptions(false)
                }
              })
            })

            rendition.on('relocated', (location: any) => {
              if (tocRef.current) { 
                const pageIdx = tocRef.current[location.start.href] + 1
                setCurrentPage(pageIdx)
                if (!isNaN(pageIdx))
                  updateReadHistory(pageIdx-1)
              }
            })
          }}
          tocChanged={toc => {
            if (tocRef.current) return

            let dict = {}
            let idx = 0
            for (const item of toc) {
              dict[item.href] = idx
              idx++
            }

            tocRef.current = dict
            setTotalPages(toc.length)
          }}
          epubOptions={{
            flow: 'paginated',
            manager: 'default'
          }}
        />
      </div>

      {/* Progress bar */}
      <ProgressUI currentPage={currentPage} totalPages={totalPages} isDarkMode={isDarkMode} />

      {/* AI options popup */}
      <AIOptionsPopup
        showAIOptions={showAIOptions}
        selectedText={selectedText}
        isDarkMode={isDarkMode}
        onCopy={() => navigator.clipboard.writeText(selectedText)}
        onSummarize={() => handleAIAction('summarize')}
        onExplain={() => handleAIAction('explain')}
      />

      {/* AI response dialog */}
      <AIResponseDialog
        aiResponse={aiResponse}
        isDarkMode={isDarkMode}
        onClose={() => setAIResponse('')}
      />

      {/* Chatbot toggle */}
      <Button
        variant="default"
        size="icon"
        className="fixed z-10 bottom-4 right-4 rounded-full shadow-lg"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      {/* Chatbot */}
      <Chatbot show={showChatbot} isDarkMode={isDarkMode} />
    </div>
  )
}

export default function ReadBookWrapper() {
  const { id } = useParams()

  return (
    <BookDataProvider>
      <ReadBook bookId={id} />
    </BookDataProvider>
)
}


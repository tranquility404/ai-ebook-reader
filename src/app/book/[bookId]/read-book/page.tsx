'use client'

import ProgressUI from '@/components/ProgressUI'
import { Button } from "@/components/ui/button"
import { BookInfo } from '@/types/bookInfo'
import apiClient from '@/utils/apiClient'
import { Rendition, Contents, Location } from 'epubjs'
import { Maximize, Minimize, Minus, Moon, Plus, Sun, Volume2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const ReactReader = dynamic(() => import('react-reader').then((mod) => mod.ReactReader), { ssr: false })

export default function ReadBook() {
  const { bookId } = useParams()
  const [book, setBook] = useState<BookInfo|null>(null)
  const [location, setLocation] = useState<string | number>(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [fontSize, setFontSize] = useState(100)
  const [selectedText, setSelectedText] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const renditionRef = useRef<Rendition>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tocRef = useRef<{[x: string]: number}>({})
  const pageIndex = useRef<number>(0)

  useEffect(() => {
    const fetchBook = async (bookId: string) => {
      if (bookId === null || bookId.length === 0) return
  
      try {
        const response = await apiClient.get(`/book/${bookId}`)
        const data = await response.data
        setBook(data)
        setTotalPages(data.pageCount|0)
      } catch (error) {
        console.error('Error fetching book:', error)
      }
    }

    if (bookId) {
      fetchBook(bookId as string)
    }

    const id = setInterval(() => {
      updateReadHistory(pageIndex.current)
    }, 15000);

    return () => {
      clearInterval(id);
    }
  }, [])

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
          url={book?.cloudUrl as string}
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

            rendition.on('selected', (cfiRange: string, contents: Contents) => {
              const text = rendition.getRange(cfiRange).toString()
              if (text.length > 0) {
                setSelectedText(text)
              }

              contents.document.addEventListener('mouseup', () => {
                if (contents.window.getSelection()?.toString().length === 0) {
                  setSelectedText('')
                }
              })
            })

            rendition.on('relocated', (location: Location) => {
              if (tocRef.current) { 
                const pageIdx = tocRef.current[location.start.href]
                if (!isNaN(pageIdx)) {
                  pageIndex.current = pageIdx
                  setCurrentPage(pageIdx + 1)
                }
              }
            })
          }}
          tocChanged={toc => {
            if (tocRef.current) return

            const dict: {[x: string]: number} = {}
            let idx = 0
            for (const item of toc) {
              dict[item.href] = idx
              idx++
            }

            tocRef.current = dict
          }}
          epubOptions={{
            flow: 'paginated',
            manager: 'default'
          }}
        />
      </div>

      {/* Progress bar */}
      <ProgressUI currentPage={currentPage} totalPages={totalPages} isDarkMode={isDarkMode} />
    </div>
  )
}


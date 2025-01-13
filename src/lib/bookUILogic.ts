import { useState, useEffect } from 'react'
import { useBookData } from './bookDataContext'

export function useBookUILogic(bookId: string) {
  const { books, loading, error, fetchBook, updateBookProgress } = useBookData()
  const [location, setLocation] = useState<string | number>(0)
  const [fontSize, setFontSize] = useState(100)
  const [selectedText, setSelectedText] = useState('')
  const [showAIOptions, setShowAIOptions] = useState(false)
  const [aiResponse, setAIResponse] = useState('')
  const [showChatbot, setShowChatbot] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    fetchBook(bookId)
  }, [bookId, fetchBook])

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => Math.max(50, Math.min(200, prev + delta)))
  }

  const toggleDarkMode = () => setIsDarkMode(prev => !prev)

  const toggleFullScreen = () => setIsFullScreen(prev => !prev)

  const handleAIAction = (action: 'summarize' | 'explain') => {
    setAIResponse(action === 'summarize' ? 'This is a summary of the selected text.' : 'This is an explanation of the selected text.')
  }

  const updateProgress = (currentPage: number) => {
    updateBookProgress(bookId, currentPage)
  }

  return {
    bookInfo: books[bookId],
    loading,
    error,
    location,
    setLocation,
    fontSize,
    handleFontSizeChange,
    selectedText,
    setSelectedText,
    showAIOptions,
    setShowAIOptions,
    aiResponse,
    setAIResponse,
    showChatbot,
    setShowChatbot,
    isDarkMode,
    toggleDarkMode,
    isFullScreen,
    toggleFullScreen,
    handleAIAction,
    updateProgress
  }
}


'use client'

import { use, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Book, Brain, HelpCircle, FileText } from 'lucide-react'
import { useBookData } from '@/lib/bookDataContext'
import { set } from 'react-hook-form'

interface Chapter {
  id: string
  title: string
  wordCount: number
}

export default function ChapterPage() {
  const { bookId, chapterId } = useParams()
  const router = useRouter()
  // const { books } = useBookData()
  const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [showQuizDialog, setShowQuizDialog] = useState(false)
  const [summaryText, setSummaryText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock chapters data (replace with actual data from your context)
  const chapters: Chapter[] = [
    { id: '1', title: 'Introduction', wordCount: 1500 },
    { id: '2', title: 'The Beginning', wordCount: 2300 },
    { id: '3', title: 'Rising Action', wordCount: 3100 },
    // Add more chapters...
  ]


  const generateSummary = () => {
    if (!selectedChapter) return
    console.log('Generating summary...');
    
    setShowSummary(true)
    // setIsGenerating(true)
    setSummaryText('')

    const words = sample.split(' ')
    let i = 0
    const id = setInterval(() => {
      if (i < words.length) {
        const text = words.slice(i, i + 3).join(' ')
        setSummaryText(prev => prev + ' ' + text)
        i++
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(id);
    }, (words.length/3)*1000)

    // const words = summaryText.split(' ')
    // let i = 0
    // while (i < words.length) {
    //   const text = words.slice(i, i + 3).join(' ')
    //   setSummaryText(prev => prev + text)
    // }

    // try {
    //   const response = await fetch('/api/generate-summary', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       bookId: params.id,
    //       chapterId: selectedChapter.id 
    //     }),
    //   })

    //   if (!response.ok) throw new Error('Failed to generate summary')

    //   const reader = response.body?.getReader()
    //   if (!reader) throw new Error('No reader available')

      /* while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const text = new TextDecoder().decode(value)
        setSummaryText(prev => prev + text)
      } */
    // } catch (error) {
    //   console.error('Error:', error)
    // } finally {
    //   setIsGenerating(false)
    // }
  }

  const generateQuiz = async () => {
    if (!selectedChapter) return
    setShowQuizDialog(true)
    
    setTimeout(() => {
      setShowQuizDialog(false)
      router.push(`/quiz/0`)
    }, 3000);
    // try {
    //   const response = await fetch('/api/generate-quiz', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       bookId: params.id,
    //       chapterId: selectedChapter.id
    //     }),
    //   })

    //   if (!response.ok) throw new Error('Failed to generate quiz')

    //   const quizId = await response.json()
    //   router.push(`/book/${params.id}/chapters/${selectedChapter.id}/quiz/${quizId}`)
    // } catch (error) {
    //   console.error('Error:', error)
    // } finally {
    //   setShowQuizDialog(false)
    // }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Chapters</h2>
            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter)}
                  className={`w-full flex items-center p-2 rounded-lg text-sm
                    ${selectedChapter?.id === chapter.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                    }`}
                >
                  <span className="mr-2">{index + 1}.</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-xs text-muted-foreground">{chapter.wordCount} words</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {selectedChapter ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">{selectedChapter.title}</h1>
              <p className="text-muted-foreground mt-2">{selectedChapter.wordCount} words</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-auto py-6"
                variant="outline"
                onClick={generateSummary}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Generate Summary</span>
                </div>
              </Button>
              <Button 
                className="h-auto py-6"
                variant="outline"
                onClick={generateQuiz}
              >
                <div className="flex flex-col items-center gap-2">
                  <HelpCircle className="h-6 w-6" />
                  <span>Generate Quiz</span>
                </div>
              </Button>
              <Button 
                className="h-auto py-6"
                variant="outline"
                onClick={() => {}}
              >
                <div className="flex flex-col items-center gap-2">
                  <Brain className="h-6 w-6" />
                  <span>Create Flashcards</span>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Book className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-medium">Select a chapter to begin</h2>
              <p className="text-muted-foreground">Choose a chapter from the sidebar to view its content and features.</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary sheet */}
      <Sheet open={showSummary} onOpenChange={setShowSummary}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Chapter Summary</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-full mt-4">
            <div className="space-y-4 pb-8">
              {isGenerating ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              ) : (
                <p className="leading-relaxed">{summaryText}</p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Quiz generation dialog */}
      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className='pb-16'>
          <DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
            <DialogTitle className='text-center'>Generating Quiz</DialogTitle>
            <DialogDescription className='text-center'>
              Please wait while we generate quiz questions for this chapter...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
'use client'

import LoadingScreen from '@/components/LoadingScreen'
import { Button } from "@/components/ui/button"
import { CollapsibleSidebar } from '@/components/ui/collabsible-sidebar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MLProvider, useMLServer } from '@/context/MLContext'
import apiClient from '@/utils/apiClient'
import { Book, Brain, FileText, HelpCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Chapter {
  uid: string,
  title: string,
  noOfWords: number,
  href: string
}

function ChapterPageWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, checkServer } = useMLServer();

  useEffect(() => {
    checkServer()
  }, [])

  return (
    <>
      {isLoading ? <LoadingScreen /> : children}
    </>
  )
}

export default function ChapterPage() {
  const { bookId } = useParams()
  const router = useRouter()
  const [showQuizDialog, setShowQuizDialog] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  
  const [summaryText, setSummaryText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await apiClient.get(`/book/${bookId}/chapters`)
        const fetchedChapters: Chapter[] = response.data
        const filtered = fetchedChapters.filter((ch, idx, self) => idx == self.findIndex(obj => obj.uid == ch.uid) && ch.noOfWords > 300)
        setChapters(filtered)
      } catch (error) {
        console.error('Error:', error.response.message)
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    if (chapters) {
      const chapter = chapters.find(chapter => chapter.noOfWords > 300)
      if (chapter) setSelectedChapter(chapter)
    }
  }, [chapters])


  const generateSummary = async () => {
    if (!selectedChapter) return

    setShowSummary(true)
    setIsGenerating(true)
    setSummaryText('')

    try {
      const response = await apiClient.post(`/ml/generate-summary`, {
        "bookId": bookId,
        "chapterHref": selectedChapter.href
      });
      setSummaryText(response.data)

    } catch (error) {
      console.error('Error:', error.response.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateQuiz = async () => {
    if (!selectedChapter) return
    setShowQuizDialog(true)

    try {
      const response = await apiClient.post(`/ml/generate-quiz`, {
        "bookId": bookId,
        "chapterHref": selectedChapter.href
      });
      const quizId = response.data.quizId
      router.push(`/quiz/${quizId}`)
    } catch (error) {
      console.error('Error:', error.response.message)
    } finally {
      setShowQuizDialog(false)
    }
  }

  return (
    <MLProvider>
      <ChapterPageWrapper>
        <div className="flex h-screen">
          {/* Sidebar */}
          <CollapsibleSidebar>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Chapters</h2>
              <div className="space-y-1">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.uid}
                    onClick={() => setSelectedChapter(chapter)}
                    className={`w-full flex items-center p-2 rounded-lg text-sm
                  ${selectedChapter?.uid === chapter.uid
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                      }`}
                  >
                    <span className="mr-2">{index + 1}.</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{chapter.title}</div>
                      <div className="text-xs text-muted-foreground">{chapter.noOfWords} words</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleSidebar>

          {/* Main content */}
          <div className="flex-1 p-6">
            {selectedChapter ? (
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h1 className="text-3xl font-bold">{selectedChapter.title}</h1>
                  <p className="text-muted-foreground mt-2">{selectedChapter.noOfWords} words</p>
                </div>

                {selectedChapter.noOfWords > 300 ?
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
                      onClick={() => { }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Brain className="h-6 w-6" />
                        <span>Create Flashcards</span>
                      </div>
                    </Button>
                  </div> :
                  <div>
                    <p className="text-muted-foreground">This chapter is too short to generate a summary or quiz.</p>
                  </div>
                }
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
      </ChapterPageWrapper>
    </MLProvider>
  )
}
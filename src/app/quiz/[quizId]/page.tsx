'use client'

import QuizTimer from "@/components/QuizTimer"
import { Button } from "@/components/ui/button"
import { CollapsibleSidebar } from '@/components/ui/collabsible-sidebar'
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { cn } from "@/lib/utils"
import { QuizQuestion } from '@/types/quiz_question'
import apiClient from '@/utils/apiClient'
import confetti from 'canvas-confetti'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface QuestionState {
  answered: boolean
  selectedOption: string | null
  visited: boolean
}

export default function QuizPage() {
  return (
    <SidebarProvider>
      <div className="w-full flex flex-col">
        <QuizContent />
      </div>
    </SidebarProvider>
  )
}

function QuizContent() {
  const { quizId } = useParams()
  const router = useRouter()

  const { setOpen } = useSidebar()
  const [showScore, setShowScore] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [score, setScore] = useState({ total: 0, correct: 0, incorrect: 0 })
  const [questions, setQuestions] = useState<QuizQuestion[]>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionStates, setQuestionStates] = useState<{ [key: number]: QuestionState }>({})

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiClient.get(`/ml/quiz/${quizId}`)
        const quizJson = JSON.parse(response.data)
        setQuestions(quizJson)

      } catch (error) {
        console.error(error.response.message)
      }
    }

    fetchQuestions()
  }, [])

  const handleNextQuestion = () => {
    if (!isReviewMode) {
      setQuestionStates(prev => ({
        ...prev,
        [currentQuestionIndex]: {
          ...prev[currentQuestionIndex],
          visited: true
        }
      }))
    }
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))
  }

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index)
    setQuestionStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        visited: true
      }
    }))
  }

  const getQuestionStatus = (index: number) => {
    const state = questionStates[index]
    if (!state) return 'not-visited'
    if (state.answered) return 'answered'
    if (state.visited) return 'attempted'
    return 'not-visited'
  }

  
  const updateTestHistory = (score) => {
    try {
      apiClient.post("/book/update-quiz-test-history", {
        "testId": quizId,
        "score": score
      })

    } catch (error) {
      console.error(error.response.message);
    }
  }

  const calculateScore = () => {
    let correct = 0
    let incorrect = 0

    Object.entries(questionStates).forEach(([index, state]) => {
      if (state.selectedOption === questions[Number(index)].correctId) {
        correct++
      } else if (state.selectedOption) {
        incorrect++
      }
    })

    const totalScore = Math.round((correct / questions.length) * 100)
    setScore({ total: totalScore, correct, incorrect })
    setShowScore(true)
    setOpen(false) // Close the sidebar
    if (totalScore > 0)
      updateTestHistory(totalScore)

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleTimeUp = () => {
    calculateScore()
    setOpen(false);
  }

  const enterReviewMode = () => {
    setIsReviewMode(true)
    setShowScore(false)
  }

  const returnHome = () => {
    router.push('/')
  }

  return (
    questions &&
    <div className="flex h-screen">
      <CollapsibleSidebar>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Questions</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Attempted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span>Not visited</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index)
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionSelect(index)}
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center text-sm font-medium",
                    status === 'answered' && "bg-green-500 text-white",
                    status === 'attempted' && "bg-yellow-500 text-white",
                    status === 'not-visited' && "bg-gray-300 text-gray-600",
                    currentQuestionIndex === index && "ring-2 ring-primary"
                  )}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </CollapsibleSidebar>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quiz</h1>
          {!showScore && !isReviewMode && (
            <QuizTimer duration={questions.length*60} onTimeUp={handleTimeUp} />
          )}
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {isReviewMode && (
              <div className={cn(
                "text-sm font-medium px-3 py-1 rounded-full w-fit",
                questionStates[currentQuestionIndex]?.selectedOption === questions[currentQuestionIndex].correctId
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}>
                {questionStates[currentQuestionIndex]?.selectedOption === questions[currentQuestionIndex].correctId
                  ? "Correct"
                  : "Incorrect"}
              </div>
            )}

            <div className="space-y-6">
              <p className="text-lg">{`${currentQuestionIndex+1}). ${questions[currentQuestionIndex].question}`}</p>

                <div className="space-y-3">
                {Object.entries(questions[currentQuestionIndex].options).map(([id, text]) => {
                  const isCorrect = id === questions[currentQuestionIndex].correctId
                  const isSelected = questionStates[currentQuestionIndex]?.selectedOption === id

                  return (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4 cursor-pointer",
                        isReviewMode && isCorrect && "border-green-500 bg-green-50",
                        isReviewMode && !isCorrect && isSelected && "border-red-500 bg-red-50",
                        !isReviewMode && isSelected && "border-primary bg-primary/10"
                      )}
                      onClick={() => {
                        if (!isReviewMode) {
                          setQuestionStates(prev => ({
                            ...prev,
                            [currentQuestionIndex]: {
                              ...prev[currentQuestionIndex],
                              answered: true,
                              selectedOption: isSelected ? null : id
                            }
                          }))
                        }
                      }}
                    >
                      <div className={cn(
                        "flex h-4 w-4 shrink-0 rounded-full border border-primary",
                        isSelected && "bg-primary"
                      )}>
                        {isSelected && (
                          <svg className="h-3.5 w-3.5 fill-primary-foreground" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="3.5" />
                          </svg>
                        )}
                      </div>
                      <Label className="flex-1 cursor-pointer">
                        {text}
                      </Label>
                    </div>
                  )
                })}
              </div>
              </div>

            {!showScore && (
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={isReviewMode && currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={calculateScore}
                    disabled={isReviewMode}
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={showScore} onOpenChange={() => {}} modal={true}>
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle className="text-2xl">Quiz Results</SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-8">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{score.total}%</div>
              <div className="text-muted-foreground">
                {score.correct} correct • {score.incorrect} incorrect
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={enterReviewMode} className="flex-1">
                Check Responses
              </Button>
              <Button onClick={returnHome} variant="outline" className="flex-1">
                Return to Home
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

    </div>
  )
}


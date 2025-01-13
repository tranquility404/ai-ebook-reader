'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

interface QuestionState {
  answered: boolean
  selectedOption: string | null
  visited: boolean
}

export default function QuizPage({ 
  params 
}: { 
  params: { id: string; chapterId: string; quizId: string } 
}) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionStates, setQuestionStates] = useState<{ [key: string]: QuestionState }>({})

  // Mock questions data (replace with actual API call)
  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the main theme of this chapter?',
      options: ['Love', 'War', 'Peace', 'Nature'],
      correctAnswer: 'Peace'
    },
    // Add more questions...
  ]

  useEffect(() => {
    // Initialize question states
    const initialStates: { [key: string]: QuestionState } = {}
    questions.forEach(q => {
      initialStates[q.id] = {
        answered: false,
        selectedOption: null,
        visited: false
      }
    })
    setQuestionStates(initialStates)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (option: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answered: true,
        selectedOption: option
      }
    }))
  }

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index)
    setQuestionStates(prev => ({
      ...prev,
      [questions[index].id]: {
        ...prev[questions[index].id],
        visited: true
      }
    }))
  }

  const getQuestionStatus = (questionId: string) => {
    const state = questionStates[questionId]
    if (!state) return 'not-visited'
    if (state.answered) return 'answered'
    if (state.visited) return 'attempted'
    return 'not-visited'
  }

  const handleSubmit = () => {
    // Implement quiz submission logic
    console.log('Quiz submitted:', questionStates)
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
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

            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const status = getQuestionStatus(question.id)
                return (
                  <button
                    key={question.id}
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
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Question {currentQuestionIndex + 1}</h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.text}</p>

            <RadioGroup
              value={questionStates[currentQuestion.id]?.selectedOption || ''}
              onValueChange={handleOptionSelect}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-2 rounded-lg border p-4",
                      questionStates[currentQuestion.id]?.selectedOption === option && "border-primary"
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

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
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


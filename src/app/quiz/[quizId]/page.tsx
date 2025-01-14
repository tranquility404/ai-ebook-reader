'use client'

import { Button } from "@/components/ui/button"
import { CollapsibleSidebar } from '@/components/ui/collabsible-sidebar'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { QuizQuestion } from '@/types/quiz_question'
import apiClient from '@/utils/apiClient'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface QuestionState {
  answered: boolean
  selectedOption: string | null
  visited: boolean
}

export default function QuizPage() {
  const { quizId } = useParams()
  const router = useRouter()
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionStates, setQuestionStates] = useState<{ [key: number]: QuestionState }>({})

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiClient.get(`/ml/quiz/${quizId}`)
        const quizJson = JSON.parse(response.data)
        setQuestions(quizJson)

      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchQuestions()
  }, [])

  // useEffect(() => {
  //   // Initialize question states
  //   const initialStates: { [key: number]: QuestionState } = {}
  //   questions.forEach((_, index) => {
  //     initialStates[index] = {
  //       answered: false,
  //       selectedOption: null,
  //       visited: false
  //     }
  //   })
  //   setQuestionStates(initialStates)
  // }, [questions])

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        ...prev[currentQuestionIndex],
        answered: true,
        selectedOption: optionId
      }
    }))
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

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Question {currentQuestionIndex + 1}</h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {currentQuestion &&
            <div className="space-y-6">
              <p className="text-lg">{currentQuestion.question}</p>

              <RadioGroup
                value={questionStates[currentQuestionIndex]?.selectedOption || ''}
                onValueChange={handleOptionSelect}
              >
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([id, text]) => (
                    <div
                      key={id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4",
                        questionStates[currentQuestionIndex]?.selectedOption === id && "border-primary"
                      )}
                    >
                      <RadioGroupItem value={id} id={`option-${id}`} />
                      <Label htmlFor={`option-${id}`} className="flex-1 cursor-pointer">
                        {text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          }

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
              <Button onClick={() => console.log('Quiz submitted:', questionStates)}>
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export interface QuizQuestion {
    question: string
    options: {
      [key: string]: string
    }
    correctId: string
}
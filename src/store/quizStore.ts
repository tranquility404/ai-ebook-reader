import { QuizQuestion } from '@/types/quiz_question';
import {create} from 'zustand';

interface QuestionsState {
  questions: QuizQuestion[] | null; // Questions data
  setQuestions: (questions: QuizQuestion[]) => void; // Action to update data
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  questions: null, 
  setQuestions: (questions) => set({questions}), // Update action
}));

import { Book } from 'lucide-react'

interface ProgressUIProps {
  currentPage: number
  totalPages: number
  isDarkMode: boolean
}

export default function ProgressUI({ currentPage, totalPages, isDarkMode }: ProgressUIProps) {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0

  return (
    <div className={`pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300 ease-in-out`}>
      <div className="max-w-3xl w-4/5 mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Book className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}


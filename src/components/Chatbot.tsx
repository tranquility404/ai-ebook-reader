import { motion } from 'framer-motion'

interface ChatbotProps {
  show: boolean
  isDarkMode: boolean
}

export default function Chatbot({ show, isDarkMode }: ChatbotProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed z-10 bottom-16 right-4 bg-secondary text-secondary-foreground p-4 rounded-lg shadow-lg w-64 ${isDarkMode ? 'dark:bg-gray-700' : ''}`}
    >
      <h3 className="text-lg font-bold mb-2">Chatbot</h3>
      <p>This is a placeholder for the chatbot feature.</p>
    </motion.div>
  )
}


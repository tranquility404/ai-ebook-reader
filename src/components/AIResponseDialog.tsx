import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface AIResponseDialogProps {
  aiResponse: string
  isDarkMode: boolean
  onClose: () => void
}

export default function AIResponseDialog({ aiResponse, isDarkMode, onClose }: AIResponseDialogProps) {
  if (!aiResponse) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg max-w-md ${isDarkMode ? 'dark:bg-gray-700' : ''}`}
    >
      <h3 className="text-xl font-bold mb-4">AI Response</h3>
      <p>{aiResponse}</p>
      <Button
        onClick={onClose}
        className="mt-4"
      >
        Close
      </Button>
    </motion.div>
  )
}


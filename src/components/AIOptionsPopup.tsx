import { motion } from 'framer-motion'
import { Copy, FileText, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface AIOptionsPopupProps {
  showAIOptions: boolean
  selectedText: string
  isDarkMode: boolean
  onCopy: () => void
  onSummarize: () => void
  onExplain: () => void
}

export default function AIOptionsPopup({
  showAIOptions,
  selectedText,
  isDarkMode,
  onCopy,
  onSummarize,
  onExplain
}: AIOptionsPopupProps) {
  if (!showAIOptions || !selectedText) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed z-10 bottom-24 right-24 bg-secondary text-secondary-foreground p-4 rounded-lg shadow-lg ${isDarkMode ? 'dark:bg-gray-700' : ''}`}
    >
      <div className="flex space-x-4">
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4 mr-2" /> Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={onSummarize}>
          <FileText className="h-4 w-4 mr-2" /> Summarize
        </Button>
        <Button variant="ghost" size="sm" onClick={onExplain}>
          <HelpCircle className="h-4 w-4 mr-2" /> Explain
        </Button>
      </div>
    </motion.div>
  )
}


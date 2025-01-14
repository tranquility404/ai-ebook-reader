import { Clock, Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-2xl font-semibold">Waking up the sleepy server...</h2>
        <p className="mt-2 text-muted-foreground">This might take a moment. Thanks for your patience!</p>
      </div>
    </div>
  )
}
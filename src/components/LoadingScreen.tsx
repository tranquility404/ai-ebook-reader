import { Clock, Loader2 } from 'lucide-react'

export default function LoadingScreen({ isServerDown }: { isServerDown: boolean }) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        {!isServerDown ?
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h2 className="mt-4 text-2xl font-semibold">Waking up the sleepy server...</h2>
            <p className="mt-2 text-muted-foreground">This might take a moment. Thanks for your patience!</p>
          </>
          :
          <>
            <Clock className="h-16 w-16 animate-pulse text-primary mx-auto mt-8" />
            <h2 className="mt-4 text-2xl font-semibold">Server is under maintainence!</h2>
            <p className="mt-2 text-muted-foreground">Thanks for your patience!</p>
          </>
        }
      </div>
    </div>
  )
}
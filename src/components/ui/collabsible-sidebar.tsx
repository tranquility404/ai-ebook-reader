'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

interface CollapsibleSidebarProps {
  children: React.ReactNode
  className?: string
}

export function CollapsibleSidebar({ children, className }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <div
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-12" : "w-64",
        className
      )}
    >
      <div className="absolute -right-3 top-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className={cn(
        "h-full border-r bg-muted transition-all duration-300 ease-in-out",
        isCollapsed && "overflow-hidden"
      )}>
        <ScrollArea className="h-full">
          <div className={cn(
            "min-w-[256px] p-4",
            isCollapsed && "opacity-0"
          )}>
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
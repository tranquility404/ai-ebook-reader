'use client'

import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file && file.type === 'application/epub+zip') {
        router.push('/upload')
      } else {
        alert('Please select a valid EPUB file')
      }
    }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        accept=".epub"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button asChild>
          <span>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload New Book'}
          </span>
        </Button>
      </label>
    </div>
  )
}


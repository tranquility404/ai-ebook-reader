'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

export default function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // TODO: Implement file upload logic here
      console.log('Uploading file:', file.name)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating upload
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        accept=".epub"
        onChange={handleUpload}
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


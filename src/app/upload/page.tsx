'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import apiClient from "@/utils/apiClient"
import { File, Loader2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface BookAnalysis {
    thumbnail: string
    title: string
    chapters: { title: string; noOfWords: number }[]
    authors: string[]
    pageCount: number
    genre: string
    maturityRating: string
    language: string
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<string>('idle')
    const [analysis, setAnalysis] = useState<BookAnalysis | null>(null)
    const [requestId, setRequestId] = useState<string | null>(null)
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile?.type === 'application/epub+zip') {
          setFile(selectedFile)
          uploadFile(selectedFile)
        } else {
          alert('Please select a valid EPUB file')
        }
      }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
          'application/epub+zip': ['.epub']
        },
        multiple: false
      })

    const uploadFile = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            setStatus('uploading')
            // Upload the file to Spring Boot backend
            const uploadResponse = await apiClient.post("/book/add-book", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded / (progressEvent.total || 1)) * 100
                  );
                  setProgress(percentCompleted);
        
                  if (percentCompleted < 30) {
                    setStatus("Uploading your file... 📤");
                  } else if (percentCompleted < 70) {
                    setStatus("Halfway there! 🏃‍♂️");
                  } else {
                    setStatus("Almost done! 🤏");
                  }
                },
              });

              // File upload completed. Begin listening for backend updates.
              setStatus("Processing started... 🚀");
              const requestId = uploadResponse.data["requestId"];
              const analysis = uploadResponse.data["response"];
              setRequestId(requestId);
              setAnalysis(analysis);
              setStatus("Processing complete! 🎉");
        } catch (error) {
            console.error('Error:', error.response.data.message)
        }
    }

    const handleSubmit = async () => {
        if (!analysis) return

        try {
            const response = await apiClient.post('book/save-book/' + requestId)
            console.log(response.data);
            router.push('/')
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2">
              <div className="p-6 lg:p-8 bg-muted">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Upload Ebook</h2>
                    <p className="text-muted-foreground mt-2">
                      {status === 'idle' 
                        ? 'Select or drag & drop your EPUB file'
                        : 'Processing your ebook...'}
                    </p>
                  </div>
  
                  {status !== 'idle' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{file?.name}</span>
                      </div>
                      <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <div className="flex items-center space-x-2">
                          {status !== 'Processing complete! 🎉' && <Loader2 className="h-4 w-4 animate-spin" />}
                          <span className="capitalize">{status}...</span>
                        </div>
                      </div>
                    </div>
                  )}
  
                  {status === 'idle' && (
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-lg p-8
                        flex flex-col items-center justify-center
                        cursor-pointer transition-colors
                        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                      `}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                      <p className="text-center text-sm text-muted-foreground">
                        {isDragActive ? (
                          "Drop your EPUB file here"
                        ) : (
                          <>
                            Drag & drop your EPUB file here, or{" "}
                            <span className="text-primary">click to select</span>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
    
                {analysis && (
                  <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3">
                          <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg">
                            <img
                              src={analysis.thumbnail}
                              alt={analysis.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <h3 className="text-2xl font-semibold">{analysis.title}</h3>
                          <dl className="space-y-2">
                            <div className="flex gap-2">
                              <dt className="font-medium">Authors:</dt>
                              <dd className="text-muted-foreground">{analysis.authors.join(', ')}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="font-medium">Genre:</dt>
                              <dd className="text-muted-foreground">{analysis.genre}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="font-medium">Pages:</dt>
                              <dd className="text-muted-foreground">{analysis.pageCount}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="font-medium">Language:</dt>
                              <dd className="text-muted-foreground">{analysis.language}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="font-medium">Maturity Rating:</dt>
                              <dd className="text-muted-foreground">{analysis.maturityRating}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
    
                      <div>
                        <h4 className="text-lg font-semibold mb-4">Chapters</h4>
                        <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                          {analysis.chapters.map((chapter, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-muted rounded-lg"
                            >
                              <span className="font-medium">{chapter.title}</span>
                              <span className="text-sm text-muted-foreground">
                                {chapter.noOfWords.toLocaleString()} words
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
    
                      <Button onClick={handleSubmit} disabled={requestId == null} className="w-full">
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
}
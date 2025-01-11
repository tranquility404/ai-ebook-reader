'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from 'lucide-react'
import { set } from 'react-hook-form'

interface BookAnalysis {
    thumbnail: string
    title: string
    chapters: { title: string; wordCount: number }[]
    authors: string[]
    pageCount: number
    genre: string
    maturityRating: string
    language: string
}

export default function UploadPage() {
    const [progress, setProgress] = useState(0)
    const [step, setStep] = useState<'uploading' | 'analyzing' | 'complete'>('uploading')
    const [analysis, setAnalysis] = useState<BookAnalysis | null>(null)
    const router = useRouter()

    const uploadFile = async (/* file: File */) => {
        const formData = new FormData()
        // formData.append('file', file)

        try {
            setStep('uploading')
            // Simulated upload progress
            const uploadInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(uploadInterval)
                        return 100
                    }
                    return prev + 10
                })
            }, 500)

            // const response = await fetch('/api/upload', {
            //     method: 'POST',
            //     body: formData,
            // })

            // if (!response.ok) throw new Error('Upload failed')
            // clearInterval(uploadInterval)
            // setProgress(100)

            // const analysisResponse = await fetch('/api/analyze', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ fileId: await response.json() }),
            // })

            // if (!analysisResponse.ok) throw new Error('Analysis failed')

            // const analysisData = await analysisResponse.json()
            // setAnalysis(analysisData)
        } catch (error) {
            console.error('Error:', error)
            // Handle error appropriately
        }
    }

    useEffect(() => {
        if (progress === 100) {
            setStep('analyzing')
            setTimeout(() => {
                setStep('complete')
                setAnalysis({
                    thumbnail: '/placeholder.svg',
                    title: 'The Great Gatsby',
                    chapters: [
                        { title: 'Chapter 1', wordCount: 1000 },
                        { title: 'Chapter 2', wordCount: 1500 },
                        { title: 'Chapter 3', wordCount: 2000 },
                    ],
                    authors: ['F. Scott Fitzgerald'],
                    pageCount: 180,
                    genre: 'Fiction',
                    maturityRating: 'PG-13',
                    language: 'English',
                })
            }, 1000)
        }
    }, [progress])

    const handleSubmit = async () => {
        if (!analysis) return

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(analysis),
            })

            if (!response.ok) throw new Error('Failed to save book')

            router.push('/')
        } catch (error) {
            console.error('Error:', error)
            // Handle error appropriately
        }
    }

    useEffect(() => { 
        uploadFile()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Upload Progress</h2>
                            <Progress value={progress} className="w-full" />
                        </div>

                        <div className="flex items-center space-x-2">
                            {step !== 'complete' && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span className="capitalize">{step}...</span>
                        </div>

                        {analysis && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <img
                                            src={analysis.thumbnail}
                                            alt={analysis.title}
                                            className="rounded-lg w-full max-w-[300px]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold">{analysis.title}</h3>
                                        <div className="space-y-2">
                                            <p><strong>Authors:</strong> {analysis.authors.join(', ')}</p>
                                            <p><strong>Genre:</strong> {analysis.genre}</p>
                                            <p><strong>Pages:</strong> {analysis.pageCount}</p>
                                            <p><strong>Language:</strong> {analysis.language}</p>
                                            <p><strong>Maturity Rating:</strong> {analysis.maturityRating}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Chapters</h4>
                                    <div className="space-y-2">
                                        {analysis.chapters.map((chapter, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-2 bg-muted rounded"
                                            >
                                                <span>{chapter.title}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {chapter.wordCount} words
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={handleSubmit} className="w-full">
                                    Submit and Continue Analysis
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
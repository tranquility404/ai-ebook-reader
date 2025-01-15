'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import apiClient from '@/utils/apiClient'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q');
    const [searchQuery, setSearchQuery] = useState<string>(query)
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(true)

    const handleSearch = async (e: React.FormEvent) => {
        if (e) e.preventDefault()
        setIsSearching(true)

        try {
            const response = await apiClient.get(`/book/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
            const data = response.data
            setSearchResults(data)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setIsSearching(false)
        }
    }

    useEffect(() => {
        handleSearch(null);

    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="search"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                        <Search className="h-4 w-4 mr-2" />
                        {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                </form>

                <div className="grid gap-6">
                    {searchResults.map((book: any) => (
                        <a href={`/book/${book.id}`} key={book.id} className="group relative">
                            <div key={book.id} className="flex gap-4 p-4 border rounded-lg">
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="w-24 h-32 object-cover rounded"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">{book.title}</h2>
                                    <p className="text-sm text-muted-foreground">{book.authors}</p>
                                    <p className="text-sm mt-2">{book.genre}</p>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Added by {book.postedBy}
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}


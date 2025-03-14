import CollectionBooks from '@/components/CollectionBooks'
import Header from '@/components/Header'
import LastReadBooks from '@/components/LastReadBooks'
import RecentlyAddedBooks from '@/components/RecentlyAddedBooks'
import { useColorModeValue } from '@/components/ui/color-mode'
import { InputGroup } from '@/components/ui/input-group'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  Text
} from '@chakra-ui/react'
import { Search, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAuthClient from '../api/apiClient'

const HomePage = () => {
  const navigate = useNavigate()
  const [collectionBooks, setCollectionBooks] = useState([])
  const [lastReadBooks, setLastReadBooks] = useState([])
  const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const bgColor = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const fetchCollectionBooks = async () => {
      try {
        const response = await apiAuthClient.get('/books/my-collection')
        const books = response.data
        setCollectionBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };

    const fetchLastReadBooks = async () => {
      try {
        const response = await apiAuthClient.get('/books/last-read-books')
        const books = response.data
        setLastReadBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };

    const fetchRecentlyUploadedBooks = async () => {
      try {
        const response = await apiAuthClient.get('/books/recently-uploaded-books')
        const books = response.data
        setRecentlyAddedBooks(books)
      } catch (error) {
        console.error('Error fetching collection books:', error)
      }
    };

    fetchCollectionBooks();
    fetchLastReadBooks();
    fetchRecentlyUploadedBooks();
  }, []);

  const handleUpload = () => {
    navigate('/upload')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    let query = searchQuery.trim()
    if (searchQuery.length < 100) {
      query = query.replace(/[^a-zA-Z0-9\s]/g, "")
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <Container maxW="container.xl" px={4} py={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8} direction={{ base: 'column', md: 'row' }} gap={{ base: 8, md: 0 }}>
          <Heading as="h1" fontSize="4xl" fontWeight="bold">
            Welcome to AI Ebook Reader
          </Heading>
          <Flex gap={4} direction={{ base: 'column', sm: 'row' }} width={{ base: '100%', md: 'auto' }}>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <InputGroup
                w="full"
                endElement={
                  <Button variant="ghost" type="submit" h="full">
                    <Search size={16} />
                  </Button>
                }>
                <Input
                  type="search"
                  placeholder="Search books..."
                  width={{ base: 'full', md: '64' }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </form>
            <Button
              onClick={handleUpload}
              colorScheme="blue"
            >
              <Upload size={16} />Upload New Book
            </Button>
          </Flex>
        </Flex>

        <Grid templateColumns="1fr" gap={8}>
          <Box as="section">
            <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={4}>
              Continue Reading
            </Heading>

            <LastReadBooks
              books={lastReadBooks}
              emptyText='No books in progress'
            />
          </Box>

          <Box as="section">
            <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={4}>
              Your Collection
            </Heading>
            <CollectionBooks
              books={collectionBooks}
              emptyText="Your collection is empty"
            />
          </Box>

          <Box as="section">
            <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={4}>
              Recently Added by Community
            </Heading>
            <RecentlyAddedBooks
              books={recentlyAddedBooks}
              emptyText='No books have been added recently'
            />
          </Box>
        </Grid>
        <Text textAlign="center" mt="12" color="gray" fontSize="sm">
          Developed by
          <Link href='https://github.com/tranquility404' unstyled ml="1">
          Aman Verma
          </Link>
        </Text>
      </Container>
    </Box>
  )
}

export default HomePage;
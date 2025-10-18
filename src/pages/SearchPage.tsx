import { searchBooks } from '@/api/ApiRequests';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Image,
    Input,
    Link,
    Stack,
    Text
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  authors: string;
  genre: string;
  thumbnail: string;
  postedBy: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState<string>(query);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');

  const handleSearch = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault();
    if (!searchQuery) {
        setIsSearching(false);
        return;
    }

    setIsSearching(true);
    try {
      const response = await searchBooks(searchQuery);
      const data = response.data;
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch(null);
  }, []);

  return (
    <Container maxW="container.xl" px={4} py={8}>
      <Stack maxW="2xl" mx="auto" gap={8}>
        <form onSubmit={handleSearch}>
          <Flex gap={2}>
            {/* <InputGroup size="md" flex={1}> */}
              <Input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Button 
                type="submit" 
                loading={isSearching}
                loadingText="Searching..."
              >
              <FiSearch />Search
              </Button>
          </Flex>
        </form>

        <Grid gap={6} templateColumns="repeat(1, 1fr)">
          {searchResults.map((book: Book) => (
            <Link 
              href={`/books/${book.id}`} 
              key={book.id} 
              _hover={{ textDecoration: 'none' }}
            >
              <Flex 
                gap={4} 
                p={4} 
                borderWidth="1px" 
                borderColor={borderColor} 
                borderRadius="lg"
                transition="all 0.2s"
                flex={1}
                _hover={{ 
                  boxShadow: 'md',
                  borderColor: 'blue.200'
                }}
              >
                <Image
                  src={book.thumbnail}
                  alt={book.title}
                  w="24"
                  h="32"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box>
                  <Text fontSize="xl" fontWeight="semibold">{book.title}</Text>
                  <Text fontSize="sm" color={mutedText}>{book.authors}</Text>
                  <Text fontSize="sm" mt={2}>{book.genre}</Text>
                  <Text fontSize="sm" mt={2} color={mutedText}>
                    Added by {book.postedBy}
                  </Text>
                </Box>
              </Flex>
            </Link>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
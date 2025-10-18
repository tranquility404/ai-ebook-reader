import { getBookInfo } from '@/api/ApiRequests';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react';
import { BookOpen, Flag, Sparkles, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface BookInfo {
  id: string;
  title: string;
  authors: string[];
  description: string;
  genre: string;
  publisher: string;
  publishedDate: string;
  pageCount: number;
  maturityRating: string;
  postedBy: string;
  likes: number;
  imageLinks: {
    thumbnail: string;
  };
}

interface SimilarBook {
  id: string;
  title: string;
  thumbnail: string;
}

export default function BookInfoPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookInfo | null>(null);

  const bgGradient = useColorModeValue(
    'linear(to-t, blackAlpha.800, blackAlpha.400, transparent)',
    'linear(to-t, blackAlpha.800, blackAlpha.400, transparent)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchBook = async (id: string) => {
      if (!id || id.length === 0) return;

      try {
        const response = await getBookInfo(id);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    if (bookId) {
      fetchBook(bookId);
    }
    console.log(bookId);

  }, []);

  const similarBooks: SimilarBook[] = [
    { id: '2', title: 'To Kill a Mockingbird', thumbnail: '/placeholder.svg' },
    { id: '3', title: '1984', thumbnail: '/placeholder.svg' },
    // Add more similar books...
  ];

  if (!book) return null;

  return (
    <Container maxW="7xl" px={4} py={8}>
      <Grid templateColumns={{ lg: '1fr 300px' }} gap={8}>
        <VStack gap={8} align="stretch">
          <Grid templateColumns={{ md: '300px 1fr' }} gap={8}>
            <Box
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="2xl"
              transition="transform 0.3s"
              _hover={{ transform: 'scale(1.02)' }}
              aspectRatio={3 / 4}
            >
              <Image
                src={book.imageLinks.thumbnail}
                alt={book.title}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>

            <VStack gap={6} align="flex-start">
              <Box>
                <Heading as="h1" size="xl">{book.title}</Heading>
                <Text fontSize="lg" color={mutedColor} mt={2}>
                  by {book.authors.join(', ')}
                </Text>
              </Box>

              <Box>
                <Box h="48" overflowY="auto">
                  <Text>{book.description}</Text>
                </Box>
              </Box>

              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} w="full">
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Genre</Text>
                  <Text fontWeight="medium">{book.genre}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Publisher</Text>
                  <Text fontWeight="medium">{book.publisher}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Published Date</Text>
                  <Text fontWeight="medium">{book.publishedDate}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Chapters</Text>
                  <Text fontWeight="medium">{book.pageCount}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Maturity Rating</Text>
                  <Text fontWeight="medium">{book.maturityRating}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={mutedColor}>Posted By</Text>
                  <Text fontWeight="medium">{book.postedBy}</Text>
                </Box>
              </SimpleGrid>

              <Flex alignItems="center" gap={2}>
                <Button size="sm" variant="outline">
                  <ThumbsUp size={16} />{book.likes} Likes
                </Button>
              </Flex>
            </VStack>
          </Grid>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
            <Button
              variant="outline"
              h="auto"
              p={0}>
              <Link to={`reader`} style={{width: "100%", height: "100%"}}>
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                  py={6}
                  w="full"
                >
                  <BookOpen size={20} />
                  <Text>Read Book</Text>
                </Flex>
              </Link>
            </Button>

            <Button
              variant="outline"
              h="auto"
              p={0}
            >
              <Link to={`chapters`} style={{width: "100%", height: "100%"}}>
                <Flex
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                  py={6}
                  w="full"
                >
                  <Sparkles size={20} />
                  <Text>AI Features</Text>
                </Flex>
              </Link>
            </Button>

            <Button variant="outline" h="auto" py={4}>
              <Flex flexDirection="column" alignItems="center" gap={2}>
                <Flag size={20} />
                <Text>Report Issue</Text>
              </Flex>
            </Button>
          </SimpleGrid>
        </VStack>

        <VStack gap={6} align="stretch">
          <Heading as="h2" size="md" fontWeight="semibold">
            Similar Books
          </Heading>

          <VStack gap={4} align="stretch">
            {similarBooks.map((similarBook) => (
              <Card.Root key={similarBook.id} overflow="hidden" bg={cardBg}>
                <CardBody p={0}>
                  <Box position="relative" aspectRatio={3 / 4}>
                    <Image
                      src={similarBook.thumbnail}
                      alt={similarBook.title}
                      objectFit="cover"
                      w="full"
                      h="full"
                    />
                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient={bgGradient}
                    >
                      <Box position="absolute" bottom={0} left={0} right={0} p={3}>
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          color="white"
                          maxLines={1}
                        >
                          {similarBook.title}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card.Root>
            ))}
          </VStack>
        </VStack>
      </Grid>
    </Container>
  );
}
import {
  Box,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useColorModeValue } from './ui/color-mode'

interface Book {
  id: string
  title: string
  thumbnail: string
  postedBy: string
  addedAt: string
}

interface RecentlyAddedBooksProps {
  books: Book[]
  emptyText: string
}

export default function RecentlyAddedBooks({ books, emptyText }: RecentlyAddedBooksProps) {
  const gradientBg = useColorModeValue(
    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
    'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)'
  )

  if (books.length === 0) {
    return <Text color="gray.500">{emptyText}</Text>
  }

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
      {books.map((book) => (
        <Link
          key={book.id}
          to={`/books/${book.id}`}
        >
          <Box
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            position="relative"
            height="0"
            paddingBottom="133%" /* 4:3 aspect ratio */>
            <Image
              src={book.thumbnail}
              alt={book.title}
              objectFit="cover"
              position="absolute"
              top="0"
              width="100%"
              height="100%"
              borderRadius="lg"
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgImage={gradientBg}
            >
              <VStack
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p={3}
                align="start"
                gap={2}
              >
                <Heading
                  as="h3"
                  size="xs"
                  color="white"
                  maxLines={1}
                  fontWeight="semibold"
                >
                  {book.title}
                </Heading>
                <Text fontSize="xs" color="whiteAlpha.700">
                  Added by {book.postedBy}
                </Text>
              </VStack>
            </Box>
          </Box>
        </Link>
      ))}
    </SimpleGrid>
  )
}
import {
  Badge,
  Box,
  Heading,
  Image,
  LinkOverlay,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { useColorModeValue } from './ui/color-mode'

interface Book {
  id: string
  title: string
  thumbnail: string
  genre: string
}

interface CollectionBooksProps {
  books: Book[]
  emptyText: string
}

export default function CollectionBooks({ books, emptyText }: CollectionBooksProps) {
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
        <LinkOverlay
          href={`/books/${book.id}`}
          key={book.id}
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md">
          <Box position="relative" height="0" paddingBottom="133%" /* 4:3 aspect ratio */>
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
                gap={1}
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
                <Badge
                  px={2}
                  py={0.5}
                  fontSize="xs"
                  colorScheme="blue"
                  bgColor="blue.400"
                  color="white"
                  borderRadius="full"
                  opacity={0.8}
                >
                  {book.genre}
                </Badge>
              </VStack>
            </Box>
          </Box>
        </LinkOverlay>
      ))}
    </SimpleGrid>
  )
}
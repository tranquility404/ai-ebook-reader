import { Box, Flex, Text } from '@chakra-ui/react';
import { Book } from 'lucide-react';

interface ProgressUIProps {
  currentPage: number;
  totalPages: number;
  isDarkMode: boolean;
}

export default function ProgressUI({ currentPage, totalPages, isDarkMode }: ProgressUIProps) {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  
  // We'll maintain the manual dark mode for consistency with the parent component's state
  const textColor = isDarkMode ? 'gray.300' : 'gray.600';
  const accentColor = isDarkMode ? 'blue.400' : 'blue.600';
  const bgColor = isDarkMode ? 'gray.800' : 'white';
  
  return (
    <Box pb={4} bg={bgColor} transition="colors 0.3s ease-in-out">
      <Box maxW="3xl" w="80%" mx="auto">
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Flex alignItems="center">
            <Box as={Book} w={5} h={5} mr={2} color={accentColor} />
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Page {currentPage} of {totalPages}
            </Text>
          </Flex>
          <Text fontSize="sm" fontWeight="bold" color={accentColor}>
            {Math.round(progress)}%
          </Text>
        </Flex>
        <Box position="relative" h={2} bg="gray.200" borderRadius="full" overflow="hidden">
          <Box
            position="absolute"
            top={0}
            left={0}
            h="full"
            bg="blue.600"
            transition="all 0.3s ease-in-out"
            borderRadius="full"
            width={`${progress}%`}
          />
        </Box>
      </Box>
    </Box>
  );
}
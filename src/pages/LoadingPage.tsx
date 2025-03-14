// src/LoadingPage.tsx
import React from 'react';
import { 
  Box, 
  Flex, 
  Spinner, 
  Text, 
  Container
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

// Define a keyframes animation for a subtle fade effect
// const pulseAnimation = keyframes`
//   0% { opacity: 0.6; }
//   50% { opacity: 1; }
//   100% { opacity: 0.6; }
// `;

const LoadingPage: React.FC = () => {
  // Use theme colors that adapt to light/dark mode
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  
  // Animation for the text
  const animation = `pulseAnimation 2s ease-in-out infinite`;

  return (
    <Box 
      bg={bgColor} 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      transition="background-color 0.2s ease"
    >
      <Container maxW="container.md">
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          textAlign="center"
          p={8}
        >
          <Spinner 
            css={{ "--thickness": "4px", "--spinner-track-color": "colors.gray.200"}}
            animationDuration="0.65s"
            color={spinnerColor}
            size="xl"
            mb={6}
          />
          
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="medium"
            color={textColor}
            animation={animation}
            mb={2}
          >
            Loading...
          </Text>
          
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.500"
            maxW="md"
          >
            Please wait while we prepare your content
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default LoadingPage;
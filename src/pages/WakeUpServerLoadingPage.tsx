import { useColorModeValue } from '@/components/ui/color-mode';
import { Box, Center, Container, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const WakeUpServerLoadingPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const boxBgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box 
      minH="100vh" 
      bg={bgColor} 
      py={10} 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <Container maxW="container.md">
        <Center>
          <VStack gap={8} p={6} borderRadius="xl" bg={boxBgColor} boxShadow="lg">
            <ServerAnimation />
            <Heading 
              size="lg" 
              color={headingColor}
              fontWeight="medium"
              textAlign="center"
            >
              Waking up the sleepy server...
            </Heading>
            <Text 
              color={textColor} 
              fontSize="md" 
              textAlign="center"
              animation={`pulse 2s infinite ease-in-out`}
            >
              This might take a moment. Thanks for your patience!
            </Text>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
};

// Server animation component
const ServerAnimation: React.FC = () => {
  const animDuration = "3s";
  const serverColor = useColorModeValue('gray.200', 'gray.700');
  const lightColor = useColorModeValue('red.400', 'red.300');
  
  return (
    <Box 
      position="relative" 
      h="120px" 
      w="120px"
      animation={`floatAnimation ${animDuration} infinite ease-in-out`}
    >
      {/* Server tower */}
      <Box 
        position="absolute"
        top="10px"
        left="20px"
        w="80px"
        h="100px"
        bg={serverColor}
        borderRadius="md"
        boxShadow="md"
      >
        {/* Server details */}
        <Box 
          position="absolute"
          top="10px"
          left="10px"
          w="60px"
          h="5px"
          bg="gray.500"
          borderRadius="full"
        />
        <Box 
          position="absolute"
          top="25px"
          left="10px"
          w="60px"
          h="5px"
          bg="gray.500"
          borderRadius="full"
        />
        
        {/* Blinking lights */}
        <Box 
          position="absolute"
          bottom="15px"
          left="15px"
          w="10px"
          h="10px"
          bg={lightColor}
          borderRadius="full"
          animation={`blinkAnimation 1.5s infinite ease-in-out`}
        />
        <Box 
          position="absolute"
          bottom="15px"
          left="35px"
          w="10px"
          h="10px"
          bg={lightColor}
          borderRadius="full"
          animation={`blinkAnimation 2.1s infinite ease-in-out`}
        />
        <Box 
          position="absolute"
          bottom="15px"
          left="55px"
          w="10px"
          h="10px"
          bg={lightColor}
          borderRadius="full"
          animation={`blinkAnimation 1.7s infinite ease-in-out`}
        />
        
        {/* Z's for sleeping */}
        <Text
          position="absolute"
          top="-15px"
          right="-15px"
          fontSize="24px"
          fontWeight="bold"
          animation={`blinkAnimation 2s infinite ease-in-out 0.3s`}
        >
          z
        </Text>
        <Text
          position="absolute"
          top="-25px"
          right="-5px"
          fontSize="20px"
          fontWeight="bold"
          animation={`blinkAnimation 2s infinite ease-in-out 0.6s`}
        >
          z
        </Text>
        <Text
          position="absolute"
          top="-35px"
          right="5px"
          fontSize="16px"
          fontWeight="bold"
          animation={`blinkAnimation 2s infinite ease-in-out 0.9s`}
        >
          z
        </Text>
      </Box>
    </Box>
  );
};

export default WakeUpServerLoadingPage;
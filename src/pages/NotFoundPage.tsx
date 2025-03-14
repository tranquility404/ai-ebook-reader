import { useColorModeValue } from '@/components/ui/color-mode';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react';
import React from 'react';

const NotFoundPage: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingSize = useBreakpointValue({ base: '2xl', md: '3xl' });
  const textSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl" h="100%">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          minH={{ base: 'calc(100vh - 80px)', md: '80vh' }}
          gap={{ base: 8, md: 12 }}
        >
          {/* Left section - Error code and illustration */}
          <Flex
            flex="1"
            justify="center"
            align="center"
            direction="column"
          >
            <Box
              position="relative"
              w="100%"
              maxW="sm"
              mt={-10}
            >
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="auto"
                opacity="0.8"
              >
                <path
                  fill={useColorModeValue('#805AD5', '#D6BCFA')}
                  d="M46.5,-78.3C59.4,-71.3,68.7,-58.6,76.4,-44.6C84.1,-30.6,90.3,-15.3,89.8,-0.3C89.3,14.7,82.1,29.5,73.3,43.1C64.4,56.8,53.9,69.3,40.3,76.3C26.8,83.2,10.2,84.5,-5.4,82.2C-21,79.9,-35.7,74,-48.9,65.1C-62.1,56.2,-73.9,44.1,-78.2,30C-82.5,16,-79.3,0,-76.2,-16C-73.1,-32,-70.1,-48,-60.1,-56.6C-50.2,-65.2,-33.3,-66.4,-18.7,-71.7C-4.1,-77,8.2,-86.4,22.6,-87.1C37,-87.9,53.6,-80,46.5,-78.3Z"
                  transform="translate(100 100)"
                />
              </svg>
            </Box>
            <Heading
              as="h1"
              fontSize={headingSize}
              fontWeight="bold"
              color="white"
              lineHeight="1"
              position="absolute"
              transform="translate(0%, -70%)"
              letterSpacing="tight"
              opacity="0.8"
            >
              404
            </Heading>
          </Flex>

          {/* Right section - Text and button */}
          <VStack
            gap={6}
            flex="1"
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            <Heading as="h2" size="2xl" fontWeight="bold">
              Page Not Found
            </Heading>
            <Text fontSize={textSize} color={useColorModeValue('gray.600', 'gray.400')} maxW="lg">
              Oops! The page you are looking for doesn't exist or has been moved.
              Let's get you back on track.
            </Text>
            <Link pt={4}
              href="/"
              unstyled
            >
              <Button
                colorScheme="purple"
                size="lg"
                fontWeight="bold"
                px={8}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Back to Home
              </Button>
            </Link>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
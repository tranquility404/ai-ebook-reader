// src/ErrorPage.tsx
import { useColorModeValue } from '@/components/ui/color-mode';
import {
  Box,
  Code,
  Container,
  Flex,
  Heading,
  HStack,
  Separator,
  Text,
  VStack
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { useLocation } from 'react-router-dom';

// Props interface for the error page
interface ErrorPageProps {
  errorCode?: number;
  errorMessage?: string;
  onRetry?: () => void;
}

// Animation keyframes
// const pulseAnimation = keyframes`
//   0% { transform: scale(1); opacity: 0.8; }
//   50% { transform: scale(1.05); opacity: 1; }
//   100% { transform: scale(1); opacity: 0.8; }
// `;

// SVG Icon for the error illustration
const ServerErrorIcon = () => (
  <Box 
    as="svg" 
    boxSize="0 0 200 200" 
    width="150px" 
    height="150px"
  >
    <motion.path
      fill="none"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      d="M40,40 L160,40 L160,160 L40,160 Z"
    />
    <motion.path
      fill="none"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      d="M60,60 L140,60 L140,140 L60,140 Z"
    />
    <motion.path
      fill="none"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
      d="M80,80 L120,80 L120,120 L80,120 Z"
    />
    <motion.path
      fill="none"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 2 }}
      d="M90,100 L110,100"
    />
    <motion.path
      fill="none"
      strokeWidth="3"
      stroke="currentColor"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 2.2 }}
      d="M100,90 L100,110"
    />
  </Box>
);

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  // errorCode = 500, 
  // errorMessage = "Internal Server Error", 
  // onRetry = () => window.location.reload() 
}) => {
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('red.500', 'red.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Animation for the error code
  const animation = `pulseAnimation 3s ease-in-out infinite`;
  
  // State for countdown to retry
  // const [countdown, setCountdown] = useState<number | null>(null);

  const location = useLocation();
    // const navigate = useNavigate();

  const { message, status } = location.state || { message: "Unknown Error", status: 500 };


  // Countdown effect for auto-retry
  // useEffect(() => {
  //   if (countdown === null) return;
    
  //   if (countdown > 0) {
  //     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     onRetry();
  //   }
  // }, [countdown, onRetry]);

  // Start auto-retry countdown

  return (
    <Box 
      bg={bgColor} 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      transition="background-color 0.2s ease"
      p={4}
    >
      <Container maxW="container.md">
        <Box
          bg={cardBgColor}
          borderRadius="lg"
          boxShadow="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex 
            direction={{ base: "column", md: "row" }}
            align="center" 
            justify="center"
          >
            <Box 
              p={8}
              textAlign="center"
              color={accentColor}
              animation={animation}
              flex={{ base: "0 0 100%", md: "0 0 40%" }}
            >
              <ServerErrorIcon />
            </Box>
            
            <Box 
              p={8} 
              flex={{ base: "0 0 100%", md: "0 0 60%" }}
              borderLeftWidth={{ base: 0, md: "1px" }}
              borderTopWidth={{ base: "1px", md: 0 }}
              borderColor={borderColor}
            >
              <VStack gap={4} align="flex-start">
                <Heading 
                  as="h1" 
                  size="xl" 
                  color={accentColor}
                >
                  Server Error
                </Heading>
                
                <HStack gap={2}>
                  <Text fontWeight="bold">Error Code:</Text>
                  <Code fontSize="lg" colorScheme="red">{status}</Code>
                </HStack>
                
                <Box>
                  <Text fontWeight="bold" mb={1}>Error Message:</Text>
                  <Text color={textColor}>{message}</Text>
                </Box>
                
                <Separator />
                
                <Text fontSize="sm" color="gray.500">
                  We're experiencing technical difficulties. Please try again later or contact support if the problem persists.
                </Text>
                
                {/* <HStack gap={4} pt={2}>
                  <Button 
                    colorScheme="blue" 
                    onClick={onRetry}
                  >
                    Retry Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAutoRetry}
                    disabled={countdown !== null}
                  >
                    {countdown !== null 
                      ? `Retrying in ${countdown}s...` 
                      : "Auto Retry (5s)"}
                  </Button>
                </HStack> */}
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
import { addBook, confirmAddBook } from '@/api/ApiRequests';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    List,
    ListItem,
    Progress,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFile, FiLoader, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface ErrorMessage {
  response?: {
    message: string;
  };
}

interface BookChapter {
  title: string;
  noOfWords: number;
}

interface BookAnalysis {
  thumbnail: string;
  title: string;
  chapters: BookChapter[];
  authors: string[];
  pageCount: number;
  genre: string;
  maturityRating: string;
  language: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('idle');
  const [analysis, setAnalysis] = useState<BookAnalysis | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const bgMuted = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedText = useColorModeValue('gray.600', 'gray.400');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile?.type === 'application/epub+zip') {
      setFile(selectedFile);
      uploadFile(selectedFile);
    } else {
      alert('Please select a valid EPUB file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub']
    },
    multiple: false
  });

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('uploading');
      // Upload the file to Spring Boot backend
      const uploadResponse = await addBook(formData, (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded / (progressEvent.total || 1)) * 100
          );
          setProgress(percentCompleted);

          if (percentCompleted < 30) {
            setStatus("Uploading your file... 📤");
          } else if (percentCompleted < 70) {
            setStatus("Halfway there! 🏃‍♂️");
          } else {
            setStatus("Almost done! 🤏");
          }
      });

      // File upload completed. Begin listening for backend updates.
      setStatus("Processing started... 🚀");
      const requestId = uploadResponse.data["requestId"];
      const analysis = uploadResponse.data["response"];
      setRequestId(requestId);
      setAnalysis(analysis);
      setStatus("Processing complete! 🎉");
    } catch (error) {
      console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
    }
  };

  const handleSubmit = async () => {
    if (!analysis) return;

    try {
      const response = await confirmAddBook(requestId as string);
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxW="7xl" px={4} py={8}>
      <Card.Root overflow="hidden">
        <CardBody p={0}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
            <GridItem p={{ base: 6, lg: 8 }} bg={bgMuted}>
              <Stack gap={6}>
                <Box>
                  <Heading as="h2" size="lg">Upload Ebook</Heading>
                  <Text color={mutedText} mt={2}>
                    {status === 'idle'
                      ? 'Select or drag & drop your EPUB file'
                      : 'Processing your ebook...'}
                  </Text>
                </Box>

                {status !== 'idle' && (
                  <Stack gap={4}>
                    <Flex alignItems="center" gap={3}>
                      <FiFile />
                      <Text fontSize="sm" fontWeight="medium">{file?.name}</Text>
                    </Flex>
                    <Stack gap={2}>
                      <Progress.Root value={progress} width="full" colorScheme="blue">
                        <Progress.Track rounded="full">
                            <Progress.Range />
                        </Progress.Track>
                      </Progress.Root>
                      <Flex alignItems="center" gap={2}>
                        {status !== 'Processing complete! 🎉' && <FiLoader className="animate-spin" />}
                        <Text>{status}...</Text>
                      </Flex>
                    </Stack>
                  </Stack>
                )}

                {status === 'idle' && (
                  <Box
                    {...getRootProps()}
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderRadius="lg"
                    p={8}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    transition="colors 0.2s"
                    borderColor={isDragActive ? 'blue.500' : borderColor}
                    bg={isDragActive ? 'blue.50' : 'transparent'}
                    _dark={{
                      bg: isDragActive ? 'blue.900' : 'transparent',
                    }}
                  >
                    <input {...getInputProps()} />
                    <FiUpload size="2em" color={mutedText} style={{ marginBottom: '1rem' }} />
                    <Text textAlign="center" fontSize="sm" color={mutedText}>
                      {isDragActive ? (
                        "Drop your EPUB file here"
                      ) : (
                        <>
                          Drag & drop your EPUB file here, or{" "}
                          <Text as="span" color="blue.500" fontWeight="bold">click to select</Text>
                        </>
                      )}
                    </Text>
                  </Box>
                )}
              </Stack>
            </GridItem>

            {analysis && (
              <GridItem 
                p={{ base: 6, lg: 8 }} 
                borderTopWidth={{ base: '1px', lg: '0' }}
                borderLeftWidth={{ base: '0', lg: '1px' }}
                borderColor={borderColor}
              >
                <Stack gap={6}>
                  <Flex 
                    flexDirection={{ base: 'column', md: 'row' }}
                    gap={6}
                  >
                    <Box width={{ base: 'full', md: '1/3' }}>
                      <Box 
                        position="relative" 
                        height="0" 
                        paddingBottom="133%" 
                        borderRadius="lg" 
                        overflow="hidden"
                        boxShadow="lg"
                      >
                        <Image
                          src={analysis.thumbnail}
                          alt={analysis.title}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                          position="absolute"
                        />
                      </Box>
                    </Box>
                    <Stack flex="1" gap={4}>
                      <Heading as="h3" size="md">{analysis.title}</Heading>
                      <List.Root gap={2}>
                        <ListItem display="flex" gap={2}>
                          <Text fontWeight="medium">Authors:</Text>
                          <Text color={mutedText}>{analysis.authors.join(', ')}</Text>
                        </ListItem>
                        <ListItem display="flex" gap={2}>
                          <Text fontWeight="medium">Genre:</Text>
                          <Text color={mutedText}>{analysis.genre}</Text>
                        </ListItem>
                        <ListItem display="flex" gap={2}>
                          <Text fontWeight="medium">Pages:</Text>
                          <Text color={mutedText}>{analysis.pageCount}</Text>
                        </ListItem>
                        <ListItem display="flex" gap={2}>
                          <Text fontWeight="medium">Language:</Text>
                          <Text color={mutedText}>{analysis.language}</Text>
                        </ListItem>
                        <ListItem display="flex" gap={2}>
                          <Text fontWeight="medium">Maturity Rating:</Text>
                          <Text color={mutedText}>{analysis.maturityRating}</Text>
                        </ListItem>
                      </List.Root>
                    </Stack>
                  </Flex>

                  <Box>
                    <Heading as="h4" size="md" mb={4}>Chapters</Heading>
                    <VStack 
                      gap={2} 
                      maxH="300px" 
                      overflowY="auto" 
                      pr={2}
                      align="stretch"
                    >
                      {analysis.chapters.map((chapter, index) => (
                        <Flex 
                          key={index}
                          justifyContent="space-between" 
                          alignItems="center" 
                          p={3} 
                          bg={bgMuted} 
                          borderRadius="lg"
                        >
                          <Text fontWeight="medium">{chapter.title}</Text>
                          <Text fontSize="sm" color={mutedText}>
                            {chapter.noOfWords.toLocaleString()} words
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={requestId == null} 
                    width="full"
                    colorScheme="blue"
                  >
                    Save
                  </Button>
                </Stack>
              </GridItem>
            )}
          </Grid>
        </CardBody>
      </Card.Root>
    </Container>
  );
}
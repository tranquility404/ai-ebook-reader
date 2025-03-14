import { getBookChapterList, getSummary, postGenerateQuiz } from '@/api/ApiRequests';
import { DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ErrorMessage } from '@/types/error-message';
import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Heading,
    Spinner,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { BookIcon, BrainIcon, FileTextIcon, HelpCircleIcon, PanelLeft, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Chapter {
    uid: string;
    title: string;
    noOfWords: number;
    href: string;
}

function ChaptersPage() {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();

    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [summaryText, setSummaryText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateQuizDialog, setShowGenerateQuizDialog] = useState(false);
    const [showSummarySheet, setShowSummarySheet] = useState(false);

    // Fetch chapters when component mounts
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await getBookChapterList(bookId as string);
                const fetchedChapters: Chapter[] = response.data;
                const filtered = fetchedChapters.filter(
                    (ch, idx, self) =>
                        idx === self.findIndex(obj => obj.uid === ch.uid) &&
                        ch.noOfWords > 300
                );
                setChapters(filtered);
            } catch (error) {
                console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
            }
        };

        if (bookId) {
            fetchChapters();
        }
    }, [bookId]);

    // Set initial selected chapter
    useEffect(() => {
        if (chapters.length > 0) {
            const chapter = chapters.find(chapter => chapter.noOfWords > 300);
            if (chapter) setSelectedChapter(chapter);
        }
    }, [chapters]);

    const generateSummary = async () => {
        if (!selectedChapter || !bookId) return;
        setShowSummarySheet(true);

        // setIsGenerating(true);
        // setSummaryText('');
        // setTimeout(function () {
        //     setShowSummarySheet(false);
        // }, 8000);

        try {
            const response = await getSummary({
                bookId,
                chapterHref: selectedChapter.href
            });
            setSummaryText(response.data);
        } catch (error) {
            console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
        } finally {
            setIsGenerating(false);
        }
    };

    const generateQuiz = async () => {
        if (!selectedChapter || !bookId) return;
        setShowGenerateQuizDialog(true);
        // onQuizDialogOpen();

        // setTimeout(function () {
        //     setShowGenerateQuizDialog(false);
        // }, 8000);

        try {
            const response = await postGenerateQuiz({
                bookId,
                chapterHref: selectedChapter.href
            });
            const quizId = response.data.quizId;
            navigate(`/quiz/${quizId}`);
        } catch (error) {
            console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
        } finally {
            setShowGenerateQuizDialog(false);
        }
    };

    return (
        <Flex h="100vh">

            {/* Main Content */}
            <Box flex="1" p={6} overflow="auto">

                {selectedChapter ? (
                    <Box maxW="4xl" mx="auto" gap={8}>
                        <Box mb={8}>
                            <Flex gap={2} mb={4}>
                                {/* Mobile Sidebar Drawer */}
                                <DrawerRoot
                                    // isOpen={isSidebarOpen}
                                    placement="start"
                                    // onClose={onSidebarClose}
                                    size={{ md: "sm", mdDown: "xs" }}
                                // display={{ base: "block", md: "none" }}
                                >
                                    <DrawerBackdrop />
                                    <DrawerTrigger asChild>
                                        <Button
                                            //   display={{ base: "block", md: "none" }} 
                                            //   onClick={toggleSidebar}
                                            size="sm"
                                        >
                                            <PanelLeft />
                                            {/* <ArrowLeft /> */}
                                            {/* Chapters */}
                                            {/* <Text hideBelow="md">
                        </Text> */}
                                        </Button>
                                    </DrawerTrigger>

                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>
                                                <Flex gap={4}>

                                                    <BookIcon />
                                                    Chapters
                                                </Flex>
                                            </DrawerTitle>
                                        </DrawerHeader>
                                        <DrawerBody scrollbar="hidden">
                                            <VStack align="stretch" gap={1}>
                                                {chapters.length === 0 ?
                                                    <Text color="gray.500">
                                                        AI features not available for this book
                                                    </Text> :
                                                    chapters.map((chapter, index) => (
                                                        <Button
                                                            key={chapter.uid}
                                                            onClick={() => {
                                                                setSelectedChapter(chapter);
                                                                // onSidebarClose();
                                                            }}
                                                            variant={selectedChapter?.uid === chapter.uid ? "solid" : "ghost"}
                                                            colorScheme={selectedChapter?.uid === chapter.uid ? "blue" : "gray"}
                                                            justifyContent="flex-start"
                                                            p={2}
                                                            h="auto"
                                                            textAlign="left"
                                                        >
                                                            <Text mr={2}>{index + 1}.</Text>
                                                            <Box flex="1">
                                                                <Text fontWeight="medium">{chapter.title}</Text>
                                                                <Text fontSize="xs" color="gray.500">{chapter.noOfWords} words</Text>
                                                            </Box>
                                                        </Button>
                                                    ))}
                                            </VStack>
                                        </DrawerBody>
                                        <DrawerCloseTrigger />
                                    </DrawerContent>
                                </DrawerRoot>
                                <Heading as="h1" size="xl">{selectedChapter.title}</Heading>
                            </Flex>
                            <Text color="gray.500" mt={2}>
                                <strong>Total Words: </strong>
                                {selectedChapter.noOfWords} words
                            </Text>
                        </Box>

                        {selectedChapter.noOfWords > 300 ? (
                            <Grid
                                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                                gap={4}
                            >
                                <Button
                                    h="auto"
                                    py={6}
                                    variant="outline"
                                    onClick={generateSummary}
                                >
                                    <VStack gap={2}>
                                        <FileTextIcon size={6} />
                                        <Text>Generate Summary</Text>
                                    </VStack>
                                </Button>
                                <Button
                                    h="auto"
                                    py={6}
                                    variant="outline"
                                    onClick={generateQuiz}
                                >
                                    <VStack gap={2}>
                                        <HelpCircleIcon size={6} />
                                        <Text>Generate Quiz</Text>
                                    </VStack>
                                </Button>
                                <Button
                                    h="auto"
                                    py={6}
                                    variant="outline"
                                    onClick={() => { }}
                                >
                                    <VStack gap={2}>
                                        <BrainIcon size={6} />
                                        <Text>Create Flashcards</Text>
                                    </VStack>
                                </Button>
                            </Grid>
                        ) : (
                            <Box>
                                <Text color="gray.500">This chapter is too short to generate a summary or quiz.</Text>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Center h="full">
                        <VStack gap={4} textAlign="center">
                            <BookIcon size={12} color="gray.400" />
                            <Heading size="lg">Select a chapter to begin</Heading>
                            <Text color="gray.500">Choose a chapter from the sidebar to view its content and features.</Text>
                        </VStack>
                    </Center>
                )}
            </Box>

            {/* Summary Drawer */}
            <DrawerRoot
                open={showSummarySheet}
                placement="bottom"
                // onClose={onSummaryClose}
                size="xl"
            >
                <DrawerBackdrop />
                <DrawerContent h="80vh">
                    <DrawerCloseTrigger onClick={() => setShowSummarySheet(false)} />
                    <DrawerHeader>
                        <Heading display="flex" gap={2} >
                            <Sparkles />
                            Chapter Summary
                        </Heading>
                    </DrawerHeader>
                    <DrawerBody overflowY="auto">
                        <Box>
                            {isGenerating ? (
                                <Stack gap={2}>
                                    <Box h="4" bg="gray.200" rounded="md" w="75%" />
                                    <Box h="4" bg="gray.200" rounded="md" w="50%" />
                                    <Box h="4" bg="gray.200" rounded="md" w="83%" />
                                </Stack>
                            ) : (
                                <Text lineHeight="tall">{summaryText}</Text>
                            )}
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </DrawerRoot>

            {/* Quiz Generation Dialog */}
            <DialogRoot
                open={showGenerateQuizDialog}
                placement="center">
                <DialogContent>
                    <DialogHeader textAlign="center">
                        <DialogTitle>
                            Generating Quiz
                        </DialogTitle>
                    </DialogHeader>
                    <DialogBody textAlign="center">
                        <VStack gap={8} py={8}>
                            <Spinner borderWidth="4px" size="xl" color="blue.500" />
                            <Text>Please wait while we generate quiz questions for this chapter...</Text>
                        </VStack>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>
        </Flex>
    );
}

export default ChaptersPage;
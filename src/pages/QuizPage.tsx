import { getQuiz, postTestHistory } from '@/api/ApiRequests';
import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Radio, RadioGroup } from '@/components/ui/radio';
import {
    AbsoluteCenter,
    Badge,
    Box,
    Button,
    Circle,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    ProgressCircle,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import confetti from 'canvas-confetti';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface QuizQuestion {
    question: string;
    options: { [key: string]: string };
    correctId: string;
}

interface ErrorMessage {
    response?: {
        message?: string;
    };
}

interface QuestionState {
    answered: boolean;
    selectedOption: string | null;
    visited: boolean;
}


function QuizTimer({ duration, onTimeUp }: { duration: number; onTimeUp: () => void }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <Badge colorScheme="blue" fontSize="md" py={1} px={2} borderRadius="md">
            {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
        </Badge>
    );
}

function QuizPage() {
    return (
        <Box w="full" display="flex" flexDir="column">
            <QuizContent />
        </Box>
    );
}

function QuizContent() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [isReviewMode, setIsReviewMode] = useState(false);
    const [score, setScore] = useState({ total: 0, correct: 0, incorrect: 0 });
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [questionStates, setQuestionStates] = useState<{ [key: number]: QuestionState }>({});

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getQuiz(quizId as string);
                const quizJson = JSON.parse(response.data);
                setQuestions(quizJson);
                setCurrentQuestionIndex(0);
            } catch (error) {
                console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
            }
        };

        if (quizId) {
            fetchQuestions();
        }
    }, [quizId]);

    useEffect(() => {
        if (!isReviewMode && currentQuestionIndex >= 0) {
            setQuestionStates(prev => ({
                ...prev,
                [currentQuestionIndex]: {
                    ...prev[currentQuestionIndex],
                    visited: true
                }
            }));
        }
    }, [currentQuestionIndex])

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
        setQuestionStates(prev => ({
            ...prev,
            [index]: {
                ...prev[index],
                visited: true
            }
        }));
    };

    const getQuestionStatus = (index: number) => {
        const state = questionStates[index];
        if (!state) return 'not-visited';
        if (state.answered) return 'answered';
        if (state.visited) return 'attempted';
        return 'not-visited';
    };

    const updateTestHistory = (score: number) => {
        try {
            postTestHistory({
                "testId": quizId,
                "score": score
            });
        } catch (error) {
            console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
        }
    };

    const calculateScore = () => {
        let correct = 0;
        let incorrect = 0;

        if (!questions || questions.length === 0) return;

        Object.entries(questionStates).forEach(([index, state]) => {
           if (state.selectedOption === questions[Number(index)].correctId) {
                correct++;
            } else if (state.selectedOption) {
                incorrect++;
            }
        });

        const totalScore = Math.round((correct / questions.length) * 100);
        setScore({ total: totalScore, correct, incorrect });
        setShowScore(true);
        setDrawerOpen(false);

        if (totalScore > 0) {
            updateTestHistory(totalScore);
        }

        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    const handleTimeUp = () => {
        calculateScore();
        setDrawerOpen(false);
    };

    const enterReviewMode = () => {
        setIsReviewMode(true);
        setShowScore(false);
    };

    const returnHome = () => {
        navigate('/');
    };

    // Get color scheme for question status indicators
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'answered': return 'green';
            case 'attempted': return 'yellow';
            case 'not-visited': return '';
            default: return '';
        }
    };

    if (!questions || questions.length === 0 || currentQuestionIndex < 0) {
        return (
            <Flex height="100vh" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Flex h="100vh" flex="1" flexDir="column">
            <Flex borderBottom="1px solid" borderColor="gray.200" p={4} gap={4} align="center">
                <DrawerRoot
                    open={drawerOpen}
                    onOpenChange={(e) => setDrawerOpen(e.open)}
                    placement="start"
                    size="xs">
                    <DrawerBackdrop />
                    <DrawerTrigger asChild>
                        <IconButton>
                            <Menu />
                        </IconButton>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle mb={2}>
                                Questions
                            </DrawerTitle>
                            <Box>
                                <VStack gap={2} fontSize="sm" align="flex-start">
                                    <HStack>
                                        <Circle size="3" bg="green.500" />
                                        <Text>Answered</Text>
                                    </HStack>
                                    <HStack>
                                        <Circle size="3" bg="yellow.500" />
                                        <Text>Attempted</Text>
                                    </HStack>
                                    <HStack>
                                        <Circle size="3" bg="gray.300" />
                                        <Text>Not Visited</Text>
                                    </HStack>
                                </VStack>
                            </Box>
                        </DrawerHeader>

                        <DrawerBody>
                            <SimpleGrid columns={4} gap={2}>
                                {questions.map((_, index) => {
                                    const status = getQuestionStatus(index);
                                    const color = getStatusColor(status);

                                    return (
                                        <Button
                                            key={index}
                                            size="sm"
                                            w="8"
                                            h="8"
                                            p="0"
                                            colorPalette={color}
                                            variant={currentQuestionIndex === index ? "outline" : "solid"}
                                            borderWidth={currentQuestionIndex === index ? "2px" : "1px"}
                                            onClick={() => handleQuestionSelect(index)}
                                        >
                                            {index + 1}
                                        </Button>
                                    );
                                })}
                            </SimpleGrid>
                        </DrawerBody>
                        <DrawerCloseTrigger />
                    </DrawerContent>
                </DrawerRoot>
                <Heading size="lg">Quiz</Heading>
                {!showScore && !isReviewMode && (
                    <Box ml="auto">
                        <QuizTimer
                            duration={questions.length * 60}
                            onTimeUp={handleTimeUp}
                        />
                    </Box>
                )}
            </Flex>

            <Box flex="1" p={6} overflowY="auto">
                <Container maxW="3xl" centerContent>
                    <VStack gap={8} align="stretch" w="full">
                        {isReviewMode && (
                            <Badge
                                alignSelf="flex-start"
                                colorPalette={questionStates[currentQuestionIndex]?.selectedOption === questions[currentQuestionIndex].correctId ? "green" : "red"}
                                px={3}
                                py={1}
                                borderRadius="full"
                            >
                                {questionStates[currentQuestionIndex]?.selectedOption === questions[currentQuestionIndex].correctId ? "Correct" : "Incorrect"}
                            </Badge>
                        )}

                        <VStack gap={6} align="stretch">
                            <Text fontSize="lg">{`${currentQuestionIndex + 1}). ${questions[currentQuestionIndex].question}`}</Text>

                            <RadioGroup
                                value={questionStates[currentQuestionIndex]?.selectedOption || ""}
                                onChange={(value) => {
                                    if (!isReviewMode) {
                                        setQuestionStates(prev => ({
                                            ...prev,
                                            [currentQuestionIndex]: {
                                                ...prev[currentQuestionIndex],
                                                answered: true,
                                                selectedOption: value
                                            }
                                        } as { [key: number]: QuestionState }));
                                    }
                                }}
                            >
                                <Stack gap={3}>
                                    {Object.entries(questions[currentQuestionIndex].options).map(([id, text]) => {
                                        const isCorrect = id === questions[currentQuestionIndex].correctId;
                                        const isSelected = questionStates[currentQuestionIndex]?.selectedOption === id;

                                        // Determine background color based on state
                                        let bgColor = "white";
                                        let borderColor = "gray.200";

                                        if (isReviewMode) {
                                            if (isCorrect) {
                                                bgColor = "green.50";
                                                borderColor = "green.500";
                                            } else if (isSelected) {
                                                bgColor = "red.50";
                                                borderColor = "red.500";
                                            }
                                        } else if (isSelected) {
                                            bgColor = "blue.50";
                                            borderColor = "blue.500";
                                        }

                                        return (
                                            <Box
                                                key={id}
                                                borderWidth="1px"
                                                borderColor={borderColor}
                                                borderRadius="lg"
                                                p={4}
                                                bg={bgColor}
                                                cursor={isReviewMode ? "default" : "pointer"}
                                                onClick={() => {
                                                    if (!isReviewMode) {
                                                        setQuestionStates(prev => ({
                                                            ...prev,
                                                            [currentQuestionIndex]: {
                                                                ...prev[currentQuestionIndex],
                                                                answered: true,
                                                                selectedOption: isSelected ? null : id
                                                            }
                                                        }));
                                                    }
                                                }}
                                            >
                                                <HStack gap={2}>
                                                    <Radio
                                                        value={id}
                                                        disabled={isReviewMode}
                                                        colorScheme="blue"
                                                    />
                                                    <Text flex="1">{text}</Text>
                                                </HStack>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </RadioGroup>
                        </VStack>

                        {!showScore && (
                            <Flex justify="space-between" pt={6}>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    Previous
                                </Button>

                                {currentQuestionIndex < questions.length - 1 ? (
                                    <Button
                                        colorScheme="blue"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        disabled={isReviewMode && currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        colorScheme="blue"
                                        onClick={calculateScore}
                                        disabled={isReviewMode}
                                    >
                                        Submit Quiz
                                    </Button>
                                )}
                            </Flex>
                        )}
                    </VStack>
                </Container>
            </Box>

            <DrawerRoot
                open={showScore}
                // onClose={() => {}} 
                placement="bottom"
                size="md"
            >
                <DrawerBackdrop />
                <DrawerContent h="400px">
                    <DrawerHeader>
                        <Heading size="2xl" textAlign="center">
                            Quiz Results!
                        </Heading>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack gap={8}>
                            <Box textAlign="center">
                                <ProgressCircle.Root scale={3.6} value={score.total} mt={16} mb={20} >
                                    <ProgressCircle.Circle css={{ "--thickness": "2.4px"}}>
                                        <ProgressCircle.Track />
                                        <ProgressCircle.Range />
                                    </ProgressCircle.Circle>
                                    <AbsoluteCenter>
                                        <ProgressCircle.ValueText fontSize="xx-small" />
                                    </AbsoluteCenter>
                                </ProgressCircle.Root>
                                <Text color="gray.500">
                                    {score.correct} correct • {score.incorrect} incorrect
                                </Text>
                            </Box>
                            <Flex gap={4} w="full">
                                <Button
                                    onClick={enterReviewMode}
                                    flex="1"
                                    colorScheme="blue"
                                >
                                    Check Responses
                                </Button>
                                <Button
                                    onClick={returnHome}
                                    variant="outline"
                                    flex="1"
                                >
                                    Return to Home
                                </Button>
                            </Flex>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </DrawerRoot>
        </Flex>
    );
}

export default QuizPage;
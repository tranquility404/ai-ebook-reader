import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { AuthContext } from '@/context/AuthContext';
import {
    Box,
    Button,
    Link as ChakraLink,
    Heading,
    HStack,
    Input,
    Separator,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { Github, LogIn, Mail } from 'lucide-react';
import { useContext, useEffect } from 'react';

export default function LoginPage() {
    const { email, setEmail, password, setPassword, validateCredentials, setIsLogin } = useContext(AuthContext);

    useEffect(() => {
        setIsLogin(true);
    }, [])

    return (
        <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
            <Box
                w="full"
                maxW="md"
                p={8}
                bg="white"
                rounded="xl"
                shadow="xl"
                gap={8}
            >
                <VStack align="center" mb={8}>
                    <Heading fontSize="3xl" fontWeight="bold">Welcome back!</Heading>
                    <Text fontSize="sm" color="gray.600">Sign in to your account</Text>
                </VStack>

                <form onSubmit={validateCredentials}>
                    <VStack gap={4}>
                        <Field label="Email address" required>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@abc.com"
                                autoComplete='username'
                            />
                        </Field>

                        <Field label="Password" required>
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                autoComplete='current-password'
                            />
                        </Field>

                        <Box w="full" display="flex" justifyContent="flex-end">
                            <ChakraLink
                                href='/reset-password'
                                color="brand.500"
                                fontSize="sm"
                                fontWeight="semibold"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Forgot your password?
                            </ChakraLink>
                        </Box>

                        <Button type="submit" w="full" onClick={validateCredentials}>
                            <LogIn size={20} /> Sign in
                        </Button>
                    </VStack>
                </form>

                <VStack mt={6} gap={6}>
                    <Stack>
                        <HStack w="full" align="center">
                            <Separator variant="solid" />
                            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap" px={3}>
                                Or continue with
                            </Text>
                            <Separator />
                        </HStack>
                    </Stack>

                    <div className='grid grid-cols-2 gap-3 w-full'>
                        <Button variant="outline" className='w-full'>
                            <Github size={20} style={{ marginRight: '0.5rem' }} />
                            GitHub
                        </Button>
                        <Button variant="outline" className='w-full'>
                            <Mail size={20} style={{ marginRight: '0.5rem' }} />
                            Google
                        </Button>
                    </div>
                </VStack>

                <Text mt={8} textAlign="center" fontSize="sm" color="gray.600">
                    Don't have an account?{' '}
                    <ChakraLink
                        href='/register'
                        color="brand.500"
                        fontWeight="semibold"
                        _hover={{ textDecoration: 'underline' }}
                    >
                        Sign up
                    </ChakraLink>
                </Text>
            </Box>
        </Box>
    );
}
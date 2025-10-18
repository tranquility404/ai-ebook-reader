import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { AuthContext } from '@/context/AuthContext';
import {
  Box,
  Button,
  Link as ChakraLink,
  FieldHelperText,
  Heading,
  HStack,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import { UserPlus } from 'lucide-react';
import { useContext, useEffect } from 'react';

export default function RegisterPage() {
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, validateCredentials, setIsLogin } = useContext(AuthContext);

  useEffect(() => {
    setIsLogin(false);
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
          <Heading fontSize="3xl" fontWeight="bold">Join the Future of Reading</Heading>
          <Text fontSize="sm" color="gray.600">Create your account and start your journey</Text>
        </VStack>

        <form onSubmit={validateCredentials}>
          <VStack gap={4}>
            <HStack gap={4} w="full">
              <Field label="First Name" required>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  size="lg"
                />
              </Field>

              <Field label="Last Name" required>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  size="lg"
                />
              </Field>
            </HStack>

            <Field label="Email address" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='john@example.com'
              />
              <FieldHelperText color="gray.600">
                We'll never share your email with anyone else.
              </FieldHelperText>
            </Field>

            <Field label="Password" required>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Create strong password'
              />
              <FieldHelperText color="gray.600">
                Must be at least 8 characters long
              </FieldHelperText>
            </Field>

            <Button type="submit" w="full" onClick={validateCredentials}>
              <UserPlus size={20} /> Sign up
            </Button>
          </VStack>
        </form>

        <Text mt={8} textAlign="center" fontSize="sm" color="gray.600">
          Already have an account?{' '}
          <ChakraLink
            href='/'
            color="brand.500"
            fontWeight="bold"
            _hover={{ textDecoration: 'underline' }}
          >
            Sign in
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
}
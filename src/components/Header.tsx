import { getProfilePicture } from '@/api/ApiRequests';
import {
    DialogActionTrigger,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle
} from "@/components/ui/dialog";
import { useAuthHelper } from '@/controllers/LoginControl';
import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuSeparator,
    MenuTrigger
} from '@chakra-ui/react';
import { BookOpen, LogOut, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from './ui/color-mode';

interface ErrorMessage {
    response?: {
        message?: string;
    };
}

export default function Header() {
    const { logout } = useAuthHelper()
    const { colorMode, toggleColorMode } = useColorMode()
    const [profilePicCloudUrl, setProfilePicCloudUrl] = useState('')
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const res = await getProfilePicture();
                setProfilePicCloudUrl(res.data)
            } catch (error) {
                console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred")
            }
        }

        fetchProfilePic();
    }, [])

    return (
        <>
            <Box as="header" borderBottomWidth="1px" bg={colorMode === 'dark' ? 'gray.800' : 'white'} position="relative">
                <Container maxW="container.xl" py={4} px={4}>
                    <Flex justify="space-between" align="center">
                        <RouterLink to="/">
                            <Heading as="h1" fontSize="2xl" fontWeight="bold">
                                AI Ebook Reader
                            </Heading>

                        </RouterLink>

                        <MenuRoot>
                            <MenuTrigger
                                aria-label="User menu"
                                asChild >
                                <Avatar.Root size="sm">
                                    <Avatar.Fallback name="User" />
                                    { profilePicCloudUrl && <Avatar.Image src={profilePicCloudUrl} /> }
                                </Avatar.Root>
                            </MenuTrigger>

                            <MenuContent position="absolute" right="2%" top="80%" zIndex="dropdown" >
                                <RouterLink to="/profile">
                                    <MenuItem value='Profile'>
                                        <User size={16} />Profile
                                    </MenuItem>
                                </RouterLink>
                                <RouterLink to="/my-collection">

                                <MenuItem value='My Collection'>
                                    <BookOpen size={16} />My Collection
                                </MenuItem>
                                </RouterLink>
                                <MenuItem value='Feedback'>
                                    <MessageSquare size={16} />Feedback
                                </MenuItem>
                                <MenuItem value={colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    onClick={toggleColorMode}
                                >
                                    {colorMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </MenuItem>
                                <MenuSeparator />

                                <MenuItem onClick={() => setShowLogoutDialog(true)} value='Log out'>
                                    <LogOut size={16} />Log out
                                </MenuItem>


                            </MenuContent>
                        </MenuRoot>
                    </Flex>
                </Container>
            </Box>

            <DialogRoot
                size="sm"
                placement="center"
                open={showLogoutDialog} >
                <DialogContent>
                    <DialogHeader fontSize="lg" fontWeight="bold">
                        <DialogTitle>
                            Are you sure you want to logout?
                        </DialogTitle>
                    </DialogHeader>

                    <DialogBody>
                        You will need to sign in again to access your books and reading progress.
                    </DialogBody>

                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button
                                onClick={() => setShowLogoutDialog(false)}
                                variant="outline">
                                Cancel
                            </Button>
                        </DialogActionTrigger>
                        <Button colorPalette="red" onClick={logout} ml={3}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </>
    )
}
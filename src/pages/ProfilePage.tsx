import { getMyProfileInfo, updateMyProfileInfo, updateProfilePicture } from '@/api/ApiRequests';
import { Field } from '@/components/ui/field';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  createListCollection,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack
} from '@chakra-ui/react';
import { EditIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ErrorMessage {
  response?: {
    message: string;
  };
}

interface UserProfile {
  profilePicCloudUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  country: string;
}

const countries = createListCollection({
  items: [
    { label: "India", id: "IN" },
    { label: "United States", id: "US" },
    { label: "United Kingdom", id: "UK" },
    { label: "Canada", id: "CA" },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.id,
})

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const toast = useToast();

  const fetchUserInfo = async () => {
    try {
      const res = await getMyProfileInfo();
      setProfile(res.data);
    } catch (error) {
      console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
      //   toast({
      //     title: 'Error fetching profile',
      //     description: (error as ErrorMessage)?.response?.message || "An unknown error occurred",
      //     status: 'error',
      //     duration: 5000,
      //     isClosable: true,
      //   });
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateMyProfileInfo({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        dob: profile?.dob,
        country: profile?.country
      });
      setIsEditing(false);
      //   toast({
      //     title: 'Profile updated',
      //     description: 'Your profile has been successfully updated',
      //     status: 'success',
      //     duration: 5000,
      //     isClosable: true,
      //   });
    } catch (error) {
      console.log(error);
      //   toast({
      //     title: 'Update failed',
      //     description: (error as ErrorMessage)?.response?.message || 'Failed to update profile',
      //     status: 'error',
      //     duration: 5000,
      //     isClosable: true,
      //   });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await updateProfilePicture(formData);

        const url = uploadResponse.data;
        setProfile({ ...profile, profilePicCloudUrl: url } as UserProfile);
        // toast({
        //   title: 'Profile picture updated',
        //   status: 'success',
        //   duration: 3000,
        //   isClosable: true,
        // });
      } catch (error) {
        console.error('Error:', (error as ErrorMessage)?.response?.message || "An unknown error occurred");
        // toast({
        //   title: 'Error uploading image',
        //   description: (error as ErrorMessage)?.response?.message || "An unknown error occurred",
        //   status: 'error',
        //   duration: 5000,
        //   isClosable: true,
        // });
      }
    }
  };

  if (!profile) {
    return (
      <Container maxW="container.md" py={8}>
        <Flex justify="center" align="center" h="300px">
          <Heading size="md">Loading profile...</Heading>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card.Root>
        <Card.Header>
          <Flex justify="space-between" align="center">
            {/* <Heading size="lg">Profile</Heading> */}
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                ml="auto"
              >
                <EditIcon />Edit Profile
              </Button>
            )}
          </Flex>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <Flex justify="center">
                <Box position="relative">
                  <Avatar.Root size="2xl">
                    <Avatar.Fallback name={profile.firstName} />
                    <Avatar.Image src={profile.profilePicCloudUrl} />
                  </Avatar.Root>
                  {isEditing && (
                    <IconButton
                      size="sm"
                      position="absolute"
                      bottom={-2}
                      right={-4}
                      rounded="full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <EditIcon />
                      <Input
                        ref={fileInputRef}
                        type="file"
                        id="file-upload"
                        display="none"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </IconButton>
                  )}
                </Box>
              </Flex>

              <Stack gap={4}>

                <HStack gap={4} w="full">
                  <Field label="First Name">
                    <Input
                      id='firstName'
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>

                  <Field label="Last Name">
                    <Input
                      id='lastName'
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Field>
                </HStack>

                <Field label="Email">
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={true}
                  />
                </Field>

                <Field label="Date of Birth">
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    disabled={!isEditing}
                  />
                </Field>


                <SelectRoot
                  id="country"
                  defaultValue={[profile.country]}
                  collection={countries}
                  onValueChange={(e) => setProfile({ ...profile, country: e.value[0] })}
                  disabled={!isEditing}
                >
                  <SelectLabel>
                    Country/Region
                  </SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder='Select a country' />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.items.map((country) => (
                      <SelectItem item={country} key={country.id}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Stack>

              {isEditing && (
                <Flex gap={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flexGrow={1}
                    loading={isSubmitting}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    flexGrow={1}
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Flex>
              )}
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
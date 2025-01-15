'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import apiClient from '@/utils/apiClient'
import { Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface UserProfile {
  profilePicCloudUrl: string
  name: string
  email: string
  dob: string
  country: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profile, setProfile] = useState<UserProfile>()
  const fileInputRef = useRef(null);

  const fetchUserInfo = async () => {
    try {
      const res = await apiClient.get("/user/user-info");
      setProfile(res.data)
    } catch(error) {
      console.log(error.response.message);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await apiClient.post('/user/user-info', {
        name: profile?.name,
        dob: profile?.dob,
        country: profile?.country
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file && file.type.startsWith('image/')) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadResponse = await apiClient.post("/user/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        const url = uploadResponse.data;
        setProfile({ ...profile, profilePicCloudUrl: url })
      } catch (error) {
        console.error('Error:', error.response.data.message)
      }
    }
  }

  return (
    profile &&
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Profile</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.profilePicCloudUrl} alt={profile.name} />
                    {profile.name &&
                      <AvatarFallback>
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    }
                  </Avatar>
                  {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current)
                        fileInputRef.current.click()
                    }}
                  >
                      <Pencil className="h-4 w-4" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </Button>
                  )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country/Region</Label>
                <Select
                  value={profile.country}
                  onValueChange={(value) => setProfile({ ...profile, country: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


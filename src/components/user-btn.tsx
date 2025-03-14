"use client"
import React, { use, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useSession } from 'next-auth/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, User, Shield, CreditCard, ArrowRight, Mail, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Image } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Switch } from './ui/switch'
import EmailForm from './profile/email-form'
import PasswordForm from './profile/password-form'
import ProfileForm from './profile/profile-form'
import DeleteAccount from './profile/delete-account'

const tabs = [
    { name: "Profile", id: 1 },
    { name: "change email", id: 2 },
    { name: "change password", id: 3 },
    { name: "delete account", id: 4 },

]

const UserButton = () => {
    const { data } = useSession()
    const [activeTab, setActiveTab] = useState('profile');
    return (
        <Dialog>

            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>

                </DialogHeader>

                <div className="flex-1">
                    <Tabs
                        defaultValue="profile"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="mb-6 flex space-x-2">
                            <TabsTrigger value="profile" className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="account" className="flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                Account
                            </TabsTrigger>
                          
                        </TabsList>

                        <TabsContent value="profile">

                            <ProfileForm setActiveTab={setActiveTab} />

                        </TabsContent>

                        <TabsContent value="account">
                            <div className="space-y-6">
                                <PasswordForm />
                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="font-medium">Sessions</h4>
                                    <p className="text-sm text-gray-500">
                                        You're currently signed in on this device.
                                        You can sign out of all other devices from here.
                                    </p>
                                    <Button variant="outline" className="mt-2">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Sign out of all devices
                                    </Button>
                                </div>
                                <Separator />
                              <DeleteAccount/>
                            </div>
                        </TabsContent>
                      

                    </Tabs>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default UserButton
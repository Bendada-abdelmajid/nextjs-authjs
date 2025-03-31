"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  User, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PasswordForm from "./password-form";
import ProfileForm from "./profile-form";
import DeleteAccount from "./delete-account";


import { getUserAccounts } from "@/actions/profile/user-accounts";
import { useAuth } from "../auth-provider";

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
};

const ManageAccount = ({ setOpen, open }: Props) => {
    const [activeTab, setActiveTab] = useState("profile");

    const { user } = useAuth()
    const [accounts, setAccounts] = useState<string[] | null>(null)
    useEffect(() => {
        async function getUsers() {
            const res = await getUserAccounts()
            setAccounts(res)
        }
        getUsers()
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>

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
                            <ProfileForm />
                        </TabsContent>
                        <TabsContent value="account">
                            <div className="space-y-6">
                                <PasswordForm />


                                {accounts && accounts?.length > 0 && <>   <Separator /><div className="space-y-2">
                                    <h4 className="font-medium">Connected accounts</h4>
                                    {accounts.map(el => (
                                        <div key={el}>
                                            <div className="flex  gap-2 ">
                                                <h4 className="text-sm capitalize">{el}</h4>
                                                <div>
                                                    <p className="opacity-70 text-sm">•  {user?.email}</p>
                                                    <p className="text-xs ml-2 opacity-60 mt-0.5"
                                                    >This account has been <b>{user?.provider == el ? "connected " : "disconnected"}</b>.</p>
                                                </div>

                                                {/* <Button size={"sm"} variant={"ghost"} className="ml-auto text-xs !text-destructive">Delete</Button> */}
                                            </div>


                                        </div>
                                    ))}

                                </div> </>}
                                <Separator />
                                <DeleteAccount />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ManageAccount;

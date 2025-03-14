"use client"
import { UseCurrentUser } from '@/lib/use-current-user'
import React, { useRef, useState } from 'react'

import { ArrowRight, ImageIcon, TriangleAlert } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { deleteFileFromS3, uploadProfileImage } from '@/actions/uplode-profile-image'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import EmailForm from './email-form'

type Props = {
    setActiveTab: (tab: string) => void
}

const ProfileForm = ({ setActiveTab }: Props) => {
    const user = UseCurrentUser()
    const [upadetEmail, setUpadetEmail] = useState(false)
    const [name, setName] = useState(user?.name)
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber)
    const [error, setError] = useState<string | null>(null)
    const handleSubmit = async () => {

    }
    return (
        <div className="space-y-6">

            <UploadImage />
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" defaultValue={name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Phone number</Label>
                    <Input id="lastName" defaultValue="Doe" />
                </div>
            </div>
            <Button>Save changes</Button>
            <Separator />
            {!upadetEmail ? <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email Address</Label>
                    <Button variant={"link"} onClick={() => setUpadetEmail(true)} size="sm" className='h-6'>Edit <ArrowRight /></Button>
                </div>
                <Input id="email" type="email" defaultValue={user?.email} readOnly />
            </div>
                : <EmailForm cancel={()=> setUpadetEmail(false)} />}


        </div>

    )
}
const UploadImage = () => {
    const user = UseCurrentUser();
    const [image, setImage] = useState(user?.image);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: session, update } = useSession();
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type & size
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Only JPG and PNG are allowed.");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            setError("File size exceeds 3MB limit.");
            return;
        }
        setError(""); // Clear any previous error
        setUploading(true);

        // Show preview before uploading
        const fakeUrl = URL.createObjectURL(file);
        setImage(fakeUrl);

        // Upload file to S3
        const res = await uploadProfileImage(file);
        console.log({ res })
        if (res.error) {
            setError(res.error as string);
        }

        setUploading(false);
    };

    const handleRemove = async () => {

        setError("");
        try {
            await deleteFileFromS3(user.image)
            update({ image: "" })
            setImage(null);
        } catch (error) {
            setError(error as string || "Failed to delete image from S3.");
        }
        if (inputRef.current) {
            inputRef.current.value = ""; // Reset file input
        }
    };

    return (
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 items-start md:items-center">

            <Avatar className="h-24 w-24">

                <AvatarImage src={image} />
                <AvatarFallback className="uppercase">
                    {(user?.name as string)?.slice(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="space-y-1">


                <h4 className="text-sm font-medium">Profile Picture</h4>
                <p className="text-sm text-gray-500">JPG or PNG. Max size of 3MB.</p>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    onChange={handleChange}
                    accept="image/jpeg, image/png"
                />

                <div className="flex space-x-2 mt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>
                    {image && (
                        <Button size="sm" variant="ghost" onClick={handleRemove}>
                            Remove
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ProfileForm
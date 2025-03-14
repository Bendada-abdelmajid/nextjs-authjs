import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPSlot } from '../ui/input-otp';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CircleCheckBig, Loader, TriangleAlert } from 'lucide-react';
import { verifyEmail } from '@/actions/verify-code';

type Props = {
    title: string;
    email: string;
    suuccessFunction: () => void
}

function VerfyEmail({ email, title, suuccessFunction }: Props) {
    const [otp, setOtp] = useState('')
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const sendVerificationCode = async () => {
        const res = await fetch("/api/auth/send-verification-email", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setError(data.message || data.error);
    };
    const verifyCode = async () => {
        setError("")
        setIsLoading(true)
        try {
            const res = await verifyEmail(email, otp);
            if (res.error) {
                setError(res.error);
                return;
            }
            setSuccess(res?.success || null)

            // Automatically log the user in after verification
            suuccessFunction()

            // if (loginResult?.error) {
            //     setError("Login failed after verification.");
            // } else {
            //     router.push("/"); // Redirect to dashboard
            // }
        } catch {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    };
    return (


        <Card className="w-[350px] text-center">
            <CardHeader>
                <CardTitle >{title}</CardTitle>
                <CardDescription>Enter the verification code sent to your email <br />{email}  </CardDescription>
                {success && <div className='bg-green-100 rounded-lg p-3 items-center mt-4 flex gap-4 '>
                    <CircleCheckBig className='text-green-500' />
                    <div className='text-left'>
                        <h4 className='text-xs font-medium'>success</h4>
                        <p className='text-xm opacity-70'>{success}</p>
                    </div>
                </div>}
                {error && <div className='bg-destructive/5 rounded-lg p-3 items-center mt-4 flex gap-4 '>
                    <TriangleAlert className='text-destructive/60' />
                    <div className='text-left'>
                        <h4 className='text-xs font-medium'>Error</h4>
                        <p className='text-xm opacity-70'>{error}</p>
                    </div>
                </div>}
            </CardHeader>
            <CardContent className='flex flex-col  items-center'>
                <InputOTP maxLength={6} value={otp} onChange={(e) => setOtp(e)}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i + "otp"} index={i} className='border rounded-sm' />
                    ))}
                </InputOTP>
                <Button type='button' onClick={sendVerificationCode} variant={"link"} className="text-center mt-2 flex">Didn't receive a code? Resend</Button>
            </CardContent>

            <Button onClick={verifyCode} disabled={isLoading} className="w-[80%] mx-auto">Verify {isLoading && <Loader className='animate-spin' />}</Button>

        </Card>

    )
}

export default VerfyEmail
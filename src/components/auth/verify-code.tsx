"use client";
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPSlot } from '../ui/input-otp';
import { Button } from '../ui/button';
import { CircleCheckBig, Loader, TriangleAlert } from 'lucide-react';
import { verifyEmail } from '@/actions/verify-code';
import { sendVerification } from '@/actions/send-verification';




type Props = {
    title: string;
    email: string;
    setIsValide:(value:boolean)=>void

}

function VerifyCode({ email, title , setIsValide}: Props) {
   
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const resend = async () => {
        try {
            await sendVerification(email)
            setSuccess("Verification email sent with success")
        } catch (error) {
            setError("Failed to send verification email. Please try again later.");
        }
    };
    const verifyCode = async () => {
        setError("")
        setIsLoading(true)
        try {
            const res = await verifyEmail(otp);
            if (res.error) {
                setError(res.error);
                setOtp("")
                return;
            }
            setSuccess(res?.success || null)
             setIsValide(true)
        
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
                <Button type='button' onClick={resend} variant={"link"} className="text-center mt-2 flex">Didn't receive a code? Resend</Button>
            </CardContent>

            <Button onClick={verifyCode} disabled={isLoading} className="w-[80%] mx-auto">Verify {isLoading && <Loader className='animate-spin' />}</Button>

        </Card>

    )
}

export default VerifyCode
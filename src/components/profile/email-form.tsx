import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CircleCheckBig, Edit, Loader, Pencil, TriangleAlert } from 'lucide-react'
import { InputOTP, InputOTPSlot } from '../ui/input-otp'
import { sendVerification } from '@/actions/send-verification'
import { updateEmail } from '@/actions/profile/update-email'



const EmailForm = ({ cancel }: { cancel: () => void }) => {

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [verifyEmail, setVerifyEmail] = useState(false)
    const hundleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        try {
            setIsLoading(true)
            if (email == "") {
                setError("Please enter email")
                return
            }
            await sendVerification(email)
            setVerifyEmail(true)
        } catch (error) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div>

            <form className='space-y-4 bg-secondary/50 rounded-lg p-4' onSubmit={hundleSubmit}>

                <div>
                    <h4 className='font-medium'>Update email address</h4>
                    <div className='text-sm flex  text-orange-500 mt-2'> <TriangleAlert className='inline-flex self-center mr-1' size={16} />
                        <p>You'll need to verify this email address before it can be added to your account.</p></div>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {error && <div className='bg-destructive/5 rounded-lg p-3 items-center mt-4 flex gap-4 '>
                    <TriangleAlert className='text-destructive/60' />
                    <div className='text-left'>
                        <h4 className='text-xs font-medium'>Error</h4>
                        <p className='text-xm opacity-70'>{error}</p>
                    </div>
                </div>}
                <div className="flex justify-end items-center gap-2">
                    <Button disabled={isLoading} type='button' onClick={cancel} variant={"outline"} className='min-w-20'>Cancel </Button>
                    <Button disabled={isLoading} className='min-w-20'>Update {isLoading && <Loader className='animate-spin' />}</Button>
                </div>
            </form>
            {verifyEmail && <VerifyEmail email={email} setVerifyEmail={setVerifyEmail} />}
        </div>

    )
}
const VerifyEmail = ({ email, setVerifyEmail }: { email: string, setVerifyEmail: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const verifyCode = async () => {
        setError("")
        setSuccess("")
        setIsLoading(true)
        try {

            const res = await updateEmail(email, otp)
            if (res.error) {
                setError(res.error)
                return
            }
            setSuccess(res?.success || 'Email updated successfully!')
            setTimeout(() => {
                setVerifyEmail(false)
            }, 1000);
        } catch (error) {
            console.log(error)
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <div className='absolute h-full w-full inset-0 bg-black/20 z-20' />
            <div className='absolute p-5 w-full max-w-sm  bg-white z-30 border rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <CardHeader className='text-center'>
                    <CardTitle >Verify your email</CardTitle>
                    <CardDescription>Enter the verification code sent to
                        your email <br />{email} <button onClick={() => setVerifyEmail(false)} className='cursor-pointer inline-flex p-1 align-middle opacity-70 hover:opacity-100'><Pencil size={16} /></button>  </CardDescription>
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
                <CardContent className='flex flex-col items-center mt-4 '>
                    <InputOTP maxLength={6} value={otp} onChange={(e) => setOtp(e)}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot key={i + "otp"} index={i} className='border rounded-sm' />
                        ))}
                    </InputOTP>
                    <Button type='button' variant={"link"} className=" mt-2 text-center flex">Didn't receive a code? Resend</Button>
                </CardContent>

                <Button disabled={isLoading} onClick={verifyCode} className="mx-auto flex mt-2">Verify {isLoading && <Loader className='animate-spin' />}</Button>
            </div>
        </>
    )
}
export default EmailForm
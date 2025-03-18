"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { CircleCheckBig, Eye, EyeOff, Loader, Pencil, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendCodeForPasswordReset } from '@/actions/resset-password';
import { checkEmail } from '@/actions/login';
import { Span } from 'next/dist/trace';
import { LoginSteps } from '@/lib/types';

type Props = {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;

     setActive: Dispatch<SetStateAction<LoginSteps>>;
}

const SignInForm = ({ email, password, setEmail, setPassword, setActive }: Props) => {
    const searchParams = useSearchParams();
    const [validEmail, setValidEmail] = useState(false)
    const [seePassword, setSeePassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const errorParam = searchParams.get("error");

        if (errorParam === "OAuthAccountNotLinked") {
            setError("Email already used in a different provider");
        } else {
            setError(null);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {

            if (validEmail) {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                })

                const data = await response.json()
                console.log({ data })
                if (!response.ok) {
                    if (data.error === "EmailNotVerified") {
                        setError("Email not verified,  New verification link sent.")
                        setActive("verify-email")
                    } else {
                        setError(data.error || "Something went wrong")
                    }


                    return
                }
                if (data.success && data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                const res = await checkEmail(email)
                if (res.error) {
                    setError(res.error)
                    return

                }
                if (res.success) {
                    setValidEmail(true)
                }

            }

        } catch {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }

    }
    const handleForgetPassword = async () => {
        setSuccess(null)
        setError("")
        const res = await sendCodeForPasswordReset(email)
        if (res.error) {
            setError(res.error)
            return
        }
        if (res.success) {
            setSuccess(res.success)
            setActive("send-password-code")
        }
    }

    const handleOAuthSignIn = async (provider: string) => {
        setError("") // Reset error state
        try {
            await signIn(provider).catch(err => console.log(err)) // No response object
        } catch (error) {
            console.error("OAuth SignIn Error:", error)
            setError((error as Error)?.message || "Something went wrong")
        }
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <Card className="w-full max-w-sm ">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{!validEmail ? "Welcome back" : "Enter your password"}</CardTitle>
                    <CardDescription>{validEmail ? <><span>Enter the password associated with your account  {email}</span> <button onClick={() => setValidEmail(false)} className='cursor-pointer inline-flex p-1 align-middle opacity-70 hover:opacity-100'><Pencil size={16} /></button>  </> : "Login with your Apple or Google account"} </CardDescription>
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
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {!validEmail && <><div className="flex flex-col gap-4">
                                <Button type='button' onClick={() => handleOAuthSignIn("linkedin")} variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Linkedin
                                </Button>
                                <Button type='button' onClick={() => handleOAuthSignIn("google")} variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Login with Google
                                </Button>
                            </div>
                                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                    <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div> </>}
                            <div className="grid gap-6">
                                {!validEmail ? <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
                                </div> :
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <Button variant={"link"} size={"sm"} onClick={handleForgetPassword} type='button' className="ml-auto text-sm ">
                                                Forgot your password?
                                            </Button>
                                        </div>
                                        <div className='relative'>
                                            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className='pr-10' type={seePassword ? "text" : "password"} required />
                                            <Button onClick={() => setSeePassword(prev => !prev)} type='button' className='absolute hover:bg-transparent top-0 right-0' size={"icon"} variant={"ghost"}>
                                                {seePassword ? (<EyeOff size={16} />) : (<Eye size={16} />)}
                                            </Button>
                                        </div>

                                    </div>}
                                <Button type="submit" className="w-full">
                                    {validEmail ? "Login" : "Continue"}  {isLoading && <Loader size={17} className="animate-spin" />}
                                </Button>
                            </div>
                            {validEmail ? <Button variant={"link"} onClick={() => setValidEmail(false)}>Back</Button> : <div className="text-center text-sm">
                                Don&apos;t have an account? <Link href="/auth/signup" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>}
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}

export default SignInForm
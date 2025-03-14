
import Link from 'next/link';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Eye, EyeOff, Loader, TriangleAlert } from 'lucide-react';

type Props = {
  email: string;
  setEmail: (email: string) => void;
  name: string;
  setName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setVerifyEmail: (verifyEmail: boolean) => void;
}

const SignupForm = ({ email, password, name, setEmail, setPassword, setName, setVerifyEmail }: Props) => {
  const [error, setError] = useState("")
  const [seePassword, setSeePassword] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Something went wrong")
        return
      }
      setVerifyEmail(true)
    } catch {
      setError("Something went wrong")
    } finally { 
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-sm ">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
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
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" className="w-full">
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
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">user</Label>

                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>

                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">

                  <Label htmlFor="password">Password</Label>

                  <div className='relative'>
                    <Input id="password" className='pr-10' value={password} onChange={(e) => setPassword(e.target.value)} type={seePassword ? "text" : "password"} required />
                    <Button onClick={() => setSeePassword(prev => !prev)} type='button' className='absolute hover:bg-transparent top-0 right-0' size={"icon"} variant={"ghost"}>
                      {seePassword ? (<EyeOff size={16} />) : (<Eye size={16} />)}
                    </Button>
                  </div>

                </div>
                <Button disabled={isLoading} type="submit" className="w-full gap-2">
                  Login {isLoading && <Loader size={17} className="animate-spin"/>}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?
                <Link href="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Username
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign up
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Already have an account?{" "}
                <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div> */}
    </>
  )

}

export default SignupForm
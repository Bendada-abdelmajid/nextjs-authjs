"use client"

import { useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import SignupForm from "@/components/auth/signup-form"
import VerfyEmail from "@/components/auth/verfy-email"
import { signIn, useSession } from "next-auth/react"



export default function SignUp() {
  const router = useRouter()
  const { data } = useSession()
  console.log({ data })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verifyEmail, setVerifyEmail] = useState(false);
  const signin = async ()=>{
    const loginResult = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
    });

}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {!verifyEmail ?
        <SignupForm email={email} password={password} name={name} setEmail={setEmail} setName={setName} setPassword={setPassword} setVerifyEmail={setVerifyEmail} />
        : <VerfyEmail title="Verify your email" email={email} suuccessFunction={signin} />}
    </div>
  )
}
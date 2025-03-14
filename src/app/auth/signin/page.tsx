"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import SignInForm from "@/components/auth/signin-form"
import VerfyEmail from "@/components/auth/verfy-email"
import ResetPasswordForm from "@/components/auth/reset-password-form"
import { LoginSteps } from "@/lib/types"

export default function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [active, setActive]= useState<LoginSteps>("login")

 



    const signin = async () => {
        const loginResult = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });

    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {active == "login" && <SignInForm email={email} password={password} setEmail={setEmail} setPassword={setPassword} setActive={setActive} />}
            {active == "verify-email" && <VerfyEmail title="Verify your email" email={email} suuccessFunction={signin} />}
            {active == "send-password-code" && <VerfyEmail title="Reset password" email={email} suuccessFunction={()=> setActive("reset-password")} />}
            {active == "reset-password" && <ResetPasswordForm setActive={setActive} email={email}/>}

        </div>
    )
}
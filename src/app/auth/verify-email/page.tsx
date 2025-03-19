import VerifyEmail from '@/components/auth/verify-email'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import React from 'react'



const page = async () => {
    const cookieStore = await cookies();
    const email = cookieStore.get("login_email")?.value;
    const password = cookieStore.get("login_password")?.value;

    if (!email || !password) redirect("/auth/sign-up");

    return (
        <VerifyEmail title="Verify your email" email={email} password={password} />
    )
}

export default page
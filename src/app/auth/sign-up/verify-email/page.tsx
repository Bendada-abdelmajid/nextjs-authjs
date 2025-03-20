import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import React from 'react'
import VerifyCode from '@/components/auth/verify-code';
import { verifyEmail } from '@/actions/auth/register';




const page = async () => {
    const cookieStore = await cookies();
    const email = cookieStore.get("login_email")?.value;
    const password = cookieStore.get("login_password")?.value;
    if (!email || !password) redirect("/auth/sign-up");

    return (
        <VerifyCode
            email={email}
            title="Verify your email"
            onVerify={verifyEmail}

        />

    )
}

export default page
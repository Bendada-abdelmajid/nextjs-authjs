
import React from 'react'
import { redirect } from 'next/navigation';
import FactorOneForm from '@/components/auth/factor-one-form';
import { cookies } from 'next/headers';

const page = async () => {
    const email = (await cookies())?.get("login_email")?.value;
    console.log(email)
    if (!email) redirect("/auth/sign-in");
  return (
    <FactorOneForm email={email}/>
  )
}

export default page
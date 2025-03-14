import { auth } from '@/auth'
import ProfileForm from '@/components/profile/profile-form'


import React from 'react'


const Page = async () => {
   const session = await auth()

    return (
        <ProfileForm user={session?.user}/>
    )
}

export default Page
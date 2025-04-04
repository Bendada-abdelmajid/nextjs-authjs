import { ShieldUser } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { SignedIn, SignedOut } from '../auth'
import UserButton from '../profile/user-btn'



const Header = () => {
    return (
        <header className="flex py-5 top-0 sticky z-20 bg-background justify-between items-center">
            <Link href={"/"}><ShieldUser strokeWidth={1.3} size={24} />
            </Link>
            <div className="flex items-center gap-5">
                <Link href={"#features"} className="text-sm">
                    Features
                </Link>
                <Link href={"#guides"} className="text-sm">
                    Guides
                </Link>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <Button size={"sm"} asChild>
                        <Link href={"/auth/sign-in"}>Login</Link>
                    </Button>
                </SignedOut>
            </div>
        </header>
    )
}

export default Header
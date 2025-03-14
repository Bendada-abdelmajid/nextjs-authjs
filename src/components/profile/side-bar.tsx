import Link from 'next/link'
import React from 'react'

const links = [
    { name: "change name", href: "/account-settings" },
    { name: "change email", href: "/account-settings/change-email" },
    { name: "change password", href: "/account-settings/change-password" },
    { name: "delete account", href: "/account-settings/delete-account" },

]

const SideBar = () => {
    return (
        <div className='w-2xs p-5 h-screen sticky top-0 flex flex-col justify-center gap-3'>
            {links.map((link, index) => (
                <Link href={link.href} key={index} className="w-full flex gap-3 group px-3 items-center ">
                    <span className='size-1 rounded-full bg-muted block transition-all duration-300  group-hover:scale-125 group-hover:bg-primary' />
                    <p className='text-left font-medium text-sm capitalize opacity-60 group-hover:opacity-100 transition-colors duration-300 '>{link.name} </p>
                </Link>
            ))}

        </div>
    )
}

export default SideBar
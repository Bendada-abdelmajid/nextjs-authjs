"use client"
import React, { useState } from 'react'

import { Button } from '../ui/button'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { UseCurrentUser } from '@/lib/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import ThemeSwitch from '../theme-switch';
import ManageAccount from './manage-account';
import { signOut } from 'next-auth/react';

const UserButton = () => {
    const user = UseCurrentUser();
    const [openMangeAccount, setOpenManageAccount]= useState(false)

    return (
<>
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button size={"icon"} variant={"ghost"} className='rounded-full size-9'>
                    <Avatar className="size-9">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="uppercase">
                            {(user?.name as string)?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
               
                <div className="flex gap-4 px-3 py-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback className="uppercase">
                            {(user?.name as string)?.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className='text-sm '>{user?.name}</h4>
                        <p className='text-xs mt-1 line-clamp-1 max-w-full overflow-hidden'>{user?.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>setOpenManageAccount(true)} className='px-3.5 py-2'>
                    <Settings /> Manage Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> signOut()} className='px-3.5 py-2 hover:text-destructive'>
                    <LogOut /> Sign out
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex justify-between py-1 px-3">
                    <h4 className='text-sm'>Theam</h4>
                    <ThemeSwitch className='gap-2'/>
                </div>

            </DropdownMenuContent>


        </DropdownMenu>
        {openMangeAccount && <ManageAccount open={openMangeAccount} setOpen={setOpenManageAccount}/>}
</>
    )
}

export default UserButton
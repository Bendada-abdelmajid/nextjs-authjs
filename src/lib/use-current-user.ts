"use client"
import { useSession } from "next-auth/react";

export const UseCurrentUser= ()=>{
    const session = useSession();
    console.log("user:",session)
    return session.data?.user
}
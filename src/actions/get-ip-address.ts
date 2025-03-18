"use server";

import { headers } from "next/headers";
import { ipAddress } from '@vercel/functions';


export const getIp=async()=>{
    const headersInstance = await headers();
    const ip = ipAddress(headersInstance);
    console.log({ip})
    return ip
}

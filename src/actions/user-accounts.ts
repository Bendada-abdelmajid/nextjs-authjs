"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getUserAccounts = async ()=>{
   const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    const accounts = await prisma.account.findMany({
        where: { userId:userId },
        select: { provider: true },
    })
    return accounts.map(el=> el.provider)
}
"use server";

import { headers } from "next/headers";


export const getIp = async () => {
  const headersInstance = await headers();
  const ip = headersInstance.get("x-forwarded-for");
  const city = headersInstance.get("x-vercel-ip-city") || "Unknown";
  const country = headersInstance.get("x-vercel-ip-country") || "Unknown";
  const region = headersInstance.get("x-vercel-ip-country-region") || "Unknown";
  const code = headersInstance.get("'x-vercel-ip-postal-code')") || "Unknown";
  console.log({ ip, city, country, region, code });
  return "complete";
};

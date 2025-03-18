import UserButton from "@/components/profile/user-btn";
import { Button } from "@/components/ui/button";
import { Copy, Github, ShieldUser } from "lucide-react";

import Link from "next/link";

import ThemeSwitch from "@/components/theme-switch";
import CopyToClipboard from "@/components/home/copy-to-clipboard";
import Header from "@/components/home/header";

import Hero from "@/components/home/hero";
import Footer from "@/components/home/footer";
import Guides from "@/components/home/guides";
import Features from "@/components/home/features";


export default function Home() {
  return (
    <main className="w-full max-w-3xl px-5 mx-auto">
      <Header/>
     <Hero/>
   <Features/>
   <Guides/>
   <Footer/>
     

    
    </main>
  );
}

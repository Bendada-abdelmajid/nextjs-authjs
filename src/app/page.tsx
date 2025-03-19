

import Header from "@/components/home/header";

import Hero from "@/components/home/hero";
import Footer from "@/components/home/footer";
import Guides from "@/components/home/guides";
import Features from "@/components/home/features";



export default async function Home() {

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

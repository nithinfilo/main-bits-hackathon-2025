import { Suspense } from 'react'
import Hero from "@/components/Hero";
import { getSEOTags } from '@/libs/seo'


export const metadata = getSEOTags({
  title: "Hackathon BITS 2025",
  canonicalUrlRelative: "/",
});




export default function Home() {
  return (
    <>
    
<Suspense>
      <main>

        <Hero/>
        
      </main>
      </Suspense>

    </>
  );
}
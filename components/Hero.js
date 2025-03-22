'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

export default function Hero() {
  return (
    <div className="relative w-full bg-background border-b overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        variants={floatingVariants} 
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        variants={floatingVariants} 
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div 
        className="absolute top-10 right-10 w-52 h-52 bg-secondary/10 rounded-full blur-3xl"
        variants={floatingVariants} 
        animate="animate"
        transition={{ delay: 2 }}
      />
      
      {/* Content Container */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl tracking-tight lg:text-7xl font-bold text-center max-w-[800px] mb-6">
            Hackathon
            <br />
            <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              BITS 2025
            </span>
          </h1>
          <p className="text-muted-foreground text-md md:text-xl text-center max-w-[600px] mb-12">
            The #1 AI Data Analyst <br/>
            All you need to analyze your data <span className="underline whitespace-nowrap decoration-wavy text-lg md:text-2xl font-semibold decoration-primary/80">10x faster</span>
          </p>  
          <Button asChild><a href="/dashboard">Go to dashboard</a></Button>
        </div>
      </div>
    </div>
  );
}

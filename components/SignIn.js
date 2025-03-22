'use client'
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const SignIn = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [errorType, setErrorType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const type = searchParams.get('type');
    
    if (error) {
      setErrorType(error);
    } else if (type === 'email') {
      setShowVerification(true);
    }
  }, [searchParams]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("email", {
        email,
        redirect: false,
      });
      if (result?.ok) {
        setVerificationEmail(email);
        setShowVerification(true);
        setErrorType(null);
      }
    } catch (error) {
      console.error("Error signing in with email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (errorType) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background py-12 px-4 overflow-hidden">
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
        
        <div className="relative max-w-md w-full space-y-8 z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Link Expired</h1>
            <p className="text-muted-foreground">Request a new sign in link to continue</p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow border border-primary/10 text-center space-y-4">
            <div className="py-2 text-2xl">❌</div>
            <div>
              <h2 className="text-xl font-bold">Invalid or Expired Link</h2>
              <p className="text-muted-foreground">The sign in link is no longer valid.<br />Please request a new sign-in link</p>
            </div>
            <Button
              className="w-full bg-gradient-to-br from-primary via-primary/80 to-primary/50"
              onClick={() => {
                setErrorType(null);
                setShowVerification(false);
              }}
            >
              Try signing in again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-background py-12 px-4 overflow-hidden">
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
        
        <div className="relative max-w-md w-full space-y-8 z-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">Check your email to complete sign in</p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow border border-primary/10 text-center space-y-4">
            <div className="py-2 text-2xl text-primary">✓</div>
            <div>
              <h2 className="text-xl font-bold">Check your inbox</h2>
              <p className="text-muted-foreground">We sent a magic link to<br />
                <span className="font-medium bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                  {verificationEmail}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  setIsLoading(true);
                  signIn("email", {
                    email: verificationEmail,
                    redirect: false,
                  }).finally(() => setIsLoading(false));
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend email'}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full hover:bg-primary/5"
                onClick={() => {
                  setShowVerification(false);
                  setVerificationEmail("");
                  setEmail("");
                }}
              >
                Use a different email
              </Button>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                The link in the email will expire after 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background py-12 px-4 overflow-hidden">
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
      
      <div className="relative max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">Enter your email to sign in</p>
        </div>
        
        <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow border border-primary/10">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-primary/20 focus-visible:ring-primary/50"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-primary via-primary/80 to-primary/50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Continue with Email'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
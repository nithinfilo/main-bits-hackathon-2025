/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";

// A button component to either sign in, sign out, or redirect to the dashboard.
// If authenticated, the user can either log out or go to the dashboard.
const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    if (status === "authenticated") {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
  };

  if (status === "authenticated") {
    return (
      <div className={`flex items-center space-x-4 ${extraStyle ? extraStyle : ""}`}>
        <Link
          href={config.auth.callbackUrl}
          className="btn flex items-center"
        >
          {session.user?.image ? (
            <img
              src={session.user?.image}
              alt={session.user?.name || "Account"}
              className="w-6 h-6 rounded-full shrink-0"
              referrerPolicy="no-referrer"
              width={24}
              height={24}
            />
          ) : (
            <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
            </span>
          )}
          <span className="ml-2">{session.user?.name || session.user?.email || "Account"}</span>
        </Link>
        <button className="btn btn-secondary" onClick={handleSignOut}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={handleSignIn}
    >
      {text}
    </button>
  );
};

export default ButtonSignin;

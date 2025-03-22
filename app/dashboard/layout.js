import { getServerSession } from "next-auth";

import config from "@/config";

import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import mongoose from "mongoose";
import { redirect } from 'next/navigation';
import ButtonAccount from "@/components/ButtonAccount";
import React from "react";


// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {

  

  await connectMongo();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }
  
  // Check if the session user id is a valid ObjectId
  let userId;
  if (mongoose.Types.ObjectId.isValid(session.user.id)) {
    userId = new mongoose.Types.ObjectId(session.user.id);
  } else {
    throw new Error("Invalid user ID format");
  }
  
  const user = await User.findById(userId);
  
  // Check subscription status and redirect if not valid


  if (!user.hasAccess || user.hasAccess === false) {
    redirect('/#pricing');
    return null; // Return null to prevent further rendering
  }

  return <>{children}</>;
}
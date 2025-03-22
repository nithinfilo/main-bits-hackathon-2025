// app/api/credits/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/libs/next-auth';
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const { action, amount } = await req.json();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === 'deduct') {
      if (user.credits < amount) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
      }
      user.credits -= amount;
    } else if (action === 'add') {
      user.credits += amount;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await user.save();

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.error("Error updating user credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
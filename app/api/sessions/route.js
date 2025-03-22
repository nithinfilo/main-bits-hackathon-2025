// app/api/sessions/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/libs/next-auth';
import connectMongo from "@/libs/mongoose";
import Session from "@/models/Session";
import User from "@/models/User";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const { datasetUrl } = await req.json();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deduct credits for creating a new session
    if (user.credits < 5) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }
    user.credits -= 5;
    await user.save();

    const newSession = new Session({
      userId: user._id,
      datasetUrl,
    });

    await newSession.save();

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const userSessions = await Session.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
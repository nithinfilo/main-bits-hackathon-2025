// app/api/sessions/[id]/goals/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/libs/next-auth';
import connectMongo from "@/libs/mongoose";
import Session from "@/models/Session";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const { id } = params;
    const userSession = await Session.findById(id);

    if (!userSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(userSession.goals || []);
  } catch (error) {
    console.error("Error fetching session goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
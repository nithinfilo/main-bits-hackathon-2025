// app/api/sessions/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/libs/next-auth';
import connectMongo from "@/libs/mongoose";
import Session from "@/models/Session";
import { ObjectId } from 'mongodb';

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

    return NextResponse.json(userSession);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const { id } = params;
    const updateData = await req.json();
    
    const updatedSession = await Session.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
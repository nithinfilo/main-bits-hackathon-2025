// app/api/sessions/[id]/visualizations/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/libs/next-auth';
import connectMongo from "@/libs/mongoose";
import Session from "@/models/Session";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();

  try {
    const { id } = params;
    const visualizationData = await req.json();

    const updatedSession = await Session.findByIdAndUpdate(
      id,
      { 
        $push: { 
          visualizations: visualizationData 
        } 
      },
      { new: true }
    );

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Visualization saved successfully" });
  } catch (error) {
    console.error("Error saving visualization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
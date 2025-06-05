export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { generateAIResponse } from "@/lib/gemini";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // Get the most recent chat document sorted by updatedAt descending
    const chats = await db
      .collection("chats")
      .find({})
      .sort({ updatedAt: -1 }) // sort by updatedAt to get latest chat
      .limit(1)
      .toArray();

    const latestChat = chats[0];

    return NextResponse.json(
      { messages: latestChat?.messages || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("test");

    const userMessage = {
      id: "id-" + Math.random().toString(36).substring(2, 11),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    const aiResponse = await generateAIResponse(message);

    const aiMessage = {
      id: "id-" + Math.random().toString(36).substring(2, 11),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    const chat = await db
      .collection("chats")
      .findOne({}, { sort: { updatedAt: -1 } });

    if (chat) {
      await db.collection("chats").updateOne(
        { _id: new ObjectId(chat._id) },
        {
          $push: {
            messages: {
              $each: [userMessage, aiMessage],
            },
          },
          $set: {
            updatedAt: new Date(),
          },
        } as any // workaround to suppress TS error
      );
    } else {
      await db.collection("chats").insertOne({
        messages: [userMessage, aiMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ userMessage, aiMessage }, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // for generating a unique session ID

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    // Process the file (save to disk, DB, etc.)
    const success = true
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer)
    console.log(uint8Array)

    if (!success) {
      return NextResponse.json(
        { error: "File could not be processed" },
        { status: 422 }
      );
    }

    // Generate a session ID
    const sessionId = uuidv4();

    // Create response with JSON
    const response = NextResponse.json({
      message: "Upload Success",
      filename: file.name,
      timestamp: Date.now(),
    });

    // Set HTTP-only cookie (secure and inaccessible to JS)
    response.cookies.set({
      name: "sessionid",
      value: sessionId,
      httpOnly: true,
      path: "/",         // cookie is valid for entire site
      maxAge: 60 * 60,   // 1 hour
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "lax",   // CSRF protection
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

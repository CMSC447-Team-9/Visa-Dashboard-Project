import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json({ message: "Logged out" });

  // Clear the session cookie
  response.cookies.set({
    name: "sessionid",
    value: "",
    maxAge: 0,
    path: "/",        // same path as cookie was set
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
};

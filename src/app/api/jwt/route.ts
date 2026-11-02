import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // Signs the token using the secret from your .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }
}
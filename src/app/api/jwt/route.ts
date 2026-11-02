import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await req.json();
    const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ message: "Failed to generate token" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const phone = process.env.WHATSAPP_PHONE;
  if (!phone) {
    return NextResponse.json({ error: "Whatsapp phone is not set" }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message");
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return NextResponse.redirect(url);
};

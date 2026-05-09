import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/auth-cookie-response";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearTokenCookie(res);
  return res;
}

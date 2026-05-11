import { NextResponse } from "next/server";
import type { AnnonceRow } from "@/lib/annonce-types";
import { supabaseRest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const safe = encodeURIComponent(id);
  const { data, status } = await supabaseRest<AnnonceRow[]>(
    `/annonces?select=*&id=eq.${safe}&limit=1`,
    { method: "GET" },
  );

  if (status >= 400) {
    return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
  }
  const annonce = Array.isArray(data) ? data[0] : null;
  if (!annonce) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  return NextResponse.json({ annonce });
}


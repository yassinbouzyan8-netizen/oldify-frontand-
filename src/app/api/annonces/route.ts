import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import type { AnnonceRow, CreateAnnonceInput } from "@/lib/annonce-types";
import { supabaseRest } from "@/lib/supabase-rest";

export const runtime = "nodejs";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mine = url.searchParams.get("mine") === "1";
  const status = url.searchParams.get("status");

  const user = mine ? await getCurrentUser() : null;
  if (mine && !user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const filters: string[] = [];
  if (mine && user) filters.push(`owner_id=eq.${encodeURIComponent(user.id)}`);
  if (status) filters.push(`status=eq.${encodeURIComponent(status)}`);

  const qs = [
    "select=*",
    "order=created_at.desc",
    ...filters,
  ].join("&");

  const { data, status: code } = await supabaseRest<AnnonceRow[]>(
    `/annonces?${qs}`,
    { method: "GET" },
  );

  if (code >= 400) {
    return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
  }

  return NextResponse.json({ annonces: data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: CreateAnnonceInput;
  try {
    body = (await request.json()) as CreateAnnonceInput;
  } catch {
    return badRequest("Corps JSON invalide.");
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const condition =
    typeof body.condition === "string" ? body.condition.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const price =
    typeof body.price === "number" ? body.price : Number(body.price);
  const delivery = Boolean(body.delivery);
  const images = Array.isArray(body.images)
    ? body.images.filter((x) => typeof x === "string").slice(0, 8)
    : [];

  if (!title || !category || !condition || !description || !city) {
    return badRequest("Champs requis manquants.");
  }
  if (!Number.isFinite(price) || price < 0) {
    return badRequest("Prix invalide.");
  }

  const payload = {
    owner_id: user.id,
    title,
    category,
    condition,
    description,
    price,
    city,
    delivery,
    images,
    status: "en-ligne",
  };

  // Prefer: return created row (PostgREST)
  const { data, status: code } = await supabaseRest<AnnonceRow[]>(
    "/annonces?select=*",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    },
  );

  if (code >= 400) {
    return NextResponse.json(
      { error: "Impossible de créer l’annonce. Vérifie la migration SQL et la clé service role." },
      { status: 500 },
    );
  }

  const created = Array.isArray(data) ? data[0] : null;
  return NextResponse.json({ annonce: created });
}


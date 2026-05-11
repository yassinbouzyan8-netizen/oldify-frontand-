import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";

export const runtime = "nodejs";

function getSupabaseStorageEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Supabase env manquant (NEXT_PUBLIC_SUPABASE_URL + clé publishable/anon).",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

function extFromType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData invalide." }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Aucun fichier." }, { status: 400 });
  }
  if (files.length > 8) {
    return NextResponse.json({ error: "Max 8 photos." }, { status: 400 });
  }

  const { url, key } = getSupabaseStorageEnv();
  const uploaded: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Formats images uniquement." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Chaque image doit faire ≤ 10 Mo." }, { status: 400 });
    }
    const ext = extFromType(file.type);
    const objectPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
    // Upload binaire (Storage) — PUT recommandé
    const endpoint = `${url}/storage/v1/object/annonces/${objectPath}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: await file.arrayBuffer(),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json(
        { error: `Upload échoué: ${res.status} ${txt.slice(0, 200)}` },
        { status: 500 },
      );
    }

    const publicUrl = `${url}/storage/v1/object/public/annonces/${objectPath}`;
    uploaded.push(publicUrl);
  }

  return NextResponse.json({ urls: uploaded });
}


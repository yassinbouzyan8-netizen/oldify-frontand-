type SupabaseEnv = {
  url: string;
  key: string;
};

function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL est manquant (.env).");
  }
  const key = serviceRoleKey || publicKey;
  if (!key) {
    throw new Error(
      "Clé Supabase manquante. Ajoute NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

export async function supabaseRest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; status: number }> {
  const { url, key } = getSupabaseEnv();
  const endpoint = `${url}/rest/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(init?.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  headers.set("Accept", "application/json");
  if (init?.method && init.method !== "GET" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(endpoint, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as T) : (null as T);
  return { data: json, status: res.status };
}


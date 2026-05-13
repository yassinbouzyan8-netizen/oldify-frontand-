type SupabaseEnv = {
  url: string;
  serviceRoleKey: string;
};

function getSupabaseAdminEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL est manquant (.env).");
  }
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Ajoute-le dans `.env.local` (serveur) pour l’auth custom.",
    );
  }
  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

export async function supabaseAdminRest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T; status: number }> {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();
  const endpoint = `${url}/rest/v1${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(init?.headers);
  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
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

/** Compte exact PostgREST (`Prefer: count=exact`) sans charger les lignes. */
export async function supabaseAdminExactCount(
  pathWithQuery: string,
): Promise<number | null> {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();
  const endpoint = `${url}/rest/v1${pathWithQuery.startsWith("/") ? "" : "/"}${pathWithQuery}`;

  const res = await fetch(endpoint, {
    method: "HEAD",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "count=exact",
    },
    cache: "no-store",
  });

  const cr = res.headers.get("content-range");
  if (!cr) return null;
  const totalPart = cr.split("/")[1];
  if (!totalPart || totalPart === "*") return null;
  const n = Number.parseInt(totalPart, 10);
  return Number.isFinite(n) ? n : null;
}


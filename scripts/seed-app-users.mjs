/**
 * Seed many `app_users` + `app_profiles` rows (same password hash as Oldify `/api/auth/register`).
 *
 * Prérequis : `.env` à la racine avec `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
 *
 * Usage (PowerShell, depuis la racine du projet) :
 *   node scripts/seed-app-users.mjs
 *
 * Options (variables d’environnement) :
 *   SEED_USER_COUNT=30     — nombre de comptes (défaut : 30 ; max liste réaliste : voir JSON)
 *   SEED_PASSWORD=xxx      — mot de passe commun (défaut : OldifyDemo123!)
 *   SEED_USE_DEMO_LOCAL=true — emails demo-XX@oldify-demo.local au lieu des mails « réalistes »
 *   SEED_EMAIL_PREFIX=demo — utilisé seulement si SEED_USE_DEMO_LOCAL=true
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";

function loadEnvFile() {
  const path = join(process.cwd(), ".env");
  let text = "";
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error("Fichier .env introuvable à la racine du projet.");
    process.exit(1);
  }
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

async function rest(env, path, init) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const url = `${base}/rest/v1${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const envMap = loadEnvFile();
  const url = envMap.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = envMap.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis dans .env",
    );
    process.exit(1);
  }
  const env = { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key };

  const count = Math.max(
    1,
    Math.min(500, Number(process.env.SEED_USER_COUNT) || 30),
  );
  const password = process.env.SEED_PASSWORD || "OldifyDemo123!";
  const useDemoLocal = process.env.SEED_USE_DEMO_LOCAL === "true";
  const prefix = (process.env.SEED_EMAIL_PREFIX || "demo").replace(/[^a-z0-9-]/gi, "");

  const accountsPath = join(process.cwd(), "scripts", "seed-realistic-accounts.json");
  let realistic = [];
  try {
    realistic = JSON.parse(readFileSync(accountsPath, "utf8"));
  } catch {
    console.warn("seed-realistic-accounts.json introuvable, mode demo local forcé.");
  }

  console.log(`Création de ${count} utilisateur(s)…`);
  console.log(`Mot de passe commun : ${password}`);
  if (useDemoLocal || realistic.length === 0) {
    const lastNum = String(count).padStart(2, "0");
    console.log(`Emails (démo) : ${prefix}-01@oldify-demo.local … ${prefix}-${lastNum}@oldify-demo.local\n`);
  } else {
    const cap = Math.min(count, realistic.length);
    console.log(
      `Emails réalistes (scripts/seed-realistic-accounts.json), ${cap} compte(s) listé(s).\n`,
    );
  }

  let created = 0;
  let skipped = 0;

  for (let n = 1; n <= count; n++) {
    const num = String(n).padStart(2, "0");
    let email;
    let fullName;
    if (useDemoLocal || realistic.length === 0) {
      email = `${prefix}-${num}@oldify-demo.local`.toLowerCase();
      fullName = `Démo ${prefix} ${num}`;
    } else if (n <= realistic.length) {
      const row = realistic[n - 1];
      email = String(row.email).trim().toLowerCase();
      fullName = String(row.fullName ?? "").trim() || email.split("@")[0];
    } else {
      const pad3 = String(n).padStart(3, "0");
      email = `oldify.vendeur.${pad3}@gmail.com`.toLowerCase();
      fullName = `Vendeur Oldify ${pad3}`;
    }

    const exists = await rest(
      env,
      `/app_users?select=id&email=eq.${encodeURIComponent(email)}&limit=1`,
      { method: "GET" },
    );
    if (exists.ok && Array.isArray(exists.data) && exists.data.length > 0) {
      skipped++;
      console.log(`  skip (existe) ${email}`);
      continue;
    }

    const passwordHash = hashPassword(password);
    const ins = await rest(env, "/app_users?select=id,email,full_name", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        email,
        password_hash: passwordHash,
        full_name: fullName,
      }),
    });

    if (!ins.ok || !Array.isArray(ins.data) || !ins.data[0]) {
      console.error(`  ERREUR ${email}:`, ins.status, ins.data);
      continue;
    }

    const row = ins.data[0];
    await rest(env, "/app_profiles", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        user_id: row.id,
        email: row.email,
        full_name: row.full_name,
      }),
    });

    created++;
    console.log(`  ok ${email} → ${row.id}`);
  }

  console.log(`\nTerminé : ${created} créé(s), ${skipped} déjà présent(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

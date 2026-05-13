import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pw = "OldifyDemo123!";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

function sqlStr(s) {
  return s.replace(/'/g, "''");
}

const accountsPath = join(process.cwd(), "scripts", "seed-realistic-accounts.json");
const accounts = JSON.parse(readFileSync(accountsPath, "utf8"));

const values = [];
for (const { email, fullName } of accounts) {
  const em = String(email).trim().toLowerCase();
  const hash = hashPassword(pw);
  values.push(`  ('${sqlStr(em)}', '${hash}', '${sqlStr(String(fullName).trim())}')`);
}

const first = accounts[0].email;
const last = accounts[accounts.length - 1].email;
const n = accounts.length;

const sql = `-- Oldify: ${n} comptes test (même mot de passe: ${pw})
-- Exécuter dans Supabase → SQL Editor
-- Emails réalistes (Gmail, Outlook, Yahoo, etc.) — exemples: ${first} … ${last}
-- NB: ce sont des adresses de démo (pas forcément des boîtes actives).

WITH ins AS (
  INSERT INTO public.app_users (email, password_hash, full_name)
VALUES
${values.join(",\n")}
  ON CONFLICT (email) DO NOTHING
  RETURNING id, email, full_name
)
INSERT INTO public.app_profiles (user_id, email, full_name)
SELECT id, email, full_name FROM ins
ON CONFLICT (user_id) DO NOTHING;
`;

const out = join(process.cwd(), "supabase", "seed_demo_users.sql");
writeFileSync(out, sql, "utf8");
console.log("Wrote", out, `(${n} rows)`);

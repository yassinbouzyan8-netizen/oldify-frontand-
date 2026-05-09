import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { hashPassword } from "@/lib/local-auth/crypto";

export type LocalUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  full_name: string | null;
  created_at: string;
};

type StoreFile = { users: LocalUserRecord[] };

const STORE_REL = join(".data", "oldify-users.json");

function storePath(): string {
  return join(process.cwd(), STORE_REL);
}

function defaultStore(): StoreFile {
  const id = randomUUID();
  const email = "demo@oldify.ma";
  return {
    users: [
      {
        id,
        email,
        passwordHash: hashPassword("oldify123"),
        full_name: "Compte démo",
        created_at: new Date().toISOString(),
      },
    ],
  };
}

function readStoreRaw(): StoreFile {
  const p = storePath();
  if (!existsSync(p)) {
    const initial = defaultStore();
    writeStore(initial);
    return initial;
  }
  try {
    const raw = readFileSync(p, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed.users || !Array.isArray(parsed.users)) {
      return { users: [] };
    }
    return parsed;
  } catch {
    return { users: [] };
  }
}

export function readStore(): StoreFile {
  const s = readStoreRaw();
  if (s.users.length === 0) {
    const initial = defaultStore();
    writeStore(initial);
    return initial;
  }
  return s;
}

export function writeStore(store: StoreFile): void {
  const p = storePath();
  mkdirSync(dirname(p), { recursive: true });
  const tmp = `${p}.tmp`;
  writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
  renameSync(tmp, p);
}

export function findUserByEmail(email: string): LocalUserRecord | undefined {
  const norm = email.trim().toLowerCase();
  return readStore().users.find((u) => u.email === norm);
}

export function findUserById(id: string): LocalUserRecord | undefined {
  return readStore().users.find((u) => u.id === id);
}

export function createLocalUser(
  email: string,
  password: string,
  full_name: string | null,
): { ok: true; user: LocalUserRecord } | { ok: false; code: "exists" } {
  const norm = email.trim().toLowerCase();
  const store = readStore();
  if (store.users.some((u) => u.email === norm)) {
    return { ok: false, code: "exists" };
  }
  const user: LocalUserRecord = {
    id: randomUUID(),
    email: norm,
    passwordHash: hashPassword(password),
    full_name: full_name?.trim() || null,
    created_at: new Date().toISOString(),
  };
  store.users.push(user);
  writeStore(store);
  return { ok: true, user };
}

#!/usr/bin/env python3
"""
Appelé par Next.js (`GET /api/admin/python-demo`).
Lit sur stdin un JSON optionnel : { "userCount": number|null, "annonceCount": number|null }
Sortie : une ligne JSON sur stdout.

Manuel (sans comptes) :
  python python/admin_hello.py

Avec comptes (exemple) :
  echo {"userCount":12,"annonceCount":34} | python python/admin_hello.py
"""

from __future__ import annotations

import json
import sys


def read_stdin_json() -> dict:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    try:
        data = json.loads(raw)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        return {}


def fmt_count(v: object) -> str:
    if v is None:
        return "indisponible"
    if isinstance(v, bool):
        return str(v)
    if isinstance(v, int):
        return str(v)
    return str(v)


def main() -> None:
    incoming = read_stdin_json()
    user_count = incoming.get("userCount")
    annonce_count = incoming.get("annonceCount")

    summary_fr = (
        f"Utilisateurs : {fmt_count(user_count)} - "
        f"Annonces : {fmt_count(annonce_count)}"
    )

    payload = {
        "service": "oldify-admin-hello",
        "message": "Résumé généré par Python à partir des comptes fournis par Next.js.",
        "python_version": sys.version.split()[0],
        "input": {
            "userCount": user_count,
            "annonceCount": annonce_count,
        },
        "summary_fr": summary_fr,
    }
    print(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()

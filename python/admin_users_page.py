#!/usr/bin/env python3
"""
Reçoit sur stdin un JSON :
  { "users": [...], "page": int, "perPage": int, "totalCount": int|null, "totalPages": int }

Renvoie une ligne JSON : résumé + liste normalisée (email en minuscules, rôle défaut).
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


def norm_role(v: object) -> str:
    if isinstance(v, str) and v.strip().lower() == "admin":
        return "admin"
    return "user"


def main() -> None:
    data = read_stdin_json()
    users_in = data.get("users")
    if not isinstance(users_in, list):
        users_in = []

    page = int(data.get("page") or 1)
    per_page = int(data.get("perPage") or 20)
    total = data.get("totalCount")
    total_pages = data.get("totalPages")

    users_out: list[dict] = []
    for u in users_in:
        if not isinstance(u, dict):
            continue
        uid = u.get("id")
        email = u.get("email")
        if not isinstance(email, str):
            email = str(email or "")
        fn = u.get("full_name")
        full_name = fn if isinstance(fn, str) or fn is None else str(fn)
        role = norm_role(u.get("role"))
        created = u.get("created_at")
        users_out.append(
            {
                "id": str(uid) if uid is not None else "",
                "email": email.strip().lower(),
                "full_name": full_name,
                "role": role,
                "created_at": created if isinstance(created, str) or created is None else str(created),
            }
        )

    total_str = str(total) if isinstance(total, int) else "indisponible"
    pages_str = str(total_pages) if isinstance(total_pages, int) else "?"
    summary_fr = (
        f"Page {page}/{pages_str} - {len(users_out)} ligne(s) sur cette page "
        f"({total_str} comptes au total, {per_page} par page)."
    )

    out = {
        "service": "oldify-admin-users-page",
        "summary_fr": summary_fr,
        "users": users_out,
    }
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()

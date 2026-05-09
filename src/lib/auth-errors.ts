/** Messages en français pour erreurs login / register (API ou proxy). */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("unauthorized") || m.includes("401")) {
    return "Email ou mot de passe incorrect.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirmez votre adresse e-mail avant de vous connecter.";
  }
  if (
    m.includes("already") ||
    m.includes("exists") ||
    m.includes("duplicate") ||
    m.includes("409")
  ) {
    return "Un compte existe déjà avec cet e-mail.";
  }
  if (m.includes("password") && (m.includes("short") || m.includes("least"))) {
    return "Le mot de passe est trop court.";
  }
  if (
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m === "429" ||
    m.includes("email rate limit")
  ) {
    return "Trop de demandes. Réessaie dans quelques minutes.";
  }
  if (m.includes("fetch failed") || m.includes("econnrefused")) {
    return "Impossible de joindre l’API. Vérifie OLDIFY_API_BASE_URL et que ton serveur tourne.";
  }
  if (m.includes("oldify_api_base_url")) {
    return "Mode API externe : définis OLDIFY_API_BASE_URL, ou laisse-la vide pour l’auth locale intégrée.";
  }
  return message;
}

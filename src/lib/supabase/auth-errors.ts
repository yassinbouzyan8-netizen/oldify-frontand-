/** Messages en français pour les erreurs Auth Supabase courantes. */
export function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirmez votre adresse e-mail avant de vous connecter.";
  }
  if (m.includes("user already registered")) {
    return "Un compte existe déjà avec cet e-mail.";
  }
  if (m.includes("password should be at least")) {
    return "Le mot de passe est trop court (minimum 6 caractères sur Supabase).";
  }
  if (m.includes("signup requires a valid password")) {
    return "Mot de passe invalide.";
  }
  return message;
}

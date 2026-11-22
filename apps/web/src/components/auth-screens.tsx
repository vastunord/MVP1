"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { publicHref, type Locale } from "@/lib/i18n";
import type { OAuthProvider } from "@/server/auth-readiness";

const providerNames = { google: "Google", github: "GitHub", apple: "Apple" };

type Mode =
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "verify-email"
  | "onboarding";
export function AuthScreen({
  locale,
  mode,
  enabled,
  providers,
}: {
  locale: Locale;
  mode: Mode;
  enabled: boolean;
  providers: OAuthProvider[];
}) {
  const en = locale === "en";
  const router = useRouter();
  const query = useSearchParams();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const roomUpload = query.get("intent") === "room-upload";
  const workspaceEntry = roomUpload
    ? "/app/tools/room-reimagination#source-image"
    : "/app";
  const href = (path: string) => {
    const localized = publicHref(path, locale);
    return roomUpload
      ? localized + (path.includes("?") ? "&" : "?") + "intent=room-upload"
      : localized;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || pending) return;
    setPending(true);
    setError("");
    setMessage("");
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const address = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          name,
          email: address,
          password,
          callbackURL: href("/login?verified=1"),
          fetchOptions: { headers: { "x-vn-locale": locale } },
        });
        if (result.error) throw new Error(result.error.message);
        setMessage(
          en
            ? "Account created. Email verification is required before sign-in; request a new link if it does not arrive."
            : "Kontoen er opprettet. E-post må bekreftes før innlogging; be om en ny lenke hvis den ikke kommer.",
        );
      } else if (mode === "login") {
        const result = await authClient.signIn.email({
          email: address,
          password,
        });
        if (result.error) throw new Error(result.error.message);
        router.push(workspaceEntry);
        router.refresh();
      } else if (mode === "forgot-password") {
        await authClient.requestPasswordReset({
          email: address,
          redirectTo: window.location.origin + href("/reset-password"),
          fetchOptions: { headers: { "x-vn-locale": locale } },
        });
        setMessage(
          en
            ? "Request received. If the account exists and delivery succeeds, check your inbox for a recovery link."
            : "Forespørselen er mottatt. Hvis kontoen finnes og e-posten leveres, sjekk innboksen for lenken.",
        );
      } else if (mode === "reset-password") {
        const token = query.get("token");
        if (!token)
          throw new Error(
            en
              ? "Recovery link is invalid or expired."
              : "Lenken er ugyldig eller utløpt.",
          );
        const result = await authClient.resetPassword({
          newPassword: password,
          token,
        });
        if (result.error) throw new Error(result.error.message);
        setMessage(
          en
            ? "Password updated. Sign in again."
            : "Passordet er oppdatert. Logg inn på nytt.",
        );
      } else if (mode === "verify-email") {
        const result = await authClient.sendVerificationEmail({
          email: address,
          callbackURL: href("/login?verified=1"),
          fetchOptions: { headers: { "x-vn-locale": locale } },
        });
        if (result.error) throw new Error(result.error.message);
        setMessage(
          en
            ? "Request received. Check your inbox for a new link; contact support if it does not arrive."
            : "Forespørselen er mottatt. Sjekk innboksen for en ny lenke; kontakt brukerstøtte hvis den ikke kommer.",
        );
      } else if (mode === "onboarding") {
        const response = await fetch("/api/workspaces/personal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!response.ok)
          throw new Error(
            en
              ? "Studio could not be set up."
              : "Studio kunne ikke opprettes.",
          );
        router.push(workspaceEntry);
        router.refresh();
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : en
            ? "Request failed."
            : "Forespørselen feilet.",
      );
    } finally {
      setPending(false);
    }
  }

  const titles = en
    ? {
        login: "Sign in",
        signup: "Create account",
        "forgot-password": "Recover your account",
        "reset-password": "Choose a new password",
        "verify-email": "Verify your email",
        onboarding: "Set up Studio",
      }
    : {
        login: "Logg inn",
        signup: "Opprett konto",
        "forgot-password": "Tilbakestill passord",
        "reset-password": "Velg nytt passord",
        "verify-email": "Bekreft e-post",
        onboarding: "Opprett Studio",
      };
  return (
    <main id="main" className="container page-pad auth-layout">
      <div>
        <p className="eyebrow">VASTU NORD / {en ? "YOUR SPACE" : "DITT ROM"}</p>
        <h1>{titles[mode]}</h1>
        <p>
          {en
            ? "Your projects and images stay private. Public sharing requires a separate choice and review."
            : "Prosjektene og bildene dine er private. Offentlig deling krever et eget valg og godkjenning."}
        </p>
      </div>
      <section className="auth-panel" aria-label={titles[mode]}>
        {!enabled && (
          <p role="status">
            {en
              ? "Account services are not connected yet. No information is being collected."
              : "Kontotjenester er ikke koblet til ennå. Ingen informasjon samles inn."}
          </p>
        )}
        {query.get("verified") === "1" && mode === "login" && (
          <p role="status">
            {en
              ? "Email verified. You can sign in."
              : "E-post bekreftet. Du kan logge inn."}
          </p>
        )}
        {mode === "login" && query.get("oauth") === "incomplete" && (
          <p role="alert">
            {en
              ? "Sign-in was not completed. Try again or sign in with your email."
              : "Innloggingen ble ikke fullført. Prøv igjen eller logg inn med e-post."}
          </p>
        )}
        <form onSubmit={submit} className="auth-form">
          {(mode === "signup" || mode === "onboarding") && (
            <label>
              {mode === "onboarding"
                ? en
                  ? "Studio name"
                  : "Navn på Studio"
                : en
                  ? "Your name"
                  : "Ditt navn"}
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                disabled={!enabled || pending}
              />
            </label>
          )}
          {["signup", "login", "forgot-password", "verify-email"].includes(
            mode,
          ) && (
            <label>
              {en ? "Email" : "E-post"}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={!enabled || pending}
              />
            </label>
          )}
          {["signup", "login", "reset-password"].includes(mode) && (
            <label>
              {en ? "Password" : "Passord"}
              <input
                name="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
                minLength={mode === "login" ? 1 : 12}
                disabled={!enabled || pending}
              />
            </label>
          )}
          <button
            className="button primary"
            type="submit"
            disabled={!enabled || pending}
          >
            {pending ? (en ? "Please wait…" : "Vennligst vent…") : titles[mode]}
          </button>
        </form>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
        {mode === "login" && (
          <>
            <p>
              <Link href={href("/forgot-password")}>
                {en ? "Forgot password?" : "Glemt passord?"}
              </Link>
            </p>
            <p>
              <Link href={href("/signup")}>
                {en ? "Create account" : "Opprett konto"}
              </Link>
            </p>
          </>
        )}
        {mode === "signup" && (
          <p>
            <Link href={href("/login")}>
              {en ? "Already have an account?" : "Har du allerede en konto?"}
            </Link>
          </p>
        )}
        {["forgot-password", "reset-password", "verify-email"].includes(
          mode,
        ) && (
          <p>
            <Link href={href("/login")}>
              {en ? "Back to sign in" : "Tilbake til innlogging"}
            </Link>
          </p>
        )}
        {(mode === "login" || mode === "signup") && enabled && providers.map((provider) => (
          <button
            key={provider}
            type="button"
            className="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              setError("");
              try {
                const result = await authClient.signIn.social({
                  provider, callbackURL: workspaceEntry, errorCallbackURL: href("/login?oauth=incomplete"),
                });
                if (result.error) throw new Error();
              } catch {
                setError(en ? "Sign-in could not be started. Please try again." : "Innloggingen kunne ikke startes. Prøv igjen.");
              } finally {
                setPending(false);
              }
            }}
          >
            {en ? "Continue with " : "Fortsett med "}{providerNames[provider]}
          </button>
        ))}
        <p className="small">
          {en
            ? "Account email is used for verification and recovery. Your media stays private until you explicitly approve each publication."
            : "E-post brukes til bekreftelse og gjenoppretting. Mediene dine forblir private til du godkjenner hver publisering."}
        </p>
      </section>
    </main>
  );
}

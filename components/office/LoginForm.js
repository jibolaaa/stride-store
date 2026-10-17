"use client";
// Email and password sign-in, plus one-tap sign-in for the demo accounts.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLE_LABEL } from "../../lib/office/labels";

export default function LoginForm({ demo, demoPassword }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  async function signIn(creds, who) {
    if (busy) return;
    setBusy(who);
    setError("");
    try {
      const res = await fetch("/api/office/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(creds)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Couldn't sign in. Try again."); setBusy(null); return; }
      router.replace("/office");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(null);
    }
  }

  return (
    <>
      <form className="ofc-form" onSubmit={e => { e.preventDefault(); signIn({ email, password }, "form"); }} noValidate>
        <label className="ofc-field">
          <span>Email</span>
          <input className="ofc-input" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false}
            value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
        </label>
        <label className="ofc-field">
          <span>Password</span>
          <input className="ofc-input" type="password" autoComplete="current-password"
            value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
        </label>
        {error && <p className="ofc-error" role="alert">{error}</p>}
        <button type="submit" className="btn full" disabled={!!busy}>{busy === "form" ? "Signing in…" : "Sign in"}</button>
      </form>

      {demo.length > 0 && (
        <div className="demo-logins">
          <p><b>Trying the demo?</b> Tap a person to sign in as them. Each role sees a different back office. The password for all of them is {demoPassword}.</p>
          {demo.map(d => (
            <button key={d.email} type="button" disabled={!!busy} onClick={() => signIn({ email: d.email, password: demoPassword }, d.email)}>
              <b>{d.name}</b>
              <span>{busy === d.email ? "Signing in…" : ROLE_LABEL[d.role]}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

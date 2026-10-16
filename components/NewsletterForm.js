"use client";
// STRIDE is a demo, so this form checks the email and says so honestly.
// Nothing is stored or sent anywhere.
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | error | done

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setState("error"); return; }
    setState("done");
    setEmail("");
  };

  const note = state === "error"
    ? "Enter an email address, like you@example.com."
    : state === "done"
      ? "Thanks. This is a demo store, so your email wasn't saved."
      : "This is a demo store, so no emails are stored or sent.";

  return (
    <form className="news-form" onSubmit={submit} noValidate>
      <div className="news-row">
        <label htmlFor="news-email" className="sr-only">Email address</label>
        <input
          id="news-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={e => { setEmail(e.target.value); if (state !== "idle") setState("idle"); }}
          aria-invalid={state === "error"}
          aria-describedby="news-note"
        />
        <button type="submit" className="btn">Sign up</button>
      </div>
      <p id="news-note" className={`news-note ${state === "error" ? "err" : ""}`} role="status">{note}</p>
    </form>
  );
}

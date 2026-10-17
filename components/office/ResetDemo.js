"use client";
// Owner only: put the demo back to how it started. Asks once more first.
import { useState } from "react";

export default function ResetDemo() {
  const [step, setStep] = useState("idle"); // idle | confirm | busy
  const [error, setError] = useState("");

  async function reset() {
    setStep("busy");
    setError("");
    try {
      const res = await fetch("/api/office/reset", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error || "Reset didn't finish. Try again."); setStep("confirm"); return; }
      // Everyone is signed out by the reset, so start again at sign-in.
      window.location.assign("/office/login?reset=1");
    } catch {
      setError("Couldn't reach the server. Nothing was changed.");
      setStep("confirm");
    }
  }

  if (step === "idle") {
    return <button type="button" className="btn small outline" onClick={() => setStep("confirm")}>Reset demo data</button>;
  }
  return (
    <div className="ofc-form confirm-box" role="group" aria-label="Confirm reset">
      <p><b>Reset everything?</b> All sales and stock changes made in the demo are deleted.</p>
      {error && <p className="ofc-error" role="alert">{error}</p>}
      <div className="ofc-row">
        <button type="button" className="btn small" onClick={reset} disabled={step === "busy"}>{step === "busy" ? "Resetting…" : "Yes, reset"}</button>
        <button type="button" className="btn small outline" onClick={() => setStep("idle")} disabled={step === "busy"}>Keep it</button>
      </div>
    </div>
  );
}

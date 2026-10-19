"use client";
// Creates the tables and the demo shop. Only works once.
// Links between the gate pages (setup, sign-in) are plain <a> tags: a full
// page load, so the browser never shows a saved copy from before setup.
import { useState } from "react";

export default function SetupButton() {
  const [state, setState] = useState({ step: "idle" });

  async function run() {
    setState({ step: "busy" });
    try {
      const res = await fetch("/api/office/setup", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) { setState({ step: "done", text: "It was already set up." }); return; }
      if (!res.ok) { setState({ step: "error", text: data.error || "Setup didn't finish. Try again." }); return; }
      setState({ step: "done", text: `Done: ${data.staff} staff accounts, ${data.products} sneakers and ${data.sales} sales from the past week.` });
    } catch {
      setState({ step: "error", text: "Couldn't reach the server. Try again." });
    }
  }

  if (state.step === "done") {
    return (
      <>
        <p className="ofc-ok" role="status">{state.text}</p>
        <a className="btn full" href="/office/login">Sign in</a>
      </>
    );
  }
  return (
    <>
      {state.step === "error" && <p className="ofc-error" role="alert">{state.text}</p>}
      <button type="button" className="btn full" onClick={run} disabled={state.step === "busy"}>
        {state.step === "busy" ? "Setting up, about 10 seconds…" : "Create the demo shop"}
      </button>
    </>
  );
}

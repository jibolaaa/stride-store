"use client";
// A second step before a change is saved: says exactly what will happen,
// then waits for Yes or Go back. Focus moves here so it can't be missed.
import { useEffect, useId, useRef } from "react";

export default function ConfirmBox({ question, children, yes, onYes, onNo, busy = false, error = "" }) {
  const box = useRef(null);
  const id = useId();
  useEffect(() => { box.current?.focus({ preventScroll: false }); }, []);

  return (
    <div className="confirm-box" role="group" aria-labelledby={id} tabIndex={-1} ref={box}>
      <div id={id}>
        <p className="confirm-q">{question}</p>
        {children && <div className="confirm-detail">{children}</div>}
      </div>
      {error && <p className="ofc-error" role="alert">{error}</p>}
      <div className="ofc-row">
        <button type="button" className="btn small" onClick={onYes} disabled={busy}>{busy ? "Saving…" : yes}</button>
        <button type="button" className="btn small outline" onClick={onNo} disabled={busy}>Go back</button>
      </div>
    </div>
  );
}

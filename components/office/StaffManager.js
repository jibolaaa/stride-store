"use client";
// Owner only: the team list, what each role can do, adding someone, and
// changing a person's role, password or whether they can sign in at all.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLE_LABEL, ROLE_NOTE } from "../../lib/office/labels";

const ROLES = Object.keys(ROLE_LABEL);

async function send(url, method, body) {
  const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, error: data.error };
}

export default function StaffManager({ staff, meId }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const active = staff.filter(s => s.active).length;
  const anyDemo = staff.some(s => s.demo);

  return (
    <>
      <section className="panel" aria-labelledby="roles-title">
        <div className="panel-head"><h2 id="roles-title">What each role can do</h2></div>
        <ul className="role-list">
          {ROLES.map(r => <li key={r}><span className="pill">{ROLE_LABEL[r]}</span><span>{ROLE_NOTE[r]}</span></li>)}
        </ul>
      </section>

      <div className="cols">
        <section className="panel" aria-labelledby="team-title">
          <div className="panel-head">
            <h2 id="team-title">Team</h2>
            <span className="muted">{active} can sign in</span>
          </div>
          {anyDemo && (
            <p className="fine team-note">
              The demo accounts stay as they are, so the demo keeps working for everyone. Add someone to try changing a role, switching an account off or setting a new password.
            </p>
          )}
          <ul className="list">
            {staff.map(s => <StaffRow key={s.id} person={s} isMe={s.id === meId} onChanged={refresh} />)}
          </ul>
        </section>

        <section className="panel form-panel" aria-labelledby="add-title">
          <h2 id="add-title" className="panel-title">Add someone</h2>
          <AddStaff onAdded={refresh} />
        </section>
      </div>
    </>
  );
}

function StaffRow({ person: s, isMe, onChanged }) {
  const [role, setRole] = useState(s.role);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function patch(body, okText, after) {
    setBusy(true);
    setMsg(null);
    try {
      const r = await send(`/api/office/staff/${s.id}`, "PATCH", body);
      if (!r.ok) { setMsg({ ok: false, text: r.error || "That didn't save. Try again." }); return; }
      setMsg({ ok: true, text: okText });
      after?.();
      onChanged();
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className={`staff-row ${s.active ? "" : "off"}`}>
      <div className="item-text">
        <b>{s.name}{isMe ? " (you)" : ""}</b>
        <span>{s.email}</span>
      </div>
      <div className="tags">
        <span className={`pill ${s.role === "owner" ? "dark" : ""}`}>{ROLE_LABEL[s.role]}</span>
        {s.demo && <span className="pill">Demo</span>}
        {!s.active && <span className="pill out">Switched off</span>}
      </div>
      {!s.demo && (
        <details>
          <summary>Change</summary>
          <div className="staff-actions">
            {!isMe && (
              <div className="inline-form">
                <label className="sr-only" htmlFor={`role-${s.id}`}>Role for {s.name}</label>
                <select id={`role-${s.id}`} className="ofc-select" value={role} onChange={e => setRole(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
                <button type="button" className="btn small" disabled={busy || role === s.role}
                  onClick={() => patch({ role }, `${s.name} is now ${ROLE_LABEL[role].toLowerCase()}.`)}>Save role</button>
              </div>
            )}
            <form className="inline-form" onSubmit={e => { e.preventDefault(); patch({ password }, "New password saved.", () => setPassword("")); }}>
              <label className="sr-only" htmlFor={`pw-${s.id}`}>New password for {s.name}</label>
              <input id={`pw-${s.id}`} className="ofc-input" type="password" autoComplete="new-password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="New password" maxLength={72} />
              <button type="submit" className="btn small outline" disabled={busy || password.length < 8}>Set password</button>
            </form>
            {password.length > 0 && password.length < 8 && <p className="fine">At least 8 characters.</p>}
            {!isMe && (
              <button type="button" className="btn small outline" disabled={busy}
                onClick={() => patch({ active: !s.active }, s.active ? `${s.name} is switched off and signed out.` : `${s.name} can sign in again.`)}>
                {s.active ? "Switch off this account" : "Switch this account back on"}
              </button>
            )}
            {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
          </div>
        </details>
      )}
    </li>
  );
}

function AddStaff({ onAdded }) {
  const empty = { name: "", email: "", role: "cashier", password: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setMsg(null); };

  async function add(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await send("/api/office/staff", "POST", form);
      if (!r.ok) { setMsg({ ok: false, text: r.error || "The account wasn't created. Try again." }); return; }
      setMsg({ ok: true, text: `${form.name.trim()} can sign in now with ${form.email.trim().toLowerCase()} and the starting password.` });
      setForm(empty);
      onAdded();
    } catch {
      setMsg({ ok: false, text: "Couldn't reach the server. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ofc-form" onSubmit={add} noValidate>
      <label className="ofc-field">
        <span>Full name</span>
        <input className="ofc-input" value={form.name} onChange={set("name")} autoComplete="off" maxLength={80} />
      </label>
      <label className="ofc-field">
        <span>Email</span>
        <input className="ofc-input" type="email" inputMode="email" value={form.email} onChange={set("email")} autoComplete="off" autoCapitalize="none" spellCheck={false} />
      </label>
      <label className="ofc-field">
        <span>Role</span>
        <select className="ofc-select" value={form.role} onChange={set("role")}>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
      </label>
      <p className="fine">{ROLE_NOTE[form.role]}.</p>
      <label className="ofc-field">
        <span>Starting password</span>
        <input className="ofc-input" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" maxLength={72} />
      </label>
      <p className="fine">At least 8 characters. Give it to them in person; you can set a new one any time.</p>
      {msg && <p className={msg.ok ? "ofc-ok" : "ofc-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</p>}
      <button type="submit" className="btn full" disabled={busy}>{busy ? "Adding…" : "Add to the team"}</button>
    </form>
  );
}

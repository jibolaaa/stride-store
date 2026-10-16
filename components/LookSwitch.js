"use client";
// Preview only: a small switch to flip between the two proposed looks.
// Remove this file (and the script in layout.js) once a look is chosen.
import { useEffect, useState } from "react";

export default function LookSwitch() {
  const [look, setLook] = useState("a");
  useEffect(() => { setLook(document.documentElement.dataset.look || "a"); }, []);

  const pick = (l) => {
    document.documentElement.dataset.look = l;
    try { localStorage.setItem("stride_look", l); } catch {}
    setLook(l);
  };

  return (
    <div className="look-switch" role="group" aria-label="Compare looks">
      <button className={look === "a" ? "on" : ""} onClick={() => pick("a")}>Look A</button>
      <button className={look === "b" ? "on" : ""} onClick={() => pick("b")}>Look B</button>
    </div>
  );
}

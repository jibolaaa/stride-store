"use client";
// Switches between the light and dark look and remembers the choice.
// Every toggle on the page listens for changes, so they all stay in step.
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const paintBrowserBar = (theme) =>
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0f0f0f" : "#ffffff");

export default function ThemeToggle({ withLabel = false, className = "" }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const sync = () => {
      const t = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      setTheme(t);
      paintBrowserBar(t);
    };
    sync();
    window.addEventListener("stride-theme", sync);
    return () => window.removeEventListener("stride-theme", sync);
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("stride_theme", next); } catch {}
    window.dispatchEvent(new Event("stride-theme"));
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" className={`icon-btn ${className}`} onClick={flip} aria-label={label} title={label}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      {withLabel && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
    </button>
  );
}

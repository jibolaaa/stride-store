// The add-to-cart moment: a small copy of the shoe photo flies from where
// you tapped into the bag icon in the header. Browser only.

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Resolves true when the flight played, false when it was skipped
// (reduced motion, or nothing to fly from or to).
export function flyToBag(fromEl, imageUrl, size = 72) {
  return new Promise(resolve => {
    const bag = document.querySelector(".header .bag");
    if (!fromEl || !bag || reduceMotion() || typeof Element.prototype.animate !== "function") { resolve(false); return; }

    const a = fromEl.getBoundingClientRect();
    const b = bag.getBoundingClientRect();
    const s = Math.min(size, a.width, a.height) || size;
    const startX = a.left + a.width / 2 - s / 2;
    const startY = a.top + a.height / 2 - s / 2;
    const dx = b.left + b.width / 2 - (startX + s / 2);
    const dy = b.top + b.height / 2 - (startY + s / 2);
    const end = 16 / s;

    const ghost = document.createElement("div");
    ghost.className = "fly-ghost";
    ghost.setAttribute("aria-hidden", "true");
    Object.assign(ghost.style, {
      left: `${startX}px`, top: `${startY}px`, width: `${s}px`, height: `${s}px`,
      backgroundImage: imageUrl ? `url("${imageUrl}")` : "none"
    });
    document.body.appendChild(ghost);

    // Up and over in an arc, shrinking into a dot as it reaches the bag.
    const lift = Math.min(120, Math.abs(dy) * .35 + 40);
    const anim = ghost.animate([
      { transform: "translate(0, 0) scale(1)", borderRadius: "2px", opacity: 1 },
      { transform: `translate(${dx * .45}px, ${dy * .45 - lift}px) scale(.62)`, borderRadius: "30%", opacity: 1, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${end})`, borderRadius: "50%", opacity: .7 }
    ], { duration: 680, easing: "cubic-bezier(.45, 0, .25, 1)" });

    const done = () => { ghost.remove(); resolve(true); };
    anim.onfinish = done;
    anim.oncancel = done;
  });
}

// Makes the bag icon and its count pop. The header listens for this.
export const popBag = () => window.dispatchEvent(new Event("stride-bag-pop"));

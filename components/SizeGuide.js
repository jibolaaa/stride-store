"use client";
import Sheet from "./Sheet";
import { SizeTable, MEASURE_TIP } from "./SizeTable";
import { CloseIcon } from "./Icons";

export default function SizeGuide({ open, onClose, kids }) {
  return (
    <Sheet open={open} onClose={onClose} side="bottom" label="Size guide" className="guide-sheet">
      <div className="sheet-head">
        <p className="sheet-title">Size guide</p>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close size guide" data-autofocus><CloseIcon /></button>
      </div>
      <p className="guide-tip">{MEASURE_TIP}</p>
      <SizeTable kids={kids} />
      <p className="note">Between sizes? Go up one. Returns are free within 7 days if the fit is off.</p>
    </Sheet>
  );
}

// Thin line icons, drawn on a 24px grid with a 1.5px stroke.
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false" };

export const MenuIcon = (p) => <svg {...base} {...p}><path d="M3 6.5h18M3 12h18M3 17.5h18" /></svg>;
export const SearchIcon = (p) => <svg {...base} {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>;
export const BagIcon = (p) => <svg {...base} {...p}><path d="M4.5 8h15l-1 13h-13l-1-13Z" /><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" /></svg>;
export const CloseIcon = (p) => <svg {...base} {...p}><path d="M5 5l14 14M19 5 5 19" /></svg>;
export const ChevronLeft = (p) => <svg {...base} {...p}><path d="M15 5l-7 7 7 7" /></svg>;
export const ChevronRight = (p) => <svg {...base} {...p}><path d="M9 5l7 7-7 7" /></svg>;
export const ChevronDown = (p) => <svg {...base} {...p}><path d="M5 9l7 7 7-7" /></svg>;
export const PlusIcon = (p) => <svg {...base} {...p}><path d="M12 4v16M4 12h16" /></svg>;
export const MinusIcon = (p) => <svg {...base} {...p}><path d="M4 12h16" /></svg>;
export const SunIcon = (p) => <svg {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></svg>;
export const MoonIcon = (p) => <svg {...base} {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>;
export const TruckIcon = (p) => <svg {...base} {...p}><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>;
export const ReturnIcon = (p) => <svg {...base} {...p}><path d="M9 7 5 11l4 4" /><path d="M5 11h9.5a4.5 4.5 0 0 1 0 9H11" /></svg>;
export const LockIcon = (p) => <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>;
export const ChatIcon = (p) => <svg {...base} {...p}><path d="M4 18.5 5.2 15A7.5 7.5 0 1 1 8.6 18.4L4 18.5Z" /></svg>;
export const GridOneIcon = (p) => <svg {...base} {...p} fill="currentColor" stroke="none"><rect x="4" y="4" width="16" height="16" /></svg>;
export const GridTwoIcon = (p) => <svg {...base} {...p} fill="currentColor" stroke="none"><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>;
export const RulerIcon = (p) => <svg {...base} {...p}><path d="M3 15.5 15.5 3 21 8.5 8.5 21 3 15.5Z" /><path d="M7 11.5l1.8 1.8M10 8.5l1.8 1.8M13 5.5l1.8 1.8" /></svg>;
// A danfo bus in the same thin-line style, for delivery.
export const DanfoIcon = (p) => <svg {...base} {...p}><path d="M3.8 6.5h11.6c.9 0 1.7.4 2.2 1.1l2.9 4.1c.3.5.5 1 .5 1.6v2.9c0 .6-.4 1-1 1H3.8c-.7 0-1.3-.6-1.3-1.3V7.8c0-.7.6-1.3 1.3-1.3Z" /><path d="M2.5 12.6h18.4" /><path d="M5.5 9.4h2M9.5 9.4h2M13.5 9.4h1.6" /><circle cx="7" cy="17.6" r="1.7" /><circle cx="16.6" cy="17.6" r="1.7" /></svg>;
export const CheckIcon = (p) => <svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const FilterIcon = (p) => <svg {...base} {...p}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>;
export const ArrowLeft = (p) => <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const ArrowRight = (p) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const StarIcon = (p) => <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z" /></svg>;
export const BoxIcon = (p) => <svg {...base} {...p}><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></svg>;
export const ReceiptIcon = (p) => <svg {...base} {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>;
export const ChartIcon = (p) => <svg {...base} {...p}><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6M20 16v-9" /></svg>;
export const PeopleIcon = (p) => <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.6" /><path d="M16.5 14.1A5 5 0 0 1 21 19" /></svg>;
export const LogoutIcon = (p) => <svg {...base} {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 8l-4 4 4 4M6 12h10" /></svg>;
export const AlertIcon = (p) => <svg {...base} {...p}><path d="M12 3.5 21.5 20h-19L12 3.5Z" /><path d="M12 10v4.5M12 17.3v.2" /></svg>;
export const PrintIcon = (p) => <svg {...base} {...p}><path d="M7 9V3.5h10V9" /><rect x="3.5" y="9" width="17" height="8" rx="1.5" /><path d="M7 14h10v6.5H7z" /></svg>;

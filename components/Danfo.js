// A Lagos danfo, side view, facing right. The only bit of colour on the site.
// Add the `driving` prop to spin the wheels and bounce the body.
export default function Danfo({ driving = false, className = "", title }) {
  return (
    <svg
      className={`danfo ${driving ? "driving" : ""} ${className}`}
      viewBox="0 0 124 66"
      width="124"
      height="66"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <ellipse className="danfo-shadow" cx="62" cy="61.5" rx="52" ry="2.6" fill="rgba(0,0,0,.14)" />
      <g className="danfo-body">
        {/* roof rack */}
        <path d="M22 9.5V6.5M44 9.5V6.5M66 9.5V6.5M80 9.5V6.5M18 6.5H84" style={{ stroke: "var(--danfo-rack, #111)" }} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* body */}
        <path
          d="M14 10H88C95 10 99 13 103 19L112 32.5C113.4 34.6 114 37 114 39.5V48C114 50.5 112.4 52 110 52H11C8.6 52 7 50.5 7 48V17C7 13 10 10 14 10Z"
          style={{ fill: "var(--danfo, #FFC800)" }}
          stroke="#111"
          strokeWidth="2"
        />
        {/* windows */}
        <rect x="13" y="15.5" width="15" height="12.5" rx="1.6" fill="#1c1c1c" />
        <rect x="32" y="15.5" width="15" height="12.5" rx="1.6" fill="#1c1c1c" />
        <rect x="51" y="15.5" width="15" height="12.5" rx="1.6" fill="#1c1c1c" />
        <rect x="70" y="15.5" width="13" height="12.5" rx="1.6" fill="#1c1c1c" />
        <path d="M87 15.5H95.4C97.1 15.5 98.6 16.3 99.5 17.7L105.2 26.3C105.8 27.1 105.2 28 104.3 28H87Z" fill="#1c1c1c" />
        {/* the two black stripes danfos are known for */}
        <rect x="8" y="33.5" width="105" height="4.2" fill="#111" />
        <rect x="8" y="40.6" width="105.5" height="2.2" fill="#111" />
        {/* sliding door */}
        <path d="M49.5 29.5V51" stroke="#111" strokeWidth="1.2" opacity=".55" />
        {/* headlight and bumper */}
        <rect x="108.6" y="29.2" width="4" height="3" rx="1" fill="#FFF6CF" stroke="#111" strokeWidth=".8" />
        <rect x="104" y="47.4" width="12.5" height="4.6" rx="1.4" fill="#2a2a2a" />
        <rect x="4.5" y="47.4" width="8" height="4.6" rx="1.4" fill="#2a2a2a" />
      </g>
      <g className="wheel">
        <circle cx="31" cy="52.5" r="8.3" fill="#111" style={{ stroke: "var(--danfo-tyre, #111)" }} strokeWidth="1.4" />
        <circle cx="31" cy="52.5" r="3.6" fill="#d6d6d6" />
        <path d="M31 49.2V55.8M27.7 52.5H34.3" stroke="#111" strokeWidth="1.3" />
      </g>
      <g className="wheel">
        <circle cx="93" cy="52.5" r="8.3" fill="#111" style={{ stroke: "var(--danfo-tyre, #111)" }} strokeWidth="1.4" />
        <circle cx="93" cy="52.5" r="3.6" fill="#d6d6d6" />
        <path d="M93 49.2V55.8M89.7 52.5H96.3" stroke="#111" strokeWidth="1.3" />
      </g>
    </svg>
  );
}

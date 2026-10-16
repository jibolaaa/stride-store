// EU sizes with rough UK sizes and foot lengths. Brands vary a little.
// No hooks here, so both the Help page and the size guide sheet can use it.
export const ADULT = [
  [36, "3.5", "22.5"], [37, "4", "23"], [38, "5", "24"], [39, "6", "24.5"], [40, "6.5", "25"], [41, "7.5", "26"],
  [42, "8", "26.5"], [43, "9", "27.5"], [44, "9.5", "28"], [45, "10.5", "29"], [46, "11", "29.5"]
];
export const KIDS = [
  [28, "10", "17.5"], [29, "11", "18"], [30, "11.5", "18.5"], [31, "12.5", "19.5"],
  [32, "13", "20"], [33, "1", "20.5"], [34, "2", "21.5"], [35, "2.5", "22"]
];

export function SizeTable({ kids = false }) {
  const rows = kids ? KIDS : ADULT;
  return (
    <table className="size-table">
      <caption className="sr-only">{kids ? "Kids sizes" : "Adult sizes"}</caption>
      <thead><tr><th scope="col">EU</th><th scope="col">UK</th><th scope="col">Foot length (cm)</th></tr></thead>
      <tbody>{rows.map(([eu, uk, cm]) => <tr key={eu}><td>{eu}</td><td>{uk}</td><td>{cm}</td></tr>)}</tbody>
    </table>
  );
}

export const MEASURE_TIP = "Stand on a sheet of paper, mark your heel and your longest toe, and measure between them. Pick the size whose foot length matches, or the next one up.";

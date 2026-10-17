import "./office.css";
import MotionRoot from "../../components/MotionRoot";

export const metadata = {
  title: { default: "STRIDE Office", template: "%s | STRIDE Office" },
  description: "STRIDE's back office: sales at the till, stock, staff and reports.",
  robots: { index: false, follow: false }
};

// The back office has its own frame (see app/office/(app)/layout.js);
// sign-in and setup pages stand on their own.
export default function OfficeLayout({ children }) {
  return <MotionRoot>{children}</MotionRoot>;
}

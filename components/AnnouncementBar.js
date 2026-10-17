import { FREE_DELIVERY_FROM_KOBO } from "../lib/pricing";
import { nairaWhole } from "../lib/format";

// One quiet line above the header with the thing people ask first.
export default function AnnouncementBar() {
  return (
    <p className="announce">Free delivery in Lagos on orders from {nairaWhole(FREE_DELIVERY_FROM_KOBO)}</p>
  );
}

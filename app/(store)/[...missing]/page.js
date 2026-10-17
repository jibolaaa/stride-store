import { notFound } from "next/navigation";

// Any address that isn't a page gets the shop's "Wrong bus stop" page,
// with the shop's header and footer around it.
export default function Missing() {
  notFound();
}

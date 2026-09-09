import type { Metadata } from "next";
import CheckTicket from "./CheckTicket";

export const metadata: Metadata = {
  title: "Перевірка квитків | Bezlad Club",
  description: "Перевірка квитків на вході для персоналу",
  robots: { index: false, follow: false },
};

export default function CheckPage() {
  return <CheckTicket />;
}

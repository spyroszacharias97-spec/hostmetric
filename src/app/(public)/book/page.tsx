import { notFound } from "next/navigation";
import { features } from "@/config/features";

export default function BookPage() {
  if (!features.directBooking) {
    notFound();
  }

  return null;
}
import { Metadata } from "next";
import { HomeContent } from "@/features/home/components/HomeContent";

export const metadata: Metadata = {
  title: "Home",
  description: "Unified Platform for Developer Projects & Teams",
};

export default function Home() {
  return <HomeContent />;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Lab",
  description: "Your builder lab. One mission a day. Ship every week.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

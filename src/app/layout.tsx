import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clearway — Ambulance Alert Demo",
  description: "A demo-first ambulance approach alert prototype for road users.",
  applicationName: "Clearway",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f3f7f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

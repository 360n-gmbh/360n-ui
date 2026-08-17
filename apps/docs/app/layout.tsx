import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "360n UI",
    template: "%s · 360n UI",
  },
  description: "Komponenten, Tokens und Design-Regeln für 360n-Produkte.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

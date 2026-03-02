import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blue Lifeline | Schools Water Dashboard",
  description: "Verified Water Benefit tracking for schools. Monitor water sustainability and impact projects across Educational institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

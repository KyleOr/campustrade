import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/toastnotification";

export const metadata: Metadata = {
  title: "CampusTrade",
  description: "Trade with students",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

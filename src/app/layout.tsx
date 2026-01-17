import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feebdack",
  description: "Gestionnaire de feedbacks (dashboard)",
  icons: {
    icon: [
      { url: "/assets/bdicon.png?v=2", type: "image/png", sizes: "64x64" },
      { url: "/assets/bdicon.png?v=2", type: "image/png", sizes: "192x192" },
      { url: "/assets/bdicon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/assets/bdicon.png?v=2", type: "image/png", sizes: "64x64" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <script
          src="https://feebdack-phi.vercel.app/widget.js"
          async
          data-site-key="sk_567f9157affd364c32d7f2188cc99207"
        ></script>
      </body>
    </html>
  );
}

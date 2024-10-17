import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "We Care",
  description: "A platform for connecting with healthcare professionals",
  icons: {
    icon: "/assets/svg/logo-no-background.svg",
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
        className={cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          plusJakartaSans.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next"
import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/NavBar"
import { TreasuryProvider } from "@/lib/demoStore"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Masjid Treasury",
  description: "Donation accounting and treasury management",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NavBar />
        <TreasuryProvider>
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex-1">{children}</main>
        </TreasuryProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

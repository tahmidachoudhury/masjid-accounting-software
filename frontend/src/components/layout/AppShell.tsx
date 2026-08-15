"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  Upload,
  QrCode,
  Presentation,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/donations/new", label: "Record Donation", icon: PlusCircle },
  { href: "/import", label: "Import Statement", icon: Upload },
  { href: "/qr-code", label: "QR Code", icon: QrCode },
  { href: "/info", label: "Our Story", icon: Presentation },
]

const adminItems = [
  { label: "Approvals", icon: CheckSquare },
  { label: "Reporting", icon: BarChart3 },
  { label: "Forecast", icon: TrendingUp },
]

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/donations/new": "Record Donation",
  "/import": "Import Statement",
  "/qr-code": "QR Code",
  "/info": "Our Story",
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const breadcrumb = breadcrumbMap[pathname] ?? "Dashboard"
  const isPublicPage = pathname === "/donate"

  if (isPublicPage) {
    return (
      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    )
  }

  return (
    <TooltipProvider delay={0}>
      <div className="flex min-h-screen">
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[1px] md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        <aside
          id="primary-navigation"
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-sidebar-border bg-sidebar shadow-elevated transition-transform duration-200 md:translate-x-0 md:shadow-none",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
            <span className="text-xl leading-none" aria-hidden>☽</span>
            <span className="text-base font-semibold tracking-tight text-primary">
              Noor Treasury
            </span>
            <button
              type="button"
              aria-label="Close navigation"
              className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-l-2 border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground pl-[10px]"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}

            {adminItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground/60"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
                <span className="ml-auto rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:pl-60">
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6 md:px-8">
              <button
                type="button"
                aria-label="Open navigation"
                aria-controls="primary-navigation"
                aria-expanded={mobileNavOpen}
                className="rounded-md border border-border bg-card p-2 text-foreground shadow-sm md:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="size-4" />
              </button>
              <p className="text-xs text-muted-foreground">
                Pages / <span className="text-foreground">{breadcrumb}</span>
              </p>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}

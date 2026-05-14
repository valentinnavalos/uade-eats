"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  User,
  CreditCard,
  Bell,
  Sun,
  HelpCircle,
  Flag,
  LogOut,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"
import { useApp } from "@/context/AppContext"

interface SettingItem {
  icon: React.ElementType
  label: string
  destructive?: boolean
  onClick?: () => void
}

interface SettingGroup {
  title: string
  items: SettingItem[]
}

const SETTINGS: SettingGroup[] = [
  {
    title: "Cuenta",
    items: [
      { icon: User, label: "Información personal" },
      { icon: CreditCard, label: "Métodos de pago" },
    ],
  },
  {
    title: "Preferencias",
    items: [
      { icon: Bell, label: "Notificaciones" },
      { icon: Sun, label: "Tema de la app" },
    ],
  },
  {
    title: "Soporte",
    items: [
      { icon: HelpCircle, label: "Ayuda y preguntas frecuentes" },
      { icon: Flag, label: "Reportar un problema" },
    ],
  },
  {
    title: "Sesión",
    items: [{ icon: LogOut, label: "Cerrar sesión", destructive: true }],
  },
]

const NAV_MAP: Record<string, string> = {
  "Información personal": "/profile/personal-info",
  "Métodos de pago": "/profile/payment-methods",
  "Notificaciones": "/profile/notifications-settings",
  "Tema de la app": "/profile/theme",
  "Ayuda y preguntas frecuentes": "/profile/help",
  "Reportar un problema": "/profile/report",
}

export default function ProfilePage() {
  const router = useRouter()
  const { state, dispatch, cartCount } = useApp()
  const [activeNav] = useState("profile")

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    window.location.replace("/login")
  }

  // TODO: replace with API call (fetch user profile)
  const user = state.user
  const initials = user
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "?"

  return (
    <div className="min-h-svh flex flex-col items-center" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="w-full max-w-[480px] min-h-svh flex flex-col bg-background relative">

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 pt-6 pb-4">
          <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">
            Mi perfil
          </h1>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto px-4 pt-5 pb-28 space-y-5">

        </main>

        {/* ── Bottom Navigation ── */}
        <BottomNav
          active={activeNav}
          cartCount={cartCount}
          onChange={(id) => {
            if (id === "home") router.push("/")
            if (id === "cart") router.push("/cart")
            if (id === "orders") router.push("/orders")
          }}
        />
      </div>
    </div>
  )
}

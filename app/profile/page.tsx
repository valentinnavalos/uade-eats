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
  ShoppingBag,
  Star,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

interface SettingItem {
  icon: React.ElementType
  label: string
  destructive?: boolean
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

export default function ProfilePage() {
  const router = useRouter()
  const [activeNav] = useState("profile")

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

          {/* User info card */}
          <div className="rounded-2xl bg-card border border-border/60 p-4 flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
              style={{ backgroundColor: "#F97316" }}
            >
              VA
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-base text-foreground leading-tight">Valentín Avalos</p>
              <p className="text-xs text-muted-foreground mt-0.5">valentinavalossss@uade.edu.ar</p>
              <div
                className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: "#FFF0E6", color: "#F97316" }}
              >
                <span>ID</span>
                <span>· 1234567</span>
              </div>
            </div>

            <button
              className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0"
              aria-label="Editar perfil"
            >
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card border border-border/60 p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <ShoppingBag size={18} style={{ color: "#F97316" }} />
              </div>
              <div>
                <p className="text-xl font-black text-foreground leading-none">23</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">pedidos totales</p>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border/60 p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                <Star size={18} style={{ color: "#F97316" }} />
              </div>
              <div>
                <p className="text-sm font-black text-foreground leading-none">Cafetería</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Pepe · favorito</p>
              </div>
            </div>
          </div>

          {/* Settings groups */}
          {SETTINGS.map((group) => (
            <section key={group.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
                {group.title}
              </p>
              <div className="rounded-2xl bg-card border border-border/60 overflow-hidden divide-y divide-border/40">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors active:scale-[0.99] text-left",
                      item.destructive && "hover:bg-red-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        item.destructive ? "bg-red-50" : "bg-muted"
                      )}
                    >
                      <item.icon
                        size={16}
                        className={cn(item.destructive ? "text-red-500" : "text-foreground")}
                      />
                    </div>
                    <span
                      className={cn(
                        "flex-1 text-sm font-medium",
                        item.destructive ? "text-red-500" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                    {!item.destructive && (
                      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          ))}

          {/* Version footer */}
          <p className="text-center text-[11px] text-muted-foreground pb-2">
            UADE EATS · v0.1 · UADEvelopers Grupo 5
          </p>
        </main>

        {/* ── Bottom Navigation ── */}
        <BottomNav
          active={activeNav}
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

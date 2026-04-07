"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronRight, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

type OrderStatus = "preparing" | "ready"
type HistoryStatus = "completed" | "cancelled"

interface ActiveOrder {
  id: string
  code: number
  store: string
  storeCategory: string
  items: string
  total: number
  status: OrderStatus
  estimatedMinutes?: number
  placedAt: string
}

interface PastOrder {
  id: string
  store: string
  items: string
  total: number
  date: string
  status: HistoryStatus
}

const ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: "o1",
    code: 42,
    store: "Cafetería Pepe",
    storeCategory: "cafetería",
    items: "Café con Leche × 2, Medialuna × 1",
    total: 5600,
    status: "preparing",
    estimatedMinutes: 8,
    placedAt: "12:34",
  },
  {
    id: "o2",
    code: 17,
    store: "Kiosco Norte",
    storeCategory: "kiosco",
    items: "Agua mineral × 2, Alfajor × 1",
    total: 2800,
    status: "ready",
    placedAt: "12:20",
  },
]

const PAST_ORDERS: PastOrder[] = [
  {
    id: "h1",
    store: "Buffet La Cantina",
    items: "Milanesa completa, Jugo de naranja",
    total: 7200,
    date: "Ayer, 13:15",
    status: "completed",
  },
  {
    id: "h2",
    store: "Pastelería Claudio",
    items: "Brownie × 2, Café cortado",
    total: 4600,
    date: "Lun 7 abr, 10:02",
    status: "completed",
  },
  {
    id: "h3",
    store: "Cafetería Pepe",
    items: "Mate cocido, Facturas × 3",
    total: 5000,
    date: "Vie 4 abr, 09:45",
    status: "cancelled",
  },
]

const STEPS = ["Recibido", "En preparación", "Listo"]

function stepIndex(status: OrderStatus): number {
  if (status === "preparing") return 1
  if (status === "ready") return 2
  return 0
}

export default function OrdersPage() {
  const router = useRouter()
  const [activeNav] = useState("orders")

  return (
    <div className="min-h-svh flex flex-col items-center" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="w-full max-w-[480px] min-h-svh flex flex-col bg-background relative">

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">
              Mis pedidos
            </h1>
            <button
              className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Notificaciones"
            >
              <Bell size={18} className="text-foreground" />
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-6">

          {/* Active orders */}
          <section>
            <h2 className="text-base font-bold text-foreground mb-3">Pedidos activos</h2>
            {ACTIVE_ORDERS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl bg-card border border-border/60">
                <span className="text-4xl mb-3">🛵</span>
                <p className="font-semibold text-foreground text-sm">Sin pedidos activos</p>
                <p className="text-xs text-muted-foreground mt-1">Tus pedidos en curso aparecerán acá</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ACTIVE_ORDERS.map((order) => {
                  const step = stepIndex(order.status)
                  const isReady = order.status === "ready"
                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-card border border-border/60 overflow-hidden"
                    >
                      {/* Status bar */}
                      <div
                        className="px-4 py-2.5 flex items-center gap-2"
                        style={{ backgroundColor: isReady ? "#F0FDF4" : "#FFF7ED" }}
                      >
                        {isReady ? (
                          <CheckCircle2 size={15} style={{ color: "#16A34A" }} />
                        ) : (
                          <Loader2
                            size={15}
                            style={{ color: "#F97316" }}
                            className="animate-spin"
                          />
                        )}
                        <span
                          className="text-xs font-bold"
                          style={{ color: isReady ? "#16A34A" : "#F97316" }}
                        >
                          {isReady ? "¡Listo para retirar!" : "En preparación"}
                        </span>
                        {!isReady && order.estimatedMinutes && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={11} />
                            ~{order.estimatedMinutes} min
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Store + items */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-foreground">{order.store}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.items}</p>
                          </div>
                          <span
                            className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "#FFF0E6", color: "#F97316" }}
                          >
                            {order.storeCategory}
                          </span>
                        </div>

                        {/* Step tracker */}
                        <div className="flex items-center gap-0">
                          {STEPS.map((label, i) => {
                            const done = i <= step
                            const isLast = i === STEPS.length - 1
                            return (
                              <div key={label} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1 flex-1">
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300",
                                      done ? "text-white" : "bg-muted text-muted-foreground"
                                    )}
                                    style={done ? { backgroundColor: i === step && !isReady ? "#F97316" : i < step || isReady ? "#16A34A" : "#F97316" } : {}}
                                  >
                                    {done ? (
                                      i < step || isReady ? (
                                        <CheckCircle2 size={14} />
                                      ) : (
                                        <span className="w-2 h-2 rounded-full bg-white" />
                                      )
                                    ) : (
                                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                    )}
                                  </div>
                                  <span
                                    className={cn("text-[9px] font-medium text-center leading-tight", done ? "text-foreground" : "text-muted-foreground")}
                                  >
                                    {label}
                                  </span>
                                </div>
                                {!isLast && (
                                  <div
                                    className="h-0.5 flex-1 -mt-4 mx-1 rounded-full transition-colors duration-300"
                                    style={{ backgroundColor: i < step ? "#16A34A" : "var(--border)" }}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Footer: pickup code + price */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/40">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pedido de las {order.placedAt}</span>
                          </div>
                          {isReady ? (
                            <div
                              className="flex items-center gap-1.5 px-3 py-1 rounded-xl"
                              style={{ backgroundColor: "#F0FDF4" }}
                            >
                              <span className="text-xs text-muted-foreground">Código</span>
                              <span className="text-lg font-black" style={{ color: "#16A34A" }}>
                                #{order.code}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-foreground">
                              ${order.total.toLocaleString("es-AR")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Order history */}
          <section>
            <h2 className="text-base font-bold text-foreground mb-3">Historial</h2>
            {PAST_ORDERS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-4xl mb-3">📋</span>
                <p className="font-semibold text-foreground text-sm">Sin pedidos anteriores</p>
              </div>
            ) : (
              <div className="space-y-2">
                {PAST_ORDERS.map((order) => (
                  <button
                    key={order.id}
                    className="w-full text-left rounded-2xl bg-card border border-border/60 px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors active:scale-[0.99]"
                  >
                    {/* Store icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: "#FFF0E6" }}
                    >
                      🧇
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-sm text-foreground truncate">{order.store}</p>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                            order.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          )}
                        >
                          {order.status === "completed" ? "Completado" : "Cancelado"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.items}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                        <span className="text-xs font-semibold text-foreground">
                          ${order.total.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* ── Bottom Navigation ── */}
        <BottomNav
          active={activeNav}
          onChange={(id) => {
            if (id === "home") router.push("/")
            if (id === "cart") router.push("/cart")
            if (id === "profile") router.push("/profile")
          }}
        />
      </div>
    </div>
  )
}

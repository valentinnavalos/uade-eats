"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, MapPin } from "lucide-react"
import { StoreCard, type Store } from "@/components/store-card"
import { FilterChips } from "@/components/filter-chips"
import { BottomNav } from "@/components/bottom-nav"
import { SearchBar } from "@/components/search-bar"

const STORES: Store[] = [
  {
    id: "1",
    name: "Cafetería Pepe",
    tagline: "El mejor café del campus · Medialunas recién hechas",
    category: "cafeteria",
    waitTime: "5–10 min",
    isOpen: true,
    image: "/images/cafeteria-pepe.jpg",
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "2",
    name: "Pastelería Claudio",
    tagline: "Tortas artesanales · Alfajores · Brownies",
    category: "pasteleria",
    waitTime: "10–15 min",
    isOpen: true,
    image: "/images/pasteleria-claudio.jpg",
    rating: 4.6,
    reviewCount: 189,
  },
  {
    id: "3",
    name: "Buffet La Cantina",
    tagline: "Almuerzo casero · Milanesas · Pastas del día",
    category: "buffet",
    waitTime: "15–20 min",
    isOpen: true,
    image: "/images/buffet-cantina.jpg",
    rating: 4.4,
    reviewCount: 427,
  },
  {
    id: "4",
    name: "Kiosco Norte",
    tagline: "Snacks, bebidas y golosinas al paso",
    category: "kiosco",
    waitTime: "2–5 min",
    isOpen: false,
    image: "/images/kiosco-norte.jpg",
    rating: 4.2,
    reviewCount: 98,
  },
  {
    id: "5",
    name: "Sándwichería El Molino",
    tagline: "Lomitos, tostados y wraps artesanales",
    category: "sandwicheria",
    waitTime: "10–15 min",
    isOpen: true,
    image: "/images/sandwicheria-el-molino.jpg",
    rating: 4.7,
    reviewCount: 256,
  },
]

const CATEGORY_DISPLAY: Record<string, string> = {
  cafeteria: "Cafetería",
  pasteleria: "Pastelería",
  buffet: "Buffet",
  kiosco: "Kiosco",
  sandwicheria: "Sándwiches",
}

export default function HomePage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeNav, setActiveNav] = useState("home")
  const [search, setSearch] = useState("")
  const [cartCount] = useState(2)

  const filtered = useMemo(() => {
    return STORES.filter((store) => {
      const matchFilter = activeFilter === "all" || store.category === activeFilter
      const matchSearch =
        search.trim() === "" ||
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.tagline.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [activeFilter, search])

  const openCount = filtered.filter((s) => s.isOpen).length

  return (
    <div className="min-h-svh flex flex-col items-center" style={{ backgroundColor: "var(--brand-surface)" }}>
      {/* Mobile container */}
      <div className="w-full max-w-[480px] min-h-svh flex flex-col bg-background relative">

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 pt-6 pb-4 space-y-4">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-0.5">
                <MapPin size={12} style={{ color: "#F97316" }} />
                <span>UADE — Buenos Aires</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">
                UADE{" "}
                <span style={{ color: "#F97316" }} className="font-black">
                  EATS
                </span>
              </h1>
            </div>
            <button
              className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Notificaciones"
            >
              <Bell size={18} className="text-foreground" />
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#F97316" }}
              />
            </button>
          </div>

          {/* Greeting */}
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Buen día 👋 &nbsp;¿Qué vas a pedir hoy?
            </p>
          </div>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} />

          {/* Filter chips */}
          <FilterChips active={activeFilter} onChange={setActiveFilter} />
        </header>

        {/* ── Store list ── */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
          {/* Section label */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">
              {activeFilter === "all" ? "Locales disponibles" : `Locales · ${CATEGORY_DISPLAY[activeFilter] ?? activeFilter}`}
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              {openCount} abierto{openCount !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
                style={{ backgroundColor: "#FFF0E6" }}
              >
                🔍
              </div>
              <p className="font-semibold text-foreground">Sin resultados</p>
              <p className="text-sm text-muted-foreground mt-1">
                Probá con otro nombre o categoría
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}

          {/* Promo banner */}
          <div
            className="mt-6 rounded-2xl p-4 flex items-center gap-4 overflow-hidden relative"
            style={{ backgroundColor: "#F97316" }}
          >
            <div className="flex-1">
              <p className="text-white font-bold text-base leading-tight text-balance">
                ¡Primera orden gratis!
              </p>
              <p className="text-orange-100 text-xs mt-1 leading-relaxed">
                Usá el código <span className="font-bold text-white">UADE2025</span> en tu primer pedido
              </p>
            </div>
            <div className="text-4xl shrink-0">���</div>
          </div>
        </main>

        {/* ── Bottom Navigation ── */}
        <BottomNav
          active={activeNav}
          onChange={(id) => {
            setActiveNav(id)
            if (id === "cart") router.push("/cart")
            if (id === "orders") router.push("/orders")
            if (id === "profile") router.push("/profile")
          }}
          cartCount={cartCount}
        />
      </div>
    </div>
  )
}

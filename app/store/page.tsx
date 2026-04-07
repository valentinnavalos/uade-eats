"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, Star, Clock, ShoppingBag } from "lucide-react"
import { ProductCard, type Product } from "@/components/product-card"
import { CategoryTabs } from "@/components/category-tabs"
import { BottomNav } from "@/components/bottom-nav"

// ── Store meta ──────────────────────────────────────────────────────────────
const STORE = {
  name: "Cafetería Pepe",
  tagline: "El mejor café del campus",
  rating: 4.8,
  reviewCount: 312,
  waitTime: "5–10 min",
  image: "/images/cafeteria-pepe.jpg",
  isOpen: true,
}

// ── Product catalog ──────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // Bebidas
  {
    id: "b1",
    name: "Café con Leche",
    description: "Espresso doble con leche entera vaporizada. El clásico que no falla.",
    price: 1800,
    image: "/images/products/cafe-con-leche.jpg",
    category: "Bebidas",
  },
  {
    id: "b2",
    name: "Jugo de Naranja",
    description: "Exprimido al momento con naranjas frescas, sin azúcar agregada.",
    price: 1500,
    image: "/images/products/jugo-naranja.jpg",
    category: "Bebidas",
  },
  {
    id: "b3",
    name: "Mate Cocido",
    description: "Con leche o sin leche. Servido en taza grande con dos sobres.",
    price: 1200,
    image: "/images/products/mate-cocido.jpg",
    category: "Bebidas",
  },
  // Sándwiches
  {
    id: "s1",
    name: "Tostado Mixto",
    description: "Jamón cocido y queso cremoso en pan lactal tostado. Crocante por fuera.",
    price: 2400,
    image: "/images/products/tostado-mixto.jpg",
    category: "Sándwiches",
  },
  {
    id: "s2",
    name: "Sándwich Veggie",
    description: "Palta, tomate cherry, lechuga y queso en pan integral artesanal.",
    price: 2800,
    image: "/images/products/sandwich-veggie.jpg",
    category: "Sándwiches",
  },
  // Snacks
  {
    id: "sn1",
    name: "Medialunas (x3)",
    description: "Recién horneadas, glaseadas con miel. Perfectas para el recreo.",
    price: 1600,
    image: "/images/products/medialunas.jpg",
    category: "Snacks",
  },
  {
    id: "sn2",
    name: "Facturas Surtidas",
    description: "Selección de vigilantes, cañones y palmeritas. Porción para dos.",
    price: 2200,
    image: "/images/products/facturas.jpg",
    category: "Snacks",
  },
  // Postres
  {
    id: "p1",
    name: "Brownie de Chocolate",
    description: "Húmedo y fundente, con pepitas de chocolate. Servido tibio.",
    price: 1900,
    image: "/images/products/brownie.jpg",
    category: "Postres",
  },
]

const CATEGORIES = ["Bebidas", "Sándwiches", "Snacks", "Postres"]

// ── Cart state type ───────────────────────────────────────────────────────────
type CartMap = Record<string, number>

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("Bebidas")
  const [activeNav, setActiveNav] = useState("home")
  const [cart, setCart] = useState<CartMap>({})
  const [cartBump, setCartBump] = useState(false)

  // Derived: total items in cart
  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, q) => sum + q, 0),
    [cart]
  )

  // Derived: filtered products
  const visibleProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  )

  // Cart actions
  const handleAdd = useCallback((product: Product) => {
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] ?? 0) + 1 }))
    // Trigger badge bump animation
    setCartBump(true)
    setTimeout(() => setCartBump(false), 300)
  }, [])

  const handleRemove = useCallback((product: Product) => {
    setCart((prev) => {
      const next = { ...prev }
      if ((next[product.id] ?? 0) <= 1) {
        delete next[product.id]
      } else {
        next[product.id] -= 1
      }
      return next
    })
  }, [])

  return (
    <div className="min-h-svh flex flex-col items-center" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="w-full max-w-[480px] min-h-svh flex flex-col bg-background relative">

        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">

          {/* Back row */}
          <div className="flex items-center gap-3 px-4 pt-12 pb-3">
            <a
              href="/"
              aria-label="Volver al inicio"
              className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted active:scale-95 transition-all duration-150 shrink-0"
            >
              <ArrowLeft size={18} className="text-foreground" />
            </a>
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-lg text-foreground leading-tight truncate">
                {STORE.name}
              </h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5 truncate">
                {STORE.tagline}
              </p>
            </div>
            {/* Open badge */}
            <span
              className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold"
              style={
                STORE.isOpen
                  ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                  : { backgroundColor: "#F3F4F6", color: "#6B7280" }
              }
            >
              {STORE.isOpen ? "Abierto" : "Cerrado"}
            </span>
          </div>

          {/* Category tabs */}
          <div className="px-4 pb-0">
            <CategoryTabs
              categories={CATEGORIES}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </header>

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-28">

          {/* Hero image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={STORE.image}
              alt={`${STORE.name} — foto del local`}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 480px"
              priority
            />
            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Meta chips over hero */}
            <div className="absolute bottom-3 left-4 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star size={11} fill="#F97316" stroke="none" />
                <span className="text-white text-xs font-bold">{STORE.rating}</span>
                <span className="text-white/70 text-xs">({STORE.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Clock size={11} className="text-white/80" />
                <span className="text-white text-xs font-semibold">{STORE.waitTime}</span>
              </div>
            </div>
          </div>

          {/* Product list */}
          <section className="px-4 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">{activeCategory}</h2>
              <span className="text-xs text-muted-foreground">
                {visibleProducts.length} {visibleProducts.length === 1 ? "producto" : "productos"}
              </span>
            </div>

            <div className="space-y-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] ?? 0}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </section>

          {/* Order summary strip — shown when cart has items */}
          {cartCount > 0 && (
            <div className="mx-4 mt-6">
              <button
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white font-bold shadow-lg active:scale-[0.98] transition-transform duration-150"
                style={{ backgroundColor: "#F97316" }}
                aria-label={`Ver carrito — ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span className="text-sm">Ver carrito</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-90">
                    {cartCount} {cartCount === 1 ? "ítem" : "ítems"}
                  </span>
                  <span className="text-sm font-black">
                    $
                    {PRODUCTS.reduce(
                      (sum, p) => sum + (cart[p.id] ?? 0) * p.price,
                      0
                    ).toLocaleString("es-AR")}
                  </span>
                </div>
              </button>
            </div>
          )}
        </main>

        {/* ── Bottom navigation ────────────────────────────────────────── */}
        <BottomNav
          active={activeNav}
          onChange={setActiveNav}
          cartCount={cartCount}
          cartBump={cartBump}
        />
      </div>
    </div>
  )
}

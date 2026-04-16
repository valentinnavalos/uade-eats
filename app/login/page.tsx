"use client"

import { useState } from "react"
import { useApp } from "@/context/AppContext"

export default function LoginPage() {
  const { dispatch } = useApp()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.toLowerCase().trim()
    if (!trimmed.endsWith("@uade.edu.ar")) {
      setError("Solo podés ingresar con un mail @uade.edu.ar")
      return
    }
    setError("")
    dispatch({ type: "LOGIN", payload: { email: trimmed } })
    // Set cookie and hard-redirect so the proxy sees the cookie on the first server request
    document.cookie = "uade-eats-auth=1; path=/"
    window.location.replace("/")
  }

  return (
    <div
      className="min-h-svh flex flex-col items-center"
      style={{ backgroundColor: "var(--brand-surface)" }}
    >
      <div className="w-full max-w-[480px] min-h-svh flex flex-col bg-background">
        {/* Spacer */}
        <div className="flex-1" />

        {/* Main card */}
        <div className="px-6 pb-12 space-y-8">

          {/* Logo */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-foreground leading-none">
              UADE{" "}
              <span style={{ color: "#F97316" }} className="font-black">
                EATS
              </span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Ingresá con tu mail universitario
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError("")
                }}
                placeholder="tu.nombre@uade.edu.ar"
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {error && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: "#F97316" }}
            >
              Ingresar
            </button>
          </form>
        </div>

        {/* Link to register */}
        <div className="text-center -mt-4">
          <p className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <a href="/register" className="font-semibold" style={{ color: "#F97316" }}>
              Registrate
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="pb-10 text-center">
          <p className="text-[11px] text-muted-foreground">
            UADevs — Grupo 5
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useApp } from "@/context/AppContext"
import type { User } from "@/lib/types"

interface FieldErrors {
  nombre: string
  email: string
  legajo: string
  password: string
  confirmPassword: string
}

const emptyErrors: FieldErrors = {
  nombre: "",
  email: "",
  legajo: "",
  password: "",
  confirmPassword: "",
}

export default function RegisterPage() {
  const { dispatch } = useApp()

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [legajo, setLegajo] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>(emptyErrors)
  const [submitted, setSubmitted] = useState(false)

  function validateField(field: keyof FieldErrors, value: string): string {
    switch (field) {
      case "nombre":
        return value.trim() === "" ? "El nombre no puede estar vacío" : ""
      case "email":
        return !value.toLowerCase().trim().endsWith("@uade.edu.ar")
          ? "Solo podés registrarte con un mail @uade.edu.ar"
          : ""
      case "legajo":
        return !/^\d{6,7}$/.test(value.trim())
          ? "El legajo debe tener 6 o 7 dígitos numéricos"
          : ""
      case "password":
        return value.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : ""
      case "confirmPassword":
        return value !== password ? "Las contraseñas no coinciden" : ""
      default:
        return ""
    }
  }

  function handleBlur(field: keyof FieldErrors, value: string) {
    if (!submitted) return
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    const newErrors: FieldErrors = {
      nombre: validateField("nombre", nombre),
      email: validateField("email", email),
      legajo: validateField("legajo", legajo),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    }
    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((e) => e !== "")
    if (hasErrors) return

    const user: User = {
      id: `u-${Date.now()}`,
      name: nombre.trim(),
      email: email.toLowerCase().trim(),
      legajo: legajo.trim(),
      role: "student",
    }

    localStorage.setItem("uade-eats-user", JSON.stringify(user))
    dispatch({ type: "REGISTER", payload: { user } })
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
              Creá tu cuenta universitaria
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Nombre */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  if (submitted) setErrors((prev) => ({ ...prev, nombre: validateField("nombre", e.target.value) }))
                }}
                onBlur={(e) => handleBlur("nombre", e.target.value)}
                placeholder="Nombre completo"
                autoComplete="name"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {errors.nombre && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (submitted) setErrors((prev) => ({ ...prev, email: validateField("email", e.target.value) }))
                }}
                onBlur={(e) => handleBlur("email", e.target.value)}
                placeholder="tu.nombre@uade.edu.ar"
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {errors.email && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Legajo */}
            <div className="space-y-1.5">
              <input
                type="text"
                value={legajo}
                onChange={(e) => {
                  setLegajo(e.target.value)
                  if (submitted) setErrors((prev) => ({ ...prev, legajo: validateField("legajo", e.target.value) }))
                }}
                onBlur={(e) => handleBlur("legajo", e.target.value)}
                placeholder="Legajo (6 o 7 dígitos)"
                inputMode="numeric"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {errors.legajo && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {errors.legajo}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (submitted) {
                    setErrors((prev) => ({
                      ...prev,
                      password: validateField("password", e.target.value),
                      confirmPassword: confirmPassword !== e.target.value ? "Las contraseñas no coinciden" : "",
                    }))
                  }
                }}
                onBlur={(e) => handleBlur("password", e.target.value)}
                placeholder="Contraseña (mín. 8 caracteres)"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {errors.password && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-1.5">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (submitted) setErrors((prev) => ({ ...prev, confirmPassword: validateField("confirmPassword", e.target.value) }))
                }}
                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium px-1" style={{ color: "#EF4444" }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: "#F97316" }}
            >
              Crear cuenta
            </button>
          </form>

          {/* Link to login */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <a href="/login" className="font-semibold" style={{ color: "#F97316" }}>
                Iniciá sesión
              </a>
            </p>
          </div>
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

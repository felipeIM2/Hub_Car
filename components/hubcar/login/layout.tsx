"use client"

import type { ReactNode } from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LoginLayoutProps {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <div className="w-full flex flex-1 flex-col">
        <main className="flex-1 overflow-hidden bg-white dark:bg-[#0F0F12]">
          {children}
        </main>
      </div>
    </div>
  )
}
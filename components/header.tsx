"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  userName: string
  pixKey?: string
}

export function Header({ userName, pixKey }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleLogout() {
    try {
      setIsLoggingOut(true)
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        router.refresh()
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Controle de Estoque</h1>
        </div>

        {pixKey && (
          <div className="hidden md:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Pix:</span>
            <code
              className="text-sm font-mono text-primary cursor-pointer hover:opacity-75"
              onClick={() => navigator.clipboard.writeText(pixKey)}
            >
              {pixKey}
            </code>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            disabled={!mounted}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Saindo..." : "Sair"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

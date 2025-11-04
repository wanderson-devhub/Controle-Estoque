"use client"

import type React from "react"

import { useState } from "react"
import type { User as UserType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Briefcase, Phone, Key, QrCode } from "lucide-react"

interface ProfileFormProps {
  user: UserType
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    warName: user.warName,
    rank: user.rank,
    company: user.company,
    phone: user.phone,
    ...(user.isAdmin && {
      pixKey: user.pixKey || "",
      pixQrCode: user.pixQrCode || "",
    }),
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("Perfil atualizado com sucesso!")
      } else {
        setMessage("Erro ao atualizar perfil")
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>Atualize seus dados de perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="warName">Nome de Guerra</Label>
            <Input id="warName" name="warName" value={formData.warName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Posto/Graduação</Label>
            <Input id="rank" name="rank" value={formData.rank} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Companhia</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {user.isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Informações de Cobrança (Admin)
            </CardTitle>
            <CardDescription>Configure sua chave Pix e QR Code para cobranças</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave Pix</Label>
              <Input
                id="pixKey"
                name="pixKey"
                value={formData.pixKey}
                onChange={handleChange}
                placeholder="Seu CPF, Email ou Chave Aleatória"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixQrCode">QR Code Pix (URL da Imagem)</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pixQrCode"
                  name="pixQrCode"
                  value={formData.pixQrCode}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {message && (
        <div
          className={`p-3 border rounded-md text-sm ${
            message.includes("sucesso")
              ? "bg-green-500/10 border-green-500 text-green-600"
              : "bg-destructive/10 border-destructive text-destructive"
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  )
}

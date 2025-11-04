"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Product {
  id: string
  name: string
  price: number
  imageUrl: string
}

interface Consumption {
  id: string
  quantity: number
  product: Product
}

interface ConsumptionListProps {
  initialConsumptions: Consumption[]
  userId: string
}

export function ConsumptionList({ initialConsumptions, userId }: ConsumptionListProps) {
  const [consumptions, setConsumptions] = useState<Consumption[]>(initialConsumptions)
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{ [productId: string]: number }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  async function handleAddToCart(productId: string) {
    const quantity = cart[productId] || 0
    if (quantity < 1) return

    setLoading(true)
    try {
      const response = await fetch("/api/consumptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })

      if (response.ok) {
        const newConsumption = await response.json()
        setConsumptions([...consumptions, newConsumption])
        setCart({ ...cart, [productId]: 0 })
      }
    } catch (error) {
      console.error("Error adding consumption:", error)
    } finally {
      setLoading(false)
    }
  }

  const groupedConsumptions = products
    .map((product) => {
      const items = consumptions.filter((c) => c.product.id === product.id)
      const totalQty = items.reduce((sum, c) => sum + c.quantity, 0)
      const totalPrice = totalQty * product.price
      return { product, totalQty, totalPrice, items }
    })
    .filter((g) => g.totalQty > 0)

  const cartTotal = Object.entries(cart).reduce((sum, [productId, qty]) => {
    const product = products.find((p) => p.id === productId)
    return sum + (product ? qty * product.price : 0)
  }, 0)

  return (
    <div className="space-y-6">
      <Card className="shadow-professional hover-lift animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Adicionar Consumo
          </CardTitle>
          <CardDescription>Selecione produtos e quantidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col gap-2">
                <div className="relative overflow-hidden rounded-lg bg-muted border border-border hover:border-primary transition-colors hover-lift">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold text-center px-1">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-medium line-clamp-2">{product.name}</h4>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    value={cart[product.id] || 0}
                    onChange={(e) => setCart({ ...cart, [product.id]: Number.parseInt(e.target.value) || 0 })}
                    className="h-8 text-center text-xs p-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total da Compra</p>
                <p className="text-2xl font-bold text-primary">R$ {cartTotal.toFixed(2)}</p>
              </div>
              <Button
                onClick={() => {
                  Object.entries(cart).forEach(([productId, qty]) => {
                    if (qty > 0) {
                      handleAddToCart(productId)
                    }
                  })
                }}
                disabled={Object.values(cart).every((qty) => qty === 0) || loading}
                className="gap-2 hover-lift"
              >
                <Plus className="h-4 w-4" />
                Confirmar Compra
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumptions history */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Histórico de Consumo</h3>
        {groupedConsumptions.length === 0 ? (
          <Card className="shadow-professional hover-lift">
            <CardContent className="pt-6 text-center text-muted-foreground">
              Nenhum consumo registrado ainda
            </CardContent>
          </Card>
        ) : (
          groupedConsumptions.map(({ product, totalQty, totalPrice }) => (
            <Card key={product.id} className="shadow-professional hover-lift">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalQty} unidades × R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

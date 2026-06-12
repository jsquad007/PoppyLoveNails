const CART_KEY = 'poppylove_cart'

export type CartItem = {
  productId:  string
  productName: string
  productSku:  string
  imageUrl:    string
  unitPrice:   number   // cents AUD
  shape:       string
  width:       string
  length:      string
  quantity:    number
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const cart = getCart()
  const existingIndex = cart.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.shape     === item.shape &&
      i.width     === item.width &&
      i.length    === item.length
  )
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  saveCart(cart)
}

export function removeFromCart(index: number): void {
  const cart = getCart()
  cart.splice(index, 1)
  saveCart(cart)
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
}

export function formatAUD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

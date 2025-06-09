// 购物相关类型定义

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  brand: string
  category: ProductCategory
  images: ProductImage[]
  videos?: ProductVideo[]
  price: ProductPrice
  specifications: ProductSpecification[]
  variants: ProductVariant[]
  inventory: ProductInventory
  ratings: ProductRating
  tags: string[]
  features: string[]
  isNew?: boolean
  isBestseller?: boolean
  isOnSale?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  type: 'main' | 'gallery' | 'variant' | 'ar_model'
  order: number
  isDefault: boolean
}

export interface ProductVideo {
  id: string
  url: string
  thumbnail: string
  title: string
  duration: number
  type: 'demo' | 'review' | 'unboxing' | '360'
}

export interface ProductPrice {
  current: number
  original?: number
  currency: string
  discount?: {
    percentage: number
    amount: number
    validUntil?: Date
  }
  priceHistory: Array<{
    price: number
    date: Date
    source: string
  }>
  compareAt?: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  parentId?: string
  children?: ProductCategory[]
  imageUrl?: string
  iconName: string
  isActive: boolean
  productCount: number
  filters: CategoryFilter[]
}

export interface CategoryFilter {
  id: string
  name: string
  type: 'range' | 'select' | 'checkbox' | 'color' | 'size'
  options?: FilterOption[]
  min?: number
  max?: number
  unit?: string
}

export interface FilterOption {
  id: string
  label: string
  value: string
  color?: string
  count?: number
}

export interface ProductSpecification {
  id: string
  name: string
  value: string
  unit?: string
  category: string
  isHighlight: boolean
}

export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'style' | 'material'
  value: string
  price?: number
  imageUrl?: string
  sku: string
  inventory: number
  isAvailable: boolean
}

export interface ProductInventory {
  total: number
  available: number
  reserved: number
  lowStockThreshold: number
  isInStock: boolean
  estimatedRestockDate?: Date
}

export interface ProductRating {
  average: number
  count: number
  distribution: Record<number, number> // 1-5星的分布
  reviews: ProductReview[]
}

export interface ProductReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  videos?: string[]
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  helpfulCount: number
  variant?: {
    color?: string
    size?: string
  }
  pros: string[]
  cons: string[]
}

export interface ShoppingCart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  price: number
  subtotal: number
  addedAt: Date
  isSelected: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  items: OrderItem[]
  shipping: ShippingInfo
  billing: BillingInfo
  payment: PaymentInfo
  pricing: OrderPricing
  timeline: OrderTimeline[]
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  price: number
  subtotal: number
}

export interface ShippingInfo {
  method: string
  cost: number
  estimatedDays: number
  address: Address
  instructions?: string
}

export interface BillingInfo {
  address: Address
  sameAsShipping: boolean
}

export interface PaymentInfo {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'alipay' | 'wechat_pay'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  last4?: string
  brand?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface OrderPricing {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
}

export interface OrderTimeline {
  id: string
  status: OrderStatus
  message: string
  timestamp: Date
  location?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Wishlist {
  id: string
  userId: string
  name: string
  description?: string
  items: WishlistItem[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: Date
  priceWhenAdded: number
  notes?: string
}

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  product: Product
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: Date
  triggeredAt?: Date
}

export interface SearchResult {
  products: Product[]
  categories: ProductCategory[]
  brands: string[]
  total: number
  query: string
  filters: SearchFilters
  suggestions: string[]
  facets: SearchFacet[]
}

export interface SearchFilters {
  categories?: string[]
  brands?: string[]
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  inStock?: boolean
  onSale?: boolean
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'bestseller'
  features?: string[]
}

export interface SearchFacet {
  name: string
  type: 'category' | 'brand' | 'price' | 'rating' | 'feature'
  options: Array<{
    value: string
    label: string
    count: number
  }>
}

export interface ARTryOn {
  id: string
  productId: string
  userId: string
  modelUrl: string
  sessionData: any
  screenshots: string[]
  createdAt: Date
  sharedWith?: string[]
}

export interface PriceComparison {
  productId: string
  prices: Array<{
    source: string
    price: number
    url: string
    availability: boolean
    shipping: number
    lastUpdated: Date
  }>
  lowestPrice: number
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
}

export interface ShoppingRecommendation {
  id: string
  type: 'similar' | 'complementary' | 'trending' | 'personalized' | 'recently_viewed'
  products: Product[]
  reason: string
  confidence: number
  context?: {
    basedOn?: string
    category?: string
    behavior?: string
  }
}

// API响应类型
export interface ShoppingApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
  meta?: {
    totalProducts: number
    totalBrands: number
    lastUpdated: Date
  }
}

// 购物事件类型
export type ShoppingEvent = 
  | { type: 'PRODUCT_VIEW'; productId: string; duration: number }
  | { type: 'PRODUCT_LIKE'; productId: string }
  | { type: 'PRODUCT_UNLIKE'; productId: string }
  | { type: 'ADD_TO_CART'; productId: string; variantId?: string; quantity: number }
  | { type: 'REMOVE_FROM_CART'; itemId: string }
  | { type: 'UPDATE_CART_QUANTITY'; itemId: string; quantity: number }
  | { type: 'ADD_TO_WISHLIST'; productId: string }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: string }
  | { type: 'SEARCH'; query: string; filters?: SearchFilters }
  | { type: 'FILTER_APPLY'; filters: SearchFilters }
  | { type: 'PRICE_ALERT_CREATE'; productId: string; targetPrice: number }
  | { type: 'AR_TRY_ON'; productId: string }
  | { type: 'REVIEW_SUBMIT'; productId: string; rating: number; content: string }

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Product, 
  ProductCategory, 
  ShoppingCart,
  CartItem,
  Wishlist,
  WishlistItem,
  PriceAlert,
  SearchFilters,
  ShoppingRecommendation,
  ShoppingEvent,
  Order
} from '@/types/shopping'

interface ShoppingStore {
  // 产品数据
  products: Product[]
  featuredProducts: Product[]
  categories: ProductCategory[]
  
  // 购物车
  cart: ShoppingCart | null
  
  // 心愿单
  wishlists: Wishlist[]
  currentWishlist: Wishlist | null
  
  // 价格提醒
  priceAlerts: PriceAlert[]
  
  // 订单
  orders: Order[]
  
  // 浏览历史
  viewHistory: Array<{
    product: Product
    viewedAt: Date
    duration: number
  }>
  
  // 搜索和筛选
  searchQuery: string
  searchFilters: SearchFilters
  selectedCategory: string | null
  
  // UI状态
  isLoading: boolean
  error: string | null
  
  // 购物车操作
  addToCart: (productId: string, variantId?: string, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // 心愿单操作
  addToWishlist: (productId: string, wishlistId?: string) => void
  removeFromWishlist: (productId: string, wishlistId?: string) => void
  createWishlist: (name: string, description?: string) => void
  deleteWishlist: (wishlistId: string) => void
  
  // 价格提醒
  createPriceAlert: (productId: string, targetPrice: number) => void
  removePriceAlert: (alertId: string) => void
  
  // 搜索和筛选
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  setSelectedCategory: (categoryId: string | null) => void
  clearSearch: () => void
  
  // 产品操作
  likeProduct: (productId: string) => void
  unlikeProduct: (productId: string) => void
  viewProduct: (productId: string, duration: number) => void
  
  // 数据获取
  fetchProducts: (category?: string) => Promise<void>
  fetchProductById: (id: string) => Promise<Product | null>
  searchProducts: (query: string, filters?: SearchFilters) => Promise<void>
  
  // 推荐系统
  getRecommendations: (type: ShoppingRecommendation['type'], productId?: string) => Product[]
  
  // 事件处理
  handleShoppingEvent: (event: ShoppingEvent) => void
  
  // 工具方法
  getProductById: (id: string) => Product | undefined
  getCategoryById: (id: string) => ProductCategory | undefined
  getCartTotal: () => number
  getCartItemCount: () => number
  isInCart: (productId: string, variantId?: string) => boolean
  isInWishlist: (productId: string) => boolean
}

export const useShoppingStore = create<ShoppingStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      products: [],
      featuredProducts: [],
      categories: [],
      cart: null,
      wishlists: [],
      currentWishlist: null,
      priceAlerts: [],
      orders: [],
      viewHistory: [],
      searchQuery: '',
      searchFilters: {},
      selectedCategory: null,
      isLoading: false,
      error: null,

      // 购物车操作
      addToCart: (productId: string, variantId?: string, quantity = 1) => {
        const { products, cart } = get()
        const product = products.find(p => p.id === productId)
        
        if (!product) return
        
        const variant = variantId ? product.variants.find(v => v.id === variantId) : undefined
        const price = variant?.price || product.price.current
        
        const newItem: CartItem = {
          id: `cart_item_${Date.now()}`,
          productId,
          product,
          variantId,
          variant,
          quantity,
          price,
          subtotal: price * quantity,
          addedAt: new Date(),
          isSelected: true,
        }
        
        if (!cart) {
          // 创建新购物车
          const newCart: ShoppingCart = {
            id: `cart_${Date.now()}`,
            userId: 'current_user',
            items: [newItem],
            subtotal: newItem.subtotal,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: newItem.subtotal,
            currency: 'CNY',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          set({ cart: newCart })
        } else {
          // 检查是否已存在相同商品和变体
          const existingItemIndex = cart.items.findIndex(
            item => item.productId === productId && item.variantId === variantId
          )
          
          let updatedItems: CartItem[]
          
          if (existingItemIndex >= 0) {
            // 更新数量
            updatedItems = cart.items.map((item, index) => 
              index === existingItemIndex 
                ? { 
                    ...item, 
                    quantity: item.quantity + quantity,
                    subtotal: (item.quantity + quantity) * item.price
                  }
                : item
            )
          } else {
            // 添加新商品
            updatedItems = [...cart.items, newItem]
          }
          
          const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
          const tax = subtotal * 0.1 // 假设10%税率
          const total = subtotal + tax
          
          set({
            cart: {
              ...cart,
              items: updatedItems,
              subtotal,
              tax,
              total,
              updatedAt: new Date(),
            }
          })
        }
      },

      removeFromCart: (itemId: string) => {
        const { cart } = get()
        if (!cart) return
        
        const updatedItems = cart.items.filter(item => item.id !== itemId)
        const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        const tax = subtotal * 0.1
        const total = subtotal + tax
        
        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date(),
          }
        })
      },

      updateCartQuantity: (itemId: string, quantity: number) => {
        const { cart } = get()
        if (!cart) return
        
        if (quantity <= 0) {
          get().removeFromCart(itemId)
          return
        }
        
        const updatedItems = cart.items.map(item => 
          item.id === itemId 
            ? { ...item, quantity, subtotal: quantity * item.price }
            : item
        )
        
        const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0)
        const tax = subtotal * 0.1
        const total = subtotal + tax
        
        set({
          cart: {
            ...cart,
            items: updatedItems,
            subtotal,
            tax,
            total,
            updatedAt: new Date(),
          }
        })
      },

      clearCart: () => {
        set({ cart: null })
      },

      // 心愿单操作
      addToWishlist: (productId: string, wishlistId?: string) => {
        const { products, wishlists } = get()
        const product = products.find(p => p.id === productId)
        
        if (!product) return
        
        let targetWishlist: Wishlist
        
        if (wishlistId) {
          const existingWishlist = wishlists.find(w => w.id === wishlistId)
          if (!existingWishlist) return
          targetWishlist = existingWishlist
        } else {
          // 使用默认心愿单或创建新的
          let defaultWishlist = wishlists.find(w => w.name === '我的收藏')
          
          if (!defaultWishlist) {
            defaultWishlist = {
              id: `wishlist_${Date.now()}`,
              userId: 'current_user',
              name: '我的收藏',
              items: [],
              isPublic: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            set({ wishlists: [...wishlists, defaultWishlist] })
          }
          
          targetWishlist = defaultWishlist
        }
        
        // 检查是否已存在
        const existingItem = targetWishlist.items.find(item => item.productId === productId)
        if (existingItem) return
        
        const newItem: WishlistItem = {
          id: `wishlist_item_${Date.now()}`,
          productId,
          product,
          addedAt: new Date(),
          priceWhenAdded: product.price.current,
        }
        
        const updatedWishlists = wishlists.map(wishlist => 
          wishlist.id === targetWishlist.id
            ? {
                ...wishlist,
                items: [...wishlist.items, newItem],
                updatedAt: new Date(),
              }
            : wishlist
        )
        
        set({ wishlists: updatedWishlists })
      },

      removeFromWishlist: (productId: string, wishlistId?: string) => {
        const { wishlists } = get()
        
        const updatedWishlists = wishlists.map(wishlist => {
          if (wishlistId && wishlist.id !== wishlistId) return wishlist
          
          return {
            ...wishlist,
            items: wishlist.items.filter(item => item.productId !== productId),
            updatedAt: new Date(),
          }
        })
        
        set({ wishlists: updatedWishlists })
      },

      createWishlist: (name: string, description?: string) => {
        const { wishlists } = get()
        
        const newWishlist: Wishlist = {
          id: `wishlist_${Date.now()}`,
          userId: 'current_user',
          name,
          description,
          items: [],
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set({ wishlists: [...wishlists, newWishlist] })
      },

      deleteWishlist: (wishlistId: string) => {
        const { wishlists } = get()
        const updatedWishlists = wishlists.filter(w => w.id !== wishlistId)
        set({ wishlists: updatedWishlists })
      },

      // 价格提醒
      createPriceAlert: (productId: string, targetPrice: number) => {
        const { products, priceAlerts } = get()
        const product = products.find(p => p.id === productId)
        
        if (!product) return
        
        const newAlert: PriceAlert = {
          id: `alert_${Date.now()}`,
          userId: 'current_user',
          productId,
          product,
          targetPrice,
          currentPrice: product.price.current,
          isActive: true,
          createdAt: new Date(),
        }
        
        set({ priceAlerts: [...priceAlerts, newAlert] })
      },

      removePriceAlert: (alertId: string) => {
        const { priceAlerts } = get()
        const updatedAlerts = priceAlerts.filter(alert => alert.id !== alertId)
        set({ priceAlerts: updatedAlerts })
      },

      // 搜索和筛选
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setSearchFilters: (filters: Partial<SearchFilters>) => {
        const { searchFilters } = get()
        set({ searchFilters: { ...searchFilters, ...filters } })
      },

      setSelectedCategory: (categoryId: string | null) => {
        set({ selectedCategory: categoryId })
      },

      clearSearch: () => {
        set({ searchQuery: '', searchFilters: {}, selectedCategory: null })
      },

      // 产品操作
      likeProduct: (productId: string) => {
        // 这里可以添加点赞逻辑
        console.log('Like product:', productId)
      },

      unlikeProduct: (productId: string) => {
        // 这里可以添加取消点赞逻辑
        console.log('Unlike product:', productId)
      },

      viewProduct: (productId: string, duration: number) => {
        const { products, viewHistory } = get()
        const product = products.find(p => p.id === productId)
        
        if (!product) return
        
        const existingIndex = viewHistory.findIndex(h => h.product.id === productId)
        
        let updatedHistory: typeof viewHistory
        
        if (existingIndex >= 0) {
          // 更新现有记录
          updatedHistory = viewHistory.map((item, index) => 
            index === existingIndex 
              ? { ...item, viewedAt: new Date(), duration }
              : item
          )
        } else {
          // 添加新记录
          updatedHistory = [
            { product, viewedAt: new Date(), duration },
            ...viewHistory.slice(0, 99) // 保留最近100条
          ]
        }
        
        set({ viewHistory: updatedHistory })
      },

      // 数据获取 (模拟API调用)
      fetchProducts: async (category?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟API延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 这里应该是实际的API调用
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '获取产品失败' 
          })
        }
      },

      fetchProductById: async (id: string) => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          const { products } = get()
          return products.find(p => p.id === id) || null
        } catch (error) {
          console.error('Failed to fetch product:', error)
          return null
        }
      },

      searchProducts: async (query: string, filters?: SearchFilters) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟搜索API调用
          await new Promise(resolve => setTimeout(resolve, 800))
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '搜索失败' 
          })
        }
      },

      // 推荐系统
      getRecommendations: (type: ShoppingRecommendation['type'], productId?: string) => {
        const { products, viewHistory } = get()
        
        switch (type) {
          case 'recently_viewed':
            return viewHistory.slice(0, 10).map(h => h.product)
          case 'trending':
            return products.filter(p => p.isBestseller).slice(0, 10)
          case 'personalized':
            // 简单的个性化推荐：基于浏览历史的分类
            const viewedCategories = viewHistory.map(h => h.product.category.id)
            return products.filter(p => viewedCategories.includes(p.category.id)).slice(0, 10)
          default:
            return products.slice(0, 10)
        }
      },

      // 事件处理
      handleShoppingEvent: (event: ShoppingEvent) => {
        const actions = get()
        
        switch (event.type) {
          case 'PRODUCT_VIEW':
            actions.viewProduct(event.productId, event.duration)
            break
          case 'ADD_TO_CART':
            actions.addToCart(event.productId, event.variantId, event.quantity)
            break
          case 'REMOVE_FROM_CART':
            actions.removeFromCart(event.itemId)
            break
          case 'UPDATE_CART_QUANTITY':
            actions.updateCartQuantity(event.itemId, event.quantity)
            break
          case 'ADD_TO_WISHLIST':
            actions.addToWishlist(event.productId)
            break
          case 'REMOVE_FROM_WISHLIST':
            actions.removeFromWishlist(event.productId)
            break
          case 'SEARCH':
            actions.searchProducts(event.query, event.filters)
            break
          case 'PRICE_ALERT_CREATE':
            actions.createPriceAlert(event.productId, event.targetPrice)
            break
        }
      },

      // 工具方法
      getProductById: (id: string) => {
        const { products } = get()
        return products.find(product => product.id === id)
      },

      getCategoryById: (id: string) => {
        const { categories } = get()
        return categories.find(category => category.id === id)
      },

      getCartTotal: () => {
        const { cart } = get()
        return cart?.total || 0
      },

      getCartItemCount: () => {
        const { cart } = get()
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
      },

      isInCart: (productId: string, variantId?: string) => {
        const { cart } = get()
        if (!cart) return false
        
        return cart.items.some(item => 
          item.productId === productId && 
          (!variantId || item.variantId === variantId)
        )
      },

      isInWishlist: (productId: string) => {
        const { wishlists } = get()
        return wishlists.some(wishlist => 
          wishlist.items.some(item => item.productId === productId)
        )
      },
    }),
    {
      name: 'shopping-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlists: state.wishlists,
        priceAlerts: state.priceAlerts,
        viewHistory: state.viewHistory.slice(0, 50), // 只保存最近50条
      }),
    }
  )
)

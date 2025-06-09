import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  LifeService, 
  ServiceCategory,
  ServiceBooking,
  ServiceReview,
  ServiceRequest,
  ServiceFavorite,
  ServiceHistory,
  ServiceSearchFilters,
  ServicePromotion,
  LifeEvent
} from '@/types/life'

interface LifeStore {
  // 服务数据
  services: LifeService[]
  featuredServices: LifeService[]
  categories: ServiceCategory[]
  
  // 用户数据
  bookings: ServiceBooking[]
  favorites: ServiceFavorite[]
  history: ServiceHistory[]
  reviews: ServiceReview[]
  requests: ServiceRequest[]
  
  // 促销活动
  promotions: ServicePromotion[]
  
  // 搜索和筛选
  searchQuery: string
  searchFilters: ServiceSearchFilters
  selectedCategory: string | null
  userLocation: {
    latitude: number
    longitude: number
    address: string
  } | null
  
  // UI状态
  isLoading: boolean
  error: string | null
  
  // 服务操作
  addToFavorites: (serviceId: string) => void
  removeFromFavorites: (serviceId: string) => void
  viewService: (serviceId: string, duration: number) => void
  
  // 预订管理
  createBooking: (booking: Omit<ServiceBooking, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBooking: (bookingId: string, updates: Partial<ServiceBooking>) => void
  cancelBooking: (bookingId: string, reason: string) => void
  
  // 评价管理
  submitReview: (review: Omit<ServiceReview, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateReview: (reviewId: string, updates: Partial<ServiceReview>) => void
  
  // 需求管理
  createRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt'>) => void
  updateRequest: (requestId: string, updates: Partial<ServiceRequest>) => void
  
  // 搜索和筛选
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Partial<ServiceSearchFilters>) => void
  setSelectedCategory: (categoryId: string | null) => void
  setUserLocation: (location: { latitude: number; longitude: number; address: string }) => void
  clearSearch: () => void
  
  // 数据获取
  fetchServices: (category?: string) => Promise<void>
  fetchServiceById: (id: string) => Promise<LifeService | null>
  searchServices: (query: string, filters?: ServiceSearchFilters) => Promise<void>
  
  // 推荐系统
  getRecommendedServices: (limit?: number) => LifeService[]
  getNearbyServices: (limit?: number) => LifeService[]
  getPopularServices: (limit?: number) => LifeService[]
  
  // 事件处理
  handleLifeEvent: (event: LifeEvent) => void
  
  // 工具方法
  getServiceById: (id: string) => LifeService | undefined
  getCategoryById: (id: string) => ServiceCategory | undefined
  getBookingById: (id: string) => ServiceBooking | undefined
  isFavorite: (serviceId: string) => boolean
  getActiveBookings: () => ServiceBooking[]
  getCompletedBookings: () => ServiceBooking[]
  getUpcomingBookings: () => ServiceBooking[]
}

export const useLifeStore = create<LifeStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      services: [],
      featuredServices: [],
      categories: [],
      bookings: [],
      favorites: [],
      history: [],
      reviews: [],
      requests: [],
      promotions: [],
      searchQuery: '',
      searchFilters: {},
      selectedCategory: null,
      userLocation: null,
      isLoading: false,
      error: null,

      // 服务操作
      addToFavorites: (serviceId: string) => {
        const { services, favorites } = get()
        const service = services.find(s => s.id === serviceId)
        
        if (service && !favorites.some(f => f.serviceId === serviceId)) {
          const newFavorite: ServiceFavorite = {
            id: `favorite_${Date.now()}`,
            userId: 'current_user',
            serviceId,
            service,
            addedAt: new Date(),
          }
          
          set({ favorites: [...favorites, newFavorite] })
        }
      },

      removeFromFavorites: (serviceId: string) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(f => f.serviceId !== serviceId) })
      },

      viewService: (serviceId: string, duration: number) => {
        const { services, history } = get()
        const service = services.find(s => s.id === serviceId)
        
        if (service) {
          const existingIndex = history.findIndex(h => h.serviceId === serviceId)
          
          let updatedHistory: ServiceHistory[]
          
          if (existingIndex >= 0) {
            // 更新现有记录
            updatedHistory = history.map((item, index) => 
              index === existingIndex 
                ? { ...item, viewedAt: new Date(), duration }
                : item
            )
          } else {
            // 添加新记录
            const newHistory: ServiceHistory = {
              id: `history_${Date.now()}`,
              userId: 'current_user',
              serviceId,
              service,
              viewedAt: new Date(),
              duration,
              source: 'direct',
            }
            
            updatedHistory = [newHistory, ...history.slice(0, 99)] // 保留最近100条
          }
          
          set({ history: updatedHistory })
        }
      },

      // 预订管理
      createBooking: (bookingData) => {
        const newBooking: ServiceBooking = {
          ...bookingData,
          id: `booking_${Date.now()}`,
          timeline: [
            {
              id: `timeline_${Date.now()}`,
              status: 'pending',
              timestamp: new Date(),
              message: '预订已创建，等待服务商确认',
              actor: 'system',
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          bookings: [...state.bookings, newBooking]
        }))
      },

      updateBooking: (bookingId, updates) => {
        set(state => ({
          bookings: state.bookings.map(booking =>
            booking.id === bookingId
              ? { ...booking, ...updates, updatedAt: new Date() }
              : booking
          )
        }))
      },

      cancelBooking: (bookingId, reason) => {
        const { bookings } = get()
        const booking = bookings.find(b => b.id === bookingId)
        
        if (booking) {
          const newTimelineEntry = {
            id: `timeline_${Date.now()}`,
            status: 'cancelled' as const,
            timestamp: new Date(),
            message: `预订已取消：${reason}`,
            actor: 'customer' as const,
          }
          
          get().updateBooking(bookingId, {
            status: 'cancelled',
            timeline: [...booking.timeline, newTimelineEntry],
          })
        }
      },

      // 评价管理
      submitReview: (reviewData) => {
        const newReview: ServiceReview = {
          ...reviewData,
          id: `review_${Date.now()}`,
          helpfulCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          reviews: [...state.reviews, newReview]
        }))
      },

      updateReview: (reviewId, updates) => {
        set(state => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, ...updates, updatedAt: new Date() }
              : review
          )
        }))
      },

      // 需求管理
      createRequest: (requestData) => {
        const newRequest: ServiceRequest = {
          ...requestData,
          id: `request_${Date.now()}`,
          status: 'open',
          quotes: [],
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
        }
        
        set(state => ({
          requests: [...state.requests, newRequest]
        }))
      },

      updateRequest: (requestId, updates) => {
        set(state => ({
          requests: state.requests.map(request =>
            request.id === requestId ? { ...request, ...updates } : request
          )
        }))
      },

      // 搜索和筛选
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setSearchFilters: (filters: Partial<ServiceSearchFilters>) => {
        const { searchFilters } = get()
        set({ searchFilters: { ...searchFilters, ...filters } })
      },

      setSelectedCategory: (categoryId: string | null) => {
        set({ selectedCategory: categoryId })
      },

      setUserLocation: (location) => {
        set({ userLocation: location })
      },

      clearSearch: () => {
        set({ searchQuery: '', searchFilters: {}, selectedCategory: null })
      },

      // 数据获取 (模拟API调用)
      fetchServices: async (category?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟API延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 这里应该是实际的API调用
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '获取服务失败' 
          })
        }
      },

      fetchServiceById: async (id: string) => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          const { services } = get()
          return services.find(s => s.id === id) || null
        } catch (error) {
          console.error('Failed to fetch service:', error)
          return null
        }
      },

      searchServices: async (query: string, filters?: ServiceSearchFilters) => {
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
      getRecommendedServices: (limit = 10) => {
        const { services, history, favorites } = get()
        
        // 简单的推荐算法：基于浏览历史和收藏
        const viewedCategories = history.map(h => h.service.category.id)
        const favoriteCategories = favorites.map(f => f.service.category.id)
        const preferredCategories = [...new Set([...viewedCategories, ...favoriteCategories])]
        
        return services
          .filter(service => {
            // 过滤掉已收藏的服务
            const isFavorited = favorites.some(f => f.serviceId === service.id)
            if (isFavorited) return false
            
            // 基于偏好分类筛选
            if (preferredCategories.length > 0) {
              return preferredCategories.includes(service.category.id)
            }
            
            return true
          })
          .sort((a, b) => {
            // 按照评分和特色排序
            const scoreA = a.rating.overall * 0.7 + (a.isFeatured ? 1 : 0) * 0.3
            const scoreB = b.rating.overall * 0.7 + (b.isFeatured ? 1 : 0) * 0.3
            return scoreB - scoreA
          })
          .slice(0, limit)
      },

      getNearbyServices: (limit = 10) => {
        const { services, userLocation } = get()
        
        if (!userLocation) return services.slice(0, limit)
        
        // 简单的距离计算（实际应用中应使用更精确的地理计算）
        return services
          .filter(service => service.location.type !== 'online')
          .sort((a, b) => {
            // 这里应该计算实际距离，暂时使用随机排序
            return Math.random() - 0.5
          })
          .slice(0, limit)
      },

      getPopularServices: (limit = 10) => {
        const { services } = get()
        
        return services
          .sort((a, b) => {
            // 按照评分数量和评分排序
            const scoreA = a.rating.reviewCount * 0.6 + a.rating.overall * 0.4
            const scoreB = b.rating.reviewCount * 0.6 + b.rating.overall * 0.4
            return scoreB - scoreA
          })
          .slice(0, limit)
      },

      // 事件处理
      handleLifeEvent: (event: LifeEvent) => {
        const actions = get()
        
        switch (event.type) {
          case 'SERVICE_VIEW':
            actions.viewService(event.serviceId, event.duration)
            break
          case 'SERVICE_FAVORITE':
            actions.addToFavorites(event.serviceId)
            break
          case 'SERVICE_UNFAVORITE':
            actions.removeFromFavorites(event.serviceId)
            break
          case 'BOOKING_CREATE':
            actions.createBooking(event.booking)
            break
          case 'BOOKING_UPDATE':
            actions.updateBooking(event.bookingId, event.updates)
            break
          case 'BOOKING_CANCEL':
            actions.cancelBooking(event.bookingId, event.reason)
            break
          case 'REVIEW_SUBMIT':
            actions.submitReview(event.review)
            break
          case 'REQUEST_CREATE':
            actions.createRequest(event.request)
            break
          case 'SEARCH':
            actions.searchServices(event.query, event.filters)
            break
        }
      },

      // 工具方法
      getServiceById: (id: string) => {
        const { services } = get()
        return services.find(service => service.id === id)
      },

      getCategoryById: (id: string) => {
        const { categories } = get()
        return categories.find(category => category.id === id)
      },

      getBookingById: (id: string) => {
        const { bookings } = get()
        return bookings.find(booking => booking.id === id)
      },

      isFavorite: (serviceId: string) => {
        const { favorites } = get()
        return favorites.some(favorite => favorite.serviceId === serviceId)
      },

      getActiveBookings: () => {
        const { bookings } = get()
        return bookings.filter(booking => 
          booking.status === 'confirmed' || booking.status === 'in_progress'
        )
      },

      getCompletedBookings: () => {
        const { bookings } = get()
        return bookings.filter(booking => booking.status === 'completed')
      },

      getUpcomingBookings: () => {
        const { bookings } = get()
        const now = new Date()
        return bookings.filter(booking => 
          (booking.status === 'confirmed' || booking.status === 'pending') &&
          booking.scheduledDate > now
        )
      },
    }),
    {
      name: 'life-store',
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history.slice(0, 50), // 只保存最近50条
        bookings: state.bookings,
        reviews: state.reviews,
        requests: state.requests,
        userLocation: state.userLocation,
      }),
    }
  )
)

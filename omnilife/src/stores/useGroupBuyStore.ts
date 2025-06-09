import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  GroupBuySession, 
  GroupBuyProduct,
  GroupParticipant,
  GroupChat,
  ChatMessage,
  GroupBuyReview,
  GroupBuyUser,
  GroupActivity,
  GroupBuySearchFilters,
  AIRecommendation,
  GroupBuyEvent
} from '@/types/group'

interface GroupBuyStore {
  // 数据状态
  sessions: GroupBuySession[]
  products: GroupBuyProduct[]
  myParticipations: GroupParticipant[]
  chats: GroupChat[]
  reviews: GroupBuyReview[]
  activities: GroupActivity[]
  recommendations: AIRecommendation[]
  
  // 用户状态
  currentUser: GroupBuyUser | null
  
  // 搜索和筛选
  searchQuery: string
  searchFilters: GroupBuySearchFilters
  selectedCategory: string | null
  
  // UI状态
  isLoading: boolean
  error: string | null
  
  // 会话管理
  createSession: (session: Omit<GroupBuySession, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSession: (sessionId: string, updates: Partial<GroupBuySession>) => void
  deleteSession: (sessionId: string) => void
  
  // 参与管理
  joinSession: (sessionId: string, quantity: number, variants?: Record<string, string>) => void
  leaveSession: (sessionId: string, reason: string) => void
  updateParticipation: (participantId: string, updates: Partial<GroupParticipant>) => void
  
  // 支付管理
  processPayment: (sessionId: string, amount: number, method: string) => Promise<boolean>
  refundPayment: (participantId: string, reason: string) => Promise<boolean>
  
  // 聊天管理
  sendMessage: (sessionId: string, content: string, type?: ChatMessage['type']) => void
  addReaction: (messageId: string, emoji: string, userId: string) => void
  removeReaction: (messageId: string, emoji: string, userId: string) => void
  
  // 评价管理
  submitReview: (review: Omit<GroupBuyReview, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateReview: (reviewId: string, updates: Partial<GroupBuyReview>) => void
  markReviewHelpful: (reviewId: string, userId: string) => void
  
  // 搜索和筛选
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Partial<GroupBuySearchFilters>) => void
  setSelectedCategory: (categoryId: string | null) => void
  clearSearch: () => void
  
  // 推荐系统
  getRecommendedSessions: (limit?: number) => GroupBuySession[]
  getPopularSessions: (limit?: number) => GroupBuySession[]
  getEndingSoonSessions: (limit?: number) => GroupBuySession[]
  getFriendsActivities: (limit?: number) => GroupActivity[]
  
  // AI功能
  generateRecommendations: (sessionId: string) => Promise<AIRecommendation[]>
  optimizeGroupSize: (sessionId: string) => Promise<number>
  predictSuccessRate: (sessionId: string) => Promise<number>
  
  // 社交功能
  inviteFriends: (sessionId: string, userIds: string[]) => void
  shareSession: (sessionId: string, platform: string) => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  
  // 数据获取
  fetchSessions: (filters?: GroupBuySearchFilters) => Promise<void>
  fetchSessionById: (id: string) => Promise<GroupBuySession | null>
  fetchUserParticipations: (userId: string) => Promise<void>
  fetchChatMessages: (sessionId: string) => Promise<void>
  
  // 工具方法
  getSessionById: (id: string) => GroupBuySession | undefined
  getParticipantsBySession: (sessionId: string) => GroupParticipant[]
  getUserParticipation: (sessionId: string, userId: string) => GroupParticipant | undefined
  isUserParticipating: (sessionId: string, userId: string) => boolean
  canJoinSession: (sessionId: string) => boolean
  getSessionProgress: (sessionId: string) => number
  getTimeRemaining: (sessionId: string) => number
  
  // 事件处理
  handleGroupBuyEvent: (event: GroupBuyEvent) => void
}

export const useGroupBuyStore = create<GroupBuyStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      sessions: [],
      products: [],
      myParticipations: [],
      chats: [],
      reviews: [],
      activities: [],
      recommendations: [],
      currentUser: null,
      searchQuery: '',
      searchFilters: {},
      selectedCategory: null,
      isLoading: false,
      error: null,

      // 会话管理
      createSession: (sessionData) => {
        const newSession: GroupBuySession = {
          ...sessionData,
          id: `session_${Date.now()}`,
          currentSize: 0,
          participants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          sessions: [...state.sessions, newSession]
        }))
      },

      updateSession: (sessionId, updates) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, ...updates, updatedAt: new Date() }
              : session
          )
        }))
      },

      deleteSession: (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
          myParticipations: state.myParticipations.filter(p => p.sessionId !== sessionId),
          chats: state.chats.filter(chat => chat.sessionId !== sessionId),
        }))
      },

      // 参与管理
      joinSession: (sessionId, quantity, variants = {}) => {
        const { currentUser, sessions } = get()
        if (!currentUser) return

        const session = sessions.find(s => s.id === sessionId)
        if (!session || !get().canJoinSession(sessionId)) return

        const newParticipant: GroupParticipant = {
          id: `participant_${Date.now()}`,
          userId: currentUser.id,
          user: currentUser,
          sessionId,
          joinedAt: new Date(),
          status: 'pending',
          quantity,
          selectedVariants: variants,
          paymentStatus: 'pending',
          paymentAmount: session.pricing.groupPrice * quantity,
          socialConnections: [],
        }

        set(state => ({
          myParticipations: [...state.myParticipations, newParticipant],
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  currentSize: s.currentSize + quantity,
                  participants: [...s.participants, newParticipant],
                  updatedAt: new Date(),
                }
              : s
          )
        }))

        // 添加活动记录
        const activity: GroupActivity = {
          id: `activity_${Date.now()}`,
          type: 'join',
          userId: currentUser.id,
          user: currentUser,
          sessionId,
          description: `${currentUser.displayName} 加入了团购`,
          timestamp: new Date(),
        }

        set(state => ({
          activities: [...state.activities, activity]
        }))
      },

      leaveSession: (sessionId, reason) => {
        const { currentUser } = get()
        if (!currentUser) return

        const participation = get().getUserParticipation(sessionId, currentUser.id)
        if (!participation) return

        set(state => ({
          myParticipations: state.myParticipations.filter(p => p.id !== participation.id),
          sessions: state.sessions.map(s =>
            s.id === sessionId
              ? {
                  ...s,
                  currentSize: Math.max(0, s.currentSize - participation.quantity),
                  participants: s.participants.filter(p => p.id !== participation.id),
                  updatedAt: new Date(),
                }
              : s
          )
        }))

        // 添加活动记录
        const activity: GroupActivity = {
          id: `activity_${Date.now()}`,
          type: 'leave',
          userId: currentUser.id,
          user: currentUser,
          sessionId,
          description: `${currentUser.displayName} 退出了团购`,
          metadata: { reason },
          timestamp: new Date(),
        }

        set(state => ({
          activities: [...state.activities, activity]
        }))
      },

      updateParticipation: (participantId, updates) => {
        set(state => ({
          myParticipations: state.myParticipations.map(p =>
            p.id === participantId ? { ...p, ...updates } : p
          ),
          sessions: state.sessions.map(session => ({
            ...session,
            participants: session.participants.map(p =>
              p.id === participantId ? { ...p, ...updates } : p
            )
          }))
        }))
      },

      // 支付管理
      processPayment: async (sessionId, amount, method) => {
        try {
          // 模拟支付处理
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const { currentUser } = get()
          if (!currentUser) return false

          const participation = get().getUserParticipation(sessionId, currentUser.id)
          if (!participation) return false

          get().updateParticipation(participation.id, {
            paymentStatus: 'paid',
            status: 'confirmed',
          })

          // 添加活动记录
          const activity: GroupActivity = {
            id: `activity_${Date.now()}`,
            type: 'payment',
            userId: currentUser.id,
            user: currentUser,
            sessionId,
            description: `${currentUser.displayName} 完成了支付`,
            metadata: { amount, method },
            timestamp: new Date(),
          }

          set(state => ({
            activities: [...state.activities, activity]
          }))

          return true
        } catch (error) {
          console.error('Payment failed:', error)
          return false
        }
      },

      refundPayment: async (participantId, reason) => {
        try {
          // 模拟退款处理
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          get().updateParticipation(participantId, {
            paymentStatus: 'refunded',
            status: 'cancelled',
          })

          return true
        } catch (error) {
          console.error('Refund failed:', error)
          return false
        }
      },

      // 聊天管理
      sendMessage: (sessionId, content, type = 'text') => {
        const { currentUser } = get()
        if (!currentUser) return

        const message: ChatMessage = {
          id: `message_${Date.now()}`,
          senderId: currentUser.id,
          sender: currentUser,
          content,
          type,
          timestamp: new Date(),
          reactions: [],
        }

        set(state => {
          const chatIndex = state.chats.findIndex(chat => chat.sessionId === sessionId)
          
          if (chatIndex >= 0) {
            const updatedChats = [...state.chats]
            updatedChats[chatIndex] = {
              ...updatedChats[chatIndex],
              messages: [...updatedChats[chatIndex].messages, message]
            }
            return { chats: updatedChats }
          } else {
            const newChat: GroupChat = {
              id: `chat_${Date.now()}`,
              sessionId,
              participants: [currentUser.id],
              messages: [message],
              isActive: true,
              createdAt: new Date(),
            }
            return { chats: [...state.chats, newChat] }
          }
        })
      },

      addReaction: (messageId, emoji, userId) => {
        set(state => ({
          chats: state.chats.map(chat => ({
            ...chat,
            messages: chat.messages.map(message => {
              if (message.id !== messageId) return message
              
              const existingReaction = message.reactions.find(r => r.emoji === emoji)
              if (existingReaction) {
                if (!existingReaction.users.includes(userId)) {
                  return {
                    ...message,
                    reactions: message.reactions.map(r =>
                      r.emoji === emoji
                        ? {
                            ...r,
                            count: r.count + 1,
                            users: [...r.users, userId]
                          }
                        : r
                    )
                  }
                }
              } else {
                return {
                  ...message,
                  reactions: [
                    ...message.reactions,
                    { emoji, count: 1, users: [userId] }
                  ]
                }
              }
              
              return message
            })
          }))
        }))
      },

      removeReaction: (messageId, emoji, userId) => {
        set(state => ({
          chats: state.chats.map(chat => ({
            ...chat,
            messages: chat.messages.map(message => {
              if (message.id !== messageId) return message
              
              return {
                ...message,
                reactions: message.reactions
                  .map(r => {
                    if (r.emoji === emoji && r.users.includes(userId)) {
                      return {
                        ...r,
                        count: r.count - 1,
                        users: r.users.filter(u => u !== userId)
                      }
                    }
                    return r
                  })
                  .filter(r => r.count > 0)
              }
            })
          }))
        }))
      },

      // 评价管理
      submitReview: (reviewData) => {
        const newReview: GroupBuyReview = {
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

      markReviewHelpful: (reviewId, userId) => {
        set(state => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, helpfulCount: review.helpfulCount + 1 }
              : review
          )
        }))
      },

      // 搜索和筛选
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setSearchFilters: (filters: Partial<GroupBuySearchFilters>) => {
        const { searchFilters } = get()
        set({ searchFilters: { ...searchFilters, ...filters } })
      },

      setSelectedCategory: (categoryId: string | null) => {
        set({ selectedCategory: categoryId })
      },

      clearSearch: () => {
        set({ searchQuery: '', searchFilters: {}, selectedCategory: null })
      },

      // 推荐系统
      getRecommendedSessions: (limit = 10) => {
        const { sessions, currentUser, myParticipations } = get()
        
        if (!currentUser) return sessions.slice(0, limit)
        
        // 简单的推荐算法：基于用户历史和偏好
        return sessions
          .filter(session => {
            // 过滤掉已参与的
            const isParticipating = myParticipations.some(p => p.sessionId === session.id)
            if (isParticipating) return false
            
            // 只显示招募中的
            return session.status === 'recruiting'
          })
          .sort((a, b) => {
            // 简单评分：基于剩余时间和参与度
            const scoreA = (a.currentSize / a.targetSize) * 0.7 + 
                          (1 - (new Date(a.endsAt).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)) * 0.3
            const scoreB = (b.currentSize / b.targetSize) * 0.7 + 
                          (1 - (new Date(b.endsAt).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)) * 0.3
            return scoreB - scoreA
          })
          .slice(0, limit)
      },

      getPopularSessions: (limit = 10) => {
        const { sessions } = get()
        return sessions
          .filter(session => session.status === 'recruiting')
          .sort((a, b) => b.currentSize - a.currentSize)
          .slice(0, limit)
      },

      getEndingSoonSessions: (limit = 10) => {
        const { sessions } = get()
        const now = Date.now()
        
        return sessions
          .filter(session => {
            const timeRemaining = new Date(session.endsAt).getTime() - now
            return session.status === 'recruiting' && timeRemaining > 0 && timeRemaining < 24 * 60 * 60 * 1000 // 24小时内
          })
          .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
          .slice(0, limit)
      },

      getFriendsActivities: (limit = 20) => {
        const { activities } = get()
        return activities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      },

      // AI功能 (模拟)
      generateRecommendations: async (sessionId) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockRecommendations: AIRecommendation[] = [
          {
            id: `rec_${Date.now()}_1`,
            type: 'participant',
            title: '邀请更多朋友',
            description: '根据分析，邀请您的朋友可以提高成团概率',
            confidence: 0.85,
            reasoning: ['朋友网络活跃度高', '相似购买偏好'],
            suggestedActions: ['分享到朋友圈', '私信邀请好友'],
            expectedImpact: '提高成团概率 25%',
            createdAt: new Date(),
          }
        ]
        
        set(state => ({
          recommendations: [...state.recommendations, ...mockRecommendations]
        }))
        
        return mockRecommendations
      },

      optimizeGroupSize: async (sessionId) => {
        await new Promise(resolve => setTimeout(resolve, 800))
        return Math.floor(Math.random() * 20) + 10 // 模拟优化后的团购人数
      },

      predictSuccessRate: async (sessionId) => {
        await new Promise(resolve => setTimeout(resolve, 600))
        return Math.random() * 0.4 + 0.6 // 模拟成功率 60-100%
      },

      // 社交功能
      inviteFriends: (sessionId, userIds) => {
        // 模拟邀请朋友功能
        console.log(`Inviting friends ${userIds.join(', ')} to session ${sessionId}`)
      },

      shareSession: (sessionId, platform) => {
        // 模拟分享功能
        console.log(`Sharing session ${sessionId} to ${platform}`)
      },

      followUser: (userId) => {
        // 模拟关注用户功能
        console.log(`Following user ${userId}`)
      },

      unfollowUser: (userId) => {
        // 模拟取消关注功能
        console.log(`Unfollowing user ${userId}`)
      },

      // 数据获取 (模拟API调用)
      fetchSessions: async (filters) => {
        set({ isLoading: true, error: null })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '获取团购失败' 
          })
        }
      },

      fetchSessionById: async (id) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          const { sessions } = get()
          return sessions.find(s => s.id === id) || null
        } catch (error) {
          console.error('Failed to fetch session:', error)
          return null
        }
      },

      fetchUserParticipations: async (userId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 800))
          // 模拟获取用户参与记录
        } catch (error) {
          console.error('Failed to fetch participations:', error)
        }
      },

      fetchChatMessages: async (sessionId) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 600))
          // 模拟获取聊天消息
        } catch (error) {
          console.error('Failed to fetch chat messages:', error)
        }
      },

      // 工具方法
      getSessionById: (id) => {
        const { sessions } = get()
        return sessions.find(session => session.id === id)
      },

      getParticipantsBySession: (sessionId) => {
        const { sessions } = get()
        const session = sessions.find(s => s.id === sessionId)
        return session?.participants || []
      },

      getUserParticipation: (sessionId, userId) => {
        const { myParticipations } = get()
        return myParticipations.find(p => p.sessionId === sessionId && p.userId === userId)
      },

      isUserParticipating: (sessionId, userId) => {
        return !!get().getUserParticipation(sessionId, userId)
      },

      canJoinSession: (sessionId) => {
        const session = get().getSessionById(sessionId)
        if (!session) return false
        
        return (
          session.status === 'recruiting' &&
          session.currentSize < session.maxGroupSize &&
          new Date(session.endsAt) > new Date()
        )
      },

      getSessionProgress: (sessionId) => {
        const session = get().getSessionById(sessionId)
        if (!session) return 0
        
        return Math.min(100, (session.currentSize / session.targetSize) * 100)
      },

      getTimeRemaining: (sessionId) => {
        const session = get().getSessionById(sessionId)
        if (!session) return 0
        
        return Math.max(0, new Date(session.endsAt).getTime() - Date.now())
      },

      // 事件处理
      handleGroupBuyEvent: (event: GroupBuyEvent) => {
        const actions = get()
        
        switch (event.type) {
          case 'SESSION_CREATE':
            actions.createSession(event.session)
            break
          case 'SESSION_JOIN':
            actions.joinSession(event.sessionId, event.quantity)
            break
          case 'SESSION_LEAVE':
            actions.leaveSession(event.sessionId, event.reason)
            break
          case 'MESSAGE_SEND':
            actions.sendMessage(event.sessionId, event.message.content, event.message.type)
            break
          case 'REVIEW_SUBMIT':
            actions.submitReview(event.review)
            break
          case 'SEARCH':
            actions.setSearchQuery(event.query)
            if (event.filters) {
              actions.setSearchFilters(event.filters)
            }
            break
        }
      },
    }),
    {
      name: 'group-buy-store',
      partialize: (state) => ({
        myParticipations: state.myParticipations,
        reviews: state.reviews.slice(0, 50), // 保留最近50条评价
        activities: state.activities.slice(0, 100), // 保留最近100条活动
        currentUser: state.currentUser,
      }),
    }
  )
)

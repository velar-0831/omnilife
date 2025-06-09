import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  NewsArticle, 
  NewsCategory, 
  NewsSource, 
  TrendingTopic,
  UserNewsPreferences,
  NewsSearchFilters,
  BreakingNews,
  NewsEvent
} from '@/types/news'

interface NewsStore {
  // 文章数据
  articles: NewsArticle[]
  featuredArticles: NewsArticle[]
  breakingNews: BreakingNews[]
  trendingTopics: TrendingTopic[]
  
  // 分类和来源
  categories: NewsCategory[]
  sources: NewsSource[]
  
  // 用户数据
  bookmarkedArticles: NewsArticle[]
  likedArticles: NewsArticle[]
  readingHistory: Array<{
    article: NewsArticle
    readAt: Date
    readTime: number
  }>
  followedSources: NewsSource[]
  subscribedCategories: NewsCategory[]
  
  // 用户偏好
  preferences: UserNewsPreferences
  
  // UI状态
  selectedCategory: string | null
  searchQuery: string
  searchFilters: NewsSearchFilters
  isLoading: boolean
  error: string | null
  
  // 文章操作
  likeArticle: (articleId: string) => void
  unlikeArticle: (articleId: string) => void
  bookmarkArticle: (articleId: string) => void
  unbookmarkArticle: (articleId: string) => void
  shareArticle: (articleId: string, platform: string) => void
  markAsRead: (articleId: string, readTime: number) => void
  
  // 来源和分类管理
  followSource: (sourceId: string) => void
  unfollowSource: (sourceId: string) => void
  subscribeToCategory: (categoryId: string) => void
  unsubscribeFromCategory: (categoryId: string) => void
  
  // 搜索和筛选
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: Partial<NewsSearchFilters>) => void
  clearSearch: () => void
  
  // 分类选择
  setSelectedCategory: (categoryId: string | null) => void
  
  // 偏好设置
  updatePreferences: (preferences: Partial<UserNewsPreferences>) => void
  
  // 数据获取
  fetchArticles: (category?: string) => Promise<void>
  fetchTrendingTopics: () => Promise<void>
  fetchBreakingNews: () => Promise<void>
  searchArticles: (query: string, filters?: NewsSearchFilters) => Promise<void>
  
  // 事件处理
  handleNewsEvent: (event: NewsEvent) => void
  
  // 工具方法
  getArticleById: (id: string) => NewsArticle | undefined
  getRecommendedArticles: (limit?: number) => NewsArticle[]
  getCategoryById: (id: string) => NewsCategory | undefined
  getSourceById: (id: string) => NewsSource | undefined
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      articles: [],
      featuredArticles: [],
      breakingNews: [],
      trendingTopics: [],
      categories: [],
      sources: [],
      bookmarkedArticles: [],
      likedArticles: [],
      readingHistory: [],
      followedSources: [],
      subscribedCategories: [],
      preferences: {
        favoriteCategories: [],
        favoriteSources: [],
        blockedSources: [],
        blockedKeywords: [],
        preferredLanguages: ['zh-CN'],
        readingSpeed: 'normal',
        interests: [],
        notificationSettings: {
          breakingNews: true,
          dailyDigest: true,
          weeklyRoundup: false,
          categoryUpdates: [],
        },
      },
      selectedCategory: null,
      searchQuery: '',
      searchFilters: {},
      isLoading: false,
      error: null,

      // 文章操作
      likeArticle: (articleId: string) => {
        const { articles, likedArticles } = get()
        const article = articles.find(a => a.id === articleId)
        
        if (article && !likedArticles.some(a => a.id === articleId)) {
          set({
            likedArticles: [...likedArticles, { ...article, isLiked: true }],
            articles: articles.map(a => 
              a.id === articleId 
                ? { ...a, isLiked: true, likeCount: a.likeCount + 1 }
                : a
            )
          })
        }
      },

      unlikeArticle: (articleId: string) => {
        const { articles, likedArticles } = get()
        
        set({
          likedArticles: likedArticles.filter(a => a.id !== articleId),
          articles: articles.map(a => 
            a.id === articleId 
              ? { ...a, isLiked: false, likeCount: Math.max(0, a.likeCount - 1) }
              : a
          )
        })
      },

      bookmarkArticle: (articleId: string) => {
        const { articles, bookmarkedArticles } = get()
        const article = articles.find(a => a.id === articleId)
        
        if (article && !bookmarkedArticles.some(a => a.id === articleId)) {
          set({
            bookmarkedArticles: [...bookmarkedArticles, { ...article, isBookmarked: true }],
            articles: articles.map(a => 
              a.id === articleId ? { ...a, isBookmarked: true } : a
            )
          })
        }
      },

      unbookmarkArticle: (articleId: string) => {
        const { articles, bookmarkedArticles } = get()
        
        set({
          bookmarkedArticles: bookmarkedArticles.filter(a => a.id !== articleId),
          articles: articles.map(a => 
            a.id === articleId ? { ...a, isBookmarked: false } : a
          )
        })
      },

      shareArticle: (articleId: string, platform: string) => {
        const { articles } = get()
        
        set({
          articles: articles.map(a => 
            a.id === articleId 
              ? { ...a, shareCount: a.shareCount + 1 }
              : a
          )
        })
        
        // 这里可以添加实际的分享逻辑
        console.log(`Sharing article ${articleId} on ${platform}`)
      },

      markAsRead: (articleId: string, readTime: number) => {
        const { articles, readingHistory } = get()
        const article = articles.find(a => a.id === articleId)
        
        if (article) {
          const existingEntry = readingHistory.find(h => h.article.id === articleId)
          
          if (!existingEntry) {
            set({
              readingHistory: [
                { article, readAt: new Date(), readTime },
                ...readingHistory.slice(0, 99) // 保留最近100条记录
              ],
              articles: articles.map(a => 
                a.id === articleId 
                  ? { ...a, viewCount: a.viewCount + 1 }
                  : a
              )
            })
          }
        }
      },

      // 来源和分类管理
      followSource: (sourceId: string) => {
        const { sources, followedSources } = get()
        const source = sources.find(s => s.id === sourceId)
        
        if (source && !followedSources.some(s => s.id === sourceId)) {
          set({
            followedSources: [...followedSources, source]
          })
        }
      },

      unfollowSource: (sourceId: string) => {
        const { followedSources } = get()
        
        set({
          followedSources: followedSources.filter(s => s.id !== sourceId)
        })
      },

      subscribeToCategory: (categoryId: string) => {
        const { categories, subscribedCategories } = get()
        const category = categories.find(c => c.id === categoryId)
        
        if (category && !subscribedCategories.some(c => c.id === categoryId)) {
          set({
            subscribedCategories: [...subscribedCategories, category]
          })
        }
      },

      unsubscribeFromCategory: (categoryId: string) => {
        const { subscribedCategories } = get()
        
        set({
          subscribedCategories: subscribedCategories.filter(c => c.id !== categoryId)
        })
      },

      // 搜索和筛选
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setSearchFilters: (filters: Partial<NewsSearchFilters>) => {
        const { searchFilters } = get()
        set({ searchFilters: { ...searchFilters, ...filters } })
      },

      clearSearch: () => {
        set({ searchQuery: '', searchFilters: {} })
      },

      // 分类选择
      setSelectedCategory: (categoryId: string | null) => {
        set({ selectedCategory: categoryId })
      },

      // 偏好设置
      updatePreferences: (newPreferences: Partial<UserNewsPreferences>) => {
        const { preferences } = get()
        set({ preferences: { ...preferences, ...newPreferences } })
      },

      // 数据获取 (模拟API调用)
      fetchArticles: async (category?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟API延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 这里应该是实际的API调用
          // const response = await fetch(`/api/news/articles?category=${category}`)
          // const articles = await response.json()
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '获取文章失败' 
          })
        }
      },

      fetchTrendingTopics: async () => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          // const topics = await fetch('/api/news/trending').then(r => r.json())
        } catch (error) {
          console.error('Failed to fetch trending topics:', error)
        }
      },

      fetchBreakingNews: async () => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          // const breaking = await fetch('/api/news/breaking').then(r => r.json())
        } catch (error) {
          console.error('Failed to fetch breaking news:', error)
        }
      },

      searchArticles: async (query: string, filters?: NewsSearchFilters) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟搜索API调用
          await new Promise(resolve => setTimeout(resolve, 800))
          // const results = await fetch('/api/news/search', { ... })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '搜索失败' 
          })
        }
      },

      // 事件处理
      handleNewsEvent: (event: NewsEvent) => {
        const actions = get()
        
        switch (event.type) {
          case 'ARTICLE_LIKE':
            actions.likeArticle(event.articleId)
            break
          case 'ARTICLE_UNLIKE':
            actions.unlikeArticle(event.articleId)
            break
          case 'ARTICLE_BOOKMARK':
            actions.bookmarkArticle(event.articleId)
            break
          case 'ARTICLE_UNBOOKMARK':
            actions.unbookmarkArticle(event.articleId)
            break
          case 'ARTICLE_SHARE':
            actions.shareArticle(event.articleId, event.platform)
            break
          case 'ARTICLE_READ':
            actions.markAsRead(event.articleId, event.readTime)
            break
          case 'SOURCE_FOLLOW':
            actions.followSource(event.sourceId)
            break
          case 'SOURCE_UNFOLLOW':
            actions.unfollowSource(event.sourceId)
            break
          case 'CATEGORY_SUBSCRIBE':
            actions.subscribeToCategory(event.categoryId)
            break
          case 'CATEGORY_UNSUBSCRIBE':
            actions.unsubscribeFromCategory(event.categoryId)
            break
          case 'SEARCH':
            actions.searchArticles(event.query, event.filters)
            break
        }
      },

      // 工具方法
      getArticleById: (id: string) => {
        const { articles } = get()
        return articles.find(article => article.id === id)
      },

      getRecommendedArticles: (limit = 10) => {
        const { articles, preferences, readingHistory } = get()
        
        // 简单的推荐算法：基于用户偏好和阅读历史
        return articles
          .filter(article => {
            // 过滤掉已读文章
            const isRead = readingHistory.some(h => h.article.id === article.id)
            if (isRead) return false
            
            // 基于偏好分类筛选
            if (preferences.favoriteCategories.length > 0) {
              return preferences.favoriteCategories.includes(article.category.id)
            }
            
            return true
          })
          .sort((a, b) => {
            // 按照可信度和热度排序
            const scoreA = a.credibilityScore * 0.3 + a.viewCount * 0.7
            const scoreB = b.credibilityScore * 0.3 + b.viewCount * 0.7
            return scoreB - scoreA
          })
          .slice(0, limit)
      },

      getCategoryById: (id: string) => {
        const { categories } = get()
        return categories.find(category => category.id === id)
      },

      getSourceById: (id: string) => {
        const { sources } = get()
        return sources.find(source => source.id === id)
      },
    }),
    {
      name: 'news-store',
      partialize: (state) => ({
        bookmarkedArticles: state.bookmarkedArticles,
        likedArticles: state.likedArticles,
        readingHistory: state.readingHistory.slice(0, 50), // 只保存最近50条
        followedSources: state.followedSources,
        subscribedCategories: state.subscribedCategories,
        preferences: state.preferences,
      }),
    }
  )
)

// 新闻资讯相关类型定义

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  author: string
  source: NewsSource
  category: NewsCategory
  tags: string[]
  imageUrl?: string
  videoUrl?: string
  publishedAt: Date
  updatedAt: Date
  readTime: number // 预估阅读时间（分钟）
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  isBookmarked?: boolean
  isLiked?: boolean
  sentiment: 'positive' | 'negative' | 'neutral'
  credibilityScore: number // 0-100 可信度评分
  aiSummary?: string
  keyPoints: string[]
  relatedArticles: string[] // 相关文章ID
}

export interface NewsSource {
  id: string
  name: string
  logoUrl?: string
  website: string
  description: string
  credibilityRating: number // 0-5 星级评分
  bias: 'left' | 'center' | 'right' | 'unknown'
  country: string
  language: string
  isVerified: boolean
  followerCount: number
}

export interface NewsCategory {
  id: string
  name: string
  slug: string
  description: string
  iconName: string
  color: string
  isActive: boolean
  articleCount: number
  parentId?: string
  children?: NewsCategory[]
}

export interface TrendingTopic {
  id: string
  keyword: string
  description: string
  articleCount: number
  trendScore: number // 热度评分
  sentiment: 'positive' | 'negative' | 'neutral'
  relatedKeywords: string[]
  timeframe: '1h' | '6h' | '24h' | '7d'
  region: string
  category: NewsCategory
}

export interface UserNewsPreferences {
  favoriteCategories: string[]
  favoriteSources: string[]
  blockedSources: string[]
  blockedKeywords: string[]
  preferredLanguages: string[]
  readingSpeed: 'slow' | 'normal' | 'fast' // 影响推荐文章长度
  interests: string[]
  notificationSettings: {
    breakingNews: boolean
    dailyDigest: boolean
    weeklyRoundup: boolean
    categoryUpdates: string[]
  }
}

export interface NewsRecommendation {
  id: string
  article: NewsArticle
  reason: string
  confidence: number // 0-1
  type: 'trending' | 'personalized' | 'breaking' | 'related' | 'local'
  weight: number
}

export interface NewsSearchResult {
  articles: NewsArticle[]
  sources: NewsSource[]
  topics: TrendingTopic[]
  total: number
  query: string
  filters: NewsSearchFilters
  suggestions: string[]
}

export interface NewsSearchFilters {
  categories?: string[]
  sources?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  sentiment?: 'positive' | 'negative' | 'neutral'
  language?: string
  region?: string
  sortBy?: 'relevance' | 'date' | 'popularity' | 'credibility'
  readTime?: {
    min: number
    max: number
  }
}

export interface NewsComment {
  id: string
  articleId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: Date
  updatedAt: Date
  likeCount: number
  replyCount: number
  parentId?: string
  replies?: NewsComment[]
  isLiked?: boolean
  sentiment: 'positive' | 'negative' | 'neutral'
}

export interface BreakingNews {
  id: string
  article: NewsArticle
  severity: 'low' | 'medium' | 'high' | 'critical'
  region: string[]
  category: NewsCategory
  alertSent: boolean
  createdAt: Date
  expiresAt: Date
}

export interface NewsAnalytics {
  totalArticles: number
  totalSources: number
  categoriesDistribution: Record<string, number>
  sentimentDistribution: Record<string, number>
  topSources: Array<{
    source: NewsSource
    articleCount: number
  }>
  trendingTopics: TrendingTopic[]
  userEngagement: {
    totalReads: number
    totalLikes: number
    totalShares: number
    totalComments: number
    averageReadTime: number
  }
}

export interface NewsWidget {
  id: string
  type: 'headlines' | 'trending' | 'category' | 'source' | 'breaking'
  title: string
  config: {
    category?: string
    source?: string
    limit: number
    showImages: boolean
    showSummary: boolean
    autoRefresh: boolean
    refreshInterval: number // 秒
  }
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  isVisible: boolean
}

// API响应类型
export interface NewsApiResponse<T> {
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
    totalSources: number
    lastUpdated: Date
    processingTime: number
  }
}

// 新闻事件类型
export type NewsEvent = 
  | { type: 'ARTICLE_READ'; articleId: string; readTime: number }
  | { type: 'ARTICLE_LIKE'; articleId: string }
  | { type: 'ARTICLE_UNLIKE'; articleId: string }
  | { type: 'ARTICLE_BOOKMARK'; articleId: string }
  | { type: 'ARTICLE_UNBOOKMARK'; articleId: string }
  | { type: 'ARTICLE_SHARE'; articleId: string; platform: string }
  | { type: 'COMMENT_ADD'; articleId: string; comment: string }
  | { type: 'SOURCE_FOLLOW'; sourceId: string }
  | { type: 'SOURCE_UNFOLLOW'; sourceId: string }
  | { type: 'CATEGORY_SUBSCRIBE'; categoryId: string }
  | { type: 'CATEGORY_UNSUBSCRIBE'; categoryId: string }
  | { type: 'SEARCH'; query: string; filters?: NewsSearchFilters }

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Bookmark, 
  Clock, 
  Newspaper,
  Filter,
  Bell,
  Settings,
  Zap,
  Globe,
  Eye,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { NewsCard } from '@/components/features/News/NewsCard'
import { NewsList } from '@/components/features/News/NewsList'
import { useNewsStore } from '@/stores/useNewsStore'
import type { NewsArticle, NewsCategory, TrendingTopic } from '@/types/news'

// 模拟数据
const mockCategories: NewsCategory[] = [
  {
    id: '1',
    name: '科技',
    slug: 'tech',
    description: '最新科技资讯',
    iconName: 'Zap',
    color: '#0066FF',
    isActive: true,
    articleCount: 1250,
  },
  {
    id: '2',
    name: '财经',
    slug: 'finance',
    description: '财经新闻',
    iconName: 'TrendingUp',
    color: '#00D4AA',
    isActive: true,
    articleCount: 890,
  },
  {
    id: '3',
    name: '娱乐',
    slug: 'entertainment',
    description: '娱乐资讯',
    iconName: 'Heart',
    color: '#FF6B6B',
    isActive: true,
    articleCount: 567,
  },
  {
    id: '4',
    name: '体育',
    slug: 'sports',
    description: '体育新闻',
    iconName: 'Globe',
    color: '#8B5CF6',
    isActive: true,
    articleCount: 432,
  },
]

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'AI技术突破：GPT-5即将发布，性能提升10倍',
    summary: '据可靠消息，OpenAI即将发布GPT-5模型，在推理能力、多模态理解等方面实现重大突破...',
    content: '',
    author: '张科技',
    source: {
      id: 's1',
      name: '科技日报',
      logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop',
      website: 'tech-daily.com',
      description: '权威科技媒体',
      credibilityRating: 4.5,
      bias: 'center',
      country: 'CN',
      language: 'zh-CN',
      isVerified: true,
      followerCount: 1200000,
    },
    category: mockCategories[0],
    tags: ['AI', 'GPT', 'OpenAI', '人工智能'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    readTime: 5,
    viewCount: 125000,
    likeCount: 3200,
    commentCount: 456,
    shareCount: 890,
    sentiment: 'positive',
    credibilityScore: 92,
    aiSummary: 'OpenAI计划发布GPT-5，性能大幅提升，将在推理和多模态方面实现突破。',
    keyPoints: [
      '性能比GPT-4提升10倍',
      '支持更复杂的推理任务',
      '多模态理解能力增强',
      '预计2024年第二季度发布'
    ],
    relatedArticles: ['2', '3'],
  },
  {
    id: '2',
    title: '全球股市震荡，科技股领跌',
    summary: '受美联储加息预期影响，全球主要股指普遍下跌，科技股成为重灾区...',
    content: '',
    author: '李财经',
    source: {
      id: 's2',
      name: '财经周刊',
      logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop',
      website: 'finance-weekly.com',
      description: '专业财经媒体',
      credibilityRating: 4.2,
      bias: 'center',
      country: 'CN',
      language: 'zh-CN',
      isVerified: true,
      followerCount: 890000,
    },
    category: mockCategories[1],
    tags: ['股市', '科技股', '美联储', '加息'],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-15T09:15:00'),
    updatedAt: new Date('2024-01-15T09:15:00'),
    readTime: 3,
    viewCount: 89000,
    likeCount: 1200,
    commentCount: 234,
    shareCount: 567,
    sentiment: 'negative',
    credibilityScore: 88,
    aiSummary: '全球股市受加息预期影响下跌，科技股跌幅最大。',
    keyPoints: [
      '纳斯达克指数下跌2.3%',
      '苹果、微软等科技巨头领跌',
      '美联储加息预期升温',
      '投资者情绪谨慎'
    ],
    relatedArticles: ['1', '3'],
  },
  {
    id: '3',
    title: '春节档电影票房创新高，国产片表现亮眼',
    summary: '今年春节档总票房突破80亿元，多部国产电影获得观众好评...',
    content: '',
    author: '王娱乐',
    source: {
      id: 's3',
      name: '娱乐头条',
      logoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop',
      website: 'entertainment-news.com',
      description: '娱乐资讯平台',
      credibilityRating: 3.8,
      bias: 'center',
      country: 'CN',
      language: 'zh-CN',
      isVerified: true,
      followerCount: 650000,
    },
    category: mockCategories[2],
    tags: ['春节档', '电影', '票房', '国产片'],
    imageUrl: 'https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=600&h=400&fit=crop',
    publishedAt: new Date('2024-01-15T08:45:00'),
    updatedAt: new Date('2024-01-15T08:45:00'),
    readTime: 4,
    viewCount: 67000,
    likeCount: 2100,
    commentCount: 345,
    shareCount: 432,
    sentiment: 'positive',
    credibilityScore: 75,
    aiSummary: '春节档电影票房创历史新高，国产电影表现优异。',
    keyPoints: [
      '总票房突破80亿元',
      '《流浪地球3》领跑',
      '观众满意度提升',
      '国产片占比超过90%'
    ],
    relatedArticles: ['1', '2'],
  },
]

const mockTrendingTopics: TrendingTopic[] = [
  {
    id: 't1',
    keyword: 'GPT-5',
    description: 'OpenAI新一代AI模型',
    articleCount: 156,
    trendScore: 95,
    sentiment: 'positive',
    relatedKeywords: ['AI', 'OpenAI', '人工智能'],
    timeframe: '24h',
    region: '全球',
    category: mockCategories[0],
  },
  {
    id: 't2',
    keyword: '股市震荡',
    description: '全球股市波动',
    articleCount: 89,
    trendScore: 78,
    sentiment: 'negative',
    relatedKeywords: ['股市', '投资', '经济'],
    timeframe: '6h',
    region: '全球',
    category: mockCategories[1],
  },
  {
    id: 't3',
    keyword: '春节档',
    description: '春节电影档期',
    articleCount: 67,
    trendScore: 82,
    sentiment: 'positive',
    relatedKeywords: ['电影', '票房', '娱乐'],
    timeframe: '24h',
    region: '中国',
    category: mockCategories[2],
  },
]

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'following' | 'bookmarks'>('all')
  
  const {
    selectedCategory,
    bookmarkedArticles,
    likedArticles,
    readingHistory,
    followedSources,
    setSelectedCategory,
    setSearchQuery: setStoreSearchQuery,
  } = useNewsStore()

  // 模拟设置初始数据
  useEffect(() => {
    // 这里应该从API获取数据
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStoreSearchQuery(query)
  }

  const getDisplayArticles = () => {
    switch (selectedTab) {
      case 'bookmarks':
        return bookmarkedArticles
      case 'following':
        return mockArticles.filter(article => 
          followedSources.some(source => source.id === article.source.id)
        )
      default:
        return mockArticles
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">📰 资讯</h1>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setSelectedTab('all')}
                className={`text-sm transition-colors ${
                  selectedTab === 'all' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedTab('following')}
                className={`text-sm transition-colors ${
                  selectedTab === 'following' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                关注
              </button>
              <button
                onClick={() => setSelectedTab('bookmarks')}
                className={`text-sm transition-colors ${
                  selectedTab === 'bookmarks' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                收藏
              </button>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索新闻、作者、来源..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 分类导航 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">新闻分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>全部</span>
                    <span className="text-xs text-muted-foreground">
                      {mockArticles.length}
                    </span>
                  </div>
                </button>
                {mockCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-primary text-white' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {category.articleCount}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 热门话题 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTrendingTopics.map((topic, index) => (
                  <div key={topic.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {topic.keyword}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {topic.articleCount} 篇文章
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {topic.sentiment === 'positive' && '😊'}
                      {topic.sentiment === 'negative' && '😔'}
                      {topic.sentiment === 'neutral' && '😐'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 阅读统计 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">阅读统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">今日阅读</span>
                  <span className="text-white font-medium">12 篇</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">收藏文章</span>
                  <span className="text-white font-medium">{bookmarkedArticles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">点赞文章</span>
                  <span className="text-white font-medium">{likedArticles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">阅读历史</span>
                  <span className="text-white font-medium">{readingHistory.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 突发新闻 */}
            {mockArticles.slice(0, 1).map((article) => (
              <motion.div
                key={`breaking-${article.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-500 font-medium text-sm">突发新闻</span>
                </div>
                <NewsCard
                  article={article}
                  variant="featured"
                  onClick={() => console.log('Open article:', article.id)}
                />
              </motion.div>
            ))}

            {/* 新闻列表 */}
            <NewsList
              title={selectedCategory ? mockCategories.find(c => c.id === selectedCategory)?.name : '最新资讯'}
              articles={getDisplayArticles()}
              onArticleClick={(article) => console.log('Open article:', article.id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

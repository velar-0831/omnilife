'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  SortDesc, 
  Grid, 
  List, 
  RefreshCw,
  TrendingUp,
  Clock,
  Star,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { NewsCard } from './NewsCard'
import { useNewsStore } from '@/stores/useNewsStore'
import { cn } from '@/lib/utils'
import type { NewsArticle, NewsSearchFilters } from '@/types/news'

interface NewsListProps {
  title?: string
  articles?: NewsArticle[]
  showFilters?: boolean
  showViewToggle?: boolean
  showRefresh?: boolean
  variant?: 'grid' | 'list' | 'masonry'
  cardVariant?: 'default' | 'featured' | 'compact' | 'minimal'
  className?: string
  emptyMessage?: string
  onArticleClick?: (article: NewsArticle) => void
}

export function NewsList({
  title,
  articles: propArticles,
  showFilters = true,
  showViewToggle = true,
  showRefresh = true,
  variant = 'grid',
  cardVariant = 'default',
  className,
  emptyMessage = '暂无新闻',
  onArticleClick
}: NewsListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'credibility'>('date')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const {
    articles: storeArticles,
    selectedCategory,
    searchQuery,
    searchFilters,
    isLoading,
    fetchArticles,
    setSearchFilters
  } = useNewsStore()

  const articles = propArticles || storeArticles

  // 筛选和排序文章
  const filteredAndSortedArticles = React.useMemo(() => {
    let filtered = [...articles]

    // 按分类筛选
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category.id === selectedCategory)
    }

    // 按搜索查询筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.source.name.toLowerCase().includes(query)
      )
    }

    // 按筛选条件筛选
    if (searchFilters.sentiment) {
      filtered = filtered.filter(article => article.sentiment === searchFilters.sentiment)
    }

    if (searchFilters.sources?.length) {
      filtered = filtered.filter(article => 
        searchFilters.sources!.includes(article.source.id)
      )
    }

    if (searchFilters.dateRange) {
      const { from, to } = searchFilters.dateRange
      filtered = filtered.filter(article => {
        const publishDate = new Date(article.publishedAt)
        return publishDate >= from && publishDate <= to
      })
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'popularity':
          return (b.viewCount + b.likeCount + b.shareCount) - (a.viewCount + a.likeCount + a.shareCount)
        case 'credibility':
          return b.credibilityScore - a.credibilityScore
        default:
          return 0
      }
    })

    return filtered
  }, [articles, selectedCategory, searchQuery, searchFilters, sortBy])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchArticles(selectedCategory || undefined)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy)
  }

  const getGridCols = () => {
    switch (variant) {
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4'
      case 'list':
        return 'grid-cols-1'
      default:
        return viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 标题和控制栏 */}
      <div className="flex items-center justify-between">
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          )}
          <p className="text-muted-foreground">
            共 {filteredAndSortedArticles.length} 篇文章
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* 排序选择 */}
          <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
            <Button
              variant={sortBy === 'date' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('date')}
              className="text-xs"
            >
              <Clock className="w-3 h-3 mr-1" />
              最新
            </Button>
            <Button
              variant={sortBy === 'popularity' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('popularity')}
              className="text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              热门
            </Button>
            <Button
              variant={sortBy === 'credibility' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('credibility')}
              className="text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              可信
            </Button>
          </div>

          {/* 视图切换 */}
          {showViewToggle && variant === 'grid' && (
            <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="w-8 h-8"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="w-8 h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* 刷新按钮 */}
          {showRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-8 h-8"
            >
              <RefreshCw className={cn(
                "w-4 h-4",
                isRefreshing && "animate-spin"
              )} />
            </Button>
          )}
        </div>
      </div>

      {/* 快速筛选标签 */}
      {showFilters && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button
            variant={!searchFilters.sentiment ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchFilters({ sentiment: undefined })}
          >
            全部
          </Button>
          <Button
            variant={searchFilters.sentiment === 'positive' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchFilters({ sentiment: 'positive' })}
          >
            😊 正面
          </Button>
          <Button
            variant={searchFilters.sentiment === 'neutral' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchFilters({ sentiment: 'neutral' })}
          >
            😐 中性
          </Button>
          <Button
            variant={searchFilters.sentiment === 'negative' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSearchFilters({ sentiment: 'negative' })}
          >
            😔 负面
          </Button>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>加载中...</span>
          </div>
        </div>
      )}

      {/* 文章列表 */}
      {!isLoading && (
        <AnimatePresence mode="wait">
          {filteredAndSortedArticles.length > 0 ? (
            <motion.div
              key={`${viewMode}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                variant === 'masonry' ? getGridCols() : `grid ${getGridCols()}`,
                variant !== 'masonry' && "gap-6"
              )}
            >
              {filteredAndSortedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={variant === 'masonry' ? "break-inside-avoid mb-6" : ""}
                >
                  <NewsCard
                    article={article}
                    variant={
                      viewMode === 'list' ? 'compact' : 
                      cardVariant === 'featured' && index === 0 ? 'featured' : 
                      cardVariant
                    }
                    onClick={() => onArticleClick?.(article)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">{emptyMessage}</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  尝试调整搜索条件或筛选器
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 加载更多 */}
      {!isLoading && filteredAndSortedArticles.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="ghost" size="lg">
            加载更多文章
          </Button>
        </div>
      )}
    </div>
  )
}

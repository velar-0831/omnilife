'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Eye,
  Clock,
  TrendingUp,
  ExternalLink,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useNewsStore } from '@/stores/useNewsStore'
import { cn, formatRelativeTime, formatPlayCount } from '@/lib/utils'
import type { NewsArticle } from '@/types/news'

interface NewsCardProps {
  article: NewsArticle
  variant?: 'default' | 'featured' | 'compact' | 'minimal'
  showImage?: boolean
  showSummary?: boolean
  showActions?: boolean
  className?: string
  onClick?: () => void
}

export function NewsCard({ 
  article, 
  variant = 'default',
  showImage = true,
  showSummary = true,
  showActions = true,
  className,
  onClick
}: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    likeArticle,
    unlikeArticle,
    bookmarkArticle,
    unbookmarkArticle,
    shareArticle,
    markAsRead
  } = useNewsStore()

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (article.isLiked) {
      unlikeArticle(article.id)
    } else {
      likeArticle(article.id)
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (article.isBookmarked) {
      unbookmarkArticle(article.id)
    } else {
      bookmarkArticle(article.id)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    shareArticle(article.id, 'general')
    // 这里可以添加实际的分享逻辑
  }

  const handleCardClick = () => {
    markAsRead(article.id, article.readTime)
    onClick?.()
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getCredibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-400" />
    if (score >= 60) return <CheckCircle className="w-4 h-4 text-yellow-400" />
    return <AlertTriangle className="w-4 h-4 text-red-400" />
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("cursor-pointer", className)}
        onClick={handleCardClick}
      >
        <div className="flex items-start space-x-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
          {showImage && article.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
              {article.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{article.source.name}</span>
              <span>•</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card 
          className="cursor-pointer hover:bg-white/5 transition-all duration-300"
          variant="glass"
          onClick={handleCardClick}
        >
          <CardContent className="p-4">
            <div className="flex space-x-4">
              {showImage && article.imageUrl && (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{article.source.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                  </div>
                  {showActions && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={handleLike}
                      >
                        <Heart className={cn(
                          "w-3 h-3",
                          article.isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                        )} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={handleBookmark}
                      >
                        <Bookmark className={cn(
                          "w-3 h-3",
                          article.isBookmarked ? "text-primary fill-current" : "text-muted-foreground"
                        )} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card 
        className={cn(
          "cursor-pointer hover:scale-[1.02] transition-all duration-300 group",
          variant === 'featured' && "border-primary/20"
        )}
        variant="glass"
        hover="glow"
        onClick={handleCardClick}
      >
        {/* 图片区域 */}
        {showImage && article.imageUrl && (
          <div className={cn(
            "relative overflow-hidden",
            variant === 'featured' ? "h-48" : "h-32"
          )}>
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* 分类标签 */}
            <div className="absolute top-3 left-3">
              <span 
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>
            </div>
            
            {/* 可信度指示器 */}
            <div className="absolute top-3 right-3">
              {getCredibilityIcon(article.credibilityScore)}
            </div>
            
            {/* 热门标识 */}
            {article.viewCount > 10000 && (
              <div className="absolute bottom-3 right-3">
                <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/80 rounded-full">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">热门</span>
                </div>
              </div>
            )}
          </div>
        )}

        <CardContent className={cn("p-4", variant === 'featured' && "p-6")}>
          {/* 标题 */}
          <h3 className={cn(
            "font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors",
            variant === 'featured' ? "text-xl" : "text-lg"
          )}>
            {article.title}
          </h3>

          {/* 摘要 */}
          {showSummary && (
            <p className={cn(
              "text-muted-foreground mb-3 line-clamp-2",
              variant === 'featured' ? "text-base" : "text-sm"
            )}>
              {article.aiSummary || article.summary}
            </p>
          )}

          {/* AI关键点 */}
          {variant === 'featured' && article.keyPoints.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">关键要点</h4>
              <ul className="space-y-1">
                {article.keyPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <img 
                  src={article.source.logoUrl || '/default-source.png'} 
                  alt={article.source.name}
                  className="w-4 h-4 rounded"
                />
                <span>{article.source.name}</span>
              </div>
              <span>•</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{article.readTime}分钟</span>
              </div>
            </div>
            
            <div className={cn("text-sm", getSentimentColor(article.sentiment))}>
              {article.sentiment === 'positive' && '😊'}
              {article.sentiment === 'negative' && '😔'}
              {article.sentiment === 'neutral' && '😐'}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{formatPlayCount(article.viewCount)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{article.commentCount}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            {showActions && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleLike}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    article.isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                  )} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleBookmark}
                >
                  <Bookmark className={cn(
                    "w-4 h-4",
                    article.isBookmarked ? "text-primary fill-current" : "text-muted-foreground"
                  )} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

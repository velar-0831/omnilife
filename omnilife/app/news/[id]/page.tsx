'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Heart, 
  Bookmark, 
  Share2, 
  MessageCircle, 
  Eye,
  Clock,
  User,
  Calendar,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { NewsCard } from '@/components/features/News/NewsCard'
import { useNewsStore } from '@/stores/useNewsStore'
import { cn, formatRelativeTime, formatPlayCount, getSentimentColor } from '@/lib/utils'
import type { NewsArticle, NewsComment } from '@/types/news'

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

// 模拟文章详情数据
const mockArticleDetail: NewsArticle = {
  id: '1',
  title: 'AI技术突破：GPT-5即将发布，性能提升10倍',
  summary: '据可靠消息，OpenAI即将发布GPT-5模型，在推理能力、多模态理解等方面实现重大突破，预计将彻底改变人工智能应用格局。',
  content: `
    <p>据多个可靠消息源透露，OpenAI正在紧锣密鼓地准备发布其下一代大型语言模型GPT-5。这一消息在科技界引起了巨大轰动，业内专家普遍认为这将是人工智能发展史上的又一个重要里程碑。</p>
    
    <h2>性能大幅提升</h2>
    <p>根据内部测试数据，GPT-5在多项基准测试中的表现比GPT-4提升了近10倍。特别是在复杂推理、数学计算和代码生成方面，新模型展现出了前所未有的能力。</p>
    
    <h2>多模态能力增强</h2>
    <p>GPT-5不仅在文本处理方面有所突破，在图像理解、音频处理和视频分析等多模态任务上也实现了显著改进。这意味着用户可以通过更自然的方式与AI进行交互。</p>
    
    <h2>应用前景广阔</h2>
    <p>业内分析师认为，GPT-5的发布将推动AI在教育、医疗、金融等多个领域的深度应用，可能会催生新的商业模式和产业机会。</p>
    
    <h2>发布时间</h2>
    <p>虽然OpenAI官方尚未正式确认发布时间，但多个消息源指向2024年第二季度。公司CEO Sam Altman在最近的采访中暗示，"令人兴奋的消息即将到来"。</p>
  `,
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
  category: {
    id: '1',
    name: '科技',
    slug: 'tech',
    description: '最新科技资讯',
    iconName: 'Zap',
    color: '#0066FF',
    isActive: true,
    articleCount: 1250,
  },
  tags: ['AI', 'GPT', 'OpenAI', '人工智能'],
  imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
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
}

const mockComments: NewsComment[] = [
  {
    id: 'c1',
    articleId: '1',
    userId: 'u1',
    userName: '科技爱好者',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
    content: '这真是令人兴奋的消息！期待GPT-5能够带来更多突破性的应用。',
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    likeCount: 23,
    replyCount: 3,
    sentiment: 'positive',
  },
  {
    id: 'c2',
    articleId: '1',
    userId: 'u2',
    userName: 'AI研究员',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
    content: '性能提升10倍听起来有些夸张，希望能看到更多技术细节和基准测试结果。',
    createdAt: new Date('2024-01-15T11:15:00'),
    updatedAt: new Date('2024-01-15T11:15:00'),
    likeCount: 15,
    replyCount: 1,
    sentiment: 'neutral',
  },
]

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [comments, setComments] = useState<NewsComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const {
    likeArticle,
    unlikeArticle,
    bookmarkArticle,
    unbookmarkArticle,
    shareArticle,
    markAsRead,
    getRecommendedArticles
  } = useNewsStore()

  useEffect(() => {
    // 模拟加载文章详情
    const loadArticle = async () => {
      setIsLoading(true)
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      setArticle(mockArticleDetail)
      setComments(mockComments)
      setIsLoading(false)
      
      // 标记为已读
      markAsRead(params.id, mockArticleDetail.readTime)
    }

    loadArticle()
  }, [params.id, markAsRead])

  const handleLike = () => {
    if (!article) return
    if (article.isLiked) {
      unlikeArticle(article.id)
    } else {
      likeArticle(article.id)
    }
  }

  const handleBookmark = () => {
    if (!article) return
    if (article.isBookmarked) {
      unbookmarkArticle(article.id)
    } else {
      bookmarkArticle(article.id)
    }
  }

  const handleShare = () => {
    if (!article) return
    shareArticle(article.id, 'general')
    // 这里可以添加实际的分享逻辑
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return
    
    const comment: NewsComment = {
      id: `c${Date.now()}`,
      articleId: article!.id,
      userId: 'current_user',
      userName: '当前用户',
      content: newComment,
      createdAt: new Date(),
      updatedAt: new Date(),
      likeCount: 0,
      replyCount: 0,
      sentiment: 'neutral',
    }
    
    setComments([comment, ...comments])
    setNewComment('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">文章不存在</p>
        </div>
      </div>
    )
  }

  const recommendedArticles = getRecommendedArticles(3)

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white truncate max-w-md">
              {article.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
            >
              <Heart className={cn(
                "w-5 h-5",
                article.isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
              )} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
            >
              <Bookmark className={cn(
                "w-5 h-5",
                article.isBookmarked ? "text-primary fill-current" : "text-muted-foreground"
              )} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* 文章头部 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span 
                    className="px-3 py-1 text-sm font-medium rounded-full text-white"
                    style={{ backgroundColor: article.category.color }}
                  >
                    {article.category.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-muted-foreground">已验证</span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {article.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6">
                  {article.summary}
                </p>
                
                {/* 元信息 */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={article.source.logoUrl} 
                        alt={article.source.name}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <p className="font-medium text-white">{article.source.name}</p>
                        <p className="text-sm text-muted-foreground">by {article.author}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatRelativeTime(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} 分钟阅读</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn("text-sm", getSentimentColor(article.sentiment))}>
                    {article.sentiment === 'positive' && '😊 正面'}
                    {article.sentiment === 'negative' && '😔 负面'}
                    {article.sentiment === 'neutral' && '😐 中性'}
                  </div>
                </div>
              </div>

              {/* 文章图片 */}
              {article.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              )}

              {/* AI关键点 */}
              {article.keyPoints.length > 0 && (
                <Card variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    AI提取的关键要点
                  </h3>
                  <ul className="space-y-2">
                    {article.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* 文章内容 */}
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* 文章标签 */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 文章统计和操作 */}
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatPlayCount(article.viewCount)} 阅读</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatPlayCount(article.likeCount)} 点赞</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{article.commentCount} 评论</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="w-4 h-4" />
                      <span>{article.shareCount} 分享</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      有用
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      无用
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4 mr-1" />
                      举报
                    </Button>
                  </div>
                </div>
              </Card>

              {/* 评论区 */}
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  评论 ({comments.length})
                </h3>
                
                {/* 发表评论 */}
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="发表你的看法..."
                    className="w-full p-3 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                      发表评论
                    </Button>
                  </div>
                </div>
                
                {/* 评论列表 */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img 
                        src={comment.userAvatar || '/default-avatar.png'} 
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{comment.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="text-muted-foreground hover:text-white flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comment.likeCount}</span>
                          </button>
                          <button className="text-muted-foreground hover:text-white">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.article>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息 */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">关于作者</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent-cyan/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-white">{article.author}</p>
                  <p className="text-sm text-muted-foreground">科技记者</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                专注于人工智能和前沿科技报道，拥有10年科技媒体从业经验。
              </p>
              <Button variant="ghost" size="sm" className="w-full">
                关注作者
              </Button>
            </Card>

            {/* 相关文章 */}
            {recommendedArticles.length > 0 && (
              <Card variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">相关文章</h3>
                <div className="space-y-4">
                  {recommendedArticles.map((relatedArticle) => (
                    <NewsCard
                      key={relatedArticle.id}
                      article={relatedArticle}
                      variant="minimal"
                      showImage={true}
                      showSummary={false}
                      showActions={false}
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* 热门标签 */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {['AI', 'GPT', 'OpenAI', '人工智能', '机器学习', '深度学习'].map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground hover:bg-primary/20 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

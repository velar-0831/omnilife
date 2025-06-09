'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Clock, 
  DollarSign,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  Target,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useGroupBuyStore } from '@/stores/useGroupBuyStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { GroupBuySession, GroupBuyStatus } from '@/types/group'

interface GroupBuyCardProps {
  session: GroupBuySession
  variant?: 'default' | 'featured' | 'compact' | 'list'
  showActions?: boolean
  className?: string
  onClick?: () => void
}

export function GroupBuyCard({ 
  session, 
  variant = 'default',
  showActions = true,
  className,
  onClick
}: GroupBuyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    currentUser,
    joinSession,
    leaveSession,
    isUserParticipating,
    canJoinSession,
    getSessionProgress,
    getTimeRemaining
  } = useGroupBuyStore()

  const isParticipating = currentUser ? isUserParticipating(session.id, currentUser.id) : false
  const canJoin = canJoinSession(session.id)
  const progress = getSessionProgress(session.id)
  const timeRemaining = getTimeRemaining(session.id)
  const coverImage = session.product.images.find(img => img.type === 'main') || session.product.images[0]
  
  const getStatusIcon = (status: GroupBuyStatus) => {
    switch (status) {
      case 'recruiting':
        return <Users className="w-4 h-4 text-blue-400" />
      case 'full':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: GroupBuyStatus) => {
    switch (status) {
      case 'recruiting':
        return '招募中'
      case 'full':
        return '已满员'
      case 'confirmed':
        return '已确认'
      case 'processing':
        return '处理中'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return '未知状态'
    }
  }

  const getStatusColor = (status: GroupBuyStatus) => {
    switch (status) {
      case 'recruiting':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'full':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return '已结束'
    
    const days = Math.floor(ms / (24 * 60 * 60 * 1000))
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    
    if (days > 0) return `${days}天${hours}小时`
    if (hours > 0) return `${hours}小时${minutes}分钟`
    return `${minutes}分钟`
  }

  const handleJoinSession = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canJoin && currentUser) {
      joinSession(session.id, 1)
    }
  }

  const handleLeaveSession = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isParticipating) {
      leaveSession(session.id, '用户主动退出')
    }
  }

  const savingsAmount = session.pricing.originalPrice - session.pricing.groupPrice
  const savingsPercentage = Math.round((savingsAmount / session.pricing.originalPrice) * 100)

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
          onClick={onClick}
        >
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                {coverImage ? (
                  <img 
                    src={coverImage.url} 
                    alt={session.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                )}
                
                {session.product.isFeatured && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                  {session.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{session.currentSize}/{session.targetSize}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Timer className="w-3 h-3" />
                    <span>{formatTimeRemaining(timeRemaining)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary text-sm">
                      {formatCurrency(session.pricing.groupPrice)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(session.pricing.originalPrice)}
                    </span>
                  </div>
                  
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(session.status)
                  )}>
                    {getStatusLabel(session.status)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card 
          className="cursor-pointer hover:bg-white/5 transition-all duration-300"
          variant="glass"
          onClick={onClick}
        >
          <CardContent className="p-6">
            <div className="flex space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                {coverImage ? (
                  <img 
                    src={coverImage.url} 
                    alt={session.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Gift className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                {session.product.isFeatured && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    精选
                  </div>
                )}
                
                {savingsPercentage > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    省{savingsPercentage}%
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{session.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{session.description}</p>
                  </div>
                  
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1",
                    getStatusColor(session.status)
                  )}>
                    {getStatusIcon(session.status)}
                    <span>{getStatusLabel(session.status)}</span>
                  </div>
                </div>
                
                {/* 进度条 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">团购进度</span>
                    <span className="text-white">{session.currentSize}/{session.targetSize}人</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent-cyan h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(session.pricing.groupPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(session.pricing.originalPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-green-400">
                          每人省 {formatCurrency(savingsAmount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-yellow-400" />
                      <div>
                        <p className="text-sm text-white">{formatTimeRemaining(timeRemaining)}</p>
                        <p className="text-xs text-muted-foreground">剩余时间</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-sm text-white">{session.organizer.displayName}</p>
                        <p className="text-xs text-muted-foreground">团长</p>
                      </div>
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        聊天
                      </Button>
                      
                      {isParticipating ? (
                        <Button variant="ghost" size="sm" onClick={handleLeaveSession}>
                          已参与
                        </Button>
                      ) : canJoin ? (
                        <Button size="sm" onClick={handleJoinSession}>
                          <Users className="w-4 h-4 mr-1" />
                          参与团购
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          无法参与
                        </Button>
                      )}
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "cursor-pointer group transition-all duration-300",
          variant === 'featured' && "border-primary/20",
          isHovered && "scale-[1.02] shadow-xl shadow-primary/20"
        )}
        variant="glass"
        onClick={onClick}
      >
        {/* 产品图片 */}
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? "h-64" : "h-48"
        )}>
          {coverImage ? (
            <img 
              src={coverImage.url} 
              alt={session.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
              <Gift className="w-16 h-16 text-primary" />
            </div>
          )}
          
          {/* 标签 */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {session.product.isFeatured && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                精选
              </span>
            )}
            {savingsPercentage > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                省{savingsPercentage}%
              </span>
            )}
          </div>
          
          {/* 状态指示器 */}
          <div className="absolute top-3 right-3">
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1",
              getStatusColor(session.status)
            )}>
              {getStatusIcon(session.status)}
              <span>{getStatusLabel(session.status)}</span>
            </div>
          </div>
          
          {/* 快速操作按钮 */}
          {showActions && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/20 backdrop-blur-sm"
                >
                  <Heart className="w-4 h-4 text-white" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/20 backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <CardContent className={cn("p-4", variant === 'featured' && "p-6")}>
          {/* 团购信息 */}
          <div className="mb-4">
            <h3 className={cn(
              "font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors mb-2",
              variant === 'featured' ? "text-lg" : "text-base"
            )}>
              {session.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {session.description}
            </p>
          </div>

          {/* 进度条 */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">团购进度</span>
              <span className="text-white">{session.currentSize}/{session.targetSize}人</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent-cyan h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          {/* 价格和时间 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "font-bold text-primary",
                  variant === 'featured' ? "text-xl" : "text-lg"
                )}>
                  {formatCurrency(session.pricing.groupPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(session.pricing.originalPrice)}
                </span>
              </div>
              <p className="text-xs text-green-400">
                每人省 {formatCurrency(savingsAmount)}
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">剩余时间</p>
            </div>
          </div>

          {/* 团长信息 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {session.organizer.avatar ? (
                  <img src={session.organizer.avatar} alt={session.organizer.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Users className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <span className="text-sm text-white">{session.organizer.displayName}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-muted-foreground">
                  {session.organizer.trustScore.toFixed(1)}
                </span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  聊天
                </Button>
                
                {isParticipating ? (
                  <Button variant="ghost" size="sm" onClick={handleLeaveSession}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    已参与
                  </Button>
                ) : canJoin ? (
                  <Button size="sm" onClick={handleJoinSession}>
                    <Users className="w-4 h-4 mr-1" />
                    参与
                  </Button>
                ) : (
                  <Button size="sm" disabled>
                    无法参与
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

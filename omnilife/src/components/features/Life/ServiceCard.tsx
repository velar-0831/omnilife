'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Users,
  Zap,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLifeStore } from '@/stores/useLifeStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { LifeService } from '@/types/life'

interface ServiceCardProps {
  service: LifeService
  variant?: 'default' | 'featured' | 'compact' | 'list'
  showActions?: boolean
  showProvider?: boolean
  className?: string
  onClick?: () => void
}

export function ServiceCard({ 
  service, 
  variant = 'default',
  showActions = true,
  showProvider = true,
  className,
  onClick
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    viewService
  } = useLifeStore()

  const isLiked = isFavorite(service.id)
  const coverImage = service.images.find(img => img.type === 'cover') || service.images[0]
  const hasDiscount = service.pricing.discounts && service.pricing.discounts.length > 0
  const activeDiscount = hasDiscount ? service.pricing.discounts.find(d => d.isActive) : null

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) {
      removeFromFavorites(service.id)
    } else {
      addToFavorites(service.id)
    }
  }

  const handleCardClick = () => {
    viewService(service.id, 0) // 浏览时长在详情页计算
    onClick?.()
  }

  const getPriceDisplay = () => {
    const { pricing } = service
    let price = pricing.basePrice
    
    if (activeDiscount) {
      if (activeDiscount.type === 'percentage') {
        price = pricing.basePrice * (1 - activeDiscount.value / 100)
      } else {
        price = pricing.basePrice - activeDiscount.value
      }
    }
    
    return {
      current: price,
      original: activeDiscount ? pricing.basePrice : undefined,
      unit: pricing.unit || '次'
    }
  }

  const priceDisplay = getPriceDisplay()

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
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                {coverImage ? (
                  <img 
                    src={coverImage.url} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                )}
                {service.isVerified && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                  {service.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{service.rating.overall.toFixed(1)}</span>
                  <span>({service.rating.reviewCount})</span>
                  {showProvider && (
                    <>
                      <span>•</span>
                      <span className="truncate">{service.provider.name}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary text-sm">
                      {formatCurrency(priceDisplay.current)}
                    </span>
                    {priceDisplay.original && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(priceDisplay.original)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">/{priceDisplay.unit}</span>
                  </div>
                  
                  {showActions && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleFavorite}
                      className="w-6 h-6"
                    >
                      <Heart className={cn(
                        "w-3 h-3",
                        isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                      )} />
                    </Button>
                  )}
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
          onClick={handleCardClick}
        >
          <CardContent className="p-6">
            <div className="flex space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                {coverImage ? (
                  <img 
                    src={coverImage.url} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                {service.isFeatured && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    精选
                  </div>
                )}
                
                {activeDiscount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    -{activeDiscount.value}{activeDiscount.type === 'percentage' ? '%' : '元'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{service.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{service.description}</p>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleFavorite}
                      >
                        <Heart className={cn(
                          "w-4 h-4",
                          isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                        )} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {showProvider && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      {service.provider.avatar ? (
                        <img src={service.provider.avatar} alt={service.provider.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Users className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-white">{service.provider.name}</span>
                    {service.provider.isVerified && (
                      <Shield className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white">{service.rating.overall.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({service.rating.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {service.location.address?.district || '上门服务'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {service.provider.responseTime}分钟响应
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(priceDisplay.current)}
                      </span>
                      {priceDisplay.original && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatCurrency(priceDisplay.original)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">/{priceDisplay.unit}</p>
                  </div>
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
        onClick={handleCardClick}
      >
        {/* 服务图片 */}
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? "h-64" : "h-48"
        )}>
          {coverImage ? (
            <img 
              src={coverImage.url} 
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
              <Zap className="w-16 h-16 text-primary" />
            </div>
          )}
          
          {/* 标签 */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {service.isFeatured && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded flex items-center">
                <Award className="w-3 h-3 mr-1" />
                精选
              </span>
            )}
            {service.isVerified && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                认证
              </span>
            )}
            {activeDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                -{activeDiscount.value}{activeDiscount.type === 'percentage' ? '%' : '元'}
              </span>
            )}
          </div>
          
          {/* 快速操作按钮 */}
          {showActions && (
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className="w-8 h-8 bg-black/20 backdrop-blur-sm"
              >
                <Heart className={cn(
                  "w-4 h-4",
                  isLiked ? "text-red-500 fill-current" : "text-white"
                )} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm"
              >
                <Bookmark className="w-4 h-4 text-white" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm"
              >
                <Share2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          )}
          
          {/* 可用性指示器 */}
          {!service.availability.isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">暂不可预约</p>
                {service.availability.nextAvailable && (
                  <p className="text-xs">
                    {formatRelativeTime(service.availability.nextAvailable)}可预约
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <CardContent className={cn("p-4", variant === 'featured' && "p-6")}>
          {/* 服务信息 */}
          <div className="mb-3">
            <h3 className={cn(
              "font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors mb-2",
              variant === 'featured' ? "text-lg" : "text-base"
            )}>
              {service.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>

          {/* 服务商信息 */}
          {showProvider && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {service.provider.avatar ? (
                  <img src={service.provider.avatar} alt={service.provider.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Users className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </div>
              <span className="text-sm text-white truncate">{service.provider.name}</span>
              {service.provider.isVerified && (
                <Shield className="w-4 h-4 text-green-400" />
              )}
            </div>
          )}

          {/* 评分和位置 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-white">{service.rating.overall.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({service.rating.reviewCount})</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {service.location.address?.district || '上门服务'}
                </span>
              </div>
            </div>
          </div>

          {/* 价格和操作 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "font-bold text-primary",
                  variant === 'featured' ? "text-xl" : "text-lg"
                )}>
                  {formatCurrency(priceDisplay.current)}
                </span>
                {priceDisplay.original && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(priceDisplay.original)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">/{priceDisplay.unit}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // 快速咨询功能
                }}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                咨询
              </Button>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // 立即预约功能
                }}
              >
                <Calendar className="w-4 h-4 mr-1" />
                预约
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

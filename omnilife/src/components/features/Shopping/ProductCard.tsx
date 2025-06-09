'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Star,
  Zap,
  Tag,
  TrendingUp,
  ArrowRight,
  Plus,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useShoppingStore } from '@/stores/useShoppingStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/types/shopping'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'featured' | 'compact' | 'list'
  showQuickActions?: boolean
  showARButton?: boolean
  className?: string
  onClick?: () => void
}

export function ProductCard({ 
  product, 
  variant = 'default',
  showQuickActions = true,
  showARButton = false,
  className,
  onClick
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    viewProduct
  } = useShoppingStore()

  const isLiked = isInWishlist(product.id)
  const inCart = isInCart(product.id)
  const mainImage = product.images.find(img => img.isDefault) || product.images[0]
  const hasDiscount = product.price.discount && product.price.discount.percentage > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAddingToCart(true)
    
    // 模拟添加到购物车的延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart(product.id, undefined, 1)
    setIsAddingToCart(false)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  const handleCardClick = () => {
    viewProduct(product.id, 0) // 浏览时长在详情页计算
    onClick?.()
  }

  const handleImageHover = (index: number) => {
    if (product.images.length > 1) {
      setCurrentImageIndex(index)
    }
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
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img 
                  src={mainImage?.url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                    -{product.price.discount!.percentage}%
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-primary">
                      {formatCurrency(product.price.current)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.price.original!)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {product.ratings.average.toFixed(1)}
                    </span>
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
          onClick={handleCardClick}
        >
          <CardContent className="p-6">
            <div className="flex space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img 
                  src={mainImage?.url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                    -{product.price.discount!.percentage}%
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    新品
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">{product.name}</h3>
                    <p className="text-muted-foreground">{product.brand}</p>
                  </div>
                  
                  {showQuickActions && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleWishlist}
                        className="w-8 h-8"
                      >
                        <Heart className={cn(
                          "w-4 h-4",
                          isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
                        )} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.shortDescription}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(product.price.current)}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatCurrency(product.price.original!)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {product.ratings.average.toFixed(1)} ({product.ratings.count})
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.inventory.isInStock}
                    className="min-w-[120px]"
                  >
                    {isAddingToCart ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : inCart ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        已添加
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        加入购物车
                      </>
                    )}
                  </Button>
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
        {/* 产品图片 */}
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? "h-64" : "h-48"
        )}>
          <img 
            src={product.images[currentImageIndex]?.url || mainImage?.url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* 标签 */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                新品
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                热销
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                -{product.price.discount!.percentage}%
              </span>
            )}
          </div>
          
          {/* 快速操作按钮 */}
          {showQuickActions && (
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleWishlist}
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
                <Eye className="w-4 h-4 text-white" />
              </Button>
              
              {showARButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/20 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </Button>
              )}
            </div>
          )}
          
          {/* 库存状态 */}
          {!product.inventory.isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">暂时缺货</p>
              </div>
            </div>
          )}
          
          {/* 图片导航点 */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product.images.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                  onMouseEnter={() => handleImageHover(index)}
                />
              ))}
            </div>
          )}
        </div>

        <CardContent className={cn("p-4", variant === 'featured' && "p-6")}>
          {/* 产品信息 */}
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            <h3 className={cn(
              "font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors",
              variant === 'featured' ? "text-lg" : "text-base"
            )}>
              {product.name}
            </h3>
          </div>

          {/* 评分 */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.ratings.average)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.ratings.average.toFixed(1)} ({product.ratings.count})
            </span>
          </div>

          {/* 价格 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className={cn(
                "font-bold text-primary",
                variant === 'featured' ? "text-xl" : "text-lg"
              )}>
                {formatCurrency(product.price.current)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price.original!)}
                </span>
              )}
            </div>
            
            {hasDiscount && (
              <div className="flex items-center space-x-1 text-green-400">
                <Tag className="w-3 h-3" />
                <span className="text-sm font-medium">
                  省 {formatCurrency(product.price.original! - product.price.current)}
                </span>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inventory.isInStock}
              className="flex-1"
              variant={inCart ? "secondary" : "default"}
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : inCart ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  已添加
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  加购物车
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                // 快速查看功能
              }}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Heart, 
  ShoppingCart, 
  Share2, 
  Star,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Check,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProductCard } from '@/components/features/Shopping/ProductCard'
import { useShoppingStore } from '@/stores/useShoppingStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { Product, ProductReview } from '@/types/shopping'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

// 模拟产品详情数据
const mockProductDetail: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max 256GB 深空黑色',
  description: `
    全新iPhone 15 Pro Max采用航空级钛金属设计，搭载强大的A17 Pro芯片，
    配备专业级摄影系统，支持5倍光学变焦，让你轻松捕捉远距离细节。
    
    主要特性：
    • A17 Pro芯片 - 3纳米工艺，性能提升20%
    • 钛金属设计 - 更轻更坚固
    • 48MP主摄像头 - 支持2倍和3倍变焦
    • 5倍长焦镜头 - 120mm焦距
    • Action Button - 可自定义功能
    • USB-C接口 - 支持USB 3.0传输
  `,
  shortDescription: 'A17 Pro芯片，钛金属设计，48MP主摄',
  brand: 'Apple',
  category: {
    id: '1',
    name: '数码科技',
    slug: 'electronics',
    description: '最新数码产品',
    iconName: 'Zap',
    isActive: true,
    productCount: 1250,
    filters: [],
  },
  images: [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
      alt: 'iPhone 15 Pro Max 正面',
      type: 'main',
      order: 0,
      isDefault: true,
    },
    {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
      alt: 'iPhone 15 Pro Max 背面',
      type: 'gallery',
      order: 1,
      isDefault: false,
    },
    {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop',
      alt: 'iPhone 15 Pro Max 侧面',
      type: 'gallery',
      order: 2,
      isDefault: false,
    },
  ],
  price: {
    current: 9999,
    original: 10999,
    currency: 'CNY',
    discount: {
      percentage: 9,
      amount: 1000,
      validUntil: new Date('2024-12-31'),
    },
    priceHistory: [],
  },
  specifications: [
    { id: 's1', name: '屏幕尺寸', value: '6.7', unit: '英寸', category: '显示', isHighlight: true },
    { id: 's2', name: '存储容量', value: '256', unit: 'GB', category: '存储', isHighlight: true },
    { id: 's3', name: '处理器', value: 'A17 Pro', unit: '', category: '性能', isHighlight: true },
    { id: 's4', name: '主摄像头', value: '48', unit: 'MP', category: '摄影', isHighlight: true },
    { id: 's5', name: '电池容量', value: '4441', unit: 'mAh', category: '续航', isHighlight: false },
    { id: 's6', name: '重量', value: '221', unit: 'g', category: '设计', isHighlight: false },
  ],
  variants: [
    {
      id: 'v1',
      name: '颜色',
      type: 'color',
      value: '深空黑色',
      sku: 'IP15PM-256-BLACK',
      inventory: 50,
      isAvailable: true,
    },
    {
      id: 'v2',
      name: '颜色',
      type: 'color',
      value: '原色钛金属',
      sku: 'IP15PM-256-NATURAL',
      inventory: 30,
      isAvailable: true,
    },
    {
      id: 'v3',
      name: '颜色',
      type: 'color',
      value: '蓝色钛金属',
      sku: 'IP15PM-256-BLUE',
      inventory: 25,
      isAvailable: true,
    },
  ],
  inventory: {
    total: 105,
    available: 105,
    reserved: 0,
    lowStockThreshold: 10,
    isInStock: true,
  },
  ratings: {
    average: 4.8,
    count: 1234,
    distribution: { 5: 800, 4: 300, 3: 100, 2: 20, 1: 14 },
    reviews: [],
  },
  tags: ['新品', '热销', '5G', 'Pro'],
  features: ['A17 Pro芯片', '钛金属设计', '48MP摄像头', '5倍光学变焦', 'Action Button'],
  isNew: true,
  isBestseller: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockReviews: ProductReview[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: '数码达人',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
    rating: 5,
    title: '非常满意的购买体验',
    content: '钛金属的质感真的很棒，A17 Pro的性能也很强劲，摄像头的表现超出预期。',
    images: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isVerified: true,
    helpfulCount: 23,
    variant: { color: '深空黑色' },
    pros: ['性能强劲', '摄像头优秀', '质感很好'],
    cons: ['价格较高'],
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: '摄影爱好者',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
    rating: 4,
    title: '摄像头确实不错',
    content: '5倍光学变焦很实用，夜景模式也有明显改善，就是电池续航一般。',
    images: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    isVerified: true,
    helpfulCount: 15,
    variant: { color: '蓝色钛金属' },
    pros: ['摄像头强大', '变焦效果好'],
    cons: ['续航一般', '发热明显'],
  },
]

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInCart,
    isInWishlist,
    viewProduct,
    getRecommendations
  } = useShoppingStore()

  useEffect(() => {
    // 模拟加载产品详情
    const loadProduct = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProduct(mockProductDetail)
      setSelectedVariant(mockProductDetail.variants[0]?.id || '')
      setIsLoading(false)
      
      // 记录浏览
      viewProduct(params.id, 0)
    }

    loadProduct()
  }, [params.id, viewProduct])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product.id, selectedVariant || undefined, quantity)
  }

  const handleToggleWishlist = () => {
    if (!product) return
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">商品不存在</p>
        </div>
      </div>
    )
  }

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant)
  const isLiked = isInWishlist(product.id)
  const inCart = isInCart(product.id, selectedVariant || undefined)
  const hasDiscount = product.price.discount && product.price.discount.percentage > 0
  const recommendedProducts = getRecommendations('similar', product.id)

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
              {product.name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 产品图片 */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img 
                src={product.images[selectedImageIndex]?.url} 
                alt={product.images[selectedImageIndex]?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 图片缩略图 */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0",
                    index === selectedImageIndex ? "border-primary" : "border-transparent"
                  )}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* AR试用按钮 */}
            <Button variant="ghost" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              AR试用
            </Button>
          </div>

          {/* 产品信息 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-muted-foreground">{product.brand}</span>
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">新品</span>
                )}
                {product.isBestseller && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">热销</span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.ratings.average)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-600"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.ratings.average} ({product.ratings.count} 评价)
                </span>
              </div>
            </div>

            {/* 价格 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price.current)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.price.original!)}
                    </span>
                    <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">
                      省 {formatCurrency(product.price.original! - product.price.current)}
                    </span>
                  </>
                )}
              </div>
              
              {hasDiscount && product.price.discount?.validUntil && (
                <p className="text-sm text-red-400">
                  限时优惠，截止到 {formatRelativeTime(product.price.discount.validUntil)}
                </p>
              )}
            </div>

            {/* 变体选择 */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-white">选择配置</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg border transition-colors",
                        selectedVariant === variant.id
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-white/20 hover:border-white/40"
                      )}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
                {selectedVariantData && (
                  <p className="text-sm text-muted-foreground">
                    库存: {selectedVariantData.inventory} 件
                  </p>
                )}
              </div>
            )}

            {/* 数量选择 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">数量</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-secondary rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-white font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  库存 {product.inventory.available} 件
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inventory.isInStock}
                className="flex-1"
                size="lg"
              >
                {inCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    已添加到购物车
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    加入购物车
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={handleToggleWishlist}
                className="px-6"
              >
                <Heart className={cn(
                  "w-5 h-5",
                  isLiked ? "text-red-500 fill-current" : ""
                )} />
              </Button>
            </div>

            {/* 服务保障 */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-white font-medium">免费配送</p>
                <p className="text-xs text-muted-foreground">满299元包邮</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-white font-medium">品质保证</p>
                <p className="text-xs text-muted-foreground">正品保障</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-white font-medium">7天退换</p>
                <p className="text-xs text-muted-foreground">无理由退换</p>
              </div>
            </div>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <div className="mt-16">
          <div className="flex space-x-8 border-b border-white/10">
            {[
              { key: 'description', label: '商品详情' },
              { key: 'specs', label: '规格参数' },
              { key: 'reviews', label: `用户评价 (${product.ratings.count})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "pb-4 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-muted-foreground">
                  {product.description}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(
                  product.specifications.reduce((acc, spec) => {
                    if (!acc[spec.category]) acc[spec.category] = []
                    acc[spec.category].push(spec)
                    return acc
                  }, {} as Record<string, typeof product.specifications>)
                ).map(([category, specs]) => (
                  <Card key={category} variant="glass">
                    <CardHeader>
                      <CardTitle>{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {specs.map((spec) => (
                        <div key={spec.id} className="flex justify-between">
                          <span className="text-muted-foreground">{spec.name}</span>
                          <span className="text-white font-medium">
                            {spec.value} {spec.unit}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* 评分统计 */}
                <Card variant="glass">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {product.ratings.average}
                        </div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-5 h-5",
                                i < Math.floor(product.ratings.average)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-600"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          基于 {product.ratings.count} 条评价
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-8">{rating}星</span>
                            <div className="flex-1 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ 
                                  width: `${((product.ratings.distribution[rating] || 0) / product.ratings.count) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">
                              {product.ratings.distribution[rating] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 评价列表 */}
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <Card key={review.id} variant="glass">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-white">{review.userName}</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={cn(
                                          "w-3 h-3",
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-600"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  {review.isVerified && (
                                    <span className="text-xs text-green-400">已验证购买</span>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatRelativeTime(review.createdAt)}
                              </span>
                            </div>
                            
                            <h5 className="font-medium text-white mb-2">{review.title}</h5>
                            <p className="text-muted-foreground mb-4">{review.content}</p>
                            
                            {review.variant && (
                              <p className="text-sm text-muted-foreground mb-4">
                                购买规格: {review.variant.color}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-white">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>有用 ({review.helpfulCount})</span>
                                </button>
                                <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-white">
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>无用</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 推荐商品 */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">相关推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.slice(0, 4).map((recommendedProduct) => (
                <ProductCard
                  key={recommendedProduct.id}
                  product={recommendedProduct}
                  variant="default"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

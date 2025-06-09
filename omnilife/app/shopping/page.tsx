'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  ShoppingCart as CartIcon, 
  Heart, 
  Grid, 
  List,
  SortDesc,
  Zap,
  Tag,
  TrendingUp,
  Star,
  Sparkles,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProductCard } from '@/components/features/Shopping/ProductCard'
import { ShoppingCart } from '@/components/features/Shopping/ShoppingCart'
import { useShoppingStore } from '@/stores/useShoppingStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product, ProductCategory } from '@/types/shopping'

// 模拟数据
const mockCategories: ProductCategory[] = [
  {
    id: '1',
    name: '数码科技',
    slug: 'electronics',
    description: '最新数码产品',
    iconName: 'Zap',
    isActive: true,
    productCount: 1250,
    filters: [],
  },
  {
    id: '2',
    name: '时尚服饰',
    slug: 'fashion',
    description: '潮流服装',
    iconName: 'Heart',
    isActive: true,
    productCount: 890,
    filters: [],
  },
  {
    id: '3',
    name: '家居生活',
    slug: 'home',
    description: '家居用品',
    iconName: 'Home',
    isActive: true,
    productCount: 567,
    filters: [],
  },
  {
    id: '4',
    name: '运动户外',
    slug: 'sports',
    description: '运动装备',
    iconName: 'Activity',
    isActive: true,
    productCount: 432,
    filters: [],
  },
]

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB 深空黑色',
    description: '全新iPhone 15 Pro Max，搭载A17 Pro芯片，钛金属设计，专业级摄影系统',
    shortDescription: 'A17 Pro芯片，钛金属设计，48MP主摄',
    brand: 'Apple',
    category: mockCategories[0],
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
        alt: 'iPhone 15 Pro Max',
        type: 'main',
        order: 0,
        isDefault: true,
      }
    ],
    price: {
      current: 9999,
      original: 10999,
      currency: 'CNY',
      discount: {
        percentage: 9,
        amount: 1000,
      },
      priceHistory: [],
    },
    specifications: [],
    variants: [
      {
        id: 'v1',
        name: '颜色',
        type: 'color',
        value: '深空黑色',
        sku: 'IP15PM-256-BLACK',
        inventory: 50,
        isAvailable: true,
      }
    ],
    inventory: {
      total: 100,
      available: 50,
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
    tags: ['新品', '热销', '5G'],
    features: ['A17 Pro芯片', '钛金属设计', '48MP摄像头'],
    isNew: true,
    isBestseller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'MacBook Pro 14英寸 M3芯片',
    description: '全新MacBook Pro，搭载M3芯片，14英寸Liquid Retina XDR显示屏',
    shortDescription: 'M3芯片，14英寸XDR显示屏，专业性能',
    brand: 'Apple',
    category: mockCategories[0],
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
        alt: 'MacBook Pro',
        type: 'main',
        order: 0,
        isDefault: true,
      }
    ],
    price: {
      current: 14999,
      currency: 'CNY',
      priceHistory: [],
    },
    specifications: [],
    variants: [],
    inventory: {
      total: 30,
      available: 30,
      reserved: 0,
      lowStockThreshold: 5,
      isInStock: true,
    },
    ratings: {
      average: 4.9,
      count: 567,
      distribution: { 5: 450, 4: 100, 3: 15, 2: 2, 1: 0 },
      reviews: [],
    },
    tags: ['专业', 'M3芯片'],
    features: ['M3芯片', 'XDR显示屏', '22小时续航'],
    isNew: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'AirPods Pro 第三代',
    description: '全新AirPods Pro，主动降噪，空间音频，无线充电盒',
    shortDescription: '主动降噪，空间音频，H2芯片',
    brand: 'Apple',
    category: mockCategories[0],
    images: [
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
        alt: 'AirPods Pro',
        type: 'main',
        order: 0,
        isDefault: true,
      }
    ],
    price: {
      current: 1899,
      original: 1999,
      currency: 'CNY',
      discount: {
        percentage: 5,
        amount: 100,
      },
      priceHistory: [],
    },
    specifications: [],
    variants: [],
    inventory: {
      total: 200,
      available: 180,
      reserved: 20,
      lowStockThreshold: 20,
      isInStock: true,
    },
    ratings: {
      average: 4.7,
      count: 2341,
      distribution: { 5: 1500, 4: 600, 3: 200, 2: 30, 1: 11 },
      reviews: [],
    },
    tags: ['降噪', '无线'],
    features: ['主动降噪', '空间音频', 'H2芯片'],
    isBestseller: true,
    isOnSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function ShoppingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'>('relevance')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[]
    priceRange: [number, number]
    rating: number
    inStock: boolean
  }>({
    categories: [],
    priceRange: [0, 50000],
    rating: 0,
    inStock: false,
  })

  const {
    selectedCategory,
    getCartItemCount,
    getCartTotal,
    setSelectedCategory,
    setSearchQuery: setStoreSearchQuery,
  } = useShoppingStore()

  const cartItemCount = getCartItemCount()
  const cartTotal = getCartTotal()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStoreSearchQuery(query)
  }

  const filteredProducts = React.useMemo(() => {
    let filtered = [...mockProducts]

    // 按分类筛选
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category.id === selectedCategory)
    }

    // 按搜索查询筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }

    // 按价格范围筛选
    filtered = filtered.filter(product => 
      product.price.current >= selectedFilters.priceRange[0] &&
      product.price.current <= selectedFilters.priceRange[1]
    )

    // 按评分筛选
    if (selectedFilters.rating > 0) {
      filtered = filtered.filter(product => product.ratings.average >= selectedFilters.rating)
    }

    // 按库存筛选
    if (selectedFilters.inStock) {
      filtered = filtered.filter(product => product.inventory.isInStock)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price.current - b.price.current
        case 'price_high':
          return b.price.current - a.price.current
        case 'rating':
          return b.ratings.average - a.ratings.average
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, searchQuery, selectedFilters, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">🛒 购物</h1>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-sm transition-colors ${
                  !selectedCategory ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                全部
              </button>
              {mockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-sm transition-colors ${
                    selectedCategory === category.id ? 'text-primary' : 'hover:text-primary'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索商品、品牌..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          {/* 购物车按钮 */}
          <Button
            variant="ghost"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <CartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏筛选 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 分类筛选 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">商品分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>全部商品</span>
                    <span className="text-xs text-muted-foreground">
                      {mockProducts.length}
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
                        {category.productCount}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 价格筛选 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">价格范围</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(selectedFilters.priceRange[0])}</span>
                    <span>{formatCurrency(selectedFilters.priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="100"
                    value={selectedFilters.priceRange[1]}
                    onChange={(e) => setSelectedFilters({
                      ...selectedFilters,
                      priceRange: [selectedFilters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[1000, 5000, 10000, 20000].map((price) => (
                    <button
                      key={price}
                      onClick={() => setSelectedFilters({
                        ...selectedFilters,
                        priceRange: [0, price]
                      })}
                      className="px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-white/10 transition-colors"
                    >
                      ≤{formatCurrency(price)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 评分筛选 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">用户评分</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedFilters({
                      ...selectedFilters,
                      rating: selectedFilters.rating === rating ? 0 : rating
                    })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedFilters.rating === rating ? 'bg-primary text-white' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm">及以上</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 购物车摘要 */}
            {cartItemCount > 0 && (
              <Card variant="glass" className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CartIcon className="w-5 h-5 mr-2 text-primary" />
                    购物车
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">商品数量</span>
                      <span className="text-white">{cartItemCount} 件</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">总金额</span>
                      <span className="text-primary font-bold">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsCartOpen(true)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    查看购物车
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">
                  {selectedCategory 
                    ? mockCategories.find(c => c.id === selectedCategory)?.name 
                    : '全部商品'
                  }
                </h2>
                <span className="text-muted-foreground">
                  共 {filteredProducts.length} 件商品
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* 排序 */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white text-sm"
                >
                  <option value="relevance">相关度</option>
                  <option value="price_low">价格从低到高</option>
                  <option value="price_high">价格从高到低</option>
                  <option value="rating">评分最高</option>
                  <option value="newest">最新上架</option>
                </select>

                {/* 视图切换 */}
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
              </div>
            </div>

            {/* 商品网格 */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    variant={viewMode === 'list' ? 'list' : index === 0 ? 'featured' : 'default'}
                    showARButton={true}
                    onClick={() => console.log('Open product:', product.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* 空状态 */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">没有找到商品</h3>
                <p className="text-muted-foreground mb-6">
                  尝试调整搜索条件或筛选器
                </p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setSelectedFilters({
                    categories: [],
                    priceRange: [0, 50000],
                    rating: 0,
                    inStock: false,
                  })
                }}>
                  清除筛选条件
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 购物车侧边栏 */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter,
  Grid,
  List,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Star,
  Gift,
  Zap,
  Crown,
  Target,
  MessageCircle,
  Bell,
  Settings,
  Sparkles,
  Brain,
  Heart,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { GroupBuyCard } from '@/components/features/GroupBuy/GroupBuyCard'
import { useGroupBuyStore } from '@/stores/useGroupBuyStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { GroupBuySession, ProductCategory } from '@/types/group'

// 模拟数据
const mockCategories: ProductCategory[] = [
  {
    id: '1',
    name: '数码科技',
    slug: 'electronics',
    description: '最新数码产品团购',
    icon: 'Zap',
    color: '#0066FF',
    productCount: 156,
    isPopular: true,
  },
  {
    id: '2',
    name: '美妆护肤',
    slug: 'beauty',
    description: '品牌美妆护肤产品',
    icon: 'Sparkles',
    color: '#FF6B9D',
    productCount: 234,
    isPopular: true,
  },
  {
    id: '3',
    name: '食品生鲜',
    slug: 'food',
    description: '新鲜食品团购',
    icon: 'Gift',
    color: '#00D4AA',
    productCount: 189,
    isPopular: true,
  },
  {
    id: '4',
    name: '家居生活',
    slug: 'home',
    description: '家居用品团购',
    icon: 'Crown',
    color: '#8B5CF6',
    productCount: 145,
    isPopular: false,
  },
  {
    id: '5',
    name: '服装配饰',
    slug: 'fashion',
    description: '时尚服装配饰',
    icon: 'Heart',
    color: '#F59E0B',
    productCount: 198,
    isPopular: false,
  },
]

const mockSessions: GroupBuySession[] = [
  {
    id: '1',
    productId: 'p1',
    product: {
      id: 'p1',
      name: 'iPhone 15 Pro Max 256GB',
      description: '最新款iPhone，A17 Pro芯片，钛金属设计',
      brand: 'Apple',
      category: mockCategories[0],
      images: [
        {
          id: 'img1',
          url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=400&fit=crop',
          type: 'main',
          alt: 'iPhone 15 Pro Max',
          order: 0,
          isDefault: true,
        }
      ],
      originalPrice: 9999,
      groupPrice: 8499,
      currency: 'CNY',
      minGroupSize: 10,
      maxGroupSize: 50,
      currentParticipants: 23,
      specifications: [],
      variants: [],
      features: ['A17 Pro芯片', '钛金属设计', '48MP主摄'],
      tags: ['数码', '手机', '苹果'],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3天后
    },
    organizerId: 'u1',
    organizer: {
      id: 'u1',
      username: 'techmaster',
      displayName: '数码达人',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      trustScore: 4.8,
      groupBuyHistory: {
        totalSessions: 15,
        successfulSessions: 14,
        totalSavings: 12000,
        averageRating: 4.8,
        badges: [],
        recentActivities: [],
      },
      socialProfile: {
        followersCount: 1200,
        followingCount: 300,
        friendsInGroups: 45,
        socialConnections: [],
        influenceScore: 85,
      },
      preferences: {
        categories: ['1'],
        priceRange: { min: 0, max: 10000 },
        brands: ['Apple'],
        deliveryPreference: 'both',
        groupSizePreference: 'medium',
        notificationSettings: {
          newGroups: true,
          groupUpdates: true,
          paymentReminders: true,
          deliveryNotifications: true,
          socialActivity: true,
          recommendations: true,
        },
      },
      isVerified: true,
      joinDate: new Date('2023-01-01'),
    },
    title: 'iPhone 15 Pro Max 团购 - 限时优惠',
    description: '全新iPhone 15 Pro Max，A17 Pro芯片性能强劲，钛金属设计更轻更坚固。团购价格优惠1500元，数量有限！',
    targetSize: 30,
    currentSize: 23,
    status: 'recruiting',
    pricing: {
      originalPrice: 9999,
      groupPrice: 8499,
      savingsPerPerson: 1500,
      totalSavings: 34500,
      currency: 'CNY',
      priceBreaks: [
        { minQuantity: 10, maxQuantity: 19, pricePerUnit: 8999, savingsPercentage: 10 },
        { minQuantity: 20, maxQuantity: 29, pricePerUnit: 8699, savingsPercentage: 13 },
        { minQuantity: 30, pricePerUnit: 8499, savingsPercentage: 15 },
      ],
      paymentTerms: {
        depositRequired: true,
        depositAmount: 1000,
        paymentMethods: ['alipay', 'wechat_pay'],
        refundPolicy: {
          cancellationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          refundPercentage: 100,
          processingFee: 0,
          conditions: ['团购失败全额退款', '个人原因退出扣除5%手续费'],
        },
      },
    },
    timeline: {
      recruitmentStart: new Date(),
      recruitmentEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      confirmationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      paymentDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deliveryStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      deliveryEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      milestones: [],
    },
    participants: [],
    rules: [],
    benefits: [],
    socialFeatures: {
      chatEnabled: true,
      votingEnabled: true,
      polls: [],
      sharedWishlist: true,
      referralRewards: [],
      socialProof: {
        friendsParticipating: [],
        influencersParticipating: [],
        communityEndorsements: [],
        mediaFeatures: [],
      },
    },
    aiRecommendations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
]

export default function GroupBuyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTab, setSelectedTab] = useState<'all' | 'hot' | 'ending' | 'my'>('all')
  
  const {
    sessions,
    selectedCategory,
    currentUser,
    myParticipations,
    getRecommendedSessions,
    getPopularSessions,
    getEndingSoonSessions,
    setSelectedCategory,
    setSearchQuery: setStoreSearchQuery,
  } = useGroupBuyStore()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStoreSearchQuery(query)
  }

  const getDisplaySessions = () => {
    switch (selectedTab) {
      case 'hot':
        return getPopularSessions(20)
      case 'ending':
        return getEndingSoonSessions(20)
      case 'my':
        return myParticipations.map(p => sessions.find(s => s.id === p.sessionId)).filter(Boolean) as GroupBuySession[]
      default:
        return mockSessions
    }
  }

  const filteredSessions = React.useMemo(() => {
    let displaySessions = getDisplaySessions()

    // 按分类筛选
    if (selectedCategory) {
      displaySessions = displaySessions.filter(session => session.product.category.id === selectedCategory)
    }

    // 按搜索查询筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      displaySessions = displaySessions.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.description.toLowerCase().includes(query) ||
        session.product.name.toLowerCase().includes(query) ||
        session.product.brand.toLowerCase().includes(query) ||
        session.product.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return displaySessions
  }, [selectedTab, selectedCategory, searchQuery, sessions, myParticipations])

  const quickStats = [
    {
      title: '活跃团购',
      value: mockSessions.filter(s => s.status === 'recruiting').length.toString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: '我的参与',
      value: myParticipations.length.toString(),
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
    {
      title: '累计节省',
      value: formatCurrency(myParticipations.reduce((sum, p) => sum + (p.paymentAmount * 0.15), 0)),
      icon: Gift,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: '信任评分',
      value: currentUser?.trustScore.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">👥 智能团购</h1>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { key: 'all', label: '全部团购' },
                { key: 'hot', label: '热门团购' },
                { key: 'ending', label: '即将结束' },
                { key: 'my', label: '我的团购' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`text-sm transition-colors ${
                    selectedTab === tab.key ? 'text-primary' : 'hover:text-primary'
                  }`}
                >
                  {tab.label}
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
                placeholder="搜索团购商品..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            
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
            
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              发起团购
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 快速统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bgColor)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 商品分类 */}
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
                    <span>全部分类</span>
                    <span className="text-xs text-muted-foreground">
                      {mockSessions.length}
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
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {category.productCount}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* AI推荐 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary" />
                  AI推荐
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">智能匹配</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    根据您的购买历史，为您推荐了3个高匹配度的团购
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">即将结束</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    有2个您关注的团购即将结束，建议尽快参与
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 热门团长 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  热门团长
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockSessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {session.organizer.avatar ? (
                        <img src={session.organizer.avatar} alt={session.organizer.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {session.organizer.displayName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {session.organizer.trustScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  发起团购
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  我的聊天
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  我的收藏
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  设置偏好
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">
                  {selectedCategory 
                    ? mockCategories.find(c => c.id === selectedCategory)?.name 
                    : selectedTab === 'all' ? '全部团购'
                    : selectedTab === 'hot' ? '热门团购'
                    : selectedTab === 'ending' ? '即将结束'
                    : '我的团购'
                  }
                </h2>
                <span className="text-muted-foreground">
                  共 {filteredSessions.length} 个团购
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>

            {/* 团购列表 */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
                : "grid-cols-1"
            )}>
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GroupBuyCard
                    session={session}
                    variant={viewMode === 'list' ? 'list' : index === 0 ? 'featured' : 'default'}
                    onClick={() => console.log('Open session:', session.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* 空状态 */}
            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">没有找到团购</h3>
                <p className="text-muted-foreground mb-6">
                  尝试调整搜索条件或选择其他分类
                </p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}>
                  清除筛选条件
                </Button>
              </div>
            )}

            {/* 加载更多 */}
            {filteredSessions.length > 0 && (
              <div className="text-center pt-8">
                <Button variant="ghost" size="lg">
                  加载更多团购
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

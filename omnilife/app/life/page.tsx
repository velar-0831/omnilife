'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  MapPin, 
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Zap,
  Home,
  Car,
  Utensils,
  Scissors,
  Wrench,
  Heart,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ServiceCard } from '@/components/features/Life/ServiceCard'
import { useLifeStore } from '@/stores/useLifeStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { LifeService, ServiceCategory } from '@/types/life'

// 模拟数据
const mockCategories: ServiceCategory[] = [
  {
    id: '1',
    name: '家政服务',
    slug: 'housekeeping',
    description: '专业家政清洁服务',
    icon: 'Home',
    color: '#0066FF',
    serviceCount: 1250,
    isPopular: true,
  },
  {
    id: '2',
    name: '维修服务',
    slug: 'repair',
    description: '家电维修上门服务',
    icon: 'Wrench',
    color: '#00D4AA',
    serviceCount: 890,
    isPopular: true,
  },
  {
    id: '3',
    name: '美容美发',
    slug: 'beauty',
    description: '专业美容美发服务',
    icon: 'Scissors',
    color: '#FF6B6B',
    serviceCount: 567,
    isPopular: true,
  },
  {
    id: '4',
    name: '外卖配送',
    slug: 'delivery',
    description: '快速外卖配送服务',
    icon: 'Utensils',
    color: '#8B5CF6',
    serviceCount: 432,
    isPopular: false,
  },
  {
    id: '5',
    name: '代驾服务',
    slug: 'driving',
    description: '安全代驾服务',
    icon: 'Car',
    color: '#F59E0B',
    serviceCount: 321,
    isPopular: false,
  },
]

const mockServices: LifeService[] = [
  {
    id: '1',
    name: '专业家庭深度清洁服务',
    description: '提供全屋深度清洁，包括厨房、卫生间、客厅、卧室等区域的专业清洁服务，使用环保清洁用品。',
    category: mockCategories[0],
    provider: {
      id: 'p1',
      name: '洁净家政',
      type: 'company',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop',
      description: '专业家政服务公司',
      phone: '400-123-4567',
      address: {
        street: '朝阳区建国路88号',
        district: '朝阳区',
        city: '北京',
        province: '北京',
        postalCode: '100020',
        country: '中国',
        coordinates: { latitude: 39.9042, longitude: 116.4074 }
      },
      businessHours: {
        monday: { isOpen: true, periods: [{ start: '08:00', end: '20:00' }] },
        tuesday: { isOpen: true, periods: [{ start: '08:00', end: '20:00' }] },
        wednesday: { isOpen: true, periods: [{ start: '08:00', end: '20:00' }] },
        thursday: { isOpen: true, periods: [{ start: '08:00', end: '20:00' }] },
        friday: { isOpen: true, periods: [{ start: '08:00', end: '20:00' }] },
        saturday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        sunday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
      },
      certifications: [],
      rating: 4.8,
      reviewCount: 1234,
      responseTime: 15,
      completionRate: 98,
      isVerified: true,
      joinDate: new Date('2020-01-01'),
      languages: ['中文'],
      serviceRadius: 20,
    },
    location: {
      type: 'mobile',
      serviceArea: {
        type: 'city',
        areas: ['朝阳区', '海淀区', '西城区'],
      },
      travelFee: 0,
      maxDistance: 20,
    },
    pricing: {
      type: 'package',
      basePrice: 199,
      currency: 'CNY',
      unit: '次',
      packages: [
        {
          id: 'pkg1',
          name: '标准清洁',
          description: '基础清洁服务',
          price: 199,
          duration: 180,
          includes: ['客厅清洁', '卧室清洁', '厨房清洁'],
          isPopular: false,
        },
        {
          id: 'pkg2',
          name: '深度清洁',
          description: '全面深度清洁',
          price: 299,
          duration: 240,
          includes: ['全屋深度清洁', '家电清洁', '窗户清洁'],
          isPopular: true,
        }
      ],
      paymentMethods: ['alipay', 'wechat_pay', 'cash'],
      discounts: [
        {
          type: 'percentage',
          value: 15,
          description: '新用户首单优惠',
          conditions: ['首次预约'],
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
          isActive: true,
        }
      ],
    },
    availability: {
      isAvailable: true,
      busyPeriods: [],
      advanceBooking: {
        required: true,
        minHours: 2,
        maxDays: 30,
      },
      instantBooking: false,
      cancellationPolicy: {
        freeUntil: 24,
        fees: [
          { hoursBeforeService: 12, feePercentage: 50 },
          { hoursBeforeService: 2, feePercentage: 100 },
        ],
        noShowFee: 100,
      },
    },
    rating: {
      overall: 4.8,
      aspects: {
        quality: 4.9,
        punctuality: 4.7,
        communication: 4.8,
        value: 4.6,
        professionalism: 4.9,
      },
      reviewCount: 1234,
      distribution: { 5: 800, 4: 300, 3: 100, 2: 20, 1: 14 },
    },
    features: ['环保清洁剂', '专业设备', '保险保障', '满意保证'],
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        type: 'cover',
        order: 0,
      }
    ],
    tags: ['家政', '清洁', '上门服务'],
    isActive: true,
    isVerified: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '家电维修上门服务',
    description: '专业维修各类家电，包括空调、洗衣机、冰箱、电视等，技师经验丰富，配件齐全。',
    category: mockCategories[1],
    provider: {
      id: 'p2',
      name: '快修师傅',
      type: 'individual',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      description: '10年维修经验',
      phone: '138-0000-1234',
      address: {
        street: '海淀区中关村大街1号',
        district: '海淀区',
        city: '北京',
        province: '北京',
        postalCode: '100080',
        country: '中国',
        coordinates: { latitude: 39.9042, longitude: 116.4074 }
      },
      businessHours: {
        monday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        tuesday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        wednesday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        thursday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        friday: { isOpen: true, periods: [{ start: '09:00', end: '18:00' }] },
        saturday: { isOpen: true, periods: [{ start: '10:00', end: '17:00' }] },
        sunday: { isOpen: false },
      },
      certifications: [],
      rating: 4.9,
      reviewCount: 567,
      responseTime: 30,
      completionRate: 95,
      isVerified: true,
      joinDate: new Date('2021-03-15'),
      languages: ['中文'],
      serviceRadius: 15,
    },
    location: {
      type: 'mobile',
      serviceArea: {
        type: 'radius',
        areas: [],
        radius: 15,
        centerPoint: { latitude: 39.9042, longitude: 116.4074 }
      },
      travelFee: 20,
      maxDistance: 15,
    },
    pricing: {
      type: 'custom',
      basePrice: 80,
      currency: 'CNY',
      unit: '次',
      additionalFees: [
        { name: '上门费', amount: 20, type: 'fixed', description: '上门服务费', isOptional: false },
        { name: '配件费', amount: 0, type: 'fixed', description: '根据实际配件收费', isOptional: true },
      ],
      paymentMethods: ['alipay', 'wechat_pay', 'cash'],
    },
    availability: {
      isAvailable: true,
      busyPeriods: [],
      advanceBooking: {
        required: false,
        minHours: 1,
        maxDays: 7,
      },
      instantBooking: true,
      cancellationPolicy: {
        freeUntil: 2,
        fees: [
          { hoursBeforeService: 1, feePercentage: 50 },
        ],
        noShowFee: 50,
      },
    },
    rating: {
      overall: 4.9,
      aspects: {
        quality: 4.9,
        punctuality: 4.8,
        communication: 4.9,
        value: 4.8,
        professionalism: 4.9,
      },
      reviewCount: 567,
      distribution: { 5: 450, 4: 100, 3: 15, 2: 2, 1: 0 },
    },
    features: ['快速响应', '原厂配件', '质保服务', '明码标价'],
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
        type: 'cover',
        order: 0,
      }
    ],
    tags: ['维修', '家电', '上门服务'],
    isActive: true,
    isVerified: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function LifePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTab, setSelectedTab] = useState<'all' | 'nearby' | 'popular' | 'favorites'>('all')
  
  const {
    selectedCategory,
    userLocation,
    favorites,
    getRecommendedServices,
    getNearbyServices,
    getPopularServices,
    setSelectedCategory,
    setSearchQuery: setStoreSearchQuery,
    setUserLocation
  } = useLifeStore()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStoreSearchQuery(query)
  }

  const getDisplayServices = () => {
    switch (selectedTab) {
      case 'nearby':
        return getNearbyServices(20)
      case 'popular':
        return getPopularServices(20)
      case 'favorites':
        return favorites.map(f => f.service)
      default:
        return mockServices
    }
  }

  const filteredServices = React.useMemo(() => {
    let services = getDisplayServices()

    // 按分类筛选
    if (selectedCategory) {
      services = services.filter(service => service.category.id === selectedCategory)
    }

    // 按搜索查询筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      services = services.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.provider.name.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return services
  }, [selectedTab, selectedCategory, searchQuery, favorites])

  const quickStats = [
    {
      title: '服务总数',
      value: mockServices.length.toString(),
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: '认证服务商',
      value: mockServices.filter(s => s.isVerified).length.toString(),
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: '平均评分',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: '我的收藏',
      value: favorites.length.toString(),
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">🏠 生活服务</h1>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { key: 'all', label: '全部服务' },
                { key: 'nearby', label: '附近服务' },
                { key: 'popular', label: '热门服务' },
                { key: 'favorites', label: '我的收藏' },
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
                placeholder="搜索服务、服务商..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          {/* 位置和视图切换 */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              {userLocation?.address || '定位中...'}
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
            {/* 服务分类 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">服务分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-primary text-white' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>全部服务</span>
                    <span className="text-xs text-muted-foreground">
                      {mockServices.length}
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
                        {category.serviceCount}
                      </span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* 热门服务商 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  热门服务商
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockServices.slice(0, 3).map((service, index) => (
                  <div key={service.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {service.provider.avatar ? (
                        <img src={service.provider.avatar} alt={service.provider.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">
                        {service.provider.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {service.rating.overall.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 快速预约 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-lg">快速预约</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  家政清洁
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Wrench className="w-4 h-4 mr-2" />
                  家电维修
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Scissors className="w-4 h-4 mr-2" />
                  美容美发
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Car className="w-4 h-4 mr-2" />
                  代驾服务
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
                    : selectedTab === 'all' ? '全部服务'
                    : selectedTab === 'nearby' ? '附近服务'
                    : selectedTab === 'popular' ? '热门服务'
                    : '我的收藏'
                  }
                </h2>
                <span className="text-muted-foreground">
                  共 {filteredServices.length} 个服务
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>

            {/* 服务列表 */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
                : "grid-cols-1"
            )}>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ServiceCard
                    service={service}
                    variant={viewMode === 'list' ? 'list' : index === 0 ? 'featured' : 'default'}
                    onClick={() => console.log('Open service:', service.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* 空状态 */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">没有找到服务</h3>
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
            {filteredServices.length > 0 && (
              <div className="text-center pt-8">
                <Button variant="ghost" size="lg">
                  加载更多服务
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Camera,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ServiceCard } from '@/components/features/Life/ServiceCard'
import { useLifeStore } from '@/stores/useLifeStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { LifeService, ServiceReview } from '@/types/life'

interface ServiceDetailPageProps {
  params: {
    id: string
  }
}

// 模拟服务详情数据
const mockServiceDetail: LifeService = {
  id: '1',
  name: '专业家庭深度清洁服务',
  description: `
    我们提供专业的家庭深度清洁服务，拥有10年以上的行业经验。我们的服务团队经过专业培训，
    使用环保清洁用品，确保您的家庭环境安全健康。

    服务包括：
    • 全屋深度清洁 - 客厅、卧室、厨房、卫生间全面清洁
    • 家电清洁 - 空调、冰箱、洗衣机等家电内外清洁
    • 窗户清洁 - 内外玻璃、窗框、窗台清洁
    • 地板护理 - 木地板、瓷砖深度清洁和护理
    • 除螨除菌 - 床垫、沙发、地毯除螨杀菌处理

    我们承诺：
    ✓ 使用环保清洁用品，对人体和宠物无害
    ✓ 专业设备，清洁效果显著
    ✓ 保险保障，服务过程中的意外损失由我们承担
    ✓ 满意保证，不满意免费重做
  `,
  category: {
    id: '1',
    name: '家政服务',
    slug: 'housekeeping',
    description: '专业家政清洁服务',
    icon: 'Home',
    color: '#0066FF',
    serviceCount: 1250,
    isPopular: true,
  },
  provider: {
    id: 'p1',
    name: '洁净家政',
    type: 'company',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop',
    description: '专业家政服务公司，成立于2013年，服务家庭超过10000户，获得多项行业认证。',
    phone: '400-123-4567',
    email: 'service@cleanhouse.com',
    website: 'https://cleanhouse.com',
    address: {
      street: '朝阳区建国路88号SOHO现代城',
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
    certifications: [
      {
        id: 'cert1',
        name: '家政服务资质证书',
        issuer: '北京市商务委员会',
        number: 'BJ2023001',
        issueDate: new Date('2023-01-01'),
        expiryDate: new Date('2025-01-01'),
        isVerified: true,
      }
    ],
    rating: 4.8,
    reviewCount: 1234,
    responseTime: 15,
    completionRate: 98,
    isVerified: true,
    joinDate: new Date('2020-01-01'),
    languages: ['中文', '英文'],
    serviceRadius: 20,
  },
  location: {
    type: 'mobile',
    serviceArea: {
      type: 'city',
      areas: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'],
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
        description: '适合日常维护清洁',
        price: 199,
        duration: 180,
        includes: ['客厅清洁', '卧室清洁', '厨房清洁', '卫生间清洁'],
        isPopular: false,
      },
      {
        id: 'pkg2',
        name: '深度清洁',
        description: '全面深度清洁，推荐首次使用',
        price: 299,
        duration: 240,
        includes: ['全屋深度清洁', '家电清洁', '窗户清洁', '除螨除菌'],
        isPopular: true,
      },
      {
        id: 'pkg3',
        name: '精装清洁',
        description: '最全面的清洁服务',
        price: 399,
        duration: 300,
        includes: ['深度清洁全套', '地板护理', '家具保养', '空气净化'],
        isPopular: false,
      }
    ],
    additionalFees: [
      { name: '高层费用', amount: 20, type: 'fixed', description: '10层以上加收', isOptional: true },
      { name: '加急费用', amount: 50, type: 'fixed', description: '24小时内服务', isOptional: true },
    ],
    discounts: [
      {
        type: 'percentage',
        value: 15,
        description: '新用户首单优惠',
        conditions: ['首次预约'],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      },
      {
        type: 'fixed',
        value: 50,
        description: '连续预约优惠',
        conditions: ['连续预约3次以上'],
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      }
    ],
    paymentMethods: ['alipay', 'wechat_pay', 'cash', 'bank_card'],
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
  features: ['环保清洁剂', '专业设备', '保险保障', '满意保证', '24小时客服', '免费复检'],
  images: [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
      type: 'cover',
      caption: '专业清洁团队',
      order: 0,
    },
    {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      type: 'gallery',
      caption: '清洁前后对比',
      order: 1,
    },
    {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
      type: 'gallery',
      caption: '环保清洁用品',
      order: 2,
    },
  ],
  tags: ['家政', '清洁', '上门服务', '环保', '专业'],
  isActive: true,
  isVerified: true,
  isFeatured: true,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date(),
}

const mockReviews: ServiceReview[] = [
  {
    id: 'r1',
    bookingId: 'b1',
    userId: 'u1',
    userName: '张女士',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
    providerId: 'p1',
    serviceId: '1',
    rating: {
      overall: 5,
      quality: 5,
      punctuality: 5,
      communication: 5,
      value: 4,
      professionalism: 5,
    },
    title: '非常满意的清洁服务',
    content: '服务人员非常专业，准时到达，清洁效果超出预期。使用的清洁用品没有刺激性气味，家里有小孩也很放心。会继续使用这个服务。',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
    ],
    pros: ['服务专业', '准时到达', '清洁彻底', '用品环保'],
    cons: ['价格稍高'],
    isVerified: true,
    helpfulCount: 23,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    response: {
      content: '感谢您的好评！我们会继续保持高质量的服务标准，为您提供更好的清洁体验。',
      timestamp: new Date('2024-01-11'),
      isOfficial: true,
    }
  },
  {
    id: 'r2',
    bookingId: 'b2',
    userId: 'u2',
    userName: '李先生',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
    providerId: 'p1',
    serviceId: '1',
    rating: {
      overall: 4,
      quality: 4,
      punctuality: 4,
      communication: 5,
      value: 4,
      professionalism: 4,
    },
    title: '整体不错，有改进空间',
    content: '清洁师傅很认真负责，沟通也很好。清洁效果基本满意，但有些细节地方还可以更仔细一些。',
    pros: ['态度好', '沟通顺畅'],
    cons: ['细节处理有待提升'],
    isVerified: true,
    helpfulCount: 15,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
]

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const [service, setService] = useState<LifeService | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'reviews' | 'provider'>('overview')
  const [showBookingModal, setShowBookingModal] = useState(false)

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    viewService,
    getRecommendedServices
  } = useLifeStore()

  useEffect(() => {
    // 模拟加载服务详情
    const loadService = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setService(mockServiceDetail)
      setSelectedPackage(mockServiceDetail.pricing.packages?.find(p => p.isPopular)?.id || '')
      setIsLoading(false)

      // 记录浏览
      viewService(params.id, 0)
    }

    loadService()
  }, [params.id, viewService])

  const handleToggleFavorite = () => {
    if (!service) return
    if (isFavorite(service.id)) {
      removeFromFavorites(service.id)
    } else {
      addToFavorites(service.id)
    }
  }

  const handleBookService = () => {
    setShowBookingModal(true)
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

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">服务不存在</p>
        </div>
      </div>
    )
  }

  const isLiked = isFavorite(service.id)
  const selectedPackageData = service.pricing.packages?.find(p => p.id === selectedPackage)
  const activeDiscount = service.pricing.discounts?.find(d => d.isActive)
  const recommendedServices = getRecommendedServices(4)

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
              {service.name}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
              <Heart className={cn(
                "w-5 h-5",
                isLiked ? "text-red-500 fill-current" : ""
              )} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 服务图片 */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-secondary">
                <img
                  src={service.images[selectedImageIndex]?.url}
                  alt={service.images[selectedImageIndex]?.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 图片缩略图 */}
              <div className="flex space-x-2 overflow-x-auto">
                {service.images.map((image, index) => (
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
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 服务信息标签页 */}
            <div>
              <div className="flex space-x-8 border-b border-white/10">
                {[
                  { key: 'overview', label: '服务详情' },
                  { key: 'packages', label: '套餐价格' },
                  { key: 'reviews', label: `用户评价 (${service.rating.reviewCount})` },
                  { key: 'provider', label: '服务商' },
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
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* 服务描述 */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">服务介绍</h3>
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-line text-muted-foreground">
                          {service.description}
                        </div>
                      </div>
                    </div>

                    {/* 服务特色 */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">服务特色</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 服务区域 */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">服务区域</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.location.serviceArea.areas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                      {service.location.maxDistance && (
                        <p className="text-sm text-muted-foreground mt-2">
                          服务半径: {service.location.maxDistance} 公里
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">选择服务套餐</h3>

                    <div className="grid gap-4">
                      {service.pricing.packages?.map((pkg) => (
                        <Card
                          key={pkg.id}
                          variant="glass"
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedPackage === pkg.id && "border-primary/50 bg-primary/5",
                            pkg.isPopular && "border-orange-500/30"
                          )}
                          onClick={() => setSelectedPackage(pkg.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="text-lg font-semibold text-white">{pkg.name}</h4>
                                  {pkg.isPopular && (
                                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                                      推荐
                                    </span>
                                  )}
                                </div>
                                <p className="text-muted-foreground mb-4">{pkg.description}</p>

                                <div className="space-y-2">
                                  {pkg.includes.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                      <span className="text-sm text-white">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="text-right ml-6">
                                <div className="text-2xl font-bold text-primary">
                                  {formatCurrency(pkg.price)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  约 {pkg.duration} 分钟
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 额外费用 */}
                    {service.pricing.additionalFees && service.pricing.additionalFees.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">可选附加服务</h4>
                        <div className="space-y-2">
                          {service.pricing.additionalFees.map((fee, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                              <div>
                                <span className="text-white">{fee.name}</span>
                                <p className="text-sm text-muted-foreground">{fee.description}</p>
                              </div>
                              <span className="text-primary font-medium">
                                +{formatCurrency(fee.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                              {service.rating.overall.toFixed(1)}
                            </div>
                            <div className="flex items-center justify-center space-x-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-5 h-5",
                                    i < Math.floor(service.rating.overall)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">
                              基于 {service.rating.reviewCount} 条评价
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
                                      width: `${((service.rating.distribution[rating] || 0) / service.rating.reviewCount) * 100}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-12">
                                  {service.rating.distribution[rating] || 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 各方面评分 */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <h4 className="font-semibold text-white mb-4">各方面评分</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(service.rating.aspects).map(([key, value]) => {
                              const labels = {
                                quality: '服务质量',
                                punctuality: '准时性',
                                communication: '沟通',
                                value: '性价比',
                                professionalism: '专业性'
                              }
                              return (
                                <div key={key} className="text-center">
                                  <div className="text-lg font-bold text-primary">{value.toFixed(1)}</div>
                                  <div className="text-sm text-muted-foreground">{labels[key as keyof typeof labels]}</div>
                                </div>
                              )
                            })}
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
                                              i < review.rating.overall
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-600"
                                            )}
                                          />
                                        ))}
                                      </div>
                                      {review.isVerified && (
                                        <span className="text-xs text-green-400">已验证</span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {formatRelativeTime(review.createdAt)}
                                  </span>
                                </div>

                                <h5 className="font-medium text-white mb-2">{review.title}</h5>
                                <p className="text-muted-foreground mb-4">{review.content}</p>

                                {/* 优缺点 */}
                                {(review.pros.length > 0 || review.cons.length > 0) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {review.pros.length > 0 && (
                                      <div>
                                        <h6 className="text-sm font-medium text-green-400 mb-2">优点</h6>
                                        <ul className="space-y-1">
                                          {review.pros.map((pro, index) => (
                                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                                              <ThumbsUp className="w-3 h-3 mr-2 text-green-400" />
                                              {pro}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {review.cons.length > 0 && (
                                      <div>
                                        <h6 className="text-sm font-medium text-red-400 mb-2">缺点</h6>
                                        <ul className="space-y-1">
                                          {review.cons.map((con, index) => (
                                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                                              <ThumbsDown className="w-3 h-3 mr-2 text-red-400" />
                                              {con}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* 评价图片 */}
                                {review.images && review.images.length > 0 && (
                                  <div className="grid grid-cols-3 gap-2 mb-4">
                                    {review.images.map((imageUrl, index) => (
                                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                                        <img
                                          src={imageUrl}
                                          alt={`评价图片 ${index + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* 服务商回复 */}
                                {review.response && (
                                  <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Users className="w-3 h-3 text-primary" />
                                      </div>
                                      <span className="text-sm font-medium text-white">服务商回复</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(review.response.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{review.response.content}</p>
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-white">
                                      <ThumbsUp className="w-4 h-4" />
                                      <span>有用 ({review.helpfulCount})</span>
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

                {activeTab === 'provider' && (
                  <div className="space-y-6">
                    {/* 服务商基本信息 */}
                    <Card variant="glass">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden">
                            {service.provider.logo ? (
                              <img
                                src={service.provider.logo}
                                alt={service.provider.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-xl font-semibold text-white">{service.provider.name}</h3>
                              {service.provider.isVerified && (
                                <Shield className="w-5 h-5 text-green-400" />
                              )}
                            </div>

                            <p className="text-muted-foreground mb-4">{service.provider.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{service.provider.rating.toFixed(1)}</div>
                                <div className="text-sm text-muted-foreground">服务评分</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{service.provider.reviewCount}</div>
                                <div className="text-sm text-muted-foreground">服务次数</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{service.provider.responseTime}分钟</div>
                                <div className="text-sm text-muted-foreground">响应时间</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{service.provider.completionRate}%</div>
                                <div className="text-sm text-muted-foreground">完成率</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 营业时间 */}
                    <Card variant="glass">
                      <CardHeader>
                        <CardTitle>营业时间</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(service.provider.businessHours).map(([day, schedule]) => {
                            const dayNames = {
                              monday: '周一',
                              tuesday: '周二',
                              wednesday: '周三',
                              thursday: '周四',
                              friday: '周五',
                              saturday: '周六',
                              sunday: '周日'
                            }

                            return (
                              <div key={day} className="flex justify-between">
                                <span className="text-muted-foreground">{dayNames[day as keyof typeof dayNames]}</span>
                                <span className="text-white">
                                  {schedule.isOpen
                                    ? schedule.periods?.map(p => `${p.start}-${p.end}`).join(', ') || '营业'
                                    : '休息'
                                  }
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 资质认证 */}
                    {service.provider.certifications.length > 0 && (
                      <Card variant="glass">
                        <CardHeader>
                          <CardTitle>资质认证</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {service.provider.certifications.map((cert) => (
                              <div key={cert.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                <div>
                                  <h4 className="font-medium text-white">{cert.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    颁发机构: {cert.issuer} | 证书编号: {cert.number}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    有效期: {formatRelativeTime(cert.issueDate)} - {cert.expiryDate ? formatRelativeTime(cert.expiryDate) : '长期有效'}
                                  </p>
                                </div>
                                {cert.isVerified && (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 预订卡片 */}
            <Card variant="glass" className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* 价格显示 */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {selectedPackageData
                          ? formatCurrency(selectedPackageData.price)
                          : formatCurrency(service.pricing.basePrice)
                        }
                      </span>
                      <span className="text-muted-foreground">/{service.pricing.unit}</span>
                    </div>

                    {activeDiscount && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-green-400">
                          {activeDiscount.type === 'percentage'
                            ? `${activeDiscount.value}% 折扣`
                            : `立减 ${formatCurrency(activeDiscount.value)}`
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activeDiscount.description}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 服务商信息 */}
                  <div className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {service.provider.avatar ? (
                        <img
                          src={service.provider.avatar}
                          alt={service.provider.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-white">{service.provider.name}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-sm text-muted-foreground">
                            {service.provider.rating.toFixed(1)}
                          </span>
                        </div>
                        {service.provider.isVerified && (
                          <Shield className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 服务保障 */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-muted-foreground">服务保障</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-muted-foreground">
                        {service.provider.responseTime}分钟内响应
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-muted-foreground">保险保障</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleBookService}
                      className="w-full"
                      size="lg"
                      disabled={!service.availability.isAvailable}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      立即预约
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        电话咨询
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        在线咨询
                      </Button>
                    </div>
                  </div>

                  {/* 取消政策 */}
                  <div className="text-xs text-muted-foreground">
                    <p>• 提前{service.availability.cancellationPolicy.freeUntil}小时免费取消</p>
                    <p>• 支持{service.pricing.paymentMethods.length}种支付方式</p>
                    <p>• 服务不满意免费重做</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 服务特色 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  服务优势
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 联系信息 */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>联系方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white">{service.provider.phone}</span>
                </div>

                {service.provider.email && (
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-white">{service.provider.email}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white">
                    {service.provider.address.district}, {service.provider.address.city}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 相关推荐 */}
        {recommendedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">相关推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedServices.map((recommendedService) => (
                <ServiceCard
                  key={recommendedService.id}
                  service={recommendedService}
                  variant="default"
                  onClick={() => window.location.href = `/life/${recommendedService.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
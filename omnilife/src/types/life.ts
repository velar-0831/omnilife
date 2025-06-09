// 生活服务相关类型定义

export interface LifeService {
  id: string
  name: string
  description: string
  category: ServiceCategory
  provider: ServiceProvider
  location: ServiceLocation
  pricing: ServicePricing
  availability: ServiceAvailability
  rating: ServiceRating
  features: string[]
  images: ServiceImage[]
  tags: string[]
  isActive: boolean
  isVerified: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  parentId?: string
  children?: ServiceCategory[]
  serviceCount: number
  isPopular: boolean
}

export interface ServiceProvider {
  id: string
  name: string
  type: 'individual' | 'company' | 'platform'
  avatar?: string
  logo?: string
  description: string
  phone: string
  email?: string
  website?: string
  address: Address
  businessHours: BusinessHours
  certifications: Certification[]
  rating: number
  reviewCount: number
  responseTime: number // 平均响应时间（分钟）
  completionRate: number // 完成率（百分比）
  isVerified: boolean
  joinDate: Date
  languages: string[]
  serviceRadius: number // 服务半径（公里）
}

export interface Address {
  street: string
  district: string
  city: string
  province: string
  postalCode: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  landmarks?: string[]
}

export interface BusinessHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
  holidays?: HolidaySchedule[]
}

export interface DaySchedule {
  isOpen: boolean
  periods?: Array<{
    start: string // HH:mm
    end: string // HH:mm
  }>
  notes?: string
}

export interface HolidaySchedule {
  date: Date
  isOpen: boolean
  periods?: Array<{
    start: string
    end: string
  }>
  note: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  number: string
  issueDate: Date
  expiryDate?: Date
  imageUrl?: string
  isVerified: boolean
}

export interface ServiceLocation {
  type: 'fixed' | 'mobile' | 'online' | 'hybrid'
  address?: Address
  serviceArea: ServiceArea
  travelFee?: number
  maxDistance?: number
}

export interface ServiceArea {
  type: 'city' | 'district' | 'radius' | 'custom'
  areas: string[]
  radius?: number // 服务半径（公里）
  centerPoint?: {
    latitude: number
    longitude: number
  }
}

export interface ServicePricing {
  type: 'fixed' | 'hourly' | 'package' | 'custom'
  basePrice: number
  currency: string
  unit?: string // 单位：次、小时、平方米等
  packages?: PricingPackage[]
  additionalFees?: AdditionalFee[]
  discounts?: Discount[]
  paymentMethods: PaymentMethod[]
}

export interface PricingPackage {
  id: string
  name: string
  description: string
  price: number
  duration?: number // 时长（分钟）
  includes: string[]
  isPopular: boolean
}

export interface AdditionalFee {
  name: string
  amount: number
  type: 'fixed' | 'percentage'
  description: string
  isOptional: boolean
}

export interface Discount {
  type: 'percentage' | 'fixed' | 'buy_x_get_y'
  value: number
  description: string
  conditions: string[]
  validFrom: Date
  validTo: Date
  isActive: boolean
}

export type PaymentMethod = 
  | 'cash'
  | 'alipay'
  | 'wechat_pay'
  | 'bank_card'
  | 'credit_card'
  | 'online_banking'

export interface ServiceAvailability {
  isAvailable: boolean
  nextAvailable?: Date
  busyPeriods: BusyPeriod[]
  advanceBooking: {
    required: boolean
    minHours: number
    maxDays: number
  }
  instantBooking: boolean
  cancellationPolicy: CancellationPolicy
}

export interface BusyPeriod {
  start: Date
  end: Date
  reason: string
}

export interface CancellationPolicy {
  freeUntil: number // 免费取消截止时间（小时）
  fees: Array<{
    hoursBeforeService: number
    feePercentage: number
  }>
  noShowFee: number
}

export interface ServiceRating {
  overall: number
  aspects: {
    quality: number
    punctuality: number
    communication: number
    value: number
    professionalism: number
  }
  reviewCount: number
  distribution: Record<number, number> // 1-5星分布
}

export interface ServiceImage {
  id: string
  url: string
  type: 'cover' | 'gallery' | 'certificate' | 'work_sample'
  caption?: string
  order: number
}

export interface ServiceBooking {
  id: string
  serviceId: string
  service: LifeService
  userId: string
  providerId: string
  provider: ServiceProvider
  status: BookingStatus
  scheduledDate: Date
  duration: number // 预计时长（分钟）
  location: BookingLocation
  pricing: BookingPricing
  requirements: string
  notes?: string
  timeline: BookingTimeline[]
  review?: ServiceReview
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 
  | 'pending' // 待确认
  | 'confirmed' // 已确认
  | 'in_progress' // 进行中
  | 'completed' // 已完成
  | 'cancelled' // 已取消
  | 'no_show' // 未到场
  | 'disputed' // 有争议

export interface BookingLocation {
  type: 'customer_address' | 'provider_address' | 'custom_address' | 'online'
  address?: Address
  instructions?: string
  contactPerson?: {
    name: string
    phone: string
  }
}

export interface BookingPricing {
  basePrice: number
  additionalFees: Array<{
    name: string
    amount: number
  }>
  discounts: Array<{
    name: string
    amount: number
  }>
  total: number
  currency: string
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'disputed'
  paymentMethod?: PaymentMethod
}

export interface BookingTimeline {
  id: string
  status: BookingStatus
  timestamp: Date
  message: string
  actor: 'customer' | 'provider' | 'system'
  details?: any
}

export interface ServiceReview {
  id: string
  bookingId: string
  userId: string
  userName: string
  userAvatar?: string
  providerId: string
  serviceId: string
  rating: {
    overall: number
    quality: number
    punctuality: number
    communication: number
    value: number
    professionalism: number
  }
  title: string
  content: string
  images?: string[]
  pros: string[]
  cons: string[]
  isVerified: boolean
  helpfulCount: number
  createdAt: Date
  updatedAt: Date
  response?: ProviderResponse
}

export interface ProviderResponse {
  content: string
  timestamp: Date
  isOfficial: boolean
}

export interface ServiceRequest {
  id: string
  userId: string
  categoryId: string
  title: string
  description: string
  location: Address
  budget: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    preferred: Date
    flexible: boolean
    urgency: 'low' | 'medium' | 'high'
  }
  requirements: string[]
  images?: string[]
  status: 'open' | 'quoted' | 'assigned' | 'completed' | 'cancelled'
  quotes: ServiceQuote[]
  createdAt: Date
  expiresAt: Date
}

export interface ServiceQuote {
  id: string
  requestId: string
  providerId: string
  provider: ServiceProvider
  price: number
  currency: string
  description: string
  timeline: string
  includes: string[]
  terms: string[]
  validUntil: Date
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
}

export interface ServicePromotion {
  id: string
  title: string
  description: string
  type: 'discount' | 'package' | 'first_time' | 'seasonal'
  value: number
  valueType: 'percentage' | 'fixed'
  conditions: string[]
  applicableServices: string[]
  validFrom: Date
  validTo: Date
  usageLimit: number
  usedCount: number
  isActive: boolean
  imageUrl?: string
}

export interface ServiceFavorite {
  id: string
  userId: string
  serviceId: string
  service: LifeService
  addedAt: Date
  notes?: string
}

export interface ServiceHistory {
  id: string
  userId: string
  serviceId: string
  service: LifeService
  viewedAt: Date
  duration: number // 浏览时长（秒）
  source: 'search' | 'category' | 'recommendation' | 'direct'
}

// 搜索和筛选
export interface ServiceSearchFilters {
  categories?: string[]
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  availability?: {
    date: Date
    timeSlot?: string
  }
  features?: string[]
  providerType?: ServiceProvider['type'][]
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance' | 'popularity'
}

export interface ServiceSearchResult {
  services: LifeService[]
  providers: ServiceProvider[]
  total: number
  query: string
  filters: ServiceSearchFilters
  suggestions: string[]
  facets: SearchFacet[]
}

export interface SearchFacet {
  name: string
  type: 'category' | 'price' | 'rating' | 'location' | 'feature'
  options: Array<{
    value: string
    label: string
    count: number
  }>
}

// API响应类型
export interface LifeApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

// 生活服务事件类型
export type LifeEvent = 
  | { type: 'SERVICE_VIEW'; serviceId: string; duration: number }
  | { type: 'SERVICE_FAVORITE'; serviceId: string }
  | { type: 'SERVICE_UNFAVORITE'; serviceId: string }
  | { type: 'BOOKING_CREATE'; booking: Omit<ServiceBooking, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'BOOKING_UPDATE'; bookingId: string; updates: Partial<ServiceBooking> }
  | { type: 'BOOKING_CANCEL'; bookingId: string; reason: string }
  | { type: 'REVIEW_SUBMIT'; review: Omit<ServiceReview, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'REQUEST_CREATE'; request: Omit<ServiceRequest, 'id' | 'createdAt'> }
  | { type: 'QUOTE_SUBMIT'; quote: Omit<ServiceQuote, 'id' | 'createdAt'> }
  | { type: 'SEARCH'; query: string; filters?: ServiceSearchFilters }

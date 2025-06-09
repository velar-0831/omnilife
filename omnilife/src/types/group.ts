// 智能团购相关类型定义

export interface GroupBuyProduct {
  id: string
  name: string
  description: string
  brand: string
  category: ProductCategory
  images: ProductImage[]
  originalPrice: number
  groupPrice: number
  currency: string
  minGroupSize: number
  maxGroupSize: number
  currentParticipants: number
  specifications: ProductSpecification[]
  variants: ProductVariant[]
  features: string[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  parentId?: string
  children?: ProductCategory[]
  productCount: number
  isPopular: boolean
}

export interface ProductImage {
  id: string
  url: string
  type: 'main' | 'gallery' | 'detail'
  alt: string
  order: number
  isDefault: boolean
}

export interface ProductSpecification {
  id: string
  name: string
  value: string
  unit?: string
  category: string
  isHighlight: boolean
}

export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'style' | 'package'
  value: string
  sku: string
  priceAdjustment: number
  inventory: number
  isAvailable: boolean
}

export interface GroupBuySession {
  id: string
  productId: string
  product: GroupBuyProduct
  organizerId: string
  organizer: GroupBuyUser
  title: string
  description: string
  targetSize: number
  currentSize: number
  status: GroupBuyStatus
  pricing: GroupPricing
  timeline: GroupTimeline
  location?: GroupLocation
  participants: GroupParticipant[]
  rules: GroupRule[]
  benefits: GroupBenefit[]
  socialFeatures: SocialFeatures
  aiRecommendations: AIRecommendation[]
  createdAt: Date
  updatedAt: Date
  startsAt: Date
  endsAt: Date
  deliveryDate?: Date
}

export type GroupBuyStatus = 
  | 'draft' // 草稿
  | 'recruiting' // 招募中
  | 'full' // 已满员
  | 'confirmed' // 已确认
  | 'processing' // 处理中
  | 'shipped' // 已发货
  | 'completed' // 已完成
  | 'cancelled' // 已取消
  | 'failed' // 失败

export interface GroupPricing {
  originalPrice: number
  groupPrice: number
  savingsPerPerson: number
  totalSavings: number
  currency: string
  priceBreaks: PriceBreak[]
  additionalFees?: AdditionalFee[]
  paymentTerms: PaymentTerms
}

export interface PriceBreak {
  minQuantity: number
  maxQuantity?: number
  pricePerUnit: number
  savingsPercentage: number
}

export interface AdditionalFee {
  name: string
  amount: number
  type: 'fixed' | 'percentage'
  description: string
  isOptional: boolean
}

export interface PaymentTerms {
  depositRequired: boolean
  depositAmount?: number
  depositPercentage?: number
  paymentMethods: PaymentMethod[]
  refundPolicy: RefundPolicy
}

export type PaymentMethod = 
  | 'alipay'
  | 'wechat_pay'
  | 'bank_card'
  | 'credit_card'
  | 'group_wallet'

export interface RefundPolicy {
  cancellationDeadline: Date
  refundPercentage: number
  processingFee: number
  conditions: string[]
}

export interface GroupTimeline {
  recruitmentStart: Date
  recruitmentEnd: Date
  confirmationDeadline: Date
  paymentDeadline: Date
  deliveryStart?: Date
  deliveryEnd?: Date
  milestones: GroupMilestone[]
}

export interface GroupMilestone {
  id: string
  name: string
  description: string
  targetDate: Date
  isCompleted: boolean
  completedAt?: Date
}

export interface GroupLocation {
  type: 'pickup' | 'delivery' | 'hybrid'
  pickupPoints?: PickupPoint[]
  deliveryAreas?: DeliveryArea[]
  shippingOptions?: ShippingOption[]
}

export interface PickupPoint {
  id: string
  name: string
  address: string
  coordinates: {
    latitude: number
    longitude: number
  }
  contactPerson: string
  contactPhone: string
  availableHours: string
  capacity: number
  instructions?: string
}

export interface DeliveryArea {
  id: string
  name: string
  boundaries: string[]
  deliveryFee: number
  estimatedDays: number
  isAvailable: boolean
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  cost: number
  estimatedDays: number
  trackingAvailable: boolean
}

export interface GroupParticipant {
  id: string
  userId: string
  user: GroupBuyUser
  sessionId: string
  joinedAt: Date
  status: ParticipantStatus
  quantity: number
  selectedVariants: Record<string, string>
  paymentStatus: PaymentStatus
  paymentAmount: number
  notes?: string
  referredBy?: string
  socialConnections: SocialConnection[]
}

export type ParticipantStatus = 
  | 'pending' // 待确认
  | 'confirmed' // 已确认
  | 'paid' // 已付款
  | 'cancelled' // 已取消
  | 'refunded' // 已退款

export type PaymentStatus = 
  | 'pending' // 待付款
  | 'paid' // 已付款
  | 'partial' // 部分付款
  | 'refunded' // 已退款
  | 'failed' // 付款失败

export interface GroupBuyUser {
  id: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  location?: string
  trustScore: number
  groupBuyHistory: GroupBuyHistory
  socialProfile: SocialProfile
  preferences: UserPreferences
  isVerified: boolean
  joinDate: Date
}

export interface GroupBuyHistory {
  totalSessions: number
  successfulSessions: number
  totalSavings: number
  averageRating: number
  badges: UserBadge[]
  recentActivities: GroupActivity[]
}

export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface SocialProfile {
  followersCount: number
  followingCount: number
  friendsInGroups: number
  socialConnections: SocialConnection[]
  influenceScore: number
}

export interface SocialConnection {
  userId: string
  type: 'friend' | 'follower' | 'mutual' | 'colleague' | 'neighbor'
  strength: number // 0-1, 连接强度
  sharedInterests: string[]
  groupHistory: number // 共同参与的团购次数
}

export interface UserPreferences {
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  brands: string[]
  deliveryPreference: 'pickup' | 'delivery' | 'both'
  groupSizePreference: 'small' | 'medium' | 'large' | 'any'
  notificationSettings: NotificationSettings
}

export interface NotificationSettings {
  newGroups: boolean
  groupUpdates: boolean
  paymentReminders: boolean
  deliveryNotifications: boolean
  socialActivity: boolean
  recommendations: boolean
}

export interface GroupRule {
  id: string
  type: 'participation' | 'payment' | 'behavior' | 'delivery'
  title: string
  description: string
  isRequired: boolean
  penalty?: string
}

export interface GroupBenefit {
  id: string
  type: 'discount' | 'gift' | 'service' | 'exclusive'
  title: string
  description: string
  value?: number
  conditions?: string[]
}

export interface SocialFeatures {
  chatEnabled: boolean
  chatRoomId?: string
  votingEnabled: boolean
  polls: GroupPoll[]
  sharedWishlist: boolean
  referralRewards: ReferralReward[]
  socialProof: SocialProof
}

export interface GroupPoll {
  id: string
  question: string
  options: PollOption[]
  createdBy: string
  createdAt: Date
  endsAt: Date
  isActive: boolean
}

export interface PollOption {
  id: string
  text: string
  votes: number
  voters: string[]
}

export interface ReferralReward {
  type: 'discount' | 'cashback' | 'points'
  value: number
  description: string
  conditions: string[]
}

export interface SocialProof {
  friendsParticipating: GroupBuyUser[]
  influencersParticipating: GroupBuyUser[]
  communityEndorsements: CommunityEndorsement[]
  mediaFeatures: MediaFeature[]
}

export interface CommunityEndorsement {
  id: string
  communityName: string
  endorserName: string
  endorserTitle: string
  message: string
  createdAt: Date
}

export interface MediaFeature {
  id: string
  mediaName: string
  title: string
  url: string
  publishedAt: Date
  excerpt: string
}

export interface AIRecommendation {
  id: string
  type: 'participant' | 'timing' | 'pricing' | 'promotion'
  title: string
  description: string
  confidence: number // 0-1
  reasoning: string[]
  suggestedActions: string[]
  expectedImpact: string
  createdAt: Date
}

export interface GroupActivity {
  id: string
  type: 'join' | 'leave' | 'payment' | 'message' | 'vote' | 'milestone'
  userId: string
  user: GroupBuyUser
  sessionId: string
  description: string
  metadata?: any
  timestamp: Date
}

export interface GroupChat {
  id: string
  sessionId: string
  participants: string[]
  messages: ChatMessage[]
  isActive: boolean
  createdAt: Date
}

export interface ChatMessage {
  id: string
  senderId: string
  sender: GroupBuyUser
  content: string
  type: 'text' | 'image' | 'system' | 'poll' | 'product'
  timestamp: Date
  reactions: MessageReaction[]
  replyTo?: string
}

export interface MessageReaction {
  emoji: string
  count: number
  users: string[]
}

export interface GroupBuyReview {
  id: string
  sessionId: string
  userId: string
  user: GroupBuyUser
  rating: {
    overall: number
    product: number
    organizer: number
    delivery: number
    value: number
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
}

// 搜索和筛选
export interface GroupBuySearchFilters {
  categories?: string[]
  priceRange?: {
    min: number
    max: number
  }
  groupSize?: {
    min: number
    max: number
  }
  status?: GroupBuyStatus[]
  location?: {
    latitude: number
    longitude: number
    radius: number
  }
  timeline?: {
    startDate?: Date
    endDate?: Date
  }
  features?: string[]
  sortBy?: 'relevance' | 'price' | 'savings' | 'popularity' | 'ending_soon' | 'newest'
}

export interface GroupBuySearchResult {
  sessions: GroupBuySession[]
  products: GroupBuyProduct[]
  total: number
  query: string
  filters: GroupBuySearchFilters
  suggestions: string[]
  facets: SearchFacet[]
}

export interface SearchFacet {
  name: string
  type: 'category' | 'price' | 'size' | 'status' | 'location'
  options: Array<{
    value: string
    label: string
    count: number
  }>
}

// API响应类型
export interface GroupBuyApiResponse<T> {
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

// 团购事件类型
export type GroupBuyEvent = 
  | { type: 'SESSION_CREATE'; session: Omit<GroupBuySession, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'SESSION_JOIN'; sessionId: string; userId: string; quantity: number }
  | { type: 'SESSION_LEAVE'; sessionId: string; userId: string; reason: string }
  | { type: 'PAYMENT_COMPLETE'; sessionId: string; userId: string; amount: number }
  | { type: 'SESSION_CONFIRM'; sessionId: string }
  | { type: 'SESSION_CANCEL'; sessionId: string; reason: string }
  | { type: 'MESSAGE_SEND'; sessionId: string; message: Omit<ChatMessage, 'id' | 'timestamp'> }
  | { type: 'POLL_CREATE'; sessionId: string; poll: Omit<GroupPoll, 'id' | 'createdAt'> }
  | { type: 'POLL_VOTE'; pollId: string; optionId: string; userId: string }
  | { type: 'REVIEW_SUBMIT'; review: Omit<GroupBuyReview, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'SEARCH'; query: string; filters?: GroupBuySearchFilters }

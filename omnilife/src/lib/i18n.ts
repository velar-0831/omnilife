import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  'zh-CN': {
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
    rtl: false
  },
  'zh-TW': {
    name: '繁體中文',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    rtl: false
  },
  'en-US': {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  'ja-JP': {
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false
  },
  'ko-KR': {
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false
  },
  'ar-SA': {
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true
  }
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

// 翻译文本类型
export interface TranslationKeys {
  // 通用
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    add: string
    search: string
    filter: string
    sort: string
    more: string
    less: string
    back: string
    next: string
    previous: string
    close: string
    open: string
    settings: string
    help: string
    about: string
    contact: string
    privacy: string
    terms: string
    logout: string
    login: string
    register: string
    profile: string
    dashboard: string
    notifications: string
    messages: string
    favorites: string
    history: string
    recommendations: string
    trending: string
    popular: string
    new: string
    featured: string
    categories: string
    tags: string
    share: string
    like: string
    comment: string
    follow: string
    unfollow: string
    subscribe: string
    unsubscribe: string
  }

  // 导航
  navigation: {
    home: string
    music: string
    news: string
    shopping: string
    auto: string
    life: string
    group: string
  }

  // 音乐模块
  music: {
    title: string
    description: string
    play: string
    pause: string
    stop: string
    next: string
    previous: string
    shuffle: string
    repeat: string
    volume: string
    playlist: string
    album: string
    artist: string
    genre: string
    duration: string
    lyrics: string
    download: string
    addToPlaylist: string
    createPlaylist: string
    deletePlaylist: string
    sharePlaylist: string
    recentlyPlayed: string
    topCharts: string
    newReleases: string
    recommendations: string
    myMusic: string
    favorites: string
    following: string
    discover: string
  }

  // 资讯模块
  news: {
    title: string
    description: string
    readMore: string
    readLess: string
    bookmark: string
    unbookmark: string
    category: string
    source: string
    publishedAt: string
    author: string
    tags: string
    relatedNews: string
    breakingNews: string
    topStories: string
    localNews: string
    worldNews: string
    technology: string
    business: string
    sports: string
    entertainment: string
    health: string
    science: string
    politics: string
    weather: string
  }

  // 购物模块
  shopping: {
    title: string
    description: string
    addToCart: string
    removeFromCart: string
    cart: string
    checkout: string
    price: string
    originalPrice: string
    discount: string
    sale: string
    inStock: string
    outOfStock: string
    quantity: string
    size: string
    color: string
    brand: string
    category: string
    rating: string
    reviews: string
    writeReview: string
    specifications: string
    description: string
    shipping: string
    returns: string
    warranty: string
    compare: string
    wishlist: string
    recentlyViewed: string
    recommendations: string
    bestSellers: string
    newArrivals: string
    deals: string
    coupons: string
    orders: string
    orderHistory: string
    trackOrder: string
    paymentMethods: string
    shippingAddress: string
    billingAddress: string
  }

  // 汽车模块
  auto: {
    title: string
    description: string
    myVehicles: string
    addVehicle: string
    editVehicle: string
    deleteVehicle: string
    maintenance: string
    scheduleMaintenance: string
    maintenanceHistory: string
    nextService: string
    mileage: string
    fuelConsumption: string
    insurance: string
    registration: string
    inspection: string
    repairs: string
    parts: string
    services: string
    dealers: string
    mechanics: string
    roadside: string
    parking: string
    tolls: string
    fuelStations: string
    chargingStations: string
    carWash: string
    rental: string
    selling: string
    buying: string
    valuation: string
    financing: string
    leasing: string
  }

  // 生活服务模块
  life: {
    title: string
    description: string
    services: string
    bookService: string
    cancelBooking: string
    rescheduleBooking: string
    serviceHistory: string
    providers: string
    reviews: string
    rating: string
    location: string
    availability: string
    pricing: string
    duration: string
    category: string
    homeServices: string
    cleaning: string
    repair: string
    maintenance: string
    installation: string
    beauty: string
    health: string
    fitness: string
    education: string
    tutoring: string
    petCare: string
    elderCare: string
    childcare: string
    delivery: string
    moving: string
    storage: string
    photography: string
    events: string
    catering: string
    transportation: string
  }

  // 团购模块
  group: {
    title: string
    description: string
    joinGroup: string
    leaveGroup: string
    createGroup: string
    inviteFriends: string
    groupChat: string
    participants: string
    progress: string
    timeLeft: string
    minimumQuantity: string
    currentQuantity: string
    pricePerUnit: string
    totalSavings: string
    groupDiscount: string
    successfulGroups: string
    activeGroups: string
    myGroups: string
    groupHistory: string
    groupRules: string
    paymentStatus: string
    deliveryInfo: string
    refundPolicy: string
    groupLeader: string
    autoJoin: string
    notifications: string
    recommendations: string
    categories: string
    popular: string
    ending: string
    new: string
  }

  // 用户相关
  user: {
    profile: string
    account: string
    settings: string
    preferences: string
    security: string
    privacy: string
    notifications: string
    subscription: string
    billing: string
    orders: string
    wishlist: string
    reviews: string
    following: string
    followers: string
    achievements: string
    points: string
    level: string
    badges: string
    activity: string
    statistics: string
    personalInfo: string
    contactInfo: string
    address: string
    paymentMethods: string
    twoFactorAuth: string
    changePassword: string
    deleteAccount: string
    exportData: string
    theme: string
    language: string
    timezone: string
    currency: string
  }

  // 错误和状态
  status: {
    loading: string
    success: string
    error: string
    warning: string
    info: string
    noData: string
    noResults: string
    networkError: string
    serverError: string
    unauthorized: string
    forbidden: string
    notFound: string
    timeout: string
    offline: string
    online: string
    syncing: string
    synced: string
    failed: string
    retry: string
    refresh: string
  }

  // 时间和日期
  time: {
    now: string
    today: string
    yesterday: string
    tomorrow: string
    thisWeek: string
    lastWeek: string
    nextWeek: string
    thisMonth: string
    lastMonth: string
    nextMonth: string
    thisYear: string
    lastYear: string
    nextYear: string
    seconds: string
    minutes: string
    hours: string
    days: string
    weeks: string
    months: string
    years: string
    ago: string
    later: string
    morning: string
    afternoon: string
    evening: string
    night: string
    am: string
    pm: string
  }
}

// 默认翻译（简体中文）
export const defaultTranslations: TranslationKeys = {
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    more: '更多',
    less: '收起',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    settings: '设置',
    help: '帮助',
    about: '关于',
    contact: '联系',
    privacy: '隐私',
    terms: '条款',
    logout: '退出登录',
    login: '登录',
    register: '注册',
    profile: '个人资料',
    dashboard: '仪表板',
    notifications: '通知',
    messages: '消息',
    favorites: '收藏',
    history: '历史',
    recommendations: '推荐',
    trending: '热门',
    popular: '流行',
    new: '最新',
    featured: '精选',
    categories: '分类',
    tags: '标签',
    share: '分享',
    like: '点赞',
    comment: '评论',
    follow: '关注',
    unfollow: '取消关注',
    subscribe: '订阅',
    unsubscribe: '取消订阅'
  },
  navigation: {
    home: '首页',
    music: '音乐',
    news: '资讯',
    shopping: '购物',
    auto: '汽车',
    life: '生活',
    group: '团购'
  },
  music: {
    title: '智能音乐',
    description: 'AI驱动的个性化音乐推荐',
    play: '播放',
    pause: '暂停',
    stop: '停止',
    next: '下一首',
    previous: '上一首',
    shuffle: '随机播放',
    repeat: '循环播放',
    volume: '音量',
    playlist: '播放列表',
    album: '专辑',
    artist: '艺术家',
    genre: '流派',
    duration: '时长',
    lyrics: '歌词',
    download: '下载',
    addToPlaylist: '添加到播放列表',
    createPlaylist: '创建播放列表',
    deletePlaylist: '删除播放列表',
    sharePlaylist: '分享播放列表',
    recentlyPlayed: '最近播放',
    topCharts: '排行榜',
    newReleases: '新发布',
    recommendations: '为你推荐',
    myMusic: '我的音乐',
    favorites: '我的收藏',
    following: '关注的艺术家',
    discover: '发现音乐'
  },
  news: {
    title: '智慧资讯',
    description: '实时新闻聚合与科技前沿',
    readMore: '阅读更多',
    readLess: '收起',
    bookmark: '收藏',
    unbookmark: '取消收藏',
    category: '分类',
    source: '来源',
    publishedAt: '发布时间',
    author: '作者',
    tags: '标签',
    relatedNews: '相关新闻',
    breakingNews: '突发新闻',
    topStories: '头条新闻',
    localNews: '本地新闻',
    worldNews: '国际新闻',
    technology: '科技',
    business: '商业',
    sports: '体育',
    entertainment: '娱乐',
    health: '健康',
    science: '科学',
    politics: '政治',
    weather: '天气'
  },
  shopping: {
    title: '智能购物',
    description: 'AR试用、智能比价、社交购物',
    addToCart: '加入购物车',
    removeFromCart: '从购物车移除',
    cart: '购物车',
    checkout: '结账',
    price: '价格',
    originalPrice: '原价',
    discount: '折扣',
    sale: '促销',
    inStock: '有库存',
    outOfStock: '缺货',
    quantity: '数量',
    size: '尺寸',
    color: '颜色',
    brand: '品牌',
    category: '分类',
    rating: '评分',
    reviews: '评价',
    writeReview: '写评价',
    specifications: '规格',
    description: '描述',
    shipping: '配送',
    returns: '退货',
    warranty: '保修',
    compare: '比较',
    wishlist: '心愿单',
    recentlyViewed: '最近浏览',
    recommendations: '推荐商品',
    bestSellers: '热销商品',
    newArrivals: '新品上市',
    deals: '优惠活动',
    coupons: '优惠券',
    orders: '订单',
    orderHistory: '订单历史',
    trackOrder: '跟踪订单',
    paymentMethods: '支付方式',
    shippingAddress: '配送地址',
    billingAddress: '账单地址'
  },
  auto: {
    title: '汽车服务',
    description: '汽车全生命周期管理',
    myVehicles: '我的车辆',
    addVehicle: '添加车辆',
    editVehicle: '编辑车辆',
    deleteVehicle: '删除车辆',
    maintenance: '保养',
    scheduleMaintenance: '预约保养',
    maintenanceHistory: '保养记录',
    nextService: '下次保养',
    mileage: '里程',
    fuelConsumption: '油耗',
    insurance: '保险',
    registration: '注册',
    inspection: '检查',
    repairs: '维修',
    parts: '配件',
    services: '服务',
    dealers: '经销商',
    mechanics: '修理工',
    roadside: '道路救援',
    parking: '停车',
    tolls: '过路费',
    fuelStations: '加油站',
    chargingStations: '充电站',
    carWash: '洗车',
    rental: '租车',
    selling: '卖车',
    buying: '买车',
    valuation: '估值',
    financing: '融资',
    leasing: '租赁'
  },
  life: {
    title: '生活服务',
    description: '本地生活服务一键直达',
    services: '服务',
    bookService: '预订服务',
    cancelBooking: '取消预订',
    rescheduleBooking: '重新安排',
    serviceHistory: '服务历史',
    providers: '服务提供商',
    reviews: '评价',
    rating: '评分',
    location: '位置',
    availability: '可用性',
    pricing: '价格',
    duration: '时长',
    category: '分类',
    homeServices: '家庭服务',
    cleaning: '清洁',
    repair: '维修',
    maintenance: '保养',
    installation: '安装',
    beauty: '美容',
    health: '健康',
    fitness: '健身',
    education: '教育',
    tutoring: '辅导',
    petCare: '宠物护理',
    elderCare: '老人护理',
    childcare: '儿童护理',
    delivery: '配送',
    moving: '搬家',
    storage: '存储',
    photography: '摄影',
    events: '活动',
    catering: '餐饮',
    transportation: '交通'
  },
  group: {
    title: '智能团购',
    description: 'AI匹配团购伙伴，享受更多优惠',
    joinGroup: '加入团购',
    leaveGroup: '退出团购',
    createGroup: '创建团购',
    inviteFriends: '邀请朋友',
    groupChat: '群聊',
    participants: '参与者',
    progress: '进度',
    timeLeft: '剩余时间',
    minimumQuantity: '最少数量',
    currentQuantity: '当前数量',
    pricePerUnit: '单价',
    totalSavings: '总节省',
    groupDiscount: '团购折扣',
    successfulGroups: '成功团购',
    activeGroups: '活跃团购',
    myGroups: '我的团购',
    groupHistory: '团购历史',
    groupRules: '团购规则',
    paymentStatus: '支付状态',
    deliveryInfo: '配送信息',
    refundPolicy: '退款政策',
    groupLeader: '团长',
    autoJoin: '自动加入',
    notifications: '通知',
    recommendations: '推荐团购',
    categories: '分类',
    popular: '热门',
    ending: '即将结束',
    new: '最新'
  },
  user: {
    profile: '个人资料',
    account: '账户',
    settings: '设置',
    preferences: '偏好',
    security: '安全',
    privacy: '隐私',
    notifications: '通知',
    subscription: '订阅',
    billing: '账单',
    orders: '订单',
    wishlist: '心愿单',
    reviews: '评价',
    following: '关注',
    followers: '粉丝',
    achievements: '成就',
    points: '积分',
    level: '等级',
    badges: '徽章',
    activity: '活动',
    statistics: '统计',
    personalInfo: '个人信息',
    contactInfo: '联系信息',
    address: '地址',
    paymentMethods: '支付方式',
    twoFactorAuth: '双重认证',
    changePassword: '修改密码',
    deleteAccount: '删除账户',
    exportData: '导出数据',
    theme: '主题',
    language: '语言',
    timezone: '时区',
    currency: '货币'
  },
  status: {
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    noData: '暂无数据',
    noResults: '无搜索结果',
    networkError: '网络错误',
    serverError: '服务器错误',
    unauthorized: '未授权',
    forbidden: '禁止访问',
    notFound: '未找到',
    timeout: '超时',
    offline: '离线',
    online: '在线',
    syncing: '同步中',
    synced: '已同步',
    failed: '失败',
    retry: '重试',
    refresh: '刷新'
  },
  time: {
    now: '现在',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    lastWeek: '上周',
    nextWeek: '下周',
    thisMonth: '本月',
    lastMonth: '上月',
    nextMonth: '下月',
    thisYear: '今年',
    lastYear: '去年',
    nextYear: '明年',
    seconds: '秒',
    minutes: '分钟',
    hours: '小时',
    days: '天',
    weeks: '周',
    months: '月',
    years: '年',
    ago: '前',
    later: '后',
    morning: '上午',
    afternoon: '下午',
    evening: '晚上',
    night: '夜晚',
    am: '上午',
    pm: '下午'
  }
}

// 国际化状态管理
interface I18nState {
  currentLanguage: SupportedLanguage
  translations: TranslationKeys
  isLoading: boolean
  setLanguage: (language: SupportedLanguage) => Promise<void>
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'zh-CN',
      translations: defaultTranslations,
      isLoading: false,

      setLanguage: async (language: SupportedLanguage) => {
        set({ isLoading: true })

        try {
          // 动态加载翻译文件
          const translations = await loadTranslations(language)
          set({
            currentLanguage: language,
            translations,
            isLoading: false
          })

          // 更新HTML lang属性
          document.documentElement.lang = language

          // 更新RTL方向
          const isRTL = SUPPORTED_LANGUAGES[language].rtl
          document.documentElement.dir = isRTL ? 'rtl' : 'ltr'

        } catch (error) {
          console.error('Failed to load translations:', error)
          set({ isLoading: false })
        }
      },

      t: (key: string) => {
        const translations = get().translations
        const keys = key.split('.')
        let value: any = translations

        for (const k of keys) {
          value = value?.[k]
          if (value === undefined) break
        }

        return value || key
      }
    }),
    {
      name: 'omnilife-i18n',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage
      })
    }
  )
)

// 动态加载翻译文件
async function loadTranslations(language: SupportedLanguage): Promise<TranslationKeys> {
  if (language === 'zh-CN') {
    return defaultTranslations
  }

  try {
    // 这里可以从API或静态文件加载翻译
    const response = await fetch(`/locales/${language}.json`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn(`Failed to load translations for ${language}, falling back to default`)
  }

  // 回退到默认翻译
  return defaultTranslations
}

// 翻译钩子
export function useTranslation() {
  const { t, currentLanguage, setLanguage, isLoading } = useI18nStore()

  return {
    t,
    currentLanguage,
    setLanguage,
    isLoading,
    languages: SUPPORTED_LANGUAGES
  }
}

// 格式化数字
export function formatNumber(
  value: number,
  language: SupportedLanguage = 'zh-CN',
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat(language, options).format(value)
}

// 格式化货币
export function formatCurrency(
  value: number,
  currency: string = 'CNY',
  language: SupportedLanguage = 'zh-CN'
) {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency
  }).format(value)
}

// 格式化日期
export function formatDate(
  date: Date,
  language: SupportedLanguage = 'zh-CN',
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(language, options).format(date)
}

// 格式化相对时间
export function formatRelativeTime(
  date: Date,
  language: SupportedLanguage = 'zh-CN'
) {
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
  const now = new Date()
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)

  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
    { unit: 'second' as const, seconds: 1 }
  ]

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit)
    }
  }

  return rtf.format(0, 'second')
}
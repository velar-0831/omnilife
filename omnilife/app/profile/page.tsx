'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Heart, 
  Clock, 
  Star,
  Award,
  TrendingUp,
  Music,
  Newspaper,
  ShoppingBag,
  Car,
  Home,
  Users,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  CreditCard,
  Download,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatCurrency } from '@/lib/utils'

// 模拟用户数据
const mockUser = {
  id: 'user1',
  username: 'omnilife_user',
  displayName: '全域生活用户',
  email: 'user@omnilife.com',
  phone: '+86 138 0000 1234',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop',
  bio: '热爱生活，享受科技带来的便利',
  location: '北京市朝阳区',
  joinDate: new Date('2023-01-15'),
  isVerified: true,
  level: 'VIP',
  points: 12580,
  totalSavings: 8650,
  stats: {
    music: { plays: 1250, favorites: 89, playlists: 12 },
    news: { reads: 456, bookmarks: 34, shares: 23 },
    shopping: { orders: 67, reviews: 45, savings: 3200 },
    auto: { services: 8, maintenance: 5, savings: 1200 },
    life: { bookings: 23, reviews: 18, savings: 2100 },
    group: { participations: 15, organized: 3, savings: 2150 },
  },
  preferences: {
    theme: 'dark',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      statsVisible: true,
    }
  }
}

const moduleStats = [
  {
    key: 'music',
    name: '音乐',
    icon: Music,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    stats: [
      { label: '播放次数', value: mockUser.stats.music.plays },
      { label: '收藏歌曲', value: mockUser.stats.music.favorites },
      { label: '创建歌单', value: mockUser.stats.music.playlists },
    ]
  },
  {
    key: 'news',
    name: '资讯',
    icon: Newspaper,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    stats: [
      { label: '阅读文章', value: mockUser.stats.news.reads },
      { label: '收藏文章', value: mockUser.stats.news.bookmarks },
      { label: '分享次数', value: mockUser.stats.news.shares },
    ]
  },
  {
    key: 'shopping',
    name: '购物',
    icon: ShoppingBag,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    stats: [
      { label: '订单数量', value: mockUser.stats.shopping.orders },
      { label: '评价数量', value: mockUser.stats.shopping.reviews },
      { label: '节省金额', value: formatCurrency(mockUser.stats.shopping.savings) },
    ]
  },
  {
    key: 'auto',
    name: '汽车',
    icon: Car,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    stats: [
      { label: '服务次数', value: mockUser.stats.auto.services },
      { label: '保养记录', value: mockUser.stats.auto.maintenance },
      { label: '节省金额', value: formatCurrency(mockUser.stats.auto.savings) },
    ]
  },
  {
    key: 'life',
    name: '生活',
    icon: Home,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    stats: [
      { label: '预订次数', value: mockUser.stats.life.bookings },
      { label: '评价数量', value: mockUser.stats.life.reviews },
      { label: '节省金额', value: formatCurrency(mockUser.stats.life.savings) },
    ]
  },
  {
    key: 'group',
    name: '团购',
    icon: Users,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    stats: [
      { label: '参与团购', value: mockUser.stats.group.participations },
      { label: '发起团购', value: mockUser.stats.group.organized },
      { label: '节省金额', value: formatCurrency(mockUser.stats.group.savings) },
    ]
  },
]

const achievements = [
  { id: '1', name: '音乐达人', description: '播放音乐超过1000次', icon: Music, color: 'text-purple-400', earned: true },
  { id: '2', name: '资讯专家', description: '阅读文章超过500篇', icon: Newspaper, color: 'text-blue-400', earned: true },
  { id: '3', name: '购物高手', description: '完成订单超过50个', icon: ShoppingBag, color: 'text-green-400', earned: true },
  { id: '4', name: '团购王者', description: '参与团购超过10次', icon: Users, color: 'text-pink-400', earned: true },
  { id: '5', name: '生活专家', description: '预订生活服务超过20次', icon: Home, color: 'text-indigo-400', earned: true },
  { id: '6', name: '汽车管家', description: '完成汽车服务超过5次', icon: Car, color: 'text-orange-400', earned: true },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings'>('overview')

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">👤 个人中心</h1>
          
          <div className="flex items-center space-x-6">
            {[
              { key: 'overview', label: '概览' },
              { key: 'stats', label: '数据统计' },
              { key: 'settings', label: '设置' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`text-sm transition-colors ${
                  activeTab === tab.key ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <Button variant="ghost">
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 用户信息卡片 */}
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                        <img 
                          src={mockUser.avatar} 
                          alt={mockUser.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-primary/20 backdrop-blur-sm"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h2 className="text-xl font-bold text-white">{mockUser.displayName}</h2>
                      {mockUser.isVerified && (
                        <Shield className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-1">@{mockUser.username}</p>
                    <div className="inline-flex items-center px-2 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
                      <Award className="w-3 h-3 mr-1" />
                      {mockUser.level}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6">{mockUser.bio}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-white">{mockUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-white">{mockUser.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-white">{mockUser.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-white">
                          {mockUser.joinDate.getFullYear()}年{mockUser.joinDate.getMonth() + 1}月加入
                        </span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6">
                      <Edit className="w-4 h-4 mr-2" />
                      编辑资料
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 积分和节省 */}
              <Card variant="glass" className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                    我的收益
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">积分余额</span>
                    <span className="text-xl font-bold text-primary">{mockUser.points.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">累计节省</span>
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency(mockUser.totalSavings)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 成就徽章 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    成就徽章
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "p-4 rounded-lg border text-center transition-all",
                          achievement.earned 
                            ? "bg-primary/10 border-primary/20" 
                            : "bg-secondary/30 border-white/10 opacity-50"
                        )}
                      >
                        <achievement.icon className={cn("w-8 h-8 mx-auto mb-2", achievement.color)} />
                        <h3 className="font-medium text-white text-sm">{achievement.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 模块使用统计 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-primary" />
                    使用统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {moduleStats.map((module) => (
                      <div key={module.key} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", module.bgColor)}>
                            <module.icon className={cn("w-4 h-4", module.color)} />
                          </div>
                          <h3 className="font-medium text-white">{module.name}</h3>
                        </div>
                        <div className="space-y-2">
                          {module.stats.map((stat, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{stat.label}</span>
                              <span className="text-white font-medium">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 最近活动 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    最近活动
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: '参与了iPhone 15团购', time: '2小时前', icon: Users, color: 'text-pink-400' },
                      { action: '收藏了一首新歌', time: '4小时前', icon: Music, color: 'text-purple-400' },
                      { action: '预约了家政服务', time: '1天前', icon: Home, color: 'text-indigo-400' },
                      { action: '阅读了AI技术文章', time: '2天前', icon: Newspaper, color: 'text-blue-400' },
                      { action: '完成了汽车保养', time: '3天前', icon: Car, color: 'text-orange-400' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={cn("w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center")}>
                          <activity.icon className={cn("w-4 h-4", activity.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">数据统计</h2>
            
            {/* 总览统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: '总积分', value: mockUser.points.toLocaleString(), icon: Star, color: 'text-yellow-400' },
                { label: '总节省', value: formatCurrency(mockUser.totalSavings), icon: TrendingUp, color: 'text-green-400' },
                { label: '活跃天数', value: '365', icon: Calendar, color: 'text-blue-400' },
                { label: '成就数量', value: achievements.filter(a => a.earned).length.toString(), icon: Award, color: 'text-purple-400' },
              ].map((stat, index) => (
                <Card key={index} variant="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={cn("w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center")}>
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 详细统计图表 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>模块使用分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    图表组件待实现
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>月度活跃趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    图表组件待实现
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">设置</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 账户设置 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    账户设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑个人资料
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2" />
                    修改密码
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    安全设置
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    支付方式
                  </Button>
                </CardContent>
              </Card>

              {/* 通知设置 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    通知设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">邮件通知</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">推送通知</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">短信通知</span>
                    <div className="w-12 h-6 bg-secondary rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 外观设置 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    外观设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <Palette className="w-4 h-4 mr-2" />
                    主题设置
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    语言设置
                  </Button>
                </CardContent>
              </Card>

              {/* 其他设置 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    其他设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    注销账户
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

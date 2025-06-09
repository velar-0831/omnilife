'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Music, 
  Newspaper, 
  ShoppingBag, 
  Car, 
  Home,
  Star,
  Clock,
  DollarSign,
  Heart,
  Zap,
  Target,
  Award,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { GlobalLayout } from '@/components/layout/GlobalLayout'
import { cn, formatCurrency, formatPercentage } from '@/lib/utils'

// 模拟数据
const mockDashboardData = {
  overview: {
    totalUsers: 125680,
    activeUsers: 89432,
    totalRevenue: 2456789,
    growthRate: 0.156,
  },
  moduleStats: [
    {
      name: '音乐',
      icon: Music,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      users: 45230,
      growth: 0.12,
      revenue: 234567,
      engagement: 0.78,
    },
    {
      name: '资讯',
      icon: Newspaper,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      users: 67890,
      growth: 0.08,
      revenue: 123456,
      engagement: 0.65,
    },
    {
      name: '购物',
      icon: ShoppingBag,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      users: 89123,
      growth: 0.25,
      revenue: 1234567,
      engagement: 0.82,
    },
    {
      name: '汽车',
      icon: Car,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      users: 23456,
      growth: 0.18,
      revenue: 456789,
      engagement: 0.71,
    },
    {
      name: '生活',
      icon: Home,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      users: 34567,
      growth: 0.15,
      revenue: 345678,
      engagement: 0.69,
    },
    {
      name: '团购',
      icon: Users,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      users: 56789,
      growth: 0.32,
      revenue: 567890,
      engagement: 0.85,
    },
  ],
  recentActivities: [
    { id: '1', type: 'user_signup', message: '新用户注册增长 15%', time: '2小时前', icon: Users },
    { id: '2', type: 'revenue', message: '团购模块收入突破新高', time: '4小时前', icon: TrendingUp },
    { id: '3', type: 'engagement', message: '音乐模块用户活跃度提升', time: '6小时前', icon: Music },
    { id: '4', type: 'feature', message: 'AI助手功能上线', time: '1天前', icon: Zap },
    { id: '5', type: 'milestone', message: '平台用户突破10万', time: '2天前', icon: Award },
  ],
  topPerformers: [
    { name: '团购模块', metric: '用户增长', value: '+32%', trend: 'up' },
    { name: '购物模块', metric: '收入增长', value: '+25%', trend: 'up' },
    { name: '汽车模块', metric: '用户满意度', value: '4.8/5', trend: 'up' },
    { name: '音乐模块', metric: '日活跃用户', value: '45K', trend: 'up' },
  ]
}

const timeRanges = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
]

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    console.log('Exporting dashboard data...')
  }

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        {/* 页面头部 */}
        <div className="border-b border-white/10 bg-background/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">📊 数据仪表板</h1>
                <p className="text-muted-foreground mt-2">实时监控平台运营数据和用户行为</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* 时间范围选择 */}
                <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
                  {timeRanges.map((range) => (
                    <Button
                      key={range.value}
                      variant={selectedTimeRange === range.value ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedTimeRange(range.value)}
                      className="h-8 text-xs"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                  刷新
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 概览统计 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">总用户数</p>
                      <p className="text-2xl font-bold text-white">
                        {mockDashboardData.overview.totalUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">
                          +{formatPercentage(mockDashboardData.overview.growthRate)}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-400/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">活跃用户</p>
                      <p className="text-2xl font-bold text-white">
                        {mockDashboardData.overview.activeUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Activity className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">
                          {formatPercentage(mockDashboardData.overview.activeUsers / mockDashboardData.overview.totalUsers)}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">总收入</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(mockDashboardData.overview.totalRevenue)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">
                          +{formatPercentage(mockDashboardData.overview.growthRate)}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">增长率</p>
                      <p className="text-2xl font-bold text-white">
                        +{formatPercentage(mockDashboardData.overview.growthRate)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Target className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary">月度增长</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 模块统计 */}
            <div className="lg:col-span-2">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    模块表现
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockDashboardData.moduleStats.map((module, index) => (
                      <motion.div
                        key={module.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", module.bgColor)}>
                              <module.icon className={cn("w-5 h-5", module.color)} />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{module.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {module.users.toLocaleString()} 用户
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">
                              {formatCurrency(module.revenue)}
                            </p>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400">
                                +{formatPercentage(module.growth)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 参与度进度条 */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">用户参与度</span>
                            <span className="text-white">{formatPercentage(module.engagement)}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className={cn("h-2 rounded-full transition-all duration-500", 
                                module.name === '音乐' ? 'bg-purple-400' :
                                module.name === '资讯' ? 'bg-blue-400' :
                                module.name === '购物' ? 'bg-green-400' :
                                module.name === '汽车' ? 'bg-orange-400' :
                                module.name === '生活' ? 'bg-indigo-400' : 'bg-pink-400'
                              )}
                              style={{ width: `${module.engagement * 100}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
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
                    {mockDashboardData.recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 bg-secondary/50 rounded-full flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 表现优异 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    表现优异
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDashboardData.topPerformers.map((performer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{performer.name}</p>
                          <p className="text-xs text-muted-foreground">{performer.metric}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-green-400">{performer.value}</span>
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 快速操作 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <PieChart className="w-4 h-4 mr-2" />
                    生成报告
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <LineChart className="w-4 h-4 mr-2" />
                    趋势分析
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Filter className="w-4 h-4 mr-2" />
                    数据筛选
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    定时报告
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>用户增长趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>图表组件待集成</p>
                    <p className="text-sm">可使用 Chart.js 或 Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>收入分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>图表组件待集成</p>
                    <p className="text-sm">可使用 Chart.js 或 Recharts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GlobalLayout>
  )
}

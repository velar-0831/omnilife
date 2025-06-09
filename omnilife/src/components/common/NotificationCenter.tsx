'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  Music, 
  Newspaper, 
  ShoppingBag, 
  Car, 
  Home, 
  Users,
  Heart,
  MessageCircle,
  Star,
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatRelativeTime } from '@/lib/utils'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'music' | 'news' | 'shopping' | 'auto' | 'life' | 'group' | 'system'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionText?: string
  image?: string
  metadata?: any
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

const typeColors = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
}

const categoryIcons = {
  music: Music,
  news: Newspaper,
  shopping: ShoppingBag,
  auto: Car,
  life: Home,
  group: Users,
  system: Settings,
}

const categoryColors = {
  music: 'text-purple-400',
  news: 'text-blue-400',
  shopping: 'text-green-400',
  auto: 'text-orange-400',
  life: 'text-indigo-400',
  group: 'text-pink-400',
  system: 'text-gray-400',
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    category: 'group',
    title: 'iPhone 15 团购成功',
    message: '恭喜！您参与的iPhone 15团购已达成目标，预计3天内发货。',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
    isRead: false,
    actionUrl: '/group/1',
    actionText: '查看详情',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=60&h=60&fit=crop',
  },
  {
    id: '2',
    type: 'info',
    category: 'music',
    title: '新歌推荐',
    message: '根据您的喜好，为您推荐了5首新歌，快来听听吧！',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
    isRead: false,
    actionUrl: '/music/recommendations',
    actionText: '去听歌',
  },
  {
    id: '3',
    type: 'warning',
    category: 'auto',
    title: '保养提醒',
    message: '您的Tesla Model 3即将到达保养里程，建议尽快预约。',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    isRead: true,
    actionUrl: '/auto/maintenance',
    actionText: '预约保养',
  },
  {
    id: '4',
    type: 'info',
    category: 'news',
    title: 'AI技术突破',
    message: 'OpenAI发布最新GPT模型，性能提升显著。',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小时前
    isRead: true,
    actionUrl: '/news/article/ai-breakthrough',
    actionText: '阅读全文',
  },
  {
    id: '5',
    type: 'success',
    category: 'life',
    title: '服务完成',
    message: '您预约的家政清洁服务已完成，请为服务评分。',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
    isRead: true,
    actionUrl: '/life/review/1',
    actionText: '去评价',
  },
  {
    id: '6',
    type: 'info',
    category: 'shopping',
    title: '优惠券到账',
    message: '您获得了一张100元优惠券，有效期7天。',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    isRead: true,
    actionUrl: '/shopping/coupons',
    actionText: '查看优惠券',
  },
]

export function NotificationCenter({ isOpen, onClose, className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      // 这里应该导航到对应页面
      console.log('Navigate to:', notification.actionUrl)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className={cn(
            "absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-white/10",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Card variant="glass" className="h-full rounded-none border-0">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>通知中心</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* 筛选器 */}
              <div className="flex items-center space-x-2 mt-4">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  全部
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  未读 ({unreadCount})
                </Button>
                
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="ml-auto"
                  >
                    全部已读
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {filter === 'unread' ? '没有未读通知' : '暂无通知'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredNotifications.map((notification, index) => {
                    const TypeIcon = typeIcons[notification.type]
                    const CategoryIcon = categoryIcons[notification.category]
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 hover:bg-white/5 transition-colors cursor-pointer relative",
                          !notification.isRead && "bg-primary/5"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* 未读指示器 */}
                        {!notification.isRead && (
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                        )}
                        
                        <div className="flex items-start space-x-3 ml-4">
                          {/* 图标或图片 */}
                          <div className="flex-shrink-0">
                            {notification.image ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <img 
                                  src={notification.image} 
                                  alt={notification.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                `bg-${notification.category === 'music' ? 'purple' : 
                                     notification.category === 'news' ? 'blue' :
                                     notification.category === 'shopping' ? 'green' :
                                     notification.category === 'auto' ? 'orange' :
                                     notification.category === 'life' ? 'indigo' :
                                     notification.category === 'group' ? 'pink' : 'gray'}-500/20`
                              )}>
                                <CategoryIcon className={cn("w-5 h-5", categoryColors[notification.category])} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className={cn(
                                  "font-medium text-sm",
                                  notification.isRead ? "text-muted-foreground" : "text-white"
                                )}>
                                  {notification.title}
                                </h3>
                                <p className={cn(
                                  "text-sm mt-1",
                                  notification.isRead ? "text-muted-foreground" : "text-white/80"
                                )}>
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <TypeIcon className={cn("w-3 h-3", typeColors[notification.type])} />
                                  <span className="text-xs text-muted-foreground">
                                    {formatRelativeTime(notification.timestamp)}
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            {notification.actionText && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNotificationClick(notification)
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
            
            {/* 底部操作 */}
            <div className="p-4 border-t border-white/10">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                通知设置
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

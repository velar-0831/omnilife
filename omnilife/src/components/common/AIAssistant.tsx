'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Sparkles,
  Music,
  Newspaper,
  ShoppingBag,
  Car,
  Home,
  Users,
  Lightbulb,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatRelativeTime } from '@/lib/utils'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  actions?: ChatAction[]
}

interface ChatAction {
  id: string
  label: string
  icon: React.ComponentType<any>
  action: () => void
  color?: string
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const quickActions = [
  { label: '推荐音乐', icon: Music, query: '为我推荐一些好听的音乐', color: 'text-purple-400' },
  { label: '今日新闻', icon: Newspaper, query: '有什么重要新闻吗？', color: 'text-blue-400' },
  { label: '购物建议', icon: ShoppingBag, query: '帮我找一些优质商品', color: 'text-green-400' },
  { label: '汽车保养', icon: Car, query: '我的车需要保养吗？', color: 'text-orange-400' },
  { label: '生活服务', icon: Home, query: '附近有什么生活服务？', color: 'text-indigo-400' },
  { label: '团购推荐', icon: Users, query: '有什么值得参与的团购？', color: 'text-pink-400' },
]

const mockResponses = {
  '推荐音乐': {
    content: '🎵 根据您的喜好，我为您推荐以下音乐：\n\n• 周杰伦 - 青花瓷 (经典中国风)\n• Taylor Swift - Anti-Hero (流行热门)\n• 久石让 - Summer (治愈纯音乐)\n• 林俊杰 - 江南 (华语经典)\n\n您想听哪一首呢？',
    suggestions: ['播放青花瓷', '查看更多推荐', '创建播放列表'],
    actions: [
      { id: '1', label: '去音乐模块', icon: Music, action: () => console.log('Navigate to music') }
    ]
  },
  '今日新闻': {
    content: '📰 今日重要新闻摘要：\n\n• AI技术突破：OpenAI发布GPT-5，性能大幅提升\n• 科技新品：苹果发布iPhone 15系列，钛金属设计\n• 经济动态：新能源汽车销量创新高\n• 生活资讯：北京地铁新线路即将开通\n\n您想了解哪个新闻的详情？',
    suggestions: ['AI技术详情', 'iPhone 15评测', '查看更多新闻'],
    actions: [
      { id: '1', label: '去资讯模块', icon: Newspaper, action: () => console.log('Navigate to news') }
    ]
  },
  '购物建议': {
    content: '🛒 为您推荐热门优质商品：\n\n• iPhone 15 Pro Max - 最新旗舰手机\n• 戴森V15吸尘器 - 家居清洁神器\n• 小米空气净化器 - 健康生活必备\n• Nike Air Max运动鞋 - 舒适运动装备\n\n这些商品都有不错的优惠哦！',
    suggestions: ['查看iPhone详情', '比较价格', '加入购物车'],
    actions: [
      { id: '1', label: '去购物模块', icon: ShoppingBag, action: () => console.log('Navigate to shopping') }
    ]
  },
  default: {
    content: '🤖 我是您的AI生活助手！我可以帮您：\n\n• 推荐个性化内容\n• 查找生活服务\n• 管理日程安排\n• 解答各种问题\n• 优化使用体验\n\n请告诉我您需要什么帮助？',
    suggestions: ['推荐音乐', '今日新闻', '购物建议', '生活服务'],
  }
}

export function AIAssistant({ isOpen, onClose, className }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 您好！我是OmniLife的AI助手，很高兴为您服务！\n\n我可以帮您推荐音乐、查找新闻、寻找商品、管理汽车、预订生活服务，还能帮您找到最优惠的团购。\n\n请问今天我能为您做些什么？',
      timestamp: new Date(),
      suggestions: ['推荐音乐', '今日新闻', '购物建议', '生活服务']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // 模拟AI响应延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // 生成AI响应
    const response = generateAIResponse(content)
    const assistantMessage: ChatMessage = {
      id: `assistant_${Date.now()}`,
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      actions: response.actions,
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const generateAIResponse = (userInput: string): Omit<ChatMessage, 'id' | 'type' | 'timestamp'> => {
    const input = userInput.toLowerCase()
    
    if (input.includes('音乐') || input.includes('歌')) {
      return mockResponses['推荐音乐']
    } else if (input.includes('新闻') || input.includes('资讯')) {
      return mockResponses['今日新闻']
    } else if (input.includes('购物') || input.includes('商品') || input.includes('买')) {
      return mockResponses['购物建议']
    } else if (input.includes('汽车') || input.includes('车')) {
      return {
        content: '🚗 关于汽车服务，我可以帮您：\n\n• 查看车辆保养记录\n• 预约保养服务\n• 寻找附近维修店\n• 管理车辆信息\n• 提醒保养时间\n\n您的车辆需要什么服务吗？',
        suggestions: ['查看保养记录', '预约保养', '寻找维修店'],
        actions: [
          { id: '1', label: '去汽车模块', icon: Car, action: () => console.log('Navigate to auto') }
        ]
      }
    } else if (input.includes('生活') || input.includes('服务')) {
      return {
        content: '🏠 生活服务推荐：\n\n• 家政清洁 - 专业上门清洁\n• 维修服务 - 家电维修保养\n• 美容美发 - 专业造型服务\n• 外卖配送 - 快速送达\n• 代驾服务 - 安全出行\n\n需要预订哪项服务？',
        suggestions: ['家政清洁', '维修服务', '美容美发'],
        actions: [
          { id: '1', label: '去生活模块', icon: Home, action: () => console.log('Navigate to life') }
        ]
      }
    } else if (input.includes('团购')) {
      return {
        content: '👥 热门团购推荐：\n\n• iPhone 15团购 - 省1500元\n• 戴森吸尘器 - 限时优惠\n• 品牌美妆套装 - 超值价格\n• 生鲜食品 - 新鲜直达\n\n您想参与哪个团购？',
        suggestions: ['iPhone团购', '戴森团购', '美妆团购'],
        actions: [
          { id: '1', label: '去团购模块', icon: Users, action: () => console.log('Navigate to group') }
        ]
      }
    } else {
      return {
        content: `🤔 我理解您想了解"${userInput}"。让我为您提供一些建议：\n\n• 您可以尝试更具体的问题\n• 或者选择下方的快捷操作\n• 我会持续学习为您提供更好的服务\n\n还有什么我可以帮助您的吗？`,
        suggestions: ['推荐音乐', '今日新闻', '购物建议', '生活服务'],
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSendMessage(action.query)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={cn(
          "fixed bottom-4 right-4 z-50",
          isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
          className
        )}
      >
        <Card variant="glass" className="h-full flex flex-col overflow-hidden border-primary/20">
          {/* 头部 */}
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-cyan rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm">AI助手</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">在线</span>
                  </div>
                </div>
              </CardTitle>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6"
                >
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-6 h-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* 消息区域 */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-start space-x-2",
                      message.type === 'user' ? "flex-row-reverse space-x-reverse" : "flex-row"
                    )}
                  >
                    {/* 头像 */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.type === 'user' 
                        ? "bg-primary/20" 
                        : "bg-gradient-to-r from-primary to-accent-cyan"
                    )}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* 消息内容 */}
                    <div className={cn(
                      "flex-1 max-w-xs",
                      message.type === 'user' ? "text-right" : "text-left"
                    )}>
                      <div className={cn(
                        "inline-block px-3 py-2 rounded-lg text-sm",
                        message.type === 'user'
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(message.timestamp)}
                      </p>

                      {/* 建议按钮 */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs rounded transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 操作按钮 */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.actions.map((action) => (
                            <Button
                              key={action.id}
                              variant="ghost"
                              size="sm"
                              onClick={action.action}
                              className="h-7 text-xs"
                            >
                              <action.icon className="w-3 h-3 mr-1" />
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 输入指示器 */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-cyan flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-secondary px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* 快捷操作 */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="flex flex-col items-center space-y-1 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <action.icon className={cn("w-4 h-4", action.color)} />
                        <span className="text-xs text-white">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 输入区域 */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(inputValue)
                      }
                    }}
                    placeholder="输入您的问题..."
                    disabled={isTyping}
                    className="flex-1 px-3 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground text-sm"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="w-8 h-8"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

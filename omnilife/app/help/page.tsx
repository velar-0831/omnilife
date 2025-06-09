'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Play,
  FileText,
  Video,
  Headphones,
  Users,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { GlobalLayout } from '@/components/layout/GlobalLayout'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  tags: string[]
}

interface HelpCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
  articleCount: number
}

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: '快速入门',
    icon: Zap,
    color: 'text-yellow-400',
    description: '了解如何开始使用OmniLife平台',
    articleCount: 12
  },
  {
    id: 'account',
    name: '账户管理',
    icon: Users,
    color: 'text-blue-400',
    description: '账户设置、安全和个人资料管理',
    articleCount: 8
  },
  {
    id: 'features',
    name: '功能使用',
    icon: Settings,
    color: 'text-green-400',
    description: '各个模块的详细使用指南',
    articleCount: 24
  },
  {
    id: 'payment',
    name: '支付相关',
    icon: CreditCard,
    color: 'text-purple-400',
    description: '支付方式、订单和退款相关问题',
    articleCount: 6
  },
  {
    id: 'security',
    name: '安全隐私',
    icon: Shield,
    color: 'text-red-400',
    description: '账户安全和隐私保护相关',
    articleCount: 5
  },
  {
    id: 'mobile',
    name: '移动应用',
    icon: Smartphone,
    color: 'text-indigo-400',
    description: '移动端应用使用指南',
    articleCount: 7
  }
]

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '如何注册OmniLife账户？',
    answer: '您可以通过以下步骤注册：1. 点击页面右上角的"注册"按钮；2. 填写手机号码或邮箱地址；3. 设置密码；4. 验证手机号或邮箱；5. 完善个人信息。注册完成后即可开始使用所有功能。',
    category: 'getting-started',
    helpful: 156,
    notHelpful: 8,
    tags: ['注册', '账户', '新用户']
  },
  {
    id: '2',
    question: '忘记密码怎么办？',
    answer: '如果忘记密码，请按以下步骤重置：1. 在登录页面点击"忘记密码"；2. 输入注册时使用的手机号或邮箱；3. 接收验证码；4. 输入验证码后设置新密码。如果仍有问题，请联系客服。',
    category: 'account',
    helpful: 234,
    notHelpful: 12,
    tags: ['密码', '重置', '登录']
  },
  {
    id: '3',
    question: '如何使用AI音乐推荐功能？',
    answer: 'AI音乐推荐会根据您的听歌历史和偏好自动推荐音乐。使用方法：1. 进入音乐模块；2. 点击"为我推荐"；3. 系统会分析您的喜好并推荐相似音乐；4. 您可以点赞或跳过来优化推荐算法。',
    category: 'features',
    helpful: 189,
    notHelpful: 15,
    tags: ['音乐', 'AI推荐', '个性化']
  },
  {
    id: '4',
    question: '团购如何参与和退出？',
    answer: '参与团购：1. 浏览团购页面选择商品；2. 点击"参与团购"；3. 选择数量和规格；4. 支付定金或全款。退出团购：在团购截止前可以申请退出，已支付金额会原路退回，具体退款时间为3-7个工作日。',
    category: 'features',
    helpful: 267,
    notHelpful: 23,
    tags: ['团购', '参与', '退出', '退款']
  },
  {
    id: '5',
    question: '支付安全如何保障？',
    answer: '我们采用多重安全措施保护您的支付安全：1. 使用SSL加密传输；2. 支持主流安全支付方式；3. 实时风险监控；4. 资金由第三方支付平台托管；5. 购买支付保险。您的资金安全有充分保障。',
    category: 'security',
    helpful: 445,
    notHelpful: 7,
    tags: ['支付', '安全', '保障']
  }
]

const quickActions = [
  {
    title: '联系客服',
    description: '在线客服为您解答疑问',
    icon: MessageCircle,
    color: 'text-blue-400',
    action: () => console.log('Open chat')
  },
  {
    title: '视频教程',
    description: '观看详细的使用教程',
    icon: Video,
    color: 'text-red-400',
    action: () => console.log('Open videos')
  },
  {
    title: '用户手册',
    description: '下载完整的用户手册',
    icon: Book,
    color: 'text-green-400',
    action: () => console.log('Download manual')
  },
  {
    title: '社区论坛',
    description: '与其他用户交流经验',
    icon: Users,
    color: 'text-purple-400',
    action: () => console.log('Open forum')
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleHelpful = (faqId: string, isHelpful: boolean) => {
    console.log(`FAQ ${faqId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`)
  }

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        {/* 页面头部 */}
        <div className="border-b border-white/10 bg-background/50">
          <div className="container mx-auto px-4 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold gradient-text mb-4">❓ 帮助中心</h1>
              <p className="text-xl text-muted-foreground mb-8">
                我们随时为您提供帮助和支持
              </p>
              
              {/* 搜索框 */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索帮助内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-secondary rounded-xl border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* 快速操作 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="glass" 
                  className="cursor-pointer hover:bg-white/5 transition-all duration-300 group"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110",
                      `bg-${action.color.split('-')[1]}-400/10`
                    )}>
                      <action.icon className={cn("w-6 h-6", action.color)} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 帮助分类 */}
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>帮助分类</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-colors",
                      !selectedCategory ? "bg-primary/20 text-primary" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">全部分类</span>
                      <span className="text-xs text-muted-foreground">
                        {faqData.length}
                      </span>
                    </div>
                  </button>
                  
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-colors",
                        selectedCategory === category.id 
                          ? "bg-primary/20 text-primary" 
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon className={cn("w-4 h-4", category.color)} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {category.articleCount}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground text-left">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ内容 */}
            <div className="lg:col-span-3">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>常见问题</span>
                    <span className="text-sm text-muted-foreground">
                      找到 {filteredFAQs.length} 个结果
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">没有找到相关内容</h3>
                      <p className="text-muted-foreground mb-6">
                        尝试使用不同的关键词或联系客服获取帮助
                      </p>
                      <Button>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        联系客服
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredFAQs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-white/10 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => handleFAQToggle(faq.id)}
                            className="w-full px-6 py-4 text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white pr-4">{faq.question}</h3>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="w-3 h-3 text-green-400" />
                                  <span className="text-xs text-muted-foreground">{faq.helpful}</span>
                                </div>
                                {expandedFAQ === faq.id ? (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {expandedFAQ === faq.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/10"
                              >
                                <div className="px-6 py-4">
                                  <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                  
                                  {/* 标签 */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {faq.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  {/* 反馈按钮 */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <span className="text-sm text-muted-foreground">这个回答有帮助吗？</span>
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleHelpful(faq.id, true)}
                                        >
                                          <ThumbsUp className="w-4 h-4 mr-1" />
                                          有帮助 ({faq.helpful})
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleHelpful(faq.id, false)}
                                        >
                                          <ThumbsDown className="w-4 h-4 mr-1" />
                                          没帮助 ({faq.notHelpful})
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 联系支持 */}
              <Card variant="glass" className="mt-8">
                <CardHeader>
                  <CardTitle>还需要帮助？</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <MessageCircle className="w-6 h-6 text-blue-400" />
                      <span className="font-medium">在线客服</span>
                      <span className="text-xs text-muted-foreground">24小时在线</span>
                    </Button>
                    
                    <Button variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Mail className="w-6 h-6 text-green-400" />
                      <span className="font-medium">邮件支持</span>
                      <span className="text-xs text-muted-foreground">support@omnilife.com</span>
                    </Button>
                    
                    <Button variant="ghost" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Phone className="w-6 h-6 text-purple-400" />
                      <span className="font-medium">电话支持</span>
                      <span className="text-xs text-muted-foreground">400-123-4567</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  )
}

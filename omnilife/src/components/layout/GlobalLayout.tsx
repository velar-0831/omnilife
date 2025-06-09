'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Home,
  Music,
  Newspaper,
  ShoppingBag,
  Car,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Zap,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { GlobalSearch } from '@/components/common/GlobalSearch'
import { NotificationCenter } from '@/components/common/NotificationCenter'
import { AIAssistant } from '@/components/common/AIAssistant'
import { ErrorBoundaryWrapper } from '@/components/common/ErrorBoundary'
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor'
import { PWAInstallPrompt } from '@/components/common/PWAInstallPrompt'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { useTranslation } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface GlobalLayoutProps {
  children: React.ReactNode
}

// 导航项将在组件内部定义以使用国际化

const mockUser = {
  name: '全域生活用户',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
  level: 'VIP',
  points: 12580,
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(
    process.env.NODE_ENV === 'development'
  )

  // 国际化和主题
  const { t } = useTranslation()
  const { isDark } = useTheme()

  // 导航项（使用国际化）
  const navigationItems = [
    { name: t('navigation.home'), href: '/', icon: Home, color: 'text-blue-400' },
    { name: t('navigation.music'), href: '/music', icon: Music, color: 'text-purple-400' },
    { name: t('navigation.news'), href: '/news', icon: Newspaper, color: 'text-blue-400' },
    { name: t('navigation.shopping'), href: '/shopping', icon: ShoppingBag, color: 'text-green-400' },
    { name: t('navigation.auto'), href: '/auto', icon: Car, color: 'text-orange-400' },
    { name: t('navigation.life'), href: '/life', icon: Home, color: 'text-indigo-400' },
    { name: t('navigation.group'), href: '/group', icon: Users, color: 'text-pink-400' },
  ]

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      
      // Escape 关闭所有弹窗
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsNotificationOpen(false)
        setIsMobileMenuOpen(false)
        setIsUserMenuOpen(false)
        setIsAIAssistantOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])



  const handleNavigation = (href: string) => {
    setCurrentPath(href)
    setIsMobileMenuOpen(false)
    // 这里应该使用路由导航
    console.log('Navigate to:', href)
  }

  return (
    <ErrorBoundaryWrapper>
      <div className={cn("min-h-screen", isDark ? 'dark' : '')}>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo和品牌 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-cyan rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">
                  OmniLife
                </span>
              </div>
            </div>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-primary/20 text-primary" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : item.color)} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-2">
              {/* 搜索按钮 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="relative"
              >
                <Search className="w-4 h-4" />
                <span className="absolute -bottom-1 -right-1 text-xs text-muted-foreground hidden sm:block">
                  ⌘K
                </span>
              </Button>

              {/* 语言切换 */}
              <LanguageSwitcher variant="dropdown" />

              {/* 主题切换 */}
              <ThemeSwitcher variant="dropdown" />

              {/* AI助手按钮 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAIAssistantOpen(true)}
                className="relative"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </Button>

              {/* 通知按钮 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationOpen(true)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* 用户菜单 */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-2"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src={mockUser.avatar} 
                      alt={mockUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white">{mockUser.name}</p>
                    <p className="text-xs text-muted-foreground">{mockUser.level} • {mockUser.points.toLocaleString()}积分</p>
                  </div>
                </Button>

                {/* 用户下拉菜单 */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-secondary border border-white/10 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={mockUser.avatar} 
                              alt={mockUser.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{mockUser.name}</p>
                            <p className="text-sm text-muted-foreground">{mockUser.level}</p>
                            <p className="text-xs text-primary">{mockUser.points.toLocaleString()} 积分</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation('/profile')
                            setIsUserMenuOpen(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          个人中心
                        </button>
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          设置
                        </button>
                        <hr className="my-2 border-white/10" />
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-400/10 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          退出登录
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端侧边栏 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80 z-50 bg-background border-r border-white/10 md:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-cyan rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">OmniLife</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = currentPath === item.href
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-primary/20 text-primary" 
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : item.color)} />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 全局搜索 */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 通知中心 */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* AI助手 */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {/* PWA安装提示 */}
      <PWAInstallPrompt />

      {/* 性能监控 */}
      {showPerformanceMonitor && (
        <PerformanceMonitor
          enabled={process.env.NODE_ENV === 'development'}
          position="bottom-right"
        />
      )}

      {/* 底部版权信息 */}
      <footer className="border-t border-white/10 bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2024 OmniLife 全域生活平台. All rights reserved.
            </p>
            <p className="text-xs mt-2">
              Powered by AI • Built with ❤️
            </p>
          </div>
        </div>
      </footer>
      </div>
    </ErrorBoundaryWrapper>
  )
}

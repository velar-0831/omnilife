'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAInstallPromptProps {
  className?: string
}

export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [installSupported, setInstallSupported] = useState(false)

  useEffect(() => {
    // 检查是否已安装
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches
      
      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)
    }

    // 监听安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      setInstallSupported(true)
      
      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true)
        }
      }, 30000) // 30秒后显示
    }

    // 监听应用安装事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    }

    // 监听网络状态
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    checkIfInstalled()
    setIsOnline(navigator.onLine)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
        localStorage.setItem('pwa-install-dismissed', 'true')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/android/.test(userAgent)) return 'Android'
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS'
    if (/windows/.test(userAgent)) return 'Windows'
    if (/mac/.test(userAgent)) return 'macOS'
    return 'Desktop'
  }

  const getInstallInstructions = () => {
    const device = getDeviceType()
    
    switch (device) {
      case 'iOS':
        return {
          icon: Smartphone,
          title: '添加到主屏幕',
          steps: [
            '点击浏览器底部的分享按钮',
            '选择"添加到主屏幕"',
            '点击"添加"确认'
          ]
        }
      case 'Android':
        return {
          icon: Smartphone,
          title: '安装应用',
          steps: [
            '点击下方的"安装"按钮',
            '在弹出的对话框中点击"安装"',
            '应用将添加到您的主屏幕'
          ]
        }
      default:
        return {
          icon: Monitor,
          title: '安装桌面应用',
          steps: [
            '点击地址栏右侧的安装图标',
            '或点击下方的"安装"按钮',
            '应用将添加到您的桌面'
          ]
        }
    }
  }

  if (isInstalled) {
    return null
  }

  return (
    <>
      {/* 网络状态指示器 */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-sm text-black text-center py-2 text-sm font-medium"
          >
            <div className="flex items-center justify-center space-x-2">
              <WifiOff className="w-4 h-4" />
              <span>您当前处于离线状态，部分功能可能受限</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 安装提示 */}
      <AnimatePresence>
        {showPrompt && installSupported && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn("fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto", className)}
          >
            <Card variant="glass" className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent-cyan rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white">安装 OmniLife</div>
                      <div className="text-xs text-muted-foreground">获得更好的体验</div>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDismiss}
                    className="w-6 h-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>安装应用后，您可以：</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>离线访问部分功能</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>接收推送通知</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>更快的启动速度</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>原生应用体验</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleInstallClick} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    安装应用
                  </Button>
                  <Button variant="ghost" onClick={handleDismiss}>
                    稍后
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 手动安装指南 */}
      <AnimatePresence>
        {!installSupported && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <Card variant="glass" className="border-blue-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-blue-400" />
                  安装指南
                </CardTitle>
              </CardHeader>

              <CardContent>
                {(() => {
                  const instructions = getInstallInstructions()
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <instructions.icon className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-medium text-white">
                          {instructions.title}
                        </span>
                      </div>
                      
                      <ol className="text-xs text-muted-foreground space-y-1">
                        {instructions.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// PWA 状态钩子
export function usePWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // 检查安装状态
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebApp = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebApp)
    }

    // 检查网络状态
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // 检查更新
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setUpdateAvailable(true)
        })
      }
    }

    checkInstallStatus()
    updateOnlineStatus()
    checkForUpdates()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const refreshApp = () => {
    window.location.reload()
  }

  return {
    isInstalled,
    isOnline,
    updateAvailable,
    refreshApp
  }
}

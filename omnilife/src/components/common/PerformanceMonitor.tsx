'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Zap, 
  Clock, 
  Wifi, 
  HardDrive,
  Cpu,
  MemoryStick,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface PerformanceMetrics {
  fps: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  timing: {
    domContentLoaded: number
    loadComplete: number
    firstPaint: number
    firstContentfulPaint: number
  }
  network: {
    effectiveType: string
    downlink: number
    rtt: number
  }
  vitals: {
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
  }
}

interface PerformanceMonitorProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

export function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef<number | null>(null)
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() })

  useEffect(() => {
    if (!enabled) return

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const memory = (performance as any).memory
      const connection = (navigator as any).connection

      // 收集性能指标
      const newMetrics: PerformanceMetrics = {
        fps: calculateFPS(),
        memory: {
          used: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
          total: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 0,
          percentage: memory ? Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100) : 0
        },
        timing: {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
          firstPaint: getFirstPaint(),
          firstContentfulPaint: getFirstContentfulPaint()
        },
        network: {
          effectiveType: connection?.effectiveType || 'unknown',
          downlink: connection?.downlink || 0,
          rtt: connection?.rtt || 0
        },
        vitals: {
          lcp: getLCP(),
          fid: getFID(),
          cls: getCLS()
        }
      }

      setMetrics(newMetrics)
    }

    const startMonitoring = () => {
      setIsCollecting(true)
      collectMetrics()
      intervalRef.current = setInterval(collectMetrics, 1000)
      startFPSMonitoring()
    }

    const stopMonitoring = () => {
      setIsCollecting(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      stopFPSMonitoring()
    }

    if (isVisible) {
      startMonitoring()
    } else {
      stopMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, [enabled, isVisible])

  const calculateFPS = () => {
    return Math.round(fpsRef.current.frames)
  }

  const startFPSMonitoring = () => {
    const measureFPS = () => {
      const now = performance.now()
      fpsRef.current.frames++
      
      if (now >= fpsRef.current.lastTime + 1000) {
        fpsRef.current.frames = 0
        fpsRef.current.lastTime = now
      }
      
      frameRef.current = requestAnimationFrame(measureFPS)
    }
    measureFPS()
  }

  const stopFPSMonitoring = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }

  const getFirstPaint = () => {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint ? Math.round(firstPaint.startTime) : 0
  }

  const getFirstContentfulPaint = () => {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcp ? Math.round(fcp.startTime) : 0
  }

  const getLCP = () => {
    // 简化的LCP计算
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
    const lastEntry = lcpEntries[lcpEntries.length - 1] as any
    return lastEntry ? Math.round(lastEntry.startTime) : 0
  }

  const getFID = () => {
    // 简化的FID计算
    const fidEntries = performance.getEntriesByType('first-input')
    const firstEntry = fidEntries[0] as any
    return firstEntry ? Math.round(firstEntry.processingStart - firstEntry.startTime) : 0
  }

  const getCLS = () => {
    // 简化的CLS计算
    const clsEntries = performance.getEntriesByType('layout-shift')
    let cls = 0
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value
      }
    })
    return Math.round(cls * 1000) / 1000
  }

  const getPerformanceStatus = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      fps: { good: 55, poor: 30 },
      memory: { good: 50, poor: 80 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-3 h-3 text-green-400" />
      case 'needs-improvement':
        return <AlertTriangle className="w-3 h-3 text-yellow-400" />
      case 'poor':
        return <AlertTriangle className="w-3 h-3 text-red-400" />
      default:
        return <Activity className="w-3 h-3 text-muted-foreground" />
    }
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  if (!enabled) return null

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      {/* 切换按钮 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="w-10 h-10 bg-background/80 backdrop-blur-sm border border-white/10"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* 性能面板 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80"
          >
            <Card variant="glass" className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-primary" />
                    性能监控
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {isCollecting && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsVisible(false)}
                      className="w-6 h-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {metrics && (
                  <>
                    {/* FPS */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>FPS</span>
                        {getStatusIcon(getPerformanceStatus('fps', metrics.fps))}
                      </div>
                      <span className="font-mono">{metrics.fps}</span>
                    </div>

                    {/* 内存使用 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MemoryStick className="w-3 h-3 text-blue-400" />
                          <span>内存</span>
                          {getStatusIcon(getPerformanceStatus('memory', metrics.memory.percentage))}
                        </div>
                        <span className="font-mono">
                          {metrics.memory.used}MB / {metrics.memory.total}MB
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1">
                        <div 
                          className={cn("h-1 rounded-full transition-all", 
                            metrics.memory.percentage > 80 ? "bg-red-400" :
                            metrics.memory.percentage > 50 ? "bg-yellow-400" : "bg-green-400"
                          )}
                          style={{ width: `${metrics.memory.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 网络信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="w-3 h-3 text-green-400" />
                        <span>网络</span>
                      </div>
                      <span className="font-mono">
                        {metrics.network.effectiveType} ({metrics.network.downlink}Mbps)
                      </span>
                    </div>

                    {/* Core Web Vitals */}
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Core Web Vitals</div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>LCP</span>
                          {getStatusIcon(getPerformanceStatus('lcp', metrics.vitals.lcp))}
                        </div>
                        <span className="font-mono">{metrics.vitals.lcp}ms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>FID</span>
                          {getStatusIcon(getPerformanceStatus('fid', metrics.vitals.fid))}
                        </div>
                        <span className="font-mono">{metrics.vitals.fid}ms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>CLS</span>
                          {getStatusIcon(getPerformanceStatus('cls', metrics.vitals.cls))}
                        </div>
                        <span className="font-mono">{metrics.vitals.cls}</span>
                      </div>
                    </div>

                    {/* 页面加载时间 */}
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">页面加载</div>
                      
                      <div className="flex items-center justify-between">
                        <span>DOM Ready</span>
                        <span className="font-mono">{metrics.timing.domContentLoaded}ms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Load Complete</span>
                        <span className="font-mono">{metrics.timing.loadComplete}ms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>First Paint</span>
                        <span className="font-mono">{metrics.timing.firstPaint}ms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>FCP</span>
                        <span className="font-mono">{metrics.timing.firstContentfulPaint}ms</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 性能分析钩子
export function usePerformanceAnalytics() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})

  useEffect(() => {
    // 监听性能条目
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            vitals: { ...prev.vitals, lcp: entry.startTime }
          }))
        }
        // 可以添加更多性能指标的监听
      })
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  const reportMetrics = (customMetrics?: Record<string, any>) => {
    const reportData = {
      ...metrics,
      ...customMetrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // 发送到分析服务
    console.log('Performance Metrics:', reportData)
    
    // 这里可以集成 Google Analytics、Adobe Analytics 等
    // gtag('event', 'performance_metrics', reportData)
  }

  return { metrics, reportMetrics }
}

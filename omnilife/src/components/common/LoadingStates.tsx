'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Zap, Music, Newspaper, ShoppingBag, Car, Home, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// 基础加载器
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground mt-2">{text}</p>
      )}
    </div>
  )
}

// 脉冲加载器
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 品牌加载器
export function BrandLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        className="w-16 h-16 bg-gradient-to-r from-primary to-accent-cyan rounded-2xl flex items-center justify-center mb-4"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-8 h-8 text-white" />
      </motion.div>
      <motion.div
        className="text-xl font-bold gradient-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        OmniLife
      </motion.div>
      <p className="text-sm text-muted-foreground mt-2">正在加载...</p>
    </div>
  )
}

// 模块加载器
interface ModuleLoaderProps {
  module: 'music' | 'news' | 'shopping' | 'auto' | 'life' | 'group'
  className?: string
}

export function ModuleLoader({ module, className }: ModuleLoaderProps) {
  const moduleConfig = {
    music: { icon: Music, name: '音乐', color: 'text-purple-400' },
    news: { icon: Newspaper, name: '资讯', color: 'text-blue-400' },
    shopping: { icon: ShoppingBag, name: '购物', color: 'text-green-400' },
    auto: { icon: Car, name: '汽车', color: 'text-orange-400' },
    life: { icon: Home, name: '生活', color: 'text-indigo-400' },
    group: { icon: Users, name: '团购', color: 'text-pink-400' }
  }

  const config = moduleConfig[module]
  const Icon = config.icon

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <motion.div
        className={cn("w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4")}
        animate={{
          scale: [1, 1.2, 1],
          rotateY: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className={cn("w-6 h-6", config.color)} />
      </motion.div>
      <motion.p
        className="text-white font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        正在加载{config.name}模块...
      </motion.p>
    </div>
  )
}

// 骨架屏组件
export function Skeleton({ 
  className, 
  variant = 'rectangular',
  animation = 'pulse'
}: { 
  className?: string
  variant?: 'rectangular' | 'circular' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
}) {
  const baseClasses = "bg-secondary/50"
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded h-4"
  }
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "",
    none: ""
  }

  if (animation === 'wave') {
    return (
      <div className={cn(
        baseClasses,
        variantClasses[variant],
        "relative overflow-hidden",
        className
      )}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    )
  }

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      animationClasses[animation],
      className
    )} />
  )
}

// 卡片骨架屏
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

// 列表骨架屏
export function ListSkeleton({ 
  items = 5, 
  className 
}: { 
  items?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

// 网格骨架屏
export function GridSkeleton({ 
  items = 6, 
  columns = 3,
  className 
}: { 
  items?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn(
      "grid gap-6",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      className
    )}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// 表格骨架屏
export function TableSkeleton({ 
  rows = 5, 
  columns = 4,
  className 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* 表头 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

// 页面加载状态
export function PageLoader({ message = "正在加载页面..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <BrandLoader />
    </div>
  )
}

// 内容加载状态
export function ContentLoader({ 
  type = 'default',
  message,
  className 
}: { 
  type?: 'default' | 'cards' | 'list' | 'grid' | 'table'
  message?: string
  className?: string 
}) {
  const renderSkeleton = () => {
    switch (type) {
      case 'cards':
        return <GridSkeleton items={6} columns={3} />
      case 'list':
        return <ListSkeleton items={8} />
      case 'grid':
        return <GridSkeleton items={9} columns={3} />
      case 'table':
        return <TableSkeleton rows={10} columns={5} />
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <GridSkeleton items={6} columns={2} />
          </div>
        )
    }
  }

  return (
    <div className={cn("p-6", className)}>
      {message && (
        <div className="text-center mb-8">
          <PulseLoader />
          <p className="text-sm text-muted-foreground mt-4">{message}</p>
        </div>
      )}
      {renderSkeleton()}
    </div>
  )
}

// 搜索加载状态
export function SearchLoader({ className }: { className?: string }) {
  return (
    <div className={cn("text-center py-12", className)}>
      <motion.div
        className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-muted-foreground">正在搜索...</p>
    </div>
  )
}

// 空状态加载
export function EmptyStateLoader({ 
  icon: Icon = Zap,
  title = "暂无数据",
  description = "当前没有可显示的内容",
  action,
  className 
}: {
  icon?: React.ComponentType<any>
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("text-center py-12", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Icon className="w-8 h-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Settings,
  Check,
  RotateCcw,
  Zap,
  Eye,
  Type,
  Square,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  useTheme, 
  ThemeMode, 
  ColorScheme, 
  COLOR_SCHEMES,
  FONT_SIZES,
  BORDER_RADIUS,
  THEME_PRESETS,
  ThemePreset
} from '@/lib/theme'
import { cn } from '@/lib/utils'

interface ThemeSwitcherProps {
  variant?: 'button' | 'dropdown' | 'modal'
  showLabel?: boolean
  className?: string
}

export function ThemeSwitcher({ 
  variant = 'button', 
  showLabel = false,
  className 
}: ThemeSwitcherProps) {
  const { mode, setMode, isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleModeToggle = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(mode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setMode(nextMode)
  }

  const getModeIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'light':
        return '浅色模式'
      case 'dark':
        return '深色模式'
      case 'system':
        return '跟随系统'
    }
  }

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleModeToggle}
        className={cn("relative", className)}
        title={getModeLabel()}
      >
        <motion.div
          key={mode}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          {getModeIcon()}
        </motion.div>
        {showLabel && (
          <span className="ml-2 text-sm">{getModeLabel()}</span>
        )}
      </Button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          {getModeIcon()}
          {showLabel && <span className="text-sm">{getModeLabel()}</span>}
          <ChevronDown className={cn(
            "w-3 h-3 transition-transform",
            isOpen && "rotate-180"
          )} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full mt-2 right-0 z-50 min-w-40"
              >
                <Card variant="glass" className="border-white/10">
                  <CardContent className="p-2">
                    {(['light', 'dark', 'system'] as ThemeMode[]).map((themeMode) => (
                      <button
                        key={themeMode}
                        onClick={() => {
                          setMode(themeMode)
                          setIsOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                          mode === themeMode
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-white/5 text-white"
                        )}
                      >
                        {themeMode === 'light' && <Sun className="w-4 h-4" />}
                        {themeMode === 'dark' && <Moon className="w-4 h-4" />}
                        {themeMode === 'system' && <Monitor className="w-4 h-4" />}
                        <span className="text-sm">
                          {themeMode === 'light' && '浅色模式'}
                          {themeMode === 'dark' && '深色模式'}
                          {themeMode === 'system' && '跟随系统'}
                        </span>
                        {mode === themeMode && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // modal variant
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={cn("flex items-center space-x-2", className)}
      >
        <Palette className="w-4 h-4" />
        {showLabel && <span className="text-sm">主题设置</span>}
      </Button>

      <ThemeCustomizationModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}

// 完整的主题自定义模态框
interface ThemeCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
}

function ThemeCustomizationModal({ isOpen, onClose }: ThemeCustomizationModalProps) {
  const theme = useTheme()

  const applyPreset = (preset: ThemePreset) => {
    const config = THEME_PRESETS[preset].config
    theme.setMode(config.mode)
    theme.setColorScheme(config.colorScheme)
    theme.setFontSize(config.fontSize)
    theme.setBorderRadius(config.borderRadius)
    theme.setAnimations(config.animations)
    theme.setReducedMotion(config.reducedMotion)
    theme.setHighContrast(config.highContrast)
    theme.setCompactMode(config.compactMode)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-primary" />
                <span>主题自定义</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* 主题预设 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-primary" />
                  主题预设
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key as ThemePreset)}
                      className="p-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-left"
                    >
                      <div className="font-medium text-white text-sm">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题模式 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-primary" />
                  主题模式
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => theme.setMode(mode)}
                      className={cn(
                        "flex flex-col items-center space-y-2 p-4 rounded-lg transition-colors",
                        theme.mode === mode
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary text-white"
                      )}
                    >
                      {mode === 'light' && <Sun className="w-6 h-6" />}
                      {mode === 'dark' && <Moon className="w-6 h-6" />}
                      {mode === 'system' && <Monitor className="w-6 h-6" />}
                      <span className="text-sm font-medium">
                        {mode === 'light' && '浅色'}
                        {mode === 'dark' && '深色'}
                        {mode === 'system' && '系统'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 颜色方案 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-primary" />
                  颜色方案
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                    <button
                      key={key}
                      onClick={() => theme.setColorScheme(key as ColorScheme)}
                      className={cn(
                        "flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors",
                        theme.colorScheme === key
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary"
                      )}
                    >
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <span className="text-xs text-white">{scheme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 字体大小 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Type className="w-4 h-4 mr-2 text-primary" />
                  字体大小
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(FONT_SIZES).map(([key, size]) => (
                    <button
                      key={key}
                      onClick={() => theme.setFontSize(key as any)}
                      className={cn(
                        "flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors",
                        theme.fontSize === key
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary text-white"
                      )}
                    >
                      <Type className="w-5 h-5" style={{ fontSize: size.baseSize }} />
                      <span className="text-xs">{size.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 圆角设置 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Square className="w-4 h-4 mr-2 text-primary" />
                  圆角大小
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(BORDER_RADIUS).map(([key, radius]) => (
                    <button
                      key={key}
                      onClick={() => theme.setBorderRadius(key as any)}
                      className={cn(
                        "flex flex-col items-center space-y-2 p-3 transition-colors",
                        theme.borderRadius === key
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary/50 hover:bg-secondary text-white"
                      )}
                      style={{ borderRadius: radius.value }}
                    >
                      <Square className="w-5 h-5" />
                      <span className="text-xs">{radius.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 其他设置 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-primary" />
                  其他设置
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-white">动画效果</span>
                    </div>
                    <button
                      onClick={() => theme.setAnimations(!theme.animations)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        theme.animations ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform",
                        theme.animations ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-white">高对比度</span>
                    </div>
                    <button
                      onClick={() => theme.setHighContrast(!theme.highContrast)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        theme.highContrast ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform",
                        theme.highContrast ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Square className="w-4 h-4 text-primary" />
                      <span className="text-white">紧凑模式</span>
                    </div>
                    <button
                      onClick={() => theme.setCompactMode(!theme.compactMode)}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        theme.compactMode ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform",
                        theme.compactMode ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={theme.resetTheme}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置</span>
                </Button>
                
                <Button onClick={onClose}>
                  完成
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

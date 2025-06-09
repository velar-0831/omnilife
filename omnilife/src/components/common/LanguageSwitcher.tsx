'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Check, 
  ChevronDown,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useTranslation, SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'modal' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  showFlag?: boolean
  showNativeName?: boolean
  className?: string
}

export function LanguageSwitcher({
  variant = 'dropdown',
  size = 'md',
  showFlag = true,
  showNativeName = true,
  className
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, isLoading, languages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLangInfo = languages[currentLanguage]

  const handleLanguageChange = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return
    
    try {
      await setLanguage(language)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className={cn(
            "flex items-center space-x-2",
            sizeClasses[size]
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Globe className="w-4 h-4" />
              {showFlag && <span>{currentLangInfo.flag}</span>}
              {showNativeName && (
                <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
              )}
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                isOpen && "rotate-180"
              )} />
            </>
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* 下拉菜单 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full mt-2 right-0 z-50 min-w-48"
              >
                <Card variant="glass" className="border-white/10">
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {Object.entries(languages).map(([code, info]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code as SupportedLanguage)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                            currentLanguage === code
                              ? "bg-primary/20 text-primary"
                              : "hover:bg-white/5 text-white"
                          )}
                        >
                          <span className="text-lg">{info.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium">{info.nativeName}</div>
                            <div className="text-xs text-muted-foreground">{info.name}</div>
                          </div>
                          {currentLanguage === code && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          disabled={isLoading}
          className={cn(
            "flex items-center space-x-2",
            sizeClasses[size],
            className
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Globe className="w-4 h-4" />
              {showFlag && <span>{currentLangInfo.flag}</span>}
              {showNativeName && (
                <span className="hidden sm:inline">{currentLangInfo.nativeName}</span>
              )}
            </>
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <Card variant="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Globe className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-white">选择语言</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(languages).map(([code, info]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code as SupportedLanguage)}
                          className={cn(
                            "flex items-center space-x-3 p-4 rounded-lg transition-colors text-left",
                            currentLanguage === code
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "hover:bg-white/5 text-white border border-transparent"
                          )}
                        >
                          <span className="text-2xl">{info.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium text-lg">{info.nativeName}</div>
                            <div className="text-sm text-muted-foreground">{info.name}</div>
                          </div>
                          {currentLanguage === code && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // inline variant
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {Object.entries(languages).map(([code, info]) => (
        <button
          key={code}
          onClick={() => handleLanguageChange(code as SupportedLanguage)}
          disabled={isLoading}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
            sizeClasses[size],
            currentLanguage === code
              ? "bg-primary/20 text-primary border border-primary/30"
              : "hover:bg-white/5 text-white border border-white/10"
          )}
        >
          {showFlag && <span>{info.flag}</span>}
          <span className={showNativeName ? "block" : "sr-only"}>
            {showNativeName ? info.nativeName : info.name}
          </span>
          {currentLanguage === code && (
            <Check className="w-3 h-3" />
          )}
        </button>
      ))}
    </div>
  )
}

// 紧凑型语言切换器
export function CompactLanguageSwitcher({ className }: { className?: string }) {
  const { currentLanguage, setLanguage, isLoading, languages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLangInfo = languages[currentLanguage]

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span className="text-sm">{currentLangInfo.flag}</span>
            <span className="text-xs font-medium text-white">
              {currentLanguage.split('-')[0].toUpperCase()}
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full mt-1 right-0 z-50 bg-secondary border border-white/10 rounded-lg shadow-xl min-w-32"
            >
              {Object.entries(languages).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code as SupportedLanguage)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center space-x-2 px-3 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg",
                    currentLanguage === code
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-white/5 text-white"
                  )}
                >
                  <span>{info.flag}</span>
                  <span className="text-xs">{code.split('-')[0].toUpperCase()}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// 语言检测和自动切换
export function useLanguageDetection() {
  const { setLanguage } = useTranslation()

  React.useEffect(() => {
    // 检测浏览器语言
    const detectLanguage = () => {
      const browserLang = navigator.language
      const supportedLangs = Object.keys(SUPPORTED_LANGUAGES)
      
      // 精确匹配
      if (supportedLangs.includes(browserLang)) {
        return browserLang as SupportedLanguage
      }
      
      // 语言代码匹配（如 en-GB -> en-US）
      const langCode = browserLang.split('-')[0]
      const matchedLang = supportedLangs.find(lang => 
        lang.startsWith(langCode)
      )
      
      if (matchedLang) {
        return matchedLang as SupportedLanguage
      }
      
      // 默认语言
      return 'zh-CN'
    }

    // 只在首次访问时自动检测
    const hasVisited = localStorage.getItem('omnilife-language-detected')
    if (!hasVisited) {
      const detectedLang = detectLanguage()
      setLanguage(detectedLang)
      localStorage.setItem('omnilife-language-detected', 'true')
    }
  }, [setLanguage])
}

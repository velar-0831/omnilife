'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Music, 
  Newspaper, 
  ShoppingBag, 
  Car, 
  Home, 
  Users,
  Clock,
  TrendingUp,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'music' | 'news' | 'shopping' | 'auto' | 'life' | 'group'
  url: string
  image?: string
  metadata?: any
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const moduleIcons = {
  music: Music,
  news: Newspaper,
  shopping: ShoppingBag,
  auto: Car,
  life: Home,
  group: Users,
}

const moduleColors = {
  music: 'text-purple-400',
  news: 'text-blue-400',
  shopping: 'text-green-400',
  auto: 'text-orange-400',
  life: 'text-indigo-400',
  group: 'text-pink-400',
}

const moduleLabels = {
  music: '音乐',
  news: '资讯',
  shopping: '购物',
  auto: '汽车',
  life: '生活',
  group: '团购',
}

// 模拟搜索结果
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '周杰伦 - 青花瓷',
    description: '经典中国风歌曲，深受喜爱',
    type: 'music',
    url: '/music/song/1',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    title: 'iPhone 15 Pro Max 团购',
    description: '限时团购，省1500元',
    type: 'group',
    url: '/group/1',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    title: 'AI技术最新突破',
    description: 'OpenAI发布GPT-5，性能大幅提升',
    type: 'news',
    url: '/news/article/1',
  },
  {
    id: '4',
    title: '家政清洁服务',
    description: '专业上门清洁，环保用品',
    type: 'life',
    url: '/life/1',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop',
  },
  {
    id: '5',
    title: '特斯拉Model Y保养',
    description: '电动车专业保养服务',
    type: 'auto',
    url: '/auto/service/1',
  },
]

const hotSearches = [
  'iPhone 15 团购',
  '周杰伦新歌',
  'AI最新资讯',
  '家政服务',
  '汽车保养',
  '生活服务',
]

export function GlobalSearch({ isOpen, onClose, className }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 模拟搜索结果
    const filteredResults = mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setResults(filteredResults)
    setIsLoading(false)
    setSelectedIndex(-1)
  }

  const handleResultClick = (result: SearchResult) => {
    // 这里应该导航到对应页面
    console.log('Navigate to:', result.url)
    onClose()
  }

  const handleHotSearchClick = (hotSearch: string) => {
    setQuery(hotSearch)
    handleSearch(hotSearch)
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn("absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl", className)}
          onClick={(e) => e.stopPropagation()}
        >
          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-0">
              {/* 搜索输入框 */}
              <div className="flex items-center p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜索音乐、资讯、商品、服务..."
                  className="flex-1 bg-transparent text-white placeholder-muted-foreground focus:outline-none"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setQuery('')
                      setResults([])
                    }}
                    className="w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-8 h-8 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* 搜索结果 */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">搜索中...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => {
                      const Icon = moduleIcons[result.type]
                      const isSelected = index === selectedIndex
                      
                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "flex items-center space-x-3 p-3 mx-2 rounded-lg cursor-pointer transition-colors",
                            isSelected ? "bg-primary/20" : "hover:bg-white/5"
                          )}
                          onClick={() => handleResultClick(result)}
                        >
                          {result.image ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                              `bg-${result.type === 'music' ? 'purple' : 
                                   result.type === 'news' ? 'blue' :
                                   result.type === 'shopping' ? 'green' :
                                   result.type === 'auto' ? 'orange' :
                                   result.type === 'life' ? 'indigo' : 'pink'}-500/20`
                            )}>
                              <Icon className={cn("w-6 h-6", moduleColors[result.type])} />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{result.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={cn("text-xs", moduleColors[result.type])}>
                                {moduleLabels[result.type]}
                              </span>
                            </div>
                          </div>
                          
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      )
                    })}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">没有找到相关结果</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      尝试使用不同的关键词
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    {/* 热门搜索 */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white">热门搜索</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hotSearches.map((hotSearch, index) => (
                          <button
                            key={index}
                            onClick={() => handleHotSearchClick(hotSearch)}
                            className="px-3 py-1 bg-secondary/50 hover:bg-secondary text-sm text-white rounded-full transition-colors"
                          >
                            {hotSearch}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 最近搜索 */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white">最近搜索</span>
                      </div>
                      <div className="space-y-2">
                        {['iPhone 团购', '周杰伦', '家政服务'].map((recent, index) => (
                          <button
                            key={index}
                            onClick={() => handleHotSearchClick(recent)}
                            className="flex items-center space-x-2 w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-white">{recent}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 快速导航 */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white">快速导航</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(moduleIcons).map(([key, Icon]) => (
                          <button
                            key={key}
                            onClick={() => {
                              // 导航到对应模块
                              console.log('Navigate to:', `/${key}`)
                              onClose()
                            }}
                            className="flex flex-col items-center space-y-2 p-3 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Icon className={cn("w-6 h-6", moduleColors[key as keyof typeof moduleColors])} />
                            <span className="text-xs text-white">
                              {moduleLabels[key as keyof typeof moduleLabels]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

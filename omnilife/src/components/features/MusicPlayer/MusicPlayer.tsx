'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useMusicStore } from '@/stores/useMusicStore'
import { cn, formatTime } from '@/lib/utils'

interface MusicPlayerProps {
  className?: string
  compact?: boolean
}

export function MusicPlayer({ className, compact = false }: MusicPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    isPaused,
    volume,
    currentTime,
    duration,
    playMode,
    likedTracks,
    play,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    setPlayMode,
    toggleLike,
  } = useMusicStore()

  const [isExpanded, setIsExpanded] = useState(!compact)
  const [isDragging, setIsDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  // 模拟音频播放进度更新
  useEffect(() => {
    if (!isPlaying || !currentTrack) return

    const interval = setInterval(() => {
      if (currentTime < duration) {
        seek(currentTime + 1)
      } else {
        next()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration, seek, next, currentTrack])

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else if (isPaused) {
      resume()
    }
  }

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !duration) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    seek(Math.max(0, Math.min(duration, newTime)))
  }

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (!volumeRef.current) return
    
    const rect = volumeRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newVolume = clickX / rect.width
    setVolume(Math.max(0, Math.min(1, newVolume)))
  }

  const togglePlayMode = () => {
    const modes: Array<typeof playMode> = ['single', 'repeat', 'shuffle']
    const currentIndex = modes.indexOf(playMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setPlayMode(nextMode)
  }

  const isLiked = currentTrack ? likedTracks.some(track => track.id === currentTrack.id) : false

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentTrack) {
    return (
      <Card className={cn("p-4 text-center text-muted-foreground", className)}>
        <p>选择一首歌曲开始播放</p>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "p-6" : "p-4",
        className
      )}
      variant="glass"
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* 专辑封面和信息 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                  className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent-cyan/20"
                >
                  {currentTrack.coverUrl ? (
                    <img 
                      src={currentTrack.coverUrl} 
                      alt={currentTrack.album}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </motion.div>
                
                {/* 播放状态指示器 */}
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.album}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => currentTrack && toggleLike(currentTrack)}
                  className={cn(
                    "transition-colors",
                    isLiked ? "text-red-500 hover:text-red-400" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* 进度条 */}
            <div className="space-y-2">
              <div 
                ref={progressRef}
                className="relative h-2 bg-secondary rounded-full cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayMode}
                className={cn(
                  "transition-colors",
                  playMode !== 'single' ? "text-primary" : "text-muted-foreground"
                )}
              >
                {playMode === 'shuffle' ? (
                  <Shuffle className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={previous}>
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                variant="neon"
                size="icon"
                onClick={handlePlayPause}
                className="w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={next}>
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* 音量控制 */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              <div 
                ref={volumeRef}
                className="flex-1 h-1 bg-secondary rounded-full cursor-pointer group"
                onClick={handleVolumeClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              
              <span className="text-xs text-muted-foreground w-8 text-right">
                {Math.round(volume * 100)}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
              {currentTrack.coverUrl ? (
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.album}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <Play className="w-4 h-4 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              className="w-8 h-8"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="w-8 h-8"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 格式化时间的辅助函数
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

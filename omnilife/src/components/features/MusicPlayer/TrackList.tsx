'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Heart, 
  MoreVertical,
  Clock,
  Music
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useMusicStore } from '@/stores/useMusicStore'
import { cn, formatTime } from '@/lib/utils'
import type { Track } from '@/types/music'

interface TrackListProps {
  tracks: Track[]
  title?: string
  showHeader?: boolean
  className?: string
}

export function TrackList({ 
  tracks, 
  title = "播放列表", 
  showHeader = true,
  className 
}: TrackListProps) {
  const {
    currentTrack,
    isPlaying,
    likedTracks,
    play,
    pause,
    toggleLike,
    addToQueue,
  } = useMusicStore()

  const handleTrackPlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause()
      } else {
        play(track)
      }
    } else {
      play(track)
    }
  }

  const isTrackLiked = (track: Track) => {
    return likedTracks.some(likedTrack => likedTrack.id === track.id)
  }

  const isCurrentTrack = (track: Track) => {
    return currentTrack?.id === track.id
  }

  return (
    <Card className={cn("p-6", className)} variant="glass">
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-muted-foreground">
            {tracks.length} 首歌曲 • 总时长 {formatTime(tracks.reduce((sum, track) => sum + (track.duration || 0), 0))}
          </p>
        </div>
      )}

      {/* 表头 */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-white/10 mb-2">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-6">标题</div>
        <div className="col-span-3">专辑</div>
        <div className="col-span-1 text-center">
          <Clock className="w-4 h-4 mx-auto" />
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* 歌曲列表 */}
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            track={track}
            index={index}
            isPlaying={isCurrentTrack(track) && isPlaying}
            isCurrent={isCurrentTrack(track)}
            isLiked={isTrackLiked(track)}
            onPlay={() => handleTrackPlay(track)}
            onLike={() => toggleLike(track)}
            onAddToQueue={() => addToQueue(track)}
          />
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">暂无歌曲</p>
        </div>
      )}
    </Card>
  )
}

interface TrackItemProps {
  track: Track
  index: number
  isPlaying: boolean
  isCurrent: boolean
  isLiked: boolean
  onPlay: () => void
  onLike: () => void
  onAddToQueue: () => void
}

function TrackItem({
  track,
  index,
  isPlaying,
  isCurrent,
  isLiked,
  onPlay,
  onLike,
  onAddToQueue,
}: TrackItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "grid grid-cols-12 gap-4 px-4 py-3 rounded-lg group hover:bg-white/5 transition-all cursor-pointer",
        isCurrent && "bg-primary/10 border border-primary/20"
      )}
      onClick={onPlay}
    >
      {/* 序号/播放按钮 */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="relative">
          <span className={cn(
            "text-sm group-hover:opacity-0 transition-opacity",
            isCurrent ? "text-primary" : "text-muted-foreground"
          )}>
            {index + 1}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {/* 歌曲信息 */}
      <div className="col-span-6 flex items-center space-x-3 min-w-0">
        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center flex-shrink-0">
          {track.coverUrl ? (
            <img 
              src={track.coverUrl} 
              alt={track.album}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <Music className="w-4 h-4 text-primary" />
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-medium truncate",
            isCurrent ? "text-primary" : "text-white"
          )}>
            {track.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {track.artist}
          </p>
        </div>
      </div>

      {/* 专辑 */}
      <div className="col-span-3 flex items-center">
        <p className="text-sm text-muted-foreground truncate">
          {track.album}
        </p>
      </div>

      {/* 时长 */}
      <div className="col-span-1 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          {formatTime(track.duration || 0)}
        </span>
      </div>

      {/* 操作按钮 */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e.stopPropagation()
              onLike()
            }}
          >
            <Heart className={cn(
              "w-3 h-3",
              isLiked ? "text-red-500 fill-current" : "text-muted-foreground"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e.stopPropagation()
              // 这里可以添加更多操作菜单
            }}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Heart, 
  Clock, 
  Music,
  PlayCircle,
  Shuffle,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MusicPlayer } from '@/components/features/MusicPlayer/MusicPlayer'
import { TrackList } from '@/components/features/MusicPlayer/TrackList'
import { useMusicStore } from '@/stores/useMusicStore'
import type { Track } from '@/types/music'

// 模拟数据
const mockTracks: Track[] = [
  {
    id: '1',
    title: '夜曲',
    artist: '周杰伦',
    album: '十一月的萧邦',
    duration: 237,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/track1.mp3',
    genre: '流行',
    releaseYear: 2005,
    playCount: 1250000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    duration: 223,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: '/audio/track2.mp3',
    genre: '流行',
    releaseYear: 2008,
    playCount: 980000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: '青花瓷',
    artist: '周杰伦',
    album: '我很忙',
    duration: 228,
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: '/audio/track3.mp3',
    genre: '中国风',
    releaseYear: 2007,
    playCount: 1500000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: '告白气球',
    artist: '周杰伦',
    album: '周杰伦的床边故事',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: '/audio/track4.mp3',
    genre: '流行',
    releaseYear: 2016,
    playCount: 2100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: '等你下课',
    artist: '周杰伦',
    album: '不能说的秘密',
    duration: 267,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: '/audio/track5.mp3',
    genre: '流行',
    releaseYear: 2018,
    playCount: 1800000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const trendingTracks = mockTracks.slice(0, 3)
const recentTracks = mockTracks.slice(2, 5)

export default function MusicPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { 
    currentTrack, 
    likedTracks, 
    recentlyPlayed,
    play,
    addToQueue,
    createPlaylist 
  } = useMusicStore()

  const handlePlayAll = (tracks: Track[]) => {
    if (tracks.length > 0) {
      play(tracks[0])
      tracks.slice(1).forEach(track => addToQueue(track))
    }
  }

  const handleShufflePlay = (tracks: Track[]) => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5)
    handlePlayAll(shuffled)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">🎵 音乐</h1>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#discover" className="text-sm hover:text-primary transition-colors">发现</a>
              <a href="#library" className="text-sm hover:text-primary transition-colors">音乐库</a>
              <a href="#playlists" className="text-sm hover:text-primary transition-colors">播放列表</a>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索歌曲、艺人、专辑..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          <Button variant="neon" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新建播放列表
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 快速操作 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">快速开始</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 cursor-pointer hover:bg-white/5 transition-colors" variant="glass">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">我喜欢</p>
                      <p className="text-xs text-muted-foreground">{likedTracks.length} 首</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:bg-white/5 transition-colors" variant="glass">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">最近播放</p>
                      <p className="text-xs text-muted-foreground">{recentlyPlayed.length} 首</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:bg-white/5 transition-colors" variant="glass">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">热门歌曲</p>
                      <p className="text-xs text-muted-foreground">精选推荐</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 cursor-pointer hover:bg-white/5 transition-colors" variant="glass">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">发现音乐</p>
                      <p className="text-xs text-muted-foreground">为你推荐</p>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* 热门歌曲 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  热门歌曲
                </h2>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePlayAll(trendingTracks)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    播放全部
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShufflePlay(trendingTracks)}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    随机播放
                  </Button>
                </div>
              </div>
              
              <TrackList tracks={trendingTracks} showHeader={false} />
            </section>

            {/* 最近播放 */}
            {recentlyPlayed.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    最近播放
                  </h2>
                </div>
                
                <TrackList tracks={recentlyPlayed} showHeader={false} />
              </section>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 当前播放 */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">正在播放</h3>
              <MusicPlayer />
            </section>

            {/* 推荐歌曲 */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4">为你推荐</h3>
              <div className="space-y-3">
                {mockTracks.slice(0, 3).map((track) => (
                  <Card 
                    key={track.id}
                    className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    variant="glass"
                    onClick={() => play(track)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                        {track.coverUrl ? (
                          <img 
                            src={track.coverUrl} 
                            alt={track.album}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Music className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* 统计信息 */}
            <Card variant="glass" className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">音乐统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">收藏歌曲</span>
                  <span className="text-white font-medium">{likedTracks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">播放历史</span>
                  <span className="text-white font-medium">{recentlyPlayed.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">当前播放</span>
                  <span className="text-white font-medium">{currentTrack ? '1' : '0'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

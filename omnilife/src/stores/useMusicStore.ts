import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track, Playlist, PlayerState, PlayerEvent } from '@/types/music'

interface MusicStore extends PlayerState {
  // 播放列表管理
  playlists: Playlist[]
  currentPlaylist: Playlist | null
  
  // 用户收藏
  likedTracks: Track[]
  recentlyPlayed: Track[]
  
  // 播放器控制
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  stop: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  setPlayMode: (mode: PlayerState['playMode']) => void
  
  // 队列管理
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  shuffleQueue: () => void
  
  // 播放列表管理
  createPlaylist: (name: string, description?: string) => void
  addToPlaylist: (playlistId: string, track: Track) => void
  removeFromPlaylist: (playlistId: string, trackId: string) => void
  deletePlaylist: (playlistId: string) => void
  
  // 收藏管理
  toggleLike: (track: Track) => void
  addToRecentlyPlayed: (track: Track) => void
  
  // 播放器状态更新
  updatePlayerState: (updates: Partial<PlayerState>) => void
  handlePlayerEvent: (event: PlayerEvent) => void
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentTrack: null,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      volume: 0.8,
      currentTime: 0,
      duration: 0,
      playMode: 'single',
      queue: [],
      currentIndex: 0,
      playlists: [],
      currentPlaylist: null,
      likedTracks: [],
      recentlyPlayed: [],

      // 播放器控制
      play: (track: Track) => {
        const state = get()
        
        // 添加到最近播放
        get().addToRecentlyPlayed(track)
        
        set({
          currentTrack: track,
          isPlaying: true,
          isPaused: false,
          isLoading: true,
          currentTime: 0,
          duration: track.duration || 0,
        })
      },

      pause: () => {
        set({ isPlaying: false, isPaused: true })
      },

      resume: () => {
        set({ isPlaying: true, isPaused: false })
      },

      stop: () => {
        set({
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
        })
      },

      next: () => {
        const { queue, currentIndex, playMode } = get()
        
        if (queue.length === 0) return
        
        let nextIndex = currentIndex + 1
        
        if (playMode === 'repeat' && nextIndex >= queue.length) {
          nextIndex = 0
        } else if (playMode === 'shuffle') {
          nextIndex = Math.floor(Math.random() * queue.length)
        }
        
        if (nextIndex < queue.length) {
          const nextTrack = queue[nextIndex]
          set({ currentIndex: nextIndex })
          get().play(nextTrack)
        }
      },

      previous: () => {
        const { queue, currentIndex } = get()
        
        if (queue.length === 0) return
        
        const prevIndex = currentIndex - 1
        
        if (prevIndex >= 0) {
          const prevTrack = queue[prevIndex]
          set({ currentIndex: prevIndex })
          get().play(prevTrack)
        }
      },

      seek: (time: number) => {
        set({ currentTime: time })
      },

      setVolume: (volume: number) => {
        set({ volume: Math.max(0, Math.min(1, volume)) })
      },

      setPlayMode: (mode: PlayerState['playMode']) => {
        set({ playMode: mode })
      },

      // 队列管理
      addToQueue: (track: Track) => {
        const { queue } = get()
        const newQueue = [...queue, track]
        set({ queue: newQueue })
      },

      removeFromQueue: (trackId: string) => {
        const { queue, currentIndex } = get()
        const newQueue = queue.filter(track => track.id !== trackId)
        const removedIndex = queue.findIndex(track => track.id === trackId)
        
        let newCurrentIndex = currentIndex
        if (removedIndex <= currentIndex && currentIndex > 0) {
          newCurrentIndex = currentIndex - 1
        }
        
        set({ queue: newQueue, currentIndex: newCurrentIndex })
      },

      clearQueue: () => {
        set({ queue: [], currentIndex: 0 })
      },

      shuffleQueue: () => {
        const { queue } = get()
        const shuffled = [...queue].sort(() => Math.random() - 0.5)
        set({ queue: shuffled, currentIndex: 0 })
      },

      // 播放列表管理
      createPlaylist: (name: string, description?: string) => {
        const { playlists } = get()
        const newPlaylist: Playlist = {
          id: `playlist_${Date.now()}`,
          name,
          description,
          tracks: [],
          isPublic: false,
          createdBy: 'current_user', // 实际应用中从用户状态获取
          createdAt: new Date(),
          updatedAt: new Date(),
          totalDuration: 0,
          trackCount: 0,
        }
        
        set({ playlists: [...playlists, newPlaylist] })
      },

      addToPlaylist: (playlistId: string, track: Track) => {
        const { playlists } = get()
        const updatedPlaylists = playlists.map(playlist => {
          if (playlist.id === playlistId) {
            const updatedTracks = [...playlist.tracks, track]
            return {
              ...playlist,
              tracks: updatedTracks,
              trackCount: updatedTracks.length,
              totalDuration: updatedTracks.reduce((sum, t) => sum + (t.duration || 0), 0),
              updatedAt: new Date(),
            }
          }
          return playlist
        })
        
        set({ playlists: updatedPlaylists })
      },

      removeFromPlaylist: (playlistId: string, trackId: string) => {
        const { playlists } = get()
        const updatedPlaylists = playlists.map(playlist => {
          if (playlist.id === playlistId) {
            const updatedTracks = playlist.tracks.filter(track => track.id !== trackId)
            return {
              ...playlist,
              tracks: updatedTracks,
              trackCount: updatedTracks.length,
              totalDuration: updatedTracks.reduce((sum, t) => sum + (t.duration || 0), 0),
              updatedAt: new Date(),
            }
          }
          return playlist
        })
        
        set({ playlists: updatedPlaylists })
      },

      deletePlaylist: (playlistId: string) => {
        const { playlists } = get()
        const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId)
        set({ playlists: updatedPlaylists })
      },

      // 收藏管理
      toggleLike: (track: Track) => {
        const { likedTracks } = get()
        const isLiked = likedTracks.some(t => t.id === track.id)
        
        if (isLiked) {
          const updatedLikedTracks = likedTracks.filter(t => t.id !== track.id)
          set({ likedTracks: updatedLikedTracks })
        } else {
          set({ likedTracks: [...likedTracks, { ...track, isLiked: true }] })
        }
      },

      addToRecentlyPlayed: (track: Track) => {
        const { recentlyPlayed } = get()
        const filtered = recentlyPlayed.filter(t => t.id !== track.id)
        const updated = [track, ...filtered].slice(0, 50) // 保留最近50首
        set({ recentlyPlayed: updated })
      },

      // 播放器状态更新
      updatePlayerState: (updates: Partial<PlayerState>) => {
        set(updates)
      },

      handlePlayerEvent: (event: PlayerEvent) => {
        const actions = get()
        
        switch (event.type) {
          case 'PLAY':
            actions.play(event.track)
            break
          case 'PAUSE':
            actions.pause()
            break
          case 'RESUME':
            actions.resume()
            break
          case 'STOP':
            actions.stop()
            break
          case 'NEXT':
            actions.next()
            break
          case 'PREVIOUS':
            actions.previous()
            break
          case 'SEEK':
            actions.seek(event.time)
            break
          case 'VOLUME_CHANGE':
            actions.setVolume(event.volume)
            break
          case 'MODE_CHANGE':
            actions.setPlayMode(event.mode)
            break
          case 'QUEUE_UPDATE':
            set({ queue: event.queue })
            break
        }
      },
    }),
    {
      name: 'music-store',
      partialize: (state) => ({
        volume: state.volume,
        playMode: state.playMode,
        playlists: state.playlists,
        likedTracks: state.likedTracks,
        recentlyPlayed: state.recentlyPlayed,
      }),
    }
  )
)

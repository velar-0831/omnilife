// 音乐相关类型定义

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number // 秒
  coverUrl?: string
  audioUrl: string
  genre?: string
  releaseYear?: number
  playCount?: number
  isLiked?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Playlist {
  id: string
  name: string
  description?: string
  coverUrl?: string
  tracks: Track[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  totalDuration: number
  trackCount: number
}

export interface Artist {
  id: string
  name: string
  bio?: string
  avatarUrl?: string
  genres: string[]
  followerCount: number
  trackCount: number
  albumCount: number
}

export interface Album {
  id: string
  title: string
  artist: Artist
  coverUrl?: string
  releaseDate: Date
  tracks: Track[]
  genre: string
  totalDuration: number
}

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  volume: number // 0-1
  currentTime: number // 秒
  duration: number // 秒
  playMode: 'single' | 'repeat' | 'shuffle'
  queue: Track[]
  currentIndex: number
}

export interface MusicRecommendation {
  id: string
  type: 'track' | 'playlist' | 'artist' | 'album'
  item: Track | Playlist | Artist | Album
  reason: string
  confidence: number // 0-1
  category: 'mood' | 'genre' | 'similar' | 'trending' | 'personal'
}

export interface UserMusicPreferences {
  favoriteGenres: string[]
  favoriteArtists: string[]
  listeningHistory: {
    trackId: string
    playedAt: Date
    duration: number
  }[]
  mood: 'happy' | 'sad' | 'energetic' | 'calm' | 'focused' | 'party'
  preferredLanguages: string[]
}

export interface SearchResult {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
  total: number
  query: string
}

// 播放器事件类型
export type PlayerEvent = 
  | { type: 'PLAY'; track: Track }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SEEK'; time: number }
  | { type: 'VOLUME_CHANGE'; volume: number }
  | { type: 'MODE_CHANGE'; mode: PlayerState['playMode'] }
  | { type: 'QUEUE_UPDATE'; queue: Track[] }

// API响应类型
export interface MusicApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 主题类型定义
export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan'

// 主题配置
export interface ThemeConfig {
  mode: ThemeMode
  colorScheme: ColorScheme
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animations: boolean
  reducedMotion: boolean
  highContrast: boolean
  compactMode: boolean
}

// 颜色方案配置
export const COLOR_SCHEMES = {
  blue: {
    name: '蓝色',
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#06b6d4',
    gradient: 'from-blue-500 to-cyan-500'
  },
  purple: {
    name: '紫色',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a855f7',
    gradient: 'from-purple-500 to-pink-500'
  },
  green: {
    name: '绿色',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    gradient: 'from-green-500 to-emerald-500'
  },
  orange: {
    name: '橙色',
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24',
    gradient: 'from-orange-500 to-red-500'
  },
  pink: {
    name: '粉色',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f472b6',
    gradient: 'from-pink-500 to-rose-500'
  },
  cyan: {
    name: '青色',
    primary: '#06b6d4',
    secondary: '#0891b2',
    accent: '#22d3ee',
    gradient: 'from-cyan-500 to-blue-500'
  }
} as const

// 字体大小配置
export const FONT_SIZES = {
  sm: {
    name: '小',
    scale: '0.875',
    baseSize: '14px'
  },
  md: {
    name: '中',
    scale: '1',
    baseSize: '16px'
  },
  lg: {
    name: '大',
    scale: '1.125',
    baseSize: '18px'
  },
  xl: {
    name: '特大',
    scale: '1.25',
    baseSize: '20px'
  }
} as const

// 圆角配置
export const BORDER_RADIUS = {
  none: { name: '无', value: '0' },
  sm: { name: '小', value: '0.25rem' },
  md: { name: '中', value: '0.5rem' },
  lg: { name: '大', value: '0.75rem' },
  xl: { name: '特大', value: '1rem' }
} as const

// 默认主题配置
const defaultTheme: ThemeConfig = {
  mode: 'dark',
  colorScheme: 'blue',
  fontSize: 'md',
  borderRadius: 'md',
  animations: true,
  reducedMotion: false,
  highContrast: false,
  compactMode: false
}

// 主题状态管理
interface ThemeState extends ThemeConfig {
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  setColorScheme: (scheme: ColorScheme) => void
  setFontSize: (size: ThemeConfig['fontSize']) => void
  setBorderRadius: (radius: ThemeConfig['borderRadius']) => void
  setAnimations: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setHighContrast: (enabled: boolean) => void
  setCompactMode: (enabled: boolean) => void
  resetTheme: () => void
  applyTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...defaultTheme,
      isDark: true,

      setMode: (mode: ThemeMode) => {
        set({ mode })
        get().applyTheme()
      },

      setColorScheme: (colorScheme: ColorScheme) => {
        set({ colorScheme })
        get().applyTheme()
      },

      setFontSize: (fontSize: ThemeConfig['fontSize']) => {
        set({ fontSize })
        get().applyTheme()
      },

      setBorderRadius: (borderRadius: ThemeConfig['borderRadius']) => {
        set({ borderRadius })
        get().applyTheme()
      },

      setAnimations: (animations: boolean) => {
        set({ animations })
        get().applyTheme()
      },

      setReducedMotion: (reducedMotion: boolean) => {
        set({ reducedMotion })
        get().applyTheme()
      },

      setHighContrast: (highContrast: boolean) => {
        set({ highContrast })
        get().applyTheme()
      },

      setCompactMode: (compactMode: boolean) => {
        set({ compactMode })
        get().applyTheme()
      },

      resetTheme: () => {
        set(defaultTheme)
        get().applyTheme()
      },

      applyTheme: () => {
        const state = get()
        const root = document.documentElement

        // 应用主题模式
        const isDark = state.mode === 'dark' || 
          (state.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        
        set({ isDark })
        root.classList.toggle('dark', isDark)

        // 应用颜色方案
        const colorScheme = COLOR_SCHEMES[state.colorScheme]
        root.style.setProperty('--color-primary', colorScheme.primary)
        root.style.setProperty('--color-secondary', colorScheme.secondary)
        root.style.setProperty('--color-accent', colorScheme.accent)

        // 应用字体大小
        const fontSize = FONT_SIZES[state.fontSize]
        root.style.setProperty('--font-size-base', fontSize.baseSize)
        root.style.setProperty('--font-scale', fontSize.scale)

        // 应用圆角
        const borderRadius = BORDER_RADIUS[state.borderRadius]
        root.style.setProperty('--border-radius', borderRadius.value)

        // 应用动画设置
        if (!state.animations || state.reducedMotion) {
          root.style.setProperty('--animation-duration', '0s')
          root.style.setProperty('--transition-duration', '0s')
        } else {
          root.style.setProperty('--animation-duration', '0.3s')
          root.style.setProperty('--transition-duration', '0.2s')
        }

        // 应用高对比度
        root.classList.toggle('high-contrast', state.highContrast)

        // 应用紧凑模式
        root.classList.toggle('compact-mode', state.compactMode)

        // 应用减少动画
        if (state.reducedMotion) {
          root.style.setProperty('--motion-reduce', 'reduce')
        } else {
          root.style.removeProperty('--motion-reduce')
        }
      }
    }),
    {
      name: 'omnilife-theme',
      onRehydrateStorage: () => (state) => {
        // 主题恢复后立即应用
        if (state) {
          setTimeout(() => state.applyTheme(), 0)
        }
      }
    }
  )
)

// 主题钩子
export function useTheme() {
  const store = useThemeStore()
  
  React.useEffect(() => {
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (store.mode === 'system') {
        store.applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [store.mode, store.applyTheme])

  React.useEffect(() => {
    // 监听系统减少动画偏好
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      store.setReducedMotion(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [store.setReducedMotion])

  React.useEffect(() => {
    // 初始应用主题
    store.applyTheme()
  }, [])

  return {
    ...store,
    colorSchemes: COLOR_SCHEMES,
    fontSizes: FONT_SIZES,
    borderRadiuses: BORDER_RADIUS
  }
}

// 主题切换快捷键
export function useThemeShortcuts() {
  const { setMode, mode } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + T 切换主题
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        const modes: ThemeMode[] = ['light', 'dark', 'system']
        const currentIndex = modes.indexOf(mode)
        const nextIndex = (currentIndex + 1) % modes.length
        setMode(modes[nextIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mode, setMode])
}

// 获取当前主题的CSS变量
export function getThemeVariables() {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  
  return {
    primary: computedStyle.getPropertyValue('--color-primary'),
    secondary: computedStyle.getPropertyValue('--color-secondary'),
    accent: computedStyle.getPropertyValue('--color-accent'),
    fontSize: computedStyle.getPropertyValue('--font-size-base'),
    borderRadius: computedStyle.getPropertyValue('--border-radius')
  }
}

// 主题预设
export const THEME_PRESETS = {
  default: {
    name: '默认',
    config: defaultTheme
  },
  minimal: {
    name: '简约',
    config: {
      ...defaultTheme,
      borderRadius: 'sm',
      compactMode: true,
      colorScheme: 'blue' as ColorScheme
    }
  },
  vibrant: {
    name: '活力',
    config: {
      ...defaultTheme,
      colorScheme: 'purple' as ColorScheme,
      borderRadius: 'lg',
      animations: true
    }
  },
  accessible: {
    name: '无障碍',
    config: {
      ...defaultTheme,
      highContrast: true,
      fontSize: 'lg',
      reducedMotion: true,
      borderRadius: 'md'
    }
  },
  compact: {
    name: '紧凑',
    config: {
      ...defaultTheme,
      compactMode: true,
      fontSize: 'sm',
      borderRadius: 'sm'
    }
  }
} as const

export type ThemePreset = keyof typeof THEME_PRESETS

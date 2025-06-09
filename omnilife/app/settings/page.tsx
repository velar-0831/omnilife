'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  CreditCard,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Lock,
  Key,
  Fingerprint,
  Save,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { GlobalLayout } from '@/components/layout/GlobalLayout'
import { cn } from '@/lib/utils'

interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'input' | 'button'
  value?: any
  options?: Array<{ label: string; value: any }>
  icon?: React.ComponentType<any>
  color?: string
  danger?: boolean
}

const settingsCategories = [
  {
    id: 'account',
    name: '账户设置',
    icon: User,
    color: 'text-blue-400',
    settings: [
      {
        id: 'profile_visibility',
        label: '个人资料可见性',
        description: '控制其他用户是否可以查看您的个人资料',
        type: 'select',
        value: 'public',
        options: [
          { label: '公开', value: 'public' },
          { label: '仅好友', value: 'friends' },
          { label: '私密', value: 'private' }
        ]
      },
      {
        id: 'activity_tracking',
        label: '活动追踪',
        description: '允许系统记录您的使用行为以提供个性化服务',
        type: 'toggle',
        value: true
      },
      {
        id: 'data_sharing',
        label: '数据共享',
        description: '与合作伙伴共享匿名使用数据以改善服务',
        type: 'toggle',
        value: false
      }
    ]
  },
  {
    id: 'notifications',
    name: '通知设置',
    icon: Bell,
    color: 'text-yellow-400',
    settings: [
      {
        id: 'push_notifications',
        label: '推送通知',
        description: '接收应用推送通知',
        type: 'toggle',
        value: true,
        icon: Smartphone
      },
      {
        id: 'email_notifications',
        label: '邮件通知',
        description: '接收重要更新的邮件通知',
        type: 'toggle',
        value: true,
        icon: Mail
      },
      {
        id: 'sms_notifications',
        label: '短信通知',
        description: '接收紧急情况的短信通知',
        type: 'toggle',
        value: false,
        icon: MessageSquare
      },
      {
        id: 'sound_enabled',
        label: '声音提醒',
        description: '播放通知声音',
        type: 'toggle',
        value: true,
        icon: Volume2
      },
      {
        id: 'notification_frequency',
        label: '通知频率',
        description: '设置接收通知的频率',
        type: 'select',
        value: 'normal',
        options: [
          { label: '实时', value: 'realtime' },
          { label: '正常', value: 'normal' },
          { label: '每小时汇总', value: 'hourly' },
          { label: '每日汇总', value: 'daily' }
        ]
      }
    ]
  },
  {
    id: 'security',
    name: '安全设置',
    icon: Shield,
    color: 'text-green-400',
    settings: [
      {
        id: 'two_factor_auth',
        label: '双重认证',
        description: '启用双重认证以增强账户安全',
        type: 'toggle',
        value: false,
        icon: Key
      },
      {
        id: 'biometric_auth',
        label: '生物识别',
        description: '使用指纹或面部识别登录',
        type: 'toggle',
        value: true,
        icon: Fingerprint
      },
      {
        id: 'session_timeout',
        label: '会话超时',
        description: '设置自动登出时间',
        type: 'select',
        value: '30',
        options: [
          { label: '15分钟', value: '15' },
          { label: '30分钟', value: '30' },
          { label: '1小时', value: '60' },
          { label: '永不', value: 'never' }
        ]
      },
      {
        id: 'change_password',
        label: '修改密码',
        description: '更改您的登录密码',
        type: 'button',
        icon: Lock
      }
    ]
  },
  {
    id: 'appearance',
    name: '外观设置',
    icon: Palette,
    color: 'text-purple-400',
    settings: [
      {
        id: 'theme',
        label: '主题模式',
        description: '选择应用的外观主题',
        type: 'select',
        value: 'dark',
        options: [
          { label: '深色模式', value: 'dark' },
          { label: '浅色模式', value: 'light' },
          { label: '跟随系统', value: 'system' }
        ],
        icon: Moon
      },
      {
        id: 'language',
        label: '语言设置',
        description: '选择应用显示语言',
        type: 'select',
        value: 'zh-CN',
        options: [
          { label: '简体中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
          { label: '繁體中文', value: 'zh-TW' },
          { label: '日本語', value: 'ja-JP' }
        ],
        icon: Globe
      },
      {
        id: 'animations',
        label: '动画效果',
        description: '启用界面动画效果',
        type: 'toggle',
        value: true
      },
      {
        id: 'compact_mode',
        label: '紧凑模式',
        description: '使用更紧凑的界面布局',
        type: 'toggle',
        value: false
      }
    ]
  },
  {
    id: 'data',
    name: '数据管理',
    icon: Database,
    color: 'text-indigo-400',
    settings: [
      {
        id: 'export_data',
        label: '导出数据',
        description: '下载您的所有数据副本',
        type: 'button',
        icon: Download
      },
      {
        id: 'clear_cache',
        label: '清除缓存',
        description: '清除应用缓存数据',
        type: 'button',
        icon: RefreshCw
      },
      {
        id: 'delete_account',
        label: '删除账户',
        description: '永久删除您的账户和所有数据',
        type: 'button',
        icon: Trash2,
        danger: true
      }
    ]
  }
]

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('account')
  const [settings, setSettings] = useState<Record<string, any>>({
    profile_visibility: 'public',
    activity_tracking: true,
    data_sharing: false,
    push_notifications: true,
    email_notifications: true,
    sms_notifications: false,
    sound_enabled: true,
    notification_frequency: 'normal',
    two_factor_auth: false,
    biometric_auth: true,
    session_timeout: '30',
    theme: 'dark',
    language: 'zh-CN',
    animations: true,
    compact_mode: false,
  })
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (settingId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // 保存设置到后端
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    // 重置为默认设置
    setHasChanges(false)
  }

  const renderSettingControl = (setting: SettingItem) => {
    const value = settings[setting.id] ?? setting.value

    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSettingChange(setting.id, !value)}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors",
                value ? "bg-primary" : "bg-secondary"
              )}
            >
              <div className={cn(
                "absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform",
                value ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
            {setting.icon && (
              <setting.icon className={cn("w-4 h-4", value ? "text-primary" : "text-muted-foreground")} />
            )}
          </div>
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="px-3 py-2 bg-secondary border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'button':
        return (
          <Button
            variant={setting.danger ? "destructive" : "ghost"}
            size="sm"
            onClick={() => console.log(`Action: ${setting.id}`)}
          >
            {setting.icon && <setting.icon className="w-4 h-4 mr-2" />}
            {setting.danger ? '执行' : '设置'}
          </Button>
        )

      default:
        return null
    }
  }

  const activeSettings = settingsCategories.find(cat => cat.id === activeCategory)

  return (
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        {/* 页面头部 */}
        <div className="border-b border-white/10 bg-background/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">⚙️ 设置</h1>
                <p className="text-muted-foreground mt-2">管理您的账户设置和偏好</p>
              </div>
              
              {hasChanges && (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={handleReset}>
                    取消
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    保存更改
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 设置分类 */}
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>设置分类</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {settingsCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                        activeCategory === category.id
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      )}
                    >
                      <category.icon className={cn("w-5 h-5", 
                        activeCategory === category.id ? "text-primary" : category.color
                      )} />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 设置内容 */}
            <div className="lg:col-span-3">
              {activeSettings && (
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <activeSettings.icon className={cn("w-5 h-5", activeSettings.color)} />
                      <span>{activeSettings.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {activeSettings.settings.map((setting, index) => (
                      <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border",
                          setting.danger 
                            ? "border-red-500/20 bg-red-500/5" 
                            : "border-white/10 bg-secondary/30"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={cn(
                              "font-medium",
                              setting.danger ? "text-red-400" : "text-white"
                            )}>
                              {setting.label}
                            </h3>
                            {setting.danger && (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        
                        <div className="ml-4">
                          {renderSettingControl(setting)}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  )
}

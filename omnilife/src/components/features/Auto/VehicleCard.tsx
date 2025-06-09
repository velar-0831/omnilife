'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, 
  Fuel, 
  Calendar, 
  AlertTriangle,
  Settings,
  MoreVertical,
  Battery,
  Gauge,
  MapPin,
  Clock,
  DollarSign,
  Wrench,
  Shield,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAutoStore } from '@/stores/useAutoStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { Vehicle } from '@/types/auto'

interface VehicleCardProps {
  vehicle: Vehicle
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  className?: string
  onClick?: () => void
}

export function VehicleCard({ 
  vehicle, 
  variant = 'default',
  showActions = true,
  className,
  onClick
}: VehicleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const {
    currentVehicle,
    setCurrentVehicle,
    getUnreadAlerts,
    getUpcomingAppointments,
    getVehicleAnalytics
  } = useAutoStore()

  const isCurrentVehicle = currentVehicle?.id === vehicle.id
  const unreadAlerts = getUnreadAlerts(vehicle.id)
  const upcomingAppointments = getUpcomingAppointments(vehicle.id)
  const analytics = getVehicleAnalytics(vehicle.id, 'month')
  
  const mainImage = vehicle.images.find(img => img.type === 'exterior') || vehicle.images[0]
  const hasAlerts = unreadAlerts.length > 0
  const hasUpcomingService = upcomingAppointments.length > 0

  const getEngineIcon = (engineType: Vehicle['engineType']) => {
    switch (engineType) {
      case 'electric':
        return <Battery className="w-4 h-4" />
      case 'hybrid':
        return <Zap className="w-4 h-4" />
      default:
        return <Fuel className="w-4 h-4" />
    }
  }

  const getEngineLabel = (engineType: Vehicle['engineType']) => {
    switch (engineType) {
      case 'electric':
        return '纯电动'
      case 'hybrid':
        return '混合动力'
      case 'diesel':
        return '柴油'
      default:
        return '汽油'
    }
  }

  const handleSetCurrent = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentVehicle(vehicle.id)
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card 
          className={cn(
            "cursor-pointer hover:bg-white/5 transition-all duration-300",
            isCurrentVehicle && "border-primary/50 bg-primary/5"
          )}
          variant="glass"
          onClick={onClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {mainImage ? (
                  <img 
                    src={mainImage.url} 
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {vehicle.year} • {vehicle.color} • {vehicle.licensePlate}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {getEngineIcon(vehicle.engineType)}
                  <span>{getEngineLabel(vehicle.engineType)}</span>
                  <span>•</span>
                  <Gauge className="w-3 h-3" />
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </div>
              </div>
              
              {(hasAlerts || hasUpcomingService) && (
                <div className="flex flex-col space-y-1">
                  {hasAlerts && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                  {hasUpcomingService && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card 
        className={cn(
          "cursor-pointer group transition-all duration-300",
          isCurrentVehicle && "border-primary/50 bg-primary/5",
          variant === 'detailed' && "hover:scale-[1.02]"
        )}
        variant="glass"
        onClick={onClick}
      >
        {/* 车辆图片 */}
        <div className="relative h-48 overflow-hidden">
          {mainImage ? (
            <img 
              src={mainImage.url} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
              <Car className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          
          {/* 状态指示器 */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {isCurrentVehicle && (
              <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                当前车辆
              </span>
            )}
            {!vehicle.isActive && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded">
                已停用
              </span>
            )}
          </div>
          
          {/* 警告指示器 */}
          {(hasAlerts || hasUpcomingService) && (
            <div className="absolute top-3 right-3 flex space-x-1">
              {hasAlerts && (
                <div className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              )}
              {hasUpcomingService && (
                <div className="w-8 h-8 bg-yellow-500/80 rounded-full flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          )}
          
          {/* 操作按钮 */}
          {showActions && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* 基本信息 */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{vehicle.year}</span>
              <span>•</span>
              <span>{vehicle.color}</span>
              <span>•</span>
              <span>{vehicle.licensePlate}</span>
            </div>
          </div>

          {/* 关键指标 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">里程</p>
                <p className="font-semibold text-white">{vehicle.mileage.toLocaleString()} km</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getEngineIcon(vehicle.engineType)}
              <div>
                <p className="text-sm text-muted-foreground">动力类型</p>
                <p className="font-semibold text-white">{getEngineLabel(vehicle.engineType)}</p>
              </div>
            </div>
            
            {analytics && (
              <>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">月支出</p>
                    <p className="font-semibold text-white">{formatCurrency(analytics.totalExpenses)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.engineType === 'electric' ? '电耗' : '油耗'}
                    </p>
                    <p className="font-semibold text-white">
                      {analytics.fuelEfficiency.toFixed(1)} 
                      {vehicle.engineType === 'electric' ? ' kWh/100km' : ' L/100km'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 保险信息 */}
          <div className="flex items-center justify-between mb-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">保险</p>
                <p className="text-xs text-muted-foreground">{vehicle.insurance.provider}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {formatRelativeTime(vehicle.insurance.endDate)}到期
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(vehicle.insurance.premium)}/年
              </p>
            </div>
          </div>

          {/* 提醒和预约 */}
          {(hasAlerts || hasUpcomingService) && (
            <div className="space-y-2 mb-4">
              {hasAlerts && (
                <div className="flex items-center space-x-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">
                    {unreadAlerts.length} 个未读提醒
                  </span>
                </div>
              )}
              
              {hasUpcomingService && (
                <div className="flex items-center space-x-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">
                    {upcomingAppointments.length} 个即将到来的预约
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          {showActions && (
            <div className="flex space-x-2">
              {!isCurrentVehicle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSetCurrent}
                  className="flex-1"
                >
                  设为当前车辆
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  // 打开车辆详情
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                管理
              </Button>
            </div>
          )}

          {/* 详细信息（展开状态） */}
          {isExpanded && variant === 'detailed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10 space-y-3"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">VIN</p>
                  <p className="text-white font-mono">{vehicle.vin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">购买日期</p>
                  <p className="text-white">{formatRelativeTime(vehicle.purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">购买价格</p>
                  <p className="text-white">{formatCurrency(vehicle.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">当前价值</p>
                  <p className="text-white">{formatCurrency(vehicle.currentValue)}</p>
                </div>
              </div>
              
              {vehicle.engineType !== 'electric' && vehicle.fuelCapacity && (
                <div>
                  <p className="text-muted-foreground text-sm">油箱容量</p>
                  <p className="text-white">{vehicle.fuelCapacity} L</p>
                </div>
              )}
              
              {vehicle.engineType === 'electric' && vehicle.batteryCapacity && (
                <div>
                  <p className="text-muted-foreground text-sm">电池容量</p>
                  <p className="text-white">{vehicle.batteryCapacity} kWh</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wrench, 
  Calendar, 
  MapPin, 
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  Camera,
  Clock,
  Gauge,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAutoStore } from '@/stores/useAutoStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { MaintenanceRecord as MaintenanceRecordType, MaintenanceType } from '@/types/auto'

interface MaintenanceRecordProps {
  record: MaintenanceRecordType
  variant?: 'default' | 'compact'
  showActions?: boolean
  className?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function MaintenanceRecord({ 
  record, 
  variant = 'default',
  showActions = true,
  className,
  onEdit,
  onDelete
}: MaintenanceRecordProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getMaintenanceTypeIcon = (type: MaintenanceType) => {
    switch (type) {
      case 'routine':
        return <Wrench className="w-4 h-4 text-green-400" />
      case 'repair':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'inspection':
        return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'emergency':
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      case 'recall':
        return <FileText className="w-4 h-4 text-purple-400" />
      case 'upgrade':
        return <Plus className="w-4 h-4 text-cyan-400" />
      default:
        return <Wrench className="w-4 h-4 text-gray-400" />
    }
  }

  const getMaintenanceTypeLabel = (type: MaintenanceType) => {
    switch (type) {
      case 'routine':
        return '常规保养'
      case 'repair':
        return '维修'
      case 'inspection':
        return '检查'
      case 'emergency':
        return '紧急维修'
      case 'recall':
        return '召回'
      case 'upgrade':
        return '升级改装'
      default:
        return '其他'
    }
  }

  const getMaintenanceTypeColor = (type: MaintenanceType) => {
    switch (type) {
      case 'routine':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'repair':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'inspection':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'emergency':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'recall':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
      case 'upgrade':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card variant="glass" className="p-4">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border",
              getMaintenanceTypeColor(record.type)
            )}>
              {getMaintenanceTypeIcon(record.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {getMaintenanceTypeLabel(record.type)}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(record.date)}</span>
                <span>•</span>
                <Gauge className="w-3 h-3" />
                <span>{record.mileage.toLocaleString()} km</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-white text-sm">
                {formatCurrency(record.cost)}
              </p>
              <p className="text-xs text-muted-foreground">
                {record.serviceProvider.name}
              </p>
            </div>
          </div>
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
      <Card variant="glass" className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center border",
                getMaintenanceTypeColor(record.type)
              )}>
                {getMaintenanceTypeIcon(record.type)}
              </div>
              
              <div>
                <CardTitle className="text-lg">
                  {getMaintenanceTypeLabel(record.type)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {record.description}
                </p>
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">日期</p>
                <p className="text-sm font-medium text-white">
                  {formatRelativeTime(record.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">里程</p>
                <p className="text-sm font-medium text-white">
                  {record.mileage.toLocaleString()} km
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">费用</p>
                <p className="text-sm font-medium text-white">
                  {formatCurrency(record.cost)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">服务商</p>
                <p className="text-sm font-medium text-white truncate">
                  {record.serviceProvider.name}
                </p>
              </div>
            </div>
          </div>

          {/* 评分 */}
          {record.rating && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">服务评分:</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < record.rating! ? "text-yellow-400 fill-current" : "text-gray-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-white">{record.rating}/5</span>
            </div>
          )}

          {/* 下次服务提醒 */}
          {(record.nextServiceDate || record.nextServiceMileage) && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">下次服务提醒</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {record.nextServiceDate && (
                  <p>日期: {formatRelativeTime(record.nextServiceDate)}</p>
                )}
                {record.nextServiceMileage && (
                  <p>里程: {record.nextServiceMileage.toLocaleString()} km</p>
                )}
              </div>
            </div>
          )}

          {/* 详细信息（展开状态） */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* 服务项目 */}
                {record.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-3">服务项目</h4>
                    <div className="space-y-2">
                      {record.items.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>数量: {item.quantity}</span>
                              {item.brand && (
                                <>
                                  <span>•</span>
                                  <span>品牌: {item.brand}</span>
                                </>
                              )}
                              {item.partNumber && (
                                <>
                                  <span>•</span>
                                  <span>零件号: {item.partNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">
                              {formatCurrency(item.totalPrice)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.unitPrice)}/个
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 保修信息 */}
                <div>
                  <h4 className="font-medium text-white mb-3">保修信息</h4>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">保修期</p>
                        <p className="text-white">{record.warranty.duration} 个月</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">保修里程</p>
                        <p className="text-white">{record.warranty.mileage.toLocaleString()} km</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-muted-foreground text-sm">保修说明</p>
                      <p className="text-white text-sm">{record.warranty.description}</p>
                    </div>
                  </div>
                </div>

                {/* 服务商信息 */}
                <div>
                  <h4 className="font-medium text-white mb-3">服务商信息</h4>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{record.serviceProvider.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.serviceProvider.address.street}, {record.serviceProvider.address.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          电话: {record.serviceProvider.phone}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-white">
                          {record.serviceProvider.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 用户评价 */}
                {record.review && (
                  <div>
                    <h4 className="font-medium text-white mb-3">我的评价</h4>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <p className="text-white text-sm">{record.review}</p>
                    </div>
                  </div>
                )}

                {/* 相关图片 */}
                {record.images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-3">相关图片</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {record.images.map((imageUrl, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-secondary">
                          <img 
                            src={imageUrl} 
                            alt={`维护记录图片 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MaintenanceListProps {
  records: MaintenanceRecordType[]
  variant?: 'default' | 'compact'
  showActions?: boolean
  className?: string
  emptyMessage?: string
  onEdit?: (record: MaintenanceRecordType) => void
  onDelete?: (recordId: string) => void
}

export function MaintenanceList({
  records,
  variant = 'default',
  showActions = true,
  className,
  emptyMessage = '暂无维护记录',
  onEdit,
  onDelete
}: MaintenanceListProps) {
  if (records.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {records.map((record, index) => (
        <MaintenanceRecord
          key={record.id}
          record={record}
          variant={variant}
          showActions={showActions}
          onEdit={() => onEdit?.(record)}
          onDelete={() => onDelete?.(record.id)}
        />
      ))}
    </div>
  )
}

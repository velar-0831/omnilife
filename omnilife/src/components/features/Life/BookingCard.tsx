'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useLifeStore } from '@/stores/useLifeStore'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { ServiceBooking, BookingStatus } from '@/types/life'

interface BookingCardProps {
  booking: ServiceBooking
  variant?: 'default' | 'compact'
  showActions?: boolean
  className?: string
  onEdit?: () => void
  onCancel?: () => void
  onViewDetails?: () => void
}

export function BookingCard({ 
  booking, 
  variant = 'default',
  showActions = true,
  className,
  onEdit,
  onCancel,
  onViewDetails
}: BookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const { updateBooking, cancelBooking } = useLifeStore()

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-orange-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return '待确认'
      case 'confirmed':
        return '已确认'
      case 'in_progress':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      case 'no_show':
        return '未到场'
      case 'disputed':
        return '有争议'
      default:
        return '未知状态'
    }
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'disputed':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'pending':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      const reason = '用户取消'
      cancelBooking(booking.id, reason)
    }
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'
  const canEdit = booking.status === 'pending'
  const isUpcoming = new Date(booking.scheduledDate) > new Date()

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
              getStatusColor(booking.status)
            )}>
              {getStatusIcon(booking.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">
                {booking.service.name}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(booking.scheduledDate)}</span>
                <span>•</span>
                <User className="w-3 h-3" />
                <span>{booking.provider.name}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-white text-sm">
                {formatCurrency(booking.pricing.total)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getStatusLabel(booking.status)}
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
                getStatusColor(booking.status)
              )}>
                {getStatusIcon(booking.status)}
              </div>
              
              <div>
                <CardTitle className="text-lg">{booking.service.name}</CardTitle>
                <div className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1",
                  getStatusColor(booking.status)
                )}>
                  {getStatusLabel(booking.status)}
                </div>
              </div>
            </div>
            
            {showActions && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-secondary border border-white/10 rounded-lg shadow-xl z-10"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowMenu(false)
                            onViewDetails?.()
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </button>
                        
                        {canEdit && (
                          <button
                            onClick={() => {
                              setShowMenu(false)
                              onEdit?.()
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            编辑预订
                          </button>
                        )}
                        
                        {canCancel && (
                          <button
                            onClick={() => {
                              setShowMenu(false)
                              handleCancel()
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-400/10 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            取消预订
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <p className="text-xs text-muted-foreground">预约时间</p>
                <p className="text-sm font-medium text-white">
                  {formatRelativeTime(booking.scheduledDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">服务时长</p>
                <p className="text-sm font-medium text-white">
                  {booking.duration} 分钟
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">服务费用</p>
                <p className="text-sm font-medium text-white">
                  {formatCurrency(booking.pricing.total)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">服务地址</p>
                <p className="text-sm font-medium text-white truncate">
                  {booking.location.type === 'customer_address' ? '上门服务' : '到店服务'}
                </p>
              </div>
            </div>
          </div>

          {/* 服务商信息 */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {booking.provider.avatar ? (
                  <img 
                    src={booking.provider.avatar} 
                    alt={booking.provider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
              
              <div>
                <p className="font-medium text-white">{booking.provider.name}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-muted-foreground">
                      {booking.provider.rating.toFixed(1)}
                    </span>
                  </div>
                  {booking.provider.isVerified && (
                    <Shield className="w-3 h-3 text-green-400" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4 mr-1" />
                电话
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                消息
              </Button>
            </div>
          </div>

          {/* 服务要求 */}
          {booking.requirements && (
            <div className="mb-4">
              <h4 className="font-medium text-white mb-2">服务要求</h4>
              <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                {booking.requirements}
              </p>
            </div>
          )}

          {/* 展开详情 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {booking.status === 'completed' && !booking.review && (
                <Button variant="ghost" size="sm">
                  <Star className="w-4 h-4 mr-1" />
                  评价服务
                </Button>
              )}
              
              {isUpcoming && canCancel && (
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <XCircle className="w-4 h-4 mr-1" />
                  取消预订
                </Button>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  详情
                </>
              )}
            </Button>
          </div>

          {/* 详细信息（展开状态） */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 space-y-4"
              >
                {/* 费用明细 */}
                <div>
                  <h4 className="font-medium text-white mb-3">费用明细</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">基础费用</span>
                      <span className="text-white">{formatCurrency(booking.pricing.basePrice)}</span>
                    </div>
                    
                    {booking.pricing.additionalFees.map((fee, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{fee.name}</span>
                        <span className="text-white">{formatCurrency(fee.amount)}</span>
                      </div>
                    ))}
                    
                    {booking.pricing.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between text-sm text-green-400">
                        <span>{discount.name}</span>
                        <span>-{formatCurrency(discount.amount)}</span>
                      </div>
                    ))}
                    
                    <div className="border-t border-white/10 pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-white">总计</span>
                        <span className="text-primary">{formatCurrency(booking.pricing.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 服务时间线 */}
                {booking.timeline.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-3">服务进度</h4>
                    <div className="space-y-3">
                      {booking.timeline.map((event, index) => (
                        <div key={event.id} className="flex items-start space-x-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            index === 0 ? "bg-primary" : "bg-muted-foreground"
                          )} />
                          <div className="flex-1">
                            <p className="text-sm text-white">{event.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 联系信息 */}
                {booking.location.contactPerson && (
                  <div>
                    <h4 className="font-medium text-white mb-3">联系信息</h4>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-white">{booking.location.contactPerson.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{booking.location.contactPerson.phone}</span>
                      </div>
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

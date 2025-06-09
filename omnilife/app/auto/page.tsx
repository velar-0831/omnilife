'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  AlertTriangle,
  Fuel,
  DollarSign,
  Wrench,
  MapPin,
  TrendingUp,
  Clock,
  Settings,
  Bell,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { VehicleCard } from '@/components/features/Auto/VehicleCard'
import { MaintenanceList } from '@/components/features/Auto/MaintenanceRecord'
import { useAutoStore } from '@/stores/useAutoStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { Vehicle, MaintenanceRecord, VehicleAlert } from '@/types/auto'

// 模拟数据
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: 'user1',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: '珍珠白',
    vin: '5YJ3E1EA1KF123456',
    licensePlate: '京A12345',
    engineType: 'electric',
    batteryCapacity: 75,
    mileage: 15000,
    purchaseDate: new Date('2023-01-15'),
    purchasePrice: 280000,
    currentValue: 250000,
    insurance: {
      id: 'ins1',
      provider: '中国平安',
      policyNumber: 'PA2023001',
      type: 'comprehensive',
      premium: 8000,
      deductible: 2000,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      coverage: [],
      isActive: true,
    },
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop',
        type: 'exterior',
        uploadedAt: new Date(),
      }
    ],
    documents: [],
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    brand: 'BMW',
    model: 'X3',
    year: 2022,
    color: '矿石灰',
    vin: 'WBAXG7C50NDX12345',
    licensePlate: '京B67890',
    engineType: 'gasoline',
    fuelCapacity: 65,
    mileage: 25000,
    purchaseDate: new Date('2022-03-20'),
    purchasePrice: 450000,
    currentValue: 380000,
    insurance: {
      id: 'ins2',
      provider: '太平洋保险',
      policyNumber: 'TP2022002',
      type: 'comprehensive',
      premium: 12000,
      deductible: 3000,
      startDate: new Date('2023-03-01'),
      endDate: new Date('2024-03-01'),
      coverage: [],
      isActive: true,
    },
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
        type: 'exterior',
        uploadedAt: new Date(),
      }
    ],
    documents: [],
    isActive: true,
    createdAt: new Date('2022-03-20'),
    updatedAt: new Date(),
  },
]

const mockAlerts: VehicleAlert[] = [
  {
    id: 'alert1',
    vehicleId: '1',
    type: 'maintenance_due',
    priority: 'medium',
    title: '保养提醒',
    message: 'Tesla Model 3 即将到达保养里程，建议尽快预约保养服务。',
    dueDate: new Date('2024-02-15'),
    dueMileage: 20000,
    isRead: false,
    isDismissed: false,
    createdAt: new Date(),
  },
  {
    id: 'alert2',
    vehicleId: '2',
    type: 'insurance_expiry',
    priority: 'high',
    title: '保险到期提醒',
    message: 'BMW X3 的保险将在30天内到期，请及时续保。',
    dueDate: new Date('2024-03-01'),
    isRead: false,
    isDismissed: false,
    createdAt: new Date(),
  },
]

export default function AutoPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'vehicles' | 'maintenance' | 'expenses'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  
  const {
    vehicles,
    currentVehicle,
    alerts,
    setCurrentVehicle,
    getMaintenanceRecordsByVehicle,
    getUnreadAlerts,
    getUpcomingAppointments,
    getVehicleAnalytics
  } = useAutoStore()

  // 模拟设置初始数据
  useEffect(() => {
    // 这里应该从API获取数据
    // 暂时使用模拟数据
  }, [])

  const unreadAlerts = getUnreadAlerts()
  const upcomingAppointments = getUpcomingAppointments()
  const recentMaintenance = currentVehicle ? getMaintenanceRecordsByVehicle(currentVehicle.id) : []
  const analytics = currentVehicle ? getVehicleAnalytics(currentVehicle.id, 'month') : null

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle.id)
  }

  const quickStats = [
    {
      title: '车辆总数',
      value: mockVehicles.length.toString(),
      icon: Car,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: '未读提醒',
      value: mockAlerts.filter(a => !a.isRead).length.toString(),
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
    {
      title: '即将预约',
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: '本月支出',
      value: analytics ? formatCurrency(analytics.totalExpenses) : '¥0',
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold gradient-text">🚗 汽车服务</h1>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { key: 'overview', label: '总览' },
                { key: 'vehicles', label: '我的车辆' },
                { key: 'maintenance', label: '维护记录' },
                { key: 'expenses', label: '费用统计' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`text-sm transition-colors ${
                    selectedTab === tab.key ? 'text-primary' : 'hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索车辆、服务商..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              添加车辆
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* 快速统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bgColor)}>
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 当前车辆 */}
              {currentVehicle ? (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-6">当前车辆</h2>
                  <VehicleCard
                    vehicle={currentVehicle}
                    variant="detailed"
                    onClick={() => console.log('Open vehicle details')}
                  />
                </section>
              ) : (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-6">我的车辆</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockVehicles.slice(0, 2).map((vehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onClick={() => handleVehicleSelect(vehicle)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 最近维护记录 */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">最近维护</h2>
                  <Button variant="ghost" size="sm">
                    查看全部
                  </Button>
                </div>
                
                {recentMaintenance.length > 0 ? (
                  <MaintenanceList
                    records={recentMaintenance.slice(0, 3)}
                    variant="compact"
                  />
                ) : (
                  <Card variant="glass">
                    <CardContent className="p-8 text-center">
                      <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">暂无维护记录</p>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 提醒和警告 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    提醒事项
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockAlerts.filter(a => !a.isDismissed).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        alert.priority === 'high' && "bg-red-500/10 border-red-500/20",
                        alert.priority === 'medium' && "bg-yellow-500/10 border-yellow-500/20",
                        alert.priority === 'low' && "bg-blue-500/10 border-blue-500/20"
                      )}
                    >
                      <h4 className="font-medium text-white text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                  ))}
                  
                  {mockAlerts.filter(a => !a.isDismissed).length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      暂无提醒事项
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 即将到来的预约 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                    即将预约
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="p-3 bg-secondary/50 rounded-lg">
                          <h4 className="font-medium text-white text-sm">
                            {appointment.serviceTypes.join(', ')}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.scheduledDate.toLocaleDateString()}</span>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{appointment.serviceProvider.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      暂无预约
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 月度统计 */}
              {analytics && (
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                      本月统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">总支出</span>
                      <span className="text-white font-medium">
                        {formatCurrency(analytics.totalExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">燃料费用</span>
                      <span className="text-white font-medium">
                        {formatCurrency(analytics.fuelCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">维护费用</span>
                      <span className="text-white font-medium">
                        {formatCurrency(analytics.maintenanceCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {currentVehicle?.engineType === 'electric' ? '电耗' : '油耗'}
                      </span>
                      <span className="text-white font-medium">
                        {analytics.fuelEfficiency.toFixed(1)} 
                        {currentVehicle?.engineType === 'electric' ? ' kWh/100km' : ' L/100km'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 快速操作 */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Fuel className="w-4 h-4 mr-2" />
                    添加加油记录
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Wrench className="w-4 h-4 mr-2" />
                    预约保养服务
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    记录费用
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    查找服务商
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'vehicles' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">我的车辆</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加车辆
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  variant="detailed"
                  onClick={() => handleVehicleSelect(vehicle)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'maintenance' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">维护记录</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                添加记录
              </Button>
            </div>
            
            <MaintenanceList
              records={recentMaintenance}
              emptyMessage="暂无维护记录，点击上方按钮添加第一条记录"
            />
          </div>
        )}

        {selectedTab === 'expenses' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">费用统计</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>月度支出趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    图表组件待实现
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>支出分类</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    图表组件待实现
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

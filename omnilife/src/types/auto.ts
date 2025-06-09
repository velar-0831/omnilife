// 汽车服务相关类型定义

export interface Vehicle {
  id: string
  userId: string
  brand: string
  model: string
  year: number
  color: string
  vin: string
  licensePlate: string
  engineType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  fuelCapacity?: number
  batteryCapacity?: number
  mileage: number
  purchaseDate: Date
  purchasePrice: number
  currentValue: number
  insurance: VehicleInsurance
  images: VehicleImage[]
  documents: VehicleDocument[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface VehicleImage {
  id: string
  url: string
  type: 'exterior' | 'interior' | 'engine' | 'damage' | 'document'
  description?: string
  uploadedAt: Date
}

export interface VehicleDocument {
  id: string
  type: 'registration' | 'insurance' | 'inspection' | 'warranty' | 'receipt'
  name: string
  url: string
  expiryDate?: Date
  uploadedAt: Date
}

export interface VehicleInsurance {
  id: string
  provider: string
  policyNumber: string
  type: 'comprehensive' | 'third_party' | 'collision'
  premium: number
  deductible: number
  startDate: Date
  endDate: Date
  coverage: InsuranceCoverage[]
  isActive: boolean
}

export interface InsuranceCoverage {
  type: string
  limit: number
  description: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: MaintenanceType
  serviceProvider: ServiceProvider
  date: Date
  mileage: number
  cost: number
  description: string
  items: MaintenanceItem[]
  nextServiceDate?: Date
  nextServiceMileage?: number
  warranty: ServiceWarranty
  rating?: number
  review?: string
  images: string[]
  createdAt: Date
}

export interface MaintenanceItem {
  id: string
  name: string
  category: 'oil' | 'filter' | 'brake' | 'tire' | 'battery' | 'engine' | 'transmission' | 'other'
  quantity: number
  unitPrice: number
  totalPrice: number
  partNumber?: string
  brand?: string
  warranty?: number // 保修期（月）
}

export interface ServiceWarranty {
  duration: number // 保修期（月）
  mileage: number // 保修里程
  description: string
  terms: string[]
}

export type MaintenanceType = 
  | 'routine' // 常规保养
  | 'repair' // 维修
  | 'inspection' // 检查
  | 'emergency' // 紧急维修
  | 'recall' // 召回
  | 'upgrade' // 升级改装

export interface ServiceProvider {
  id: string
  name: string
  type: 'dealership' | 'independent' | 'chain' | 'mobile'
  address: Address
  phone: string
  email?: string
  website?: string
  rating: number
  reviewCount: number
  services: ServiceType[]
  certifications: string[]
  workingHours: WorkingHours
  images: string[]
  isVerified: boolean
  distance?: number // 距离用户的距离（公里）
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface WorkingHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  isOpen: boolean
  openTime?: string // HH:mm 格式
  closeTime?: string // HH:mm 格式
  breaks?: Array<{
    startTime: string
    endTime: string
  }>
}

export type ServiceType = 
  | 'oil_change' // 换油
  | 'brake_service' // 刹车服务
  | 'tire_service' // 轮胎服务
  | 'battery_service' // 电池服务
  | 'engine_repair' // 发动机维修
  | 'transmission_repair' // 变速箱维修
  | 'air_conditioning' // 空调服务
  | 'electrical' // 电气系统
  | 'bodywork' // 车身修理
  | 'painting' // 喷漆
  | 'inspection' // 检查
  | 'towing' // 拖车
  | 'emergency' // 紧急救援

export interface ServiceAppointment {
  id: string
  vehicleId: string
  vehicle: Vehicle
  serviceProviderId: string
  serviceProvider: ServiceProvider
  serviceTypes: ServiceType[]
  scheduledDate: Date
  estimatedDuration: number // 预计时长（分钟）
  status: AppointmentStatus
  description: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type AppointmentStatus = 
  | 'scheduled' // 已预约
  | 'confirmed' // 已确认
  | 'in_progress' // 进行中
  | 'completed' // 已完成
  | 'cancelled' // 已取消
  | 'no_show' // 未到场

export interface FuelRecord {
  id: string
  vehicleId: string
  date: Date
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric'
  quantity: number // 加油量（升）或充电量（kWh）
  unitPrice: number
  totalCost: number
  location: string
  stationName?: string
  isFull: boolean // 是否加满
  notes?: string
  receipt?: string // 收据图片URL
  createdAt: Date
}

export interface ExpenseRecord {
  id: string
  vehicleId: string
  category: ExpenseCategory
  type: string
  amount: number
  date: Date
  description: string
  vendor?: string
  receipt?: string
  mileage?: number
  isRecurring: boolean
  tags: string[]
  createdAt: Date
}

export type ExpenseCategory = 
  | 'fuel' // 燃料
  | 'maintenance' // 保养
  | 'repair' // 维修
  | 'insurance' // 保险
  | 'registration' // 注册费
  | 'parking' // 停车费
  | 'tolls' // 过路费
  | 'fines' // 罚款
  | 'accessories' // 配件
  | 'other' // 其他

export interface VehicleAlert {
  id: string
  vehicleId: string
  type: AlertType
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  actionRequired?: string
  dueDate?: Date
  dueMileage?: number
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
}

export type AlertType = 
  | 'maintenance_due' // 保养到期
  | 'insurance_expiry' // 保险到期
  | 'registration_expiry' // 注册到期
  | 'inspection_due' // 检查到期
  | 'recall_notice' // 召回通知
  | 'low_fuel' // 燃料不足
  | 'battery_low' // 电池电量低
  | 'tire_pressure' // 胎压异常
  | 'engine_warning' // 发动机警告
  | 'service_reminder' // 服务提醒

export interface DrivingTrip {
  id: string
  vehicleId: string
  startDate: Date
  endDate: Date
  startLocation: string
  endLocation: string
  startMileage: number
  endMileage: number
  distance: number
  duration: number // 行驶时间（分钟）
  purpose: 'business' | 'personal' | 'commute' | 'leisure'
  fuelConsumed?: number
  averageSpeed: number
  maxSpeed: number
  route?: TripRoute
  expenses: TripExpense[]
  notes?: string
  createdAt: Date
}

export interface TripRoute {
  coordinates: Array<{
    latitude: number
    longitude: number
    timestamp: Date
  }>
  waypoints: string[]
}

export interface TripExpense {
  type: 'fuel' | 'parking' | 'tolls' | 'food' | 'accommodation' | 'other'
  amount: number
  description: string
  receipt?: string
}

export interface VehicleAnalytics {
  vehicleId: string
  period: 'week' | 'month' | 'quarter' | 'year'
  totalMileage: number
  totalExpenses: number
  fuelEfficiency: number // 油耗（L/100km）或电耗（kWh/100km）
  averageCostPerKm: number
  maintenanceCosts: number
  fuelCosts: number
  expenseBreakdown: Record<ExpenseCategory, number>
  mileageHistory: Array<{
    date: Date
    mileage: number
  }>
  expenseHistory: Array<{
    date: Date
    amount: number
    category: ExpenseCategory
  }>
  upcomingMaintenance: MaintenanceSchedule[]
}

export interface MaintenanceSchedule {
  type: MaintenanceType
  description: string
  dueDate?: Date
  dueMileage?: number
  estimatedCost: number
  priority: 'low' | 'medium' | 'high'
  isOverdue: boolean
}

export interface CarDealership {
  id: string
  name: string
  brand: string
  address: Address
  phone: string
  email?: string
  website?: string
  rating: number
  reviewCount: number
  services: ServiceType[]
  newCarInventory: NewCar[]
  usedCarInventory: UsedCar[]
  workingHours: WorkingHours
  images: string[]
  isAuthorized: boolean
  distance?: number
}

export interface NewCar {
  id: string
  brand: string
  model: string
  year: number
  trim: string
  color: string
  engineType: Vehicle['engineType']
  transmission: 'manual' | 'automatic' | 'cvt'
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd'
  fuelEconomy: {
    city: number
    highway: number
    combined: number
  }
  features: string[]
  price: number
  msrp: number
  incentives: CarIncentive[]
  availability: 'in_stock' | 'order_only' | 'coming_soon'
  images: string[]
  specifications: CarSpecification[]
}

export interface UsedCar extends Omit<NewCar, 'msrp' | 'incentives'> {
  mileage: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  history: CarHistory
  warranty?: CarWarranty
  certifiedPreOwned: boolean
}

export interface CarHistory {
  accidents: number
  owners: number
  serviceRecords: number
  recalls: number
  title: 'clean' | 'salvage' | 'flood' | 'lemon' | 'rebuilt'
}

export interface CarWarranty {
  type: 'manufacturer' | 'extended' | 'dealer'
  duration: number // 月
  mileage: number
  coverage: string[]
  transferable: boolean
}

export interface CarIncentive {
  type: 'rebate' | 'financing' | 'lease' | 'trade_in'
  amount: number
  description: string
  conditions: string[]
  expiryDate: Date
}

export interface CarSpecification {
  category: string
  name: string
  value: string
  unit?: string
}

// API响应类型
export interface AutoApiResponse<T> {
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

// 汽车服务事件类型
export type AutoEvent = 
  | { type: 'VEHICLE_ADD'; vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'VEHICLE_UPDATE'; vehicleId: string; updates: Partial<Vehicle> }
  | { type: 'MAINTENANCE_ADD'; record: Omit<MaintenanceRecord, 'id' | 'createdAt'> }
  | { type: 'FUEL_ADD'; record: Omit<FuelRecord, 'id' | 'createdAt'> }
  | { type: 'EXPENSE_ADD'; record: Omit<ExpenseRecord, 'id' | 'createdAt'> }
  | { type: 'APPOINTMENT_BOOK'; appointment: Omit<ServiceAppointment, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'TRIP_START'; vehicleId: string; startLocation: string; startMileage: number }
  | { type: 'TRIP_END'; tripId: string; endLocation: string; endMileage: number }
  | { type: 'ALERT_DISMISS'; alertId: string }
  | { type: 'SERVICE_SEARCH'; location: string; serviceTypes: ServiceType[] }

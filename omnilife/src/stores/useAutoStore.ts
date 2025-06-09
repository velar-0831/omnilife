import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Vehicle, 
  MaintenanceRecord,
  FuelRecord,
  ExpenseRecord,
  ServiceAppointment,
  VehicleAlert,
  DrivingTrip,
  ServiceProvider,
  VehicleAnalytics,
  AutoEvent
} from '@/types/auto'

interface AutoStore {
  // 车辆数据
  vehicles: Vehicle[]
  currentVehicle: Vehicle | null
  
  // 维护记录
  maintenanceRecords: MaintenanceRecord[]
  
  // 燃料记录
  fuelRecords: FuelRecord[]
  
  // 费用记录
  expenseRecords: ExpenseRecord[]
  
  // 预约记录
  appointments: ServiceAppointment[]
  
  // 行程记录
  trips: DrivingTrip[]
  
  // 提醒和警告
  alerts: VehicleAlert[]
  
  // 服务提供商
  serviceProviders: ServiceProvider[]
  
  // UI状态
  isLoading: boolean
  error: string | null
  
  // 车辆管理
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void
  removeVehicle: (vehicleId: string) => void
  setCurrentVehicle: (vehicleId: string | null) => void
  
  // 维护记录管理
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void
  updateMaintenanceRecord: (recordId: string, updates: Partial<MaintenanceRecord>) => void
  removeMaintenanceRecord: (recordId: string) => void
  
  // 燃料记录管理
  addFuelRecord: (record: Omit<FuelRecord, 'id' | 'createdAt'>) => void
  updateFuelRecord: (recordId: string, updates: Partial<FuelRecord>) => void
  removeFuelRecord: (recordId: string) => void
  
  // 费用记录管理
  addExpenseRecord: (record: Omit<ExpenseRecord, 'id' | 'createdAt'>) => void
  updateExpenseRecord: (recordId: string, updates: Partial<ExpenseRecord>) => void
  removeExpenseRecord: (recordId: string) => void
  
  // 预约管理
  bookAppointment: (appointment: Omit<ServiceAppointment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAppointment: (appointmentId: string, updates: Partial<ServiceAppointment>) => void
  cancelAppointment: (appointmentId: string) => void
  
  // 行程管理
  startTrip: (vehicleId: string, startLocation: string, startMileage: number) => string
  endTrip: (tripId: string, endLocation: string, endMileage: number) => void
  updateTrip: (tripId: string, updates: Partial<DrivingTrip>) => void
  
  // 提醒管理
  addAlert: (alert: Omit<VehicleAlert, 'id' | 'createdAt'>) => void
  markAlertAsRead: (alertId: string) => void
  dismissAlert: (alertId: string) => void
  
  // 数据分析
  getVehicleAnalytics: (vehicleId: string, period: VehicleAnalytics['period']) => VehicleAnalytics | null
  
  // 工具方法
  getVehicleById: (id: string) => Vehicle | undefined
  getMaintenanceRecordsByVehicle: (vehicleId: string) => MaintenanceRecord[]
  getFuelRecordsByVehicle: (vehicleId: string) => FuelRecord[]
  getExpenseRecordsByVehicle: (vehicleId: string) => ExpenseRecord[]
  getUpcomingAppointments: (vehicleId?: string) => ServiceAppointment[]
  getUnreadAlerts: (vehicleId?: string) => VehicleAlert[]
  
  // 事件处理
  handleAutoEvent: (event: AutoEvent) => void
}

export const useAutoStore = create<AutoStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      vehicles: [],
      currentVehicle: null,
      maintenanceRecords: [],
      fuelRecords: [],
      expenseRecords: [],
      appointments: [],
      trips: [],
      alerts: [],
      serviceProviders: [],
      isLoading: false,
      error: null,

      // 车辆管理
      addVehicle: (vehicleData) => {
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: `vehicle_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          vehicles: [...state.vehicles, newVehicle],
          currentVehicle: state.vehicles.length === 0 ? newVehicle : state.currentVehicle
        }))
      },

      updateVehicle: (vehicleId, updates) => {
        set(state => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === vehicleId
              ? { ...vehicle, ...updates, updatedAt: new Date() }
              : vehicle
          ),
          currentVehicle: state.currentVehicle?.id === vehicleId
            ? { ...state.currentVehicle, ...updates, updatedAt: new Date() }
            : state.currentVehicle
        }))
      },

      removeVehicle: (vehicleId) => {
        set(state => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== vehicleId),
          currentVehicle: state.currentVehicle?.id === vehicleId ? null : state.currentVehicle,
          maintenanceRecords: state.maintenanceRecords.filter(record => record.vehicleId !== vehicleId),
          fuelRecords: state.fuelRecords.filter(record => record.vehicleId !== vehicleId),
          expenseRecords: state.expenseRecords.filter(record => record.vehicleId !== vehicleId),
          appointments: state.appointments.filter(appointment => appointment.vehicleId !== vehicleId),
          trips: state.trips.filter(trip => trip.vehicleId !== vehicleId),
          alerts: state.alerts.filter(alert => alert.vehicleId !== vehicleId),
        }))
      },

      setCurrentVehicle: (vehicleId) => {
        const { vehicles } = get()
        const vehicle = vehicleId ? vehicles.find(v => v.id === vehicleId) : null
        set({ currentVehicle: vehicle || null })
      },

      // 维护记录管理
      addMaintenanceRecord: (recordData) => {
        const newRecord: MaintenanceRecord = {
          ...recordData,
          id: `maintenance_${Date.now()}`,
          createdAt: new Date(),
        }
        
        set(state => ({
          maintenanceRecords: [...state.maintenanceRecords, newRecord]
        }))
        
        // 更新车辆里程
        if (recordData.mileage > 0) {
          get().updateVehicle(recordData.vehicleId, { mileage: recordData.mileage })
        }
      },

      updateMaintenanceRecord: (recordId, updates) => {
        set(state => ({
          maintenanceRecords: state.maintenanceRecords.map(record =>
            record.id === recordId ? { ...record, ...updates } : record
          )
        }))
      },

      removeMaintenanceRecord: (recordId) => {
        set(state => ({
          maintenanceRecords: state.maintenanceRecords.filter(record => record.id !== recordId)
        }))
      },

      // 燃料记录管理
      addFuelRecord: (recordData) => {
        const newRecord: FuelRecord = {
          ...recordData,
          id: `fuel_${Date.now()}`,
          createdAt: new Date(),
        }
        
        set(state => ({
          fuelRecords: [...state.fuelRecords, newRecord]
        }))
        
        // 更新车辆里程
        if (recordData.mileage > 0) {
          get().updateVehicle(recordData.vehicleId, { mileage: recordData.mileage })
        }
      },

      updateFuelRecord: (recordId, updates) => {
        set(state => ({
          fuelRecords: state.fuelRecords.map(record =>
            record.id === recordId ? { ...record, ...updates } : record
          )
        }))
      },

      removeFuelRecord: (recordId) => {
        set(state => ({
          fuelRecords: state.fuelRecords.filter(record => record.id !== recordId)
        }))
      },

      // 费用记录管理
      addExpenseRecord: (recordData) => {
        const newRecord: ExpenseRecord = {
          ...recordData,
          id: `expense_${Date.now()}`,
          createdAt: new Date(),
        }
        
        set(state => ({
          expenseRecords: [...state.expenseRecords, newRecord]
        }))
      },

      updateExpenseRecord: (recordId, updates) => {
        set(state => ({
          expenseRecords: state.expenseRecords.map(record =>
            record.id === recordId ? { ...record, ...updates } : record
          )
        }))
      },

      removeExpenseRecord: (recordId) => {
        set(state => ({
          expenseRecords: state.expenseRecords.filter(record => record.id !== recordId)
        }))
      },

      // 预约管理
      bookAppointment: (appointmentData) => {
        const newAppointment: ServiceAppointment = {
          ...appointmentData,
          id: `appointment_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          appointments: [...state.appointments, newAppointment]
        }))
      },

      updateAppointment: (appointmentId, updates) => {
        set(state => ({
          appointments: state.appointments.map(appointment =>
            appointment.id === appointmentId
              ? { ...appointment, ...updates, updatedAt: new Date() }
              : appointment
          )
        }))
      },

      cancelAppointment: (appointmentId) => {
        get().updateAppointment(appointmentId, { status: 'cancelled' })
      },

      // 行程管理
      startTrip: (vehicleId, startLocation, startMileage) => {
        const tripId = `trip_${Date.now()}`
        const newTrip: DrivingTrip = {
          id: tripId,
          vehicleId,
          startDate: new Date(),
          endDate: new Date(), // 临时值，结束时更新
          startLocation,
          endLocation: '', // 结束时填写
          startMileage,
          endMileage: startMileage, // 临时值，结束时更新
          distance: 0,
          duration: 0,
          purpose: 'personal',
          averageSpeed: 0,
          maxSpeed: 0,
          expenses: [],
          createdAt: new Date(),
        }
        
        set(state => ({
          trips: [...state.trips, newTrip]
        }))
        
        return tripId
      },

      endTrip: (tripId, endLocation, endMileage) => {
        set(state => {
          const trip = state.trips.find(t => t.id === tripId)
          if (!trip) return state
          
          const endDate = new Date()
          const duration = Math.round((endDate.getTime() - trip.startDate.getTime()) / (1000 * 60)) // 分钟
          const distance = endMileage - trip.startMileage
          const averageSpeed = duration > 0 ? (distance / duration) * 60 : 0 // km/h
          
          return {
            trips: state.trips.map(t =>
              t.id === tripId
                ? {
                    ...t,
                    endDate,
                    endLocation,
                    endMileage,
                    distance,
                    duration,
                    averageSpeed,
                  }
                : t
            )
          }
        })
        
        // 更新车辆里程
        const trip = get().trips.find(t => t.id === tripId)
        if (trip) {
          get().updateVehicle(trip.vehicleId, { mileage: endMileage })
        }
      },

      updateTrip: (tripId, updates) => {
        set(state => ({
          trips: state.trips.map(trip =>
            trip.id === tripId ? { ...trip, ...updates } : trip
          )
        }))
      },

      // 提醒管理
      addAlert: (alertData) => {
        const newAlert: VehicleAlert = {
          ...alertData,
          id: `alert_${Date.now()}`,
          createdAt: new Date(),
        }
        
        set(state => ({
          alerts: [...state.alerts, newAlert]
        }))
      },

      markAlertAsRead: (alertId) => {
        set(state => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        }))
      },

      dismissAlert: (alertId) => {
        set(state => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, isDismissed: true } : alert
          )
        }))
      },

      // 数据分析
      getVehicleAnalytics: (vehicleId, period) => {
        const { fuelRecords, expenseRecords, maintenanceRecords, vehicles } = get()
        const vehicle = vehicles.find(v => v.id === vehicleId)
        
        if (!vehicle) return null
        
        const now = new Date()
        const periodStart = new Date()
        
        switch (period) {
          case 'week':
            periodStart.setDate(now.getDate() - 7)
            break
          case 'month':
            periodStart.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            periodStart.setMonth(now.getMonth() - 3)
            break
          case 'year':
            periodStart.setFullYear(now.getFullYear() - 1)
            break
        }
        
        const periodFuelRecords = fuelRecords.filter(
          record => record.vehicleId === vehicleId && record.date >= periodStart
        )
        const periodExpenseRecords = expenseRecords.filter(
          record => record.vehicleId === vehicleId && record.date >= periodStart
        )
        
        const totalExpenses = periodExpenseRecords.reduce((sum, record) => sum + record.amount, 0)
        const fuelCosts = periodFuelRecords.reduce((sum, record) => sum + record.totalCost, 0)
        const maintenanceCosts = periodExpenseRecords
          .filter(record => record.category === 'maintenance' || record.category === 'repair')
          .reduce((sum, record) => sum + record.amount, 0)
        
        const totalFuel = periodFuelRecords.reduce((sum, record) => sum + record.quantity, 0)
        const totalDistance = periodFuelRecords.length > 1 
          ? Math.max(...periodFuelRecords.map(r => r.mileage)) - Math.min(...periodFuelRecords.map(r => r.mileage))
          : 0
        
        const fuelEfficiency = totalDistance > 0 && totalFuel > 0 
          ? (totalFuel / totalDistance) * 100 
          : 0
        
        const expenseBreakdown = periodExpenseRecords.reduce((acc, record) => {
          acc[record.category] = (acc[record.category] || 0) + record.amount
          return acc
        }, {} as Record<string, number>)
        
        return {
          vehicleId,
          period,
          totalMileage: totalDistance,
          totalExpenses,
          fuelEfficiency,
          averageCostPerKm: totalDistance > 0 ? totalExpenses / totalDistance : 0,
          maintenanceCosts,
          fuelCosts,
          expenseBreakdown,
          mileageHistory: [],
          expenseHistory: [],
          upcomingMaintenance: [],
        } as VehicleAnalytics
      },

      // 工具方法
      getVehicleById: (id) => {
        const { vehicles } = get()
        return vehicles.find(vehicle => vehicle.id === id)
      },

      getMaintenanceRecordsByVehicle: (vehicleId) => {
        const { maintenanceRecords } = get()
        return maintenanceRecords
          .filter(record => record.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getFuelRecordsByVehicle: (vehicleId) => {
        const { fuelRecords } = get()
        return fuelRecords
          .filter(record => record.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getExpenseRecordsByVehicle: (vehicleId) => {
        const { expenseRecords } = get()
        return expenseRecords
          .filter(record => record.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getUpcomingAppointments: (vehicleId) => {
        const { appointments } = get()
        const now = new Date()
        
        return appointments
          .filter(appointment => {
            const isUpcoming = appointment.scheduledDate >= now
            const isActive = appointment.status === 'scheduled' || appointment.status === 'confirmed'
            const matchesVehicle = !vehicleId || appointment.vehicleId === vehicleId
            
            return isUpcoming && isActive && matchesVehicle
          })
          .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      },

      getUnreadAlerts: (vehicleId) => {
        const { alerts } = get()
        return alerts.filter(alert => {
          const isUnread = !alert.isRead && !alert.isDismissed
          const matchesVehicle = !vehicleId || alert.vehicleId === vehicleId
          
          return isUnread && matchesVehicle
        })
      },

      // 事件处理
      handleAutoEvent: (event) => {
        const actions = get()
        
        switch (event.type) {
          case 'VEHICLE_ADD':
            actions.addVehicle(event.vehicle)
            break
          case 'VEHICLE_UPDATE':
            actions.updateVehicle(event.vehicleId, event.updates)
            break
          case 'MAINTENANCE_ADD':
            actions.addMaintenanceRecord(event.record)
            break
          case 'FUEL_ADD':
            actions.addFuelRecord(event.record)
            break
          case 'EXPENSE_ADD':
            actions.addExpenseRecord(event.record)
            break
          case 'APPOINTMENT_BOOK':
            actions.bookAppointment(event.appointment)
            break
          case 'TRIP_START':
            actions.startTrip(event.vehicleId, event.startLocation, event.startMileage)
            break
          case 'TRIP_END':
            actions.endTrip(event.tripId, event.endLocation, event.endMileage)
            break
          case 'ALERT_DISMISS':
            actions.dismissAlert(event.alertId)
            break
        }
      },
    }),
    {
      name: 'auto-store',
      partialize: (state) => ({
        vehicles: state.vehicles,
        currentVehicle: state.currentVehicle,
        maintenanceRecords: state.maintenanceRecords.slice(0, 100), // 保留最近100条
        fuelRecords: state.fuelRecords.slice(0, 200), // 保留最近200条
        expenseRecords: state.expenseRecords.slice(0, 200),
        appointments: state.appointments.filter(a => a.scheduledDate >= new Date()), // 只保留未来的预约
        trips: state.trips.slice(0, 50), // 保留最近50次行程
        alerts: state.alerts.filter(a => !a.isDismissed), // 不保存已忽略的提醒
      }),
    }
  )
)

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart as CartIcon, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  Heart,
  Tag,
  Truck,
  Shield,
  CreditCard,
  ArrowRight,
  Gift
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useShoppingStore } from '@/stores/useShoppingStore'
import { cn, formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/types/shopping'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ShoppingCart({ isOpen, onClose, className }: ShoppingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addToWishlist,
    getCartItemCount,
    getCartTotal
  } = useShoppingStore()

  const itemCount = getCartItemCount()
  const total = getCartTotal()

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateCartQuantity(itemId, newQuantity)
    }
  }

  const handleMoveToWishlist = (item: CartItem) => {
    addToWishlist(item.productId)
    removeFromCart(item.id)
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    // 模拟结账过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsCheckingOut(false)
    // 这里应该跳转到结账页面
    console.log('Proceeding to checkout...')
  }

  const freeShippingThreshold = 299
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (cart?.subtotal || 0))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* 购物车侧边栏 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-white/10 z-50 flex flex-col",
              className
            )}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <CartIcon className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-white">购物车</h2>
                {itemCount > 0 && (
                  <span className="bg-primary text-white text-sm px-2 py-1 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 免费配送提示 */}
            {cart && cart.subtotal > 0 && remainingForFreeShipping > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-b border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">
                    再购买 <span className="font-bold text-green-400">
                      {formatCurrency(remainingForFreeShipping)}
                    </span> 即可享受免费配送
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((cart.subtotal / freeShippingThreshold) * 100))}%` 
                    }}
                  />
                </div>
              </div>
            )}

            {/* 购物车内容 */}
            <div className="flex-1 overflow-y-auto">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <CartIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">购物车是空的</h3>
                  <p className="text-muted-foreground mb-6">添加一些商品开始购物吧</p>
                  <Button onClick={onClose}>
                    继续购物
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cart.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                      onRemove={() => removeFromCart(item.id)}
                      onMoveToWishlist={() => handleMoveToWishlist(item)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 底部结算 */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                {/* 优惠码 */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="输入优惠码"
                    className="flex-1 px-3 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground text-sm"
                  />
                  <Button variant="ghost" size="sm">
                    应用
                  </Button>
                </div>

                {/* 价格明细 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">小计</span>
                    <span className="text-white">{formatCurrency(cart.subtotal)}</span>
                  </div>
                  
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>优惠</span>
                      <span>-{formatCurrency(cart.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">配送费</span>
                    <span className="text-white">
                      {cart.shipping === 0 ? '免费' : formatCurrency(cart.shipping)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">税费</span>
                    <span className="text-white">{formatCurrency(cart.tax)}</span>
                  </div>
                  
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">总计</span>
                      <span className="text-primary">{formatCurrency(cart.total)}</span>
                    </div>
                  </div>
                </div>

                {/* 服务保障 */}
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>安全支付</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>快速配送</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gift className="w-3 h-3" />
                    <span>7天退换</span>
                  </div>
                </div>

                {/* 结算按钮 */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full"
                  size="lg"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>处理中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>立即结算</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface CartItemCardProps {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
  onMoveToWishlist: () => void
}

function CartItemCard({ 
  item, 
  onQuantityChange, 
  onRemove, 
  onMoveToWishlist 
}: CartItemCardProps) {
  const { product, variant, quantity, price } = item
  const mainImage = product.images.find(img => img.isDefault) || product.images[0]
  const hasDiscount = product.price.discount && product.price.discount.percentage > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card variant="glass" className="p-4">
        <div className="flex space-x-4">
          {/* 商品图片 */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={mainImage?.url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 商品信息 */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm line-clamp-2 mb-1">
              {product.name}
            </h4>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
              <span>{product.brand}</span>
              {variant && (
                <>
                  <span>•</span>
                  <span>{variant.name}: {variant.value}</span>
                </>
              )}
            </div>
            
            {/* 价格和数量 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-primary text-sm">
                  {formatCurrency(price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(product.price.original!)}
                  </span>
                )}
              </div>
              
              {/* 数量控制 */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuantityChange(quantity - 1)}
                  className="w-6 h-6"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="text-white text-sm font-medium w-8 text-center">
                  {quantity}
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onQuantityChange(quantity + 1)}
                  className="w-6 h-6"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm font-medium text-white">
                小计: {formatCurrency(price * quantity)}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMoveToWishlist}
                  className="w-6 h-6"
                >
                  <Heart className="w-3 h-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRemove}
                  className="w-6 h-6 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

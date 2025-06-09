'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Music,
  Newspaper,
  ShoppingBag,
  Car,
  Home,
  Users,
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  Clock,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { GlobalLayout } from '@/components/layout/GlobalLayout'

export default function HomePage() {
  const features = [
    {
      icon: Music,
      title: '智能音乐',
      description: 'AI驱动的个性化音乐推荐，发现你的专属音乐世界',
      color: 'from-purple-500 to-pink-500',
      href: '/music'
    },
    {
      icon: Newspaper,
      title: '智慧资讯',
      description: '实时新闻聚合与科技前沿，AI摘要让阅读更高效',
      color: 'from-blue-500 to-cyan-500',
      href: '/news'
    },
    {
      icon: ShoppingBag,
      title: '智能购物',
      description: 'AR试用、智能比价、社交购物，重新定义购物体验',
      color: 'from-green-500 to-emerald-500',
      href: '/shopping'
    },
    {
      icon: Car,
      title: '汽车服务',
      description: '汽车全生命周期管理，从购买到保养一站式服务',
      color: 'from-orange-500 to-red-500',
      href: '/auto'
    },
    {
      icon: Home,
      title: '生活服务',
      description: '本地生活服务一键直达，让生活更便捷',
      color: 'from-indigo-500 to-purple-500',
      href: '/life'
    },
    {
      icon: Users,
      title: '智能团购',
      description: 'AI匹配团购伙伴，享受更多优惠和社交乐趣',
      color: 'from-pink-500 to-rose-500',
      href: '/group'
    }
  ]

  return (
    <GlobalLayout>

      {/* 英雄区域 */}
      <section className="pt-20 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                一个平台
              </span>
              <br />
              <span className="text-white">连接生活的每一个瞬间</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              通过AI驱动的个性化服务，OmniLife重新定义数字生活体验，
              让音乐、购物、资讯、出行等生活服务无缝连接。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                立即体验
              </Button>
              <Button variant="ghost" size="lg">
                了解更多
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                核心功能
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              六大核心模块，打造全方位的生活服务生态
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Link href={feature.href}>
                  <Card className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-gray-800/50 border-gray-700 hover:border-primary/50">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-white group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                        探索更多
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </GlobalLayout>
  )
}


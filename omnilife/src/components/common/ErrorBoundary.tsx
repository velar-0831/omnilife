'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Mail,
  MessageCircle,
  ArrowLeft,
  Copy,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  copied: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 调用外部错误处理函数
    this.props.onError?.(error, errorInfo)

    // 发送错误报告到监控服务
    this.reportError(error, errorInfo)
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // 这里可以集成错误监控服务如 Sentry
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  handleCopyError = async () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report - ${this.state.errorId}`)
    const body = encodeURIComponent(`
错误ID: ${this.state.errorId}
错误信息: ${this.state.error?.message}
发生时间: ${new Date().toISOString()}
页面URL: ${window.location.href}
用户代理: ${navigator.userAgent}

请描述您在遇到此错误前的操作步骤：
1. 
2. 
3. 

其他信息：

    `)
    window.open(`mailto:support@omnilife.com?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认错误UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card variant="glass" className="border-red-500/20">
              <CardHeader className="text-center pb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </motion.div>
                
                <CardTitle className="text-2xl text-white mb-2">
                  哎呀，出现了一些问题
                </CardTitle>
                <p className="text-muted-foreground">
                  应用遇到了意外错误，我们已经记录了这个问题
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 错误信息 */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bug className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">错误详情</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    错误ID: <code className="bg-secondary px-2 py-1 rounded text-xs">{this.state.errorId}</code>
                  </p>
                  {this.state.error && (
                    <p className="text-sm text-red-300 font-mono">
                      {this.state.error.message}
                    </p>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重试
                  </Button>
                  
                  <Button variant="ghost" onClick={this.handleReload} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新页面
                  </Button>
                  
                  <Button variant="ghost" onClick={this.handleGoHome} className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    返回首页
                  </Button>
                  
                  <Button variant="ghost" onClick={this.handleReportBug} className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    报告问题
                  </Button>
                </div>

                {/* 高级选项 */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-white transition-colors">
                    <span className="inline-flex items-center">
                      高级选项
                      <motion.div
                        className="ml-1"
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: 180 }}
                      >
                        <ArrowLeft className="w-3 h-3 transform rotate-90 group-open:rotate-180 transition-transform" />
                      </motion.div>
                    </span>
                  </summary>
                  
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 space-y-3"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={this.handleCopyError}
                      className="w-full justify-start"
                    >
                      {this.state.copied ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {this.state.copied ? '已复制错误信息' : '复制错误信息'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open('/help', '_blank')}
                      className="w-full justify-start"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      联系客服
                    </Button>
                  </motion.div>
                </details>

                {/* 提示信息 */}
                <div className="text-center text-xs text-muted-foreground">
                  <p>如果问题持续存在，请联系技术支持</p>
                  <p className="mt-1">support@omnilife.com</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// 函数式组件包装器
interface ErrorBoundaryWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export function ErrorBoundaryWrapper({ children, fallback, onError }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}

// 页面级错误边界
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // 页面级错误处理
    console.error('Page Error:', error, errorInfo)
    
    // 可以在这里添加错误上报逻辑
    // 例如发送到 Sentry、LogRocket 等服务
  }

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}

// 组件级错误边界
export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode
  componentName?: string 
}) {
  const fallback = (
    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
      <div className="flex items-center space-x-2 text-red-400">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {componentName ? `${componentName} 组件` : '组件'}加载失败
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        请刷新页面重试
      </p>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}

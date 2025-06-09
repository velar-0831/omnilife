'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Smile, 
  Image, 
  MoreVertical,
  Users,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Sad,
  Reply,
  Copy,
  Flag
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGroupBuyStore } from '@/stores/useGroupBuyStore'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { ChatMessage, GroupBuyUser } from '@/types/group'

interface GroupChatProps {
  sessionId: string
  className?: string
}

const emojiReactions = ['❤️', '👍', '😂', '😮', '😢', '😡']

export function GroupChat({ sessionId, className }: GroupChatProps) {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    chats,
    currentUser,
    sendMessage,
    addReaction,
    removeReaction,
    fetchChatMessages
  } = useGroupBuyStore()

  const chat = chats.find(c => c.sessionId === sessionId)
  const messages = chat?.messages || []

  useEffect(() => {
    fetchChatMessages(sessionId)
  }, [sessionId, fetchChatMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser) return

    sendMessage(sessionId, message.trim())
    setMessage('')
    setReplyTo(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return

    const messageReaction = messages
      .find(m => m.id === messageId)
      ?.reactions.find(r => r.emoji === emoji)

    if (messageReaction?.users.includes(currentUser.id)) {
      removeReaction(messageId, emoji, currentUser.id)
    } else {
      addReaction(messageId, emoji, currentUser.id)
    }
  }

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message)
    inputRef.current?.focus()
  }

  const MessageBubble = ({ message: msg, isOwn }: { message: ChatMessage; isOwn: boolean }) => {
    const [showActions, setShowActions] = useState(false)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-end space-x-2 mb-4",
          isOwn ? "flex-row-reverse space-x-reverse" : "flex-row"
        )}
        onHoverStart={() => setShowActions(true)}
        onHoverEnd={() => setShowActions(false)}
      >
        {/* 用户头像 */}
        {!isOwn && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {msg.sender.avatar ? (
              <img 
                src={msg.sender.avatar} 
                alt={msg.sender.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        )}

        <div className={cn(
          "flex flex-col max-w-xs lg:max-w-md",
          isOwn ? "items-end" : "items-start"
        )}>
          {/* 发送者信息 */}
          {!isOwn && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-white">{msg.sender.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(msg.timestamp)}
              </span>
            </div>
          )}

          {/* 回复引用 */}
          {msg.replyTo && (
            <div className="mb-2 p-2 bg-secondary/30 rounded-lg border-l-2 border-primary/50 text-xs">
              <p className="text-muted-foreground">回复消息</p>
            </div>
          )}

          {/* 消息内容 */}
          <div className={cn(
            "relative px-4 py-2 rounded-2xl",
            isOwn 
              ? "bg-primary text-white" 
              : "bg-secondary text-white",
            msg.type === 'system' && "bg-yellow-500/20 text-yellow-400"
          )}>
            {msg.type === 'text' && (
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            )}
            
            {msg.type === 'image' && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={msg.content} 
                  alt="聊天图片"
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {msg.type === 'system' && (
              <p className="text-xs text-center">{msg.content}</p>
            )}

            {/* 时间戳（自己的消息） */}
            {isOwn && (
              <div className="text-xs text-white/70 mt-1 text-right">
                {formatRelativeTime(msg.timestamp)}
              </div>
            )}
          </div>

          {/* 表情反应 */}
          {msg.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {msg.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(msg.id, reaction.emoji)}
                  className={cn(
                    "flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors",
                    reaction.users.includes(currentUser?.id || '')
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* 快速操作 */}
          <AnimatePresence>
            {showActions && msg.type !== 'system' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "flex items-center space-x-1 mt-2",
                  isOwn ? "flex-row-reverse space-x-reverse" : "flex-row"
                )}
              >
                {/* 表情反应 */}
                <div className="flex items-center space-x-1">
                  {emojiReactions.slice(0, 3).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className="w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xs transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* 回复按钮 */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReply(msg)}
                  className="w-6 h-6"
                >
                  <Reply className="w-3 h-3" />
                </Button>

                {/* 更多操作 */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  if (!currentUser) {
    return (
      <Card variant="glass" className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">请先登录以参与聊天</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="glass" className={cn("flex flex-col h-96", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>团购聊天</span>
          <span className="text-sm text-muted-foreground">
            ({chat?.participants.length || 0} 人在线)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">还没有消息，开始聊天吧！</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === currentUser.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 回复预览 */}
        {replyTo && (
          <div className="px-4 py-2 bg-secondary/30 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Reply className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  回复 {replyTo.sender.displayName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setReplyTo(null)}
                className="w-6 h-6"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-white truncate mt-1">
              {replyTo.content}
            </p>
          </div>
        )}

        {/* 输入区域 */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                className="w-full px-4 py-2 bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none text-white placeholder-muted-foreground"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
            >
              <Image className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* 表情选择器 */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 right-4 bg-secondary border border-white/10 rounded-lg p-3 shadow-xl"
              >
                <div className="grid grid-cols-6 gap-2">
                  {emojiReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setMessage(message + emoji)
                        setShowEmojiPicker(false)
                      }}
                      className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

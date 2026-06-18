'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  ChevronLeft,
  Package,
  BadgeCheck,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Search,
  Paperclip,
  Camera,
  File,
  CheckCheck,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useChatStore, useAuthStore, Conversation } from '@/lib/store';
import { formatTZS, formatRelativeTime } from '@/lib/data';
import { cn } from '@/lib/utils';

// Emoji data - common emojis grouped by category
const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😛', '🤔', '🤗', '🤩', '😎'],
  'Gestures': ['👍', '👎', '👌', '✌️', '🤝', '👏', '🙌', '🤲', '👐', '🤟', '🤙', '👋', '🖐️', '✋', '🖖', '💪', '🙏', '☝️', '👆', '👇'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💝', '💘', '💗', '💓', '💞', '💕', '💔', '❣️', '💟', '♥️'],
  'Objects': ['💰', '💵', '💴', '💶', '💷', '💳', '📱', '💻', '⌚', '📷', '🎁', '🛒', '📦', '🏷️', '🔖', '📍', '✅', '❌', '⭐', '🔥'],
  'Transport': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '✈️', '🚀', '🛸'],
};

// Image preview component
function ImagePreview({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative inline-block mr-2 mb-2">
      <img src={src} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-border" />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// Emoji Picker Component
function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('Smileys');

  return (
    <div className="w-72">
      {/* Category tabs */}
      <div className="flex border-b border-border overflow-x-auto pb-1 mb-2 gap-1">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors',
              activeCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(emoji)}
            className="h-8 w-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    isOpen,
    setActiveConversation,
    addMessage,
    closeChat,
    getTotalUnread,
  } = useChatStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, scrollToBottom]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        closeChat();
      }
    };

    if (isOpen) {
      // Add a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, closeChat]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachedImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    setIsAttachmentOpen(false);
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && attachedImages.length === 0) || !activeConversationId || !user) return;

    // Build message content with images
    let content = message.trim();
    if (attachedImages.length > 0) {
      content = attachedImages.map((img) => `[IMAGE:${img}]`).join('') + (content ? `\n${content}` : '');
    }

    addMessage(activeConversationId, {
      senderId: user.id,
      content: content,
    });
    setMessage('');
    setAttachedImages([]);
  };

  const totalUnread = getTotalUnread();

  // Parse message content to render images
  const renderMessageContent = (content: string) => {
    const imageRegex = /\[IMAGE:(data:image\/[^;]+;base64,[^\]]+)\]/g;
    const parts: (string | { type: 'image'; src: string })[] = [];
    let lastIndex = 0;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push({ type: 'image', src: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return (
      <div>
        {parts.map((part, idx) => {
          if (typeof part === 'string') {
            return <span key={idx}>{part}</span>;
          }
          return (
            <img
              key={idx}
              src={part.src}
              alt="Shared image"
              className="max-w-full rounded-lg mt-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(part.src, '_blank')}
            />
          );
        })}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => useChatStore.getState().toggleChat()}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        {mounted && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div 
      ref={chatContainerRef}
      className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          {activeConversation ? (
            <>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.id === activeConversation.buyerId ? (activeConversation.sellerAvatar?.startsWith('iVBOR') ? 'data:image/png;base64,' + activeConversation.sellerAvatar : activeConversation.sellerAvatar) : (activeConversation.buyerAvatar?.startsWith('iVBOR') ? 'data:image/png;base64,' + activeConversation.buyerAvatar : activeConversation.buyerAvatar)} />

                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user?.id === activeConversation.buyerId
                          ? activeConversation.sellerName.charAt(0)
                          : activeConversation.buyerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-[15px]">
                        {user?.id === activeConversation.buyerId
                          ? activeConversation.sellerName
                          : activeConversation.buyerName}
                      </span>
                      {activeConversation.sellerVerified && user?.id === activeConversation.buyerId && (
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                      <Package className="w-3 h-3" />
                      {activeConversation.productTitle}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeChat}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-semibold">Messages</span>
                {mounted && totalUnread > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {totalUnread}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeChat}>
                <X className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {activeConversation ? (
          <>
            {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {activeConversation.messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Start the conversation about this item
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['Is this still available?', 'What is the lowest price?', 'Can I see more photos?'].map((quick) => (
                    <Button
                      key={quick}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setMessage(quick)}
                    >
                      {quick}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConversation.messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          isOwn
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        )}
                      >
                        <div className="text-sm">{renderMessageContent(msg.content)}</div>
                        <div
                          className={cn(
                            'flex items-center justify-end gap-1 mt-1',
                            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}
                        >
                          <span className="text-[10px]">
                            {formatRelativeTime(msg.createdAt)}
                          </span>
                          {isOwn && (
                            msg.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-400" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Image preview area */}
          {attachedImages.length > 0 && (
            <div className="px-3 pt-2 flex flex-wrap">
              {attachedImages.map((img, idx) => (
                <ImagePreview key={idx} src={img} onRemove={() => handleRemoveImage(idx)} />
              ))}
            </div>
          )}

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border">
            <div className="flex items-center gap-2">
              {/* Attachment button */}
              <Popover open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" side="top" align="start">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      Photo Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <Camera className="h-4 w-4 text-green-500" />
                      Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      <File className="h-4 w-4 text-orange-500" />
                      Document
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Emoji button */}
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <Smile className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" side="top" align="start">
                  <EmojiPicker onSelect={handleEmojiSelect} />
                </PopoverContent>
              </Popover>

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-10"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 shrink-0"
                disabled={!message.trim() && attachedImages.length === 0}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Conversations list */}
          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation with a seller by clicking &quot;Start Chat&quot; on any product
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    currentUserId={user?.id}
                    onClick={() => setActiveConversation(conv.id)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
}

function ConversationItem({
  conversation,
  currentUserId,
  onClick,
}: {
  conversation: Conversation;
  currentUserId?: string;
  onClick: () => void;
}) {
  const otherPartyName =
    currentUserId === conversation.buyerId
      ? conversation.sellerName
      : conversation.buyerName;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary">
            {otherPartyName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1">
            <span className="font-medium truncate">{otherPartyName}</span>
            {conversation.sellerVerified && currentUserId === conversation.buyerId && (
              <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
            )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {conversation.lastMessageAt
              ? formatRelativeTime(conversation.lastMessageAt)
              : formatRelativeTime(conversation.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1">
          {conversation.productTitle}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage?.includes('[IMAGE:') 
              ? '📷 Photo' 
              : conversation.lastMessage || 'No messages yet'}
          </p>
          {conversation.messages.filter(m => !m.isRead && m.senderId !== currentUserId).length > 0 && (
            <span className="h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center shrink-0">
              {conversation.messages.filter(m => !m.isRead && m.senderId !== currentUserId).length}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

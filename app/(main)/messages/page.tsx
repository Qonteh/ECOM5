"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  ImageIcon,
  Smile,
  Package,
  BadgeCheck,
  ArrowLeft,
  Trash2,
  Flag,
  Archive,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore, useAuthStore, Conversation } from "@/lib/store";
import { formatTZS, formatRelativeTime } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    addMessage,
    markAsRead,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileConversationOpen, setIsMobileConversationOpen] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (activeConversationId) {
      markAsRead(activeConversationId);
    }
  }, [activeConversationId, markAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConversationId || !user) return;

    addMessage(activeConversationId, {
      senderId: user.id,
      content: message.trim(),
    });
    setMessage("");
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    setIsMobileConversationOpen(true);
  };

  const handleBackToList = () => {
    setIsMobileConversationOpen(false);
    setActiveConversation(null);
  };

  const quickReplies = [
    "Is this still available?",
    "What is the lowest price?",
    "Can I see more photos?",
    "Where are you located?",
    "When can I pick it up?",
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-background">
      {/* Conversations List */}
      <div
        className={cn(
          "w-full md:w-96 border-r border-border flex flex-col",
          isMobileConversationOpen && "hidden md:flex",
        )}
      >
        {/* List Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Messages
            </h1>
            <Badge variant="secondary">{conversations.length}</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-4 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start chatting with sellers by clicking &quot;Start Chat&quot;
                on any product
              </p>
              <Link href="/">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  currentUserId={user?.id}
                  isActive={conv.id === activeConversationId}
                  onClick={() => handleSelectConversation(conv.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !isMobileConversationOpen && "hidden md:flex",
        )}
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          user?.id === activeConversation.buyerId
                            ? activeConversation.sellerAvatar?.startsWith(
                                "iVBOR",
                              )
                              ? "data:image/png;base64," +
                                activeConversation.sellerAvatar
                              : activeConversation.sellerAvatar
                            : activeConversation.buyerAvatar?.startsWith(
                                  "iVBOR",
                                )
                              ? "data:image/png;base64," +
                                activeConversation.buyerAvatar
                              : activeConversation.buyerAvatar
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {user?.id === activeConversation.buyerId
                          ? activeConversation.sellerName.charAt(0)
                          : activeConversation.buyerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {user?.id === activeConversation.buyerId
                          ? activeConversation.sellerName
                          : activeConversation.buyerName}
                      </span>
                      {activeConversation.sellerVerified &&
                        user?.id === activeConversation.buyerId && (
                          <BadgeCheck className="w-5 h-5 text-primary" />
                        )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                      <span className="text-green-500 font-medium mr-3">
                        Online
                      </span>
                      <span className="flex items-center gap-1 border-l border-border/50 pl-3">
                        <Package className="w-3.5 h-3.5" />
                        <Link
                          href={`/product/`}
                          className="hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[300px]"
                        >
                          {activeConversation.productTitle}
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex text-muted-foreground"
                >
                  <Phone className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex text-muted-foreground"
                >
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href={`/product/`}
                        className="flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" />
                        View Product
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive Chat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Flag className="w-4 h-4 mr-2" />
                      Report User
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {activeConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">
                    {user?.id === activeConversation.buyerId
                      ? "Start the conversation"
                      : "No messages yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    {user?.id === activeConversation.buyerId
                      ? "Ask the seller about this product. Use quick replies below to get started."
                      : "Waiting for the buyer to send the first message."}
                  </p>
                  {user?.id === activeConversation.buyerId && (
                    <div className="flex flex-wrap justify-center gap-2 max-w-md">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          onClick={() => setMessage(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Date separator */}
                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground px-2">
                      {new Date(
                        activeConversation.createdAt,
                      ).toLocaleDateString()}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {activeConversation.messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm",
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content}
                          </p>
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 mt-1",
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            <span className="text-[10px]">
                              {formatRelativeTime(msg.createdAt)}
                            </span>
                            {isOwn && msg.isRead && (
                              <CheckCheck className="w-3 h-3" />
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

            {/* Quick Replies */}
            {activeConversation.messages.length > 0 &&
              user?.id === activeConversation.buyerId && (
                <div className="px-4 py-2 border-t border-border bg-muted/20">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2">
                      {quickReplies.slice(0, 3).map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-xs"
                          onClick={() => setMessage(reply)}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border bg-background"
            >
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="icon">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!message.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageCircle className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Select a conversation
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Choose a conversation from the list to start messaging or browse
              products to start a new chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationListItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  currentUserId?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const otherPartyName =
    currentUserId === conversation.buyerId
      ? conversation.sellerName
      : conversation.buyerName;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
        isActive && "bg-primary/5 border-l-2 border-primary",
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={
              currentUserId === conversation.buyerId
                ? conversation.sellerAvatar?.startsWith("iVBOR")
                  ? "data:image/png;base64," + conversation.sellerAvatar
                  : conversation.sellerAvatar
                : conversation.buyerAvatar?.startsWith("iVBOR")
                  ? "data:image/png;base64," + conversation.buyerAvatar
                  : conversation.buyerAvatar
            }
          />

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
            {conversation.sellerVerified &&
              currentUserId === conversation.buyerId && (
                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
              )}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {conversation.lastMessageAt
              ? formatRelativeTime(conversation.lastMessageAt)
              : formatRelativeTime(conversation.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1 flex items-center gap-1">
          {conversation.productImage ? (
            <img
              src={
                conversation.productImage.startsWith("iVBOR")
                  ? `data:image/jpeg;base64,`
                  : conversation.productImage
              }
              alt=""
              className="w-4 h-4 object-cover rounded-sm"
            />
          ) : (
            <Package className="w-3 h-3 shrink-0" />
          )}
          {conversation.productTitle}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage || "No messages yet"}
          </p>
          {conversation.messages.filter(
            (m) => !m.isRead && m.senderId !== currentUserId,
          ).length > 0 && (
            <span className="h-5 min-w-5 px-1.5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center shrink-0">
              {
                conversation.messages.filter(
                  (m) => !m.isRead && m.senderId !== currentUserId,
                ).length
              }
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

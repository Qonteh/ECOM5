'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsDropdown() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/notifications?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await fetch(`/api/notifications?user_id=${user.id}`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.is_read ? 'bg-primary/5' : ''}`}
                onClick={() => {
                  if (!notification.is_read) markAsRead(notification.id);
                  // Optional: route to specific page based on type
                }}
              >
                <div className="flex w-full justify-between items-start gap-2">
                  <span className="font-medium text-sm">{notification.title}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 w-full whitespace-normal">
                  {notification.content}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

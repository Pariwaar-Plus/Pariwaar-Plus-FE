import { Badge } from "@/components/reui/badge"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BellIcon, BellOff } from 'lucide-react'
import { useState } from "react"
import { getNotifications, markAllNotificationsAsRead, updateNotification } from "./api/notification.api"

function getTimeAgo(date: Date | string | number): string {
  const past = new Date(date).getTime();
  const now = Date.now();
  const secondsAgo = Math.floor((now - past) / 1000);

  if (secondsAgo < 5) {
    return 'Just now';
  } else if (secondsAgo < 60) {
    return `${secondsAgo} secs ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} min${minutesAgo > 1 ? 's' : ''} ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hr${hoursAgo > 1 ? 's' : ''} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
}


export function NotificationLoading() {
  return (
    <div className="flex flex-col gap-3 p-4 w-[320px]">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 animate-pulse"
        >
          <div className="h-9 w-9 rounded-full bg-muted" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoNotifications() {
  return (
    <div className="flex w-[320px] flex-col items-center justify-center gap-2 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <BellOff className="h-6 w-6 text-muted-foreground" />
      </div>

      <div>
        <p className="font-medium">No notifications</p>
        <p className="text-sm text-muted-foreground">
          You're all caught up!
        </p>
      </div>
    </div>
  );
}

export function NotificationBell({ notificationCount }: { notificationCount: number }) {

  const [open, setOpen] = useState(false);

  const {
    data: notifications,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: false,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: string) => updateNotification(id, { hasRead: true }),
    onSuccess: () => refetch(),
  });

  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => refetch(),
  });


  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      await refetch();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Notifications" >
            <BellIcon aria-hidden="true" className="w-4 h-4" />
            <Badge
              variant="destructive"
              size="sm"
              className="absolute -top-1.5 -right-2 rounded-full px-1"
              aria-hidden="true"
            >
              {notificationCount}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {(notifications && notifications?.length > 0) &&
                <button className="text-foreground text-xs font-normal underline-offset-2 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                >
                  Mark all as read
                </button>}

            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isLoading ? (
                <NotificationLoading />
              ) : notifications?.length === 0 ? (
                <NoNotifications />
              ) : (
                notifications?.map((notification) => (
                  <DropdownMenuLabel key={notification.id}>
                    <div className="flex flex-1 items-start justify-between gap-2">
                      <div className="flex flex-col gap-px min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {notification.content}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {!notification.hasRead && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="mt-1 shrink-0 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          aria-label="Mark as read"
                        >
                          <span className="bg-primary block size-1.5 rounded-full" />
                        </button>
                      )}
                    </div>
                  </DropdownMenuLabel>
                ))
              )}
            </DropdownMenuGroup>

          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

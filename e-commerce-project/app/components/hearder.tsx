
"use client"

import "./styles/header1.css"
import Link from "next/link"
import { useCart } from "../context/cartContext"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { signOut } from "@/lib/actions/auth-actios"
import { useEffect, useState } from "react"

type Notification = {
  id: number
  title: string
  message: string
  type: string
  isRead: boolean
  entityType: string | null
  entityId: string | null
  createdAt: string
}

export default function Hearder() {
  const path = usePathname()
  const exclude = path === "/createProduct"
  const login = path === "/login"

  if (!exclude && !login) {
    return (
      <nav className="navigation-bar">
        <LeftNav />
        <MiddleNav />
        <RightNav />
      </nav>
    )
  }

  return <></>
}

function LeftNav() {
  return (
    <menu className="left">
      <h4>
        <Link href="/">
          <Image
            width={90}
            height={80}
            src="/images/logo.png"
            alt="img"
            className="logo"
          />
          market
        </Link>
      </h4>
    </menu>
  )
}

function CartIcon({ size = 24, color = "currentColor" }) {
  const { cart }: { cart: any[] } = useCart()

  let totalCount = 0

  cart.forEach((x: any) => {
    totalCount += Number(x.quantity)
  })

  return (
    <Link href="/cart" className="cart-link">
      <div className="Carticon">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" />
          <circle cx="9" cy="20" r="1.4" fill={color} stroke="none" />
          <circle cx="17" cy="20" r="1.4" fill={color} stroke="none" />
        </svg>

        {totalCount > 0 && (
          <div className="cart-count">{totalCount}</div>
        )}
      </div>
    </Link>
  )
}

function RightNav() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  async function loadNotifications() {
    try {
      setLoadingNotifications(true)

      const res = await fetch("/api/notifications", {
        method: "GET",
        cache: "no-store"
      })

      if (!res.ok) return

      const data = await res.json()

      setNotifications(
        Array.isArray(data.data) ? data.data : []
      )
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    function handleServiceWorkerMessage(event: MessageEvent) {
      const data = event.data

      if (!data || data.type !== "NEW_NOTIFICATION") {
        return
      }

      const notification = data.notification

      if (
        !notification ||
        typeof notification.id !== "number" ||
        typeof notification.title !== "string" ||
        typeof notification.message !== "string" ||
        typeof notification.type !== "string"
      ) {
        console.warn("Invalid notification received:", data)
        return
      }

      console.log("HEADER RECEIVED NOTIFICATION:", notification)

      setNotifications(previous => {
        if (
          previous.some(
            item => item.id === notification.id
          )
        ) {
          return previous
        }

        return [notification, ...previous]
      })
    }

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    )

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      )
    }
  }, [])

  async function openNotifications() {
    setNotificationsOpen(true)
    await loadNotifications()
  }

  const unreadCount = notifications.filter(
    notification => !notification.isRead
  ).length

  async function markAsRead(notification: Notification) {
    try {
      const res = await fetch(
        `/api/notifications/${notification.id}/read`,
        { method: "PATCH" }
      )

      if (!res.ok) return

      setNotifications(previous =>
        previous.map(item =>
          item.id === notification.id
            ? { ...item, isRead: true }
            : item
        )
      )
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      )
    }
  }

  function getNotificationDestination(
    notification: Notification
  ): string | null {
    if (!notification.entityType || !notification.entityId) {
      return null
    }

    switch (notification.entityType.toUpperCase()) {
      case "ORDER":
        return "/orders"

      case "SELLER_ORDER":
        return `/agent/orders/${notification.entityId}`

      case "BOOKING":
        return `/account/provider-bookings`
        

      case "PRODUCT":
        return `/product/${notification.entityId}`

      case "SERVICE":
        return `/service/${notification.entityId}`

      case "REVIEW":
        return `/reviews/${notification.entityId}`

      default:
        return null
    }
  }

  async function handleNotificationClick(
    notification: Notification
  ) {
    if (!notification.isRead) {
      await markAsRead(notification)
    }

    setNotificationsOpen(false)

    const destination =
      getNotificationDestination(notification)

    if (destination) {
      router.push(destination)
    }
  }

  async function markAllAsRead() {
    try {
      const res = await fetch(
        "/api/notifications/read-all",
        { method: "PATCH" }
      )

      if (!res.ok) return

      setNotifications(previous =>
        previous.map(notification => ({
          ...notification,
          isRead: true
        }))
      )
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      )
    }
  }

  return (
    <>
      <div className="right">
        <Link
          href="/account"
          className="profile-link"
          aria-label="Profile"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </Link>

        <button
          type="button"
          className="sign"
          onClick={() => signOut()}
        >
          sign out
        </button>

        <span>|</span>

        <Link className="orders" href="/orders">
          orders
        </Link>

        <span>|</span>

        <button
          type="button"
          className="notificationIcon"
          onClick={openNotifications}
          aria-label="Open notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 24c1.326 0 2.402-1.077 2.402-2.402h-4.804c0 1.325 1.076 2.402 2.402 2.402zm6.364-6v-5c0-3.072-1.639-5.64-4.5-6.32V6a1.864 1.864 0 10-3.728 0v.68C7.275 7.36 5.636 9.928 5.636 13v5l-1.636 1.636V21h16v-1.364L18.364 18z" />
          </svg>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <span>|</span>

        <CartIcon />
      </div>

      {notificationsOpen && (
        <div
          className="notification-overlay"
          onClick={() => setNotificationsOpen(false)}
        />
      )}

      <aside
        className={`notification-drawer ${
          notificationsOpen
            ? "notification-drawer-open"
            : ""
        }`}
      >
        <div className="notification-header">
          <div>
            <h2>Notifications</h2>

            <p>
              {unreadCount === 0
                ? "You're all caught up"
                : `You have ${unreadCount} new ${
                    unreadCount === 1
                      ? "notification"
                      : "notifications"
                  }`}
            </p>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={() => setNotificationsOpen(false)}
            aria-label="Close notifications"
          >
            ×
          </button>
        </div>

        <div className="notification-list">
          {loadingNotifications ? (
            <div className="notification-empty">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">✓</div>
              <h3>No notifications</h3>
              <p>You're all caught up.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
                onClick={() =>
                  handleNotificationClick(notification)
                }
              >
                <div
                  className={`notification-icon-box ${getNotificationIconClass(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span>
                    {formatNotificationDate(
                      notification.createdAt
                    )}
                  </span>
                </div>

                {!notification.isRead && (
                  <div className="notification-dot" />
                )}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notification-footer">
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function getNotificationIcon(type: string) {
  switch (type.toUpperCase()) {
    case "ORDER":
      return "🛒"
    case "PAYMENT":
      return "✓"
    case "DELIVERY":
      return "📦"
    case "PROMOTION":
      return "%"
    case "BOOKING":
      return "📅"
    case "SERVICE":
      return "🔧"
    case "SYSTEM":
      return "ℹ"
    default:
      return "🔔"
  }
}

function getNotificationIconClass(type: string) {
  switch (type.toUpperCase()) {
    case "ORDER":
      return "order"
    case "PAYMENT":
      return "success"
    case "DELIVERY":
      return "delivery"
    case "PROMOTION":
      return "promo"
    case "BOOKING":
      return "booking"
    case "SERVICE":
      return "service"
    case "SYSTEM":
      return "system"
    default:
      return "default"
  }
}

function formatNotificationDate(date: string) {
  const notificationDate = new Date(date)
  const now = new Date()
  const difference =
    now.getTime() - notificationDate.getTime()

  const seconds = Math.floor(difference / 1000)

  if (seconds < 60) return "Just now"

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`
  }

  const days = Math.floor(hours / 24)

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`
  }

  return notificationDate.toLocaleDateString()
}

function MiddleNav() {
  return (
    <div className="middle">
      <div className="search-box">
        <SearchInput
          placeholder="    search products"
          id="search-input"
        />
        <span id="search-icon">🔍</span>
      </div>
    </div>
  )
}

function SearchInput(props: {
  placeholder: string
  id: string
}) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      id={props.id}
    />
  )
}
 
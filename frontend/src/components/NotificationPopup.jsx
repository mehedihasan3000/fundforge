"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Bell } from "@gravity-ui/icons";
import Link from "next/link";

export default function NotificationPopup() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    api.get("/api/notifications").then(setNotifications).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold text-sm">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n._id}
                href={n.actionRoute || "#"}
                onClick={() => setOpen(false)}
                className="block p-3 border-b last:border-0 hover:bg-gray-50"
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.time).toLocaleString()}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

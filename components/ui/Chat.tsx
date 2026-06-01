
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
  ChannelList,
  useChannelStateContext,
} from "stream-chat-react";
import { useUser } from "@clerk/nextjs";
import {
  Loader2,
  MessageSquare,
  Search,
  ArrowLeft,
  MoreVertical,
  Plus,
  Lock,
} from "lucide-react";

import "stream-chat-react/dist/css/v2/index.css";
import "./chat.css";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

// ---------------------------------------------------------------------------
// Custom Channel Header — WhatsApp style
// ---------------------------------------------------------------------------
function CustomChannelHeader({ onBack }: { onBack?: () => void }) {
  const { channel } = useChannelStateContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const memberCount = Object.keys(channel.state.members || {}).length;
  const channelName =
    (channel.data as any)?.name || channel.id?.replace(/-/g, " ") || "Chat";

  // Build member names string (WhatsApp-style)
  const memberNames = Object.values(channel.state.members || {})
    .map((m: any) => m.user?.name || m.user?.id || "Unknown")
    .slice(0, 4)
    .join(", ");
  const subtitle =
    memberCount > 4
      ? `${memberNames} +${memberCount - 4} more`
      : memberNames || `${memberCount} members`;

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="chat-channel-header">
      {/* Back arrow — visible only on mobile */}
      {onBack && (
        <button
          onClick={onBack}
          className="chat-back-btn"
          aria-label="Back to chat list"
        >
          <ArrowLeft size={20} />
          <span>Chats</span>
        </button>
      )}

      {/* Avatar */}
      <div className="chat-avatar-circle">
        {channelName.charAt(0).toUpperCase()}
      </div>

      {/* Name + subtitle */}
      <div className="chat-header-info">
        <h3 className="chat-header-title">{channelName}</h3>
        <p className="chat-header-subtitle">{subtitle}</p>
      </div>

      {/* Action icons — WhatsApp style */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Chat Component
// ---------------------------------------------------------------------------
export default function ChatComponent({
  role,
}: {
  role?: "STUDENT" | "FACULTY" | "ADMIN";
}) {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(
    null,
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const sidebarMenuRef = useRef<HTMLDivElement>(null);

  const initChat = useCallback(async () => {
    if (!user || !isLoaded) return;

    try {
      const res = await fetch("/api/stream-token", { method: "POST" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const { token } = await res.json();
      if (!token) throw new Error("No token received from server");

      const chatClient = StreamChat.getInstance(API_KEY);

      if (chatClient.userID && chatClient.userID !== user.id) {
        await chatClient.disconnectUser();
      }

      if (!chatClient.userID) {
        await chatClient.connectUser(
          {
            id: user.id,
            name:
              user.fullName ||
              user.firstName ||
              user.emailAddresses[0]?.emailAddress ||
              "User",
            image: user.imageUrl,
          },
          token,
        );
      }

      setClient(chatClient);
      setError(null);
    } catch (err: any) {
      console.error("[Chat] init error:", err);
      setError(err.message || "Failed to connect to chat");
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (isLoaded && user) {
      initChat();
    }
  }, [user?.id, isLoaded, initChat]);

  // Close sidebar menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(e.target as Node)
      ) {
        setSidebarMenuOpen(false);
      }
    }
    if (sidebarMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sidebarMenuOpen]);

  // ── Guards ──
  if (!isLoaded) return <ChatLoader text="Loading..." />;

  if (!user) {
    return (
      <div className="chat-error-state">
        <MessageSquare size={48} className="text-[#3B9EFF] opacity-50" />
        <p className="text-[#8BA0BF]">Please sign in to use chat.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-error-state">
        <div className="chat-error-icon">⚠️</div>
        <p className="chat-error-title">Chat Connection Failed</p>
        <p className="chat-error-msg">{error}</p>
        <button onClick={initChat} className="chat-retry-btn">
          Retry Connection
        </button>
      </div>
    );
  }

  if (!client) return <ChatLoader text="Connecting to Chat..." />;

  const filters = { type: "messaging", members: { $in: [user.id] } };
  const sort = { last_message_at: -1 } as const;

  // ── Render ──
  return (
    <div className="chat-wrapper">
      <Chat client={client} theme="str-chat__theme-dark">
        {/* ═══ LEFT SIDEBAR — Conversation List ═══ */}
        <div
          className={`chat-sidebar ${!showSidebar ? "chat-sidebar-hidden" : ""}`}
        >
          {/* ── WhatsApp-style Sidebar Header ── */}
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-avatar">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="You" />
              ) : (
                <span>{(user.fullName || "U").charAt(0)}</span>
              )}
            </div>

            <div className="chat-sidebar-user-info">
              <p className="chat-sidebar-name">
                {user.fullName || user.firstName || "You"}
              </p>
              <p className="chat-sidebar-role">{role || "Member"}</p>
            </div>

            {/* Action buttons — WhatsApp style */}
            <div className="chat-sidebar-actions">
              <div className="chat-dropdown-wrapper" ref={sidebarMenuRef}>
                <div
                  className={`chat-dropdown-menu ${sidebarMenuOpen ? "open" : ""}`}
                >
                  <button
                    className="chat-dropdown-item"
                    onClick={() => setSidebarMenuOpen(false)}
                  >
                    New group
                  </button>
                  <button
                    className="chat-dropdown-item"
                    onClick={() => setSidebarMenuOpen(false)}
                  >
                    Starred messages
                  </button>
                  <button
                    className="chat-dropdown-item"
                    onClick={() => setSidebarMenuOpen(false)}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Search ── */}

          {/* ── Channel List ── */}
          <div className="chat-channel-list-wrap">
            <ChannelList
              filters={filters}
              sort={sort}
              Preview={(previewProps) => (
                <CustomChannelPreview
                  {...previewProps}
                  activeChannelId={activeChannel?.id}
                  onSelect={(ch: StreamChannel) => {
                    setActiveChannel(ch);
                    setShowSidebar(false);
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* ═══ RIGHT PANEL — Active Chat ═══ */}
        <div
          className={`chat-main ${showSidebar ? "chat-main-hidden-mobile" : ""}`}
        >
          {activeChannel ? (
            <Channel channel={activeChannel as any}>
              <Window>
                <CustomChannelHeader
                  onBack={() => {
                    setActiveChannel(null);
                    setShowSidebar(true);
                  }}
                />
                <div className="chat-message-list-wrap">
                  <MessageList />
                </div>
                <div className="chat-input-wrap">
                  <MessageInput focus />
                </div>
              </Window>
            </Channel>
          ) : (
            /* WhatsApp empty landing screen */
            <div className="chat-empty-state">
              <div className="chat-empty-icon-circle">
                <MessageSquare
                  size={80}
                  strokeWidth={1}
                  className="text-[#3B9EFF] opacity-20"
                />
              </div>
              <h2 className="chat-empty-title">Projexia Communication Hub</h2>
              <p className="chat-empty-desc">
                Send and receive messages with your project team, faculty, and
                administrators. Select a conversation from the sidebar to get
                started.
              </p>
              <div className="chat-empty-divider" />
              <div className="chat-empty-encryption">
                <Lock size={12} />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          )}
        </div>
      </Chat>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Channel Preview — WhatsApp conversation row
// ---------------------------------------------------------------------------
function CustomChannelPreview({
  channel,
  latestMessage,
  onSelect,
  activeChannelId,
}: {
  channel: StreamChannel;
  latestMessage?: any;
  onSelect?: (ch: StreamChannel) => void;
  activeChannelId?: string;
}) {
  const channelName =
    (channel.data as any)?.name || channel.id?.replace(/_/g, " ") || "Channel";

  const unread = channel.countUnread();
  const lastMsg: string = latestMessage?.text || "No messages yet";

  const rawDate = channel.lastMessage()?.created_at;
  let lastTime = "";
  if (rawDate) {
    const msgDate = new Date(rawDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (isSameDay(msgDate, today)) {
      lastTime = msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isSameDay(msgDate, yesterday)) {
      lastTime = "Yesterday";
    } else {
      lastTime = msgDate.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  }

  const isActive = channel.id === activeChannelId;

  return (
    <div
      className={`chat-preview-item ${isActive ? "active" : ""}`}
      onClick={() => onSelect?.(channel)}
    >
      <div className="chat-preview-avatar">
        {channelName.charAt(0).toUpperCase()}
      </div>
      <div className="chat-preview-content">
        <div className="chat-preview-top">
          <span className="chat-preview-name">{channelName}</span>
          <span
            className={`chat-preview-time ${unread > 0 ? "has-unread" : ""}`}
          >
            {lastTime}
          </span>
        </div>
        <div className="chat-preview-bottom">
          <span className="chat-preview-msg">{lastMsg}</span>
          {unread > 0 && <span className="chat-preview-badge">{unread}</span>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loader helper
// ---------------------------------------------------------------------------
function ChatLoader({ text }: { text: string }) {
  return (
    <div className="chat-loader">
      <Loader2 className="w-10 h-10 animate-spin text-[#3B9EFF]" />
      <span className="text-[#8BA0BF] text-sm">{text}</span>
    </div>
  );
}

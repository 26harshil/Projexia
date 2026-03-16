"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Loader2, MessageSquare, Users, Search, ArrowLeft } from "lucide-react";

import "stream-chat-react/dist/css/v2/index.css";
import "./chat.css";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

// ---------------------------------------------------------------------------
// Custom Channel Header
// ---------------------------------------------------------------------------
function CustomChannelHeader({ onBack }: { onBack?: () => void }) {
  const { channel } = useChannelStateContext();
  const memberCount = Object.keys(channel.state.members || {}).length;
  const channelName =
    (channel.data as any)?.name || channel.id?.replace(/-/g, " ") || "Chat";

  return (
    <div className="chat-channel-header">
      {onBack && (
        <button onClick={onBack} className="chat-back-btn md:hidden">
          <ArrowLeft size={20} />
        </button>
      )}
      <div className="chat-avatar-circle">
        {channelName.charAt(0).toUpperCase()}
      </div>
      <div className="chat-header-info">
        <h3 className="chat-header-title">{channelName}</h3>
        <p className="chat-header-subtitle">{memberCount} members</p>
      </div>
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

  const initChat = useCallback(async () => {
    if (!user || !isLoaded) return;

    try {
      // Step 1 — get a server-signed token (server-only, uses API secret)
      const res = await fetch("/api/stream-token", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const { token } = await res.json();
      if (!token) throw new Error("No token received from server");

      // Step 2 — get (or reuse) the singleton client with the PUBLIC api key
      const chatClient = StreamChat.getInstance(API_KEY);

      // If a different user was previously connected, disconnect first
      if (chatClient.userID && chatClient.userID !== user.id) {
        await chatClient.disconnectUser();
      }

      // Step 3 — connect the user with the server-signed token
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
    // Do NOT disconnect on unmount — preserve connection across navigation
  }, [user?.id, isLoaded, initChat]);

  // -------------------------------------------------------------------------
  // Guard renders
  // -------------------------------------------------------------------------
  if (!isLoaded) return <ChatLoader text="Loading..." />;

  if (!user) {
    return (
      <div className="chat-error-state">
        <MessageSquare size={48} className="text-[#3B9EFF] opacity-50" />
        <p>Please sign in to use chat.</p>
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

  // Show only channels this user is a member of (general-hub + project groups)
  const filters = { type: "messaging", members: { $in: [user.id] } };
  const sort = { last_message_at: -1 } as const;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="chat-wrapper">
      <Chat client={client} theme="str-chat__theme-dark">
        {/* ── Left Sidebar ── */}
        <div
          className={`chat-sidebar ${!showSidebar ? "chat-sidebar-hidden" : ""}`}
        >
          {/* Sidebar Header */}
          <div className="chat-sidebar-header">
            <div className="chat-sidebar-avatar">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="You"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(user.fullName || "U").charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="chat-sidebar-name">
                {user.fullName || user.firstName || "You"}
              </p>
              <p className="chat-sidebar-role">{role || "Member"}</p>
            </div>
            <div className="chat-online-dot" />
          </div>

          {/* Search Bar */}
          <div className="chat-search-bar">
            <Search size={16} className="chat-search-icon" />
            <input
              type="text"
              placeholder="Search chats..."
              className="chat-search-input"
            />
          </div>

          {/* Section label */}
          <div className="chat-section-label">
            <Users size={14} />
            <span>Your Group Chats</span>
          </div>

          {/* Channel List */}
          <div className="chat-channel-list-wrap">
            <ChannelList
              filters={filters}
              sort={sort}
              Preview={(previewProps) => (
                <CustomChannelPreview
                  {...previewProps}
                  onSelect={(ch: StreamChannel) => {
                    setActiveChannel(ch);
                    setShowSidebar(false);
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div
          className={`chat-main ${showSidebar ? "chat-main-hidden-mobile" : ""}`}
        >
          {activeChannel ? (
            <Channel channel={activeChannel as any}>
              <Window>
                <CustomChannelHeader onBack={() => setShowSidebar(true)} />
                <div className="chat-message-list-wrap">
                  <MessageList />
                </div>
                <div className="chat-input-wrap">
                  <MessageInput focus />
                </div>
              </Window>
            </Channel>
          ) : (
            <div className="chat-empty-state">
              <MessageSquare size={48} className="text-[#3B9EFF] opacity-30" />
              <p className="text-[#8BA0BF] mt-3 text-sm">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </Chat>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom channel preview row — WhatsApp-style
// ---------------------------------------------------------------------------
function CustomChannelPreview({
  channel,
  latestMessage,
  onSelect,
}: {
  channel: StreamChannel;
  latestMessage?: any;
  onSelect?: (ch: StreamChannel) => void;
}) {
  const channelName =
    (channel.data as any)?.name || channel.id?.replace(/_/g, " ") || "Channel";

  const unread = channel.countUnread();
  const lastMsg: string = latestMessage?.text || "No messages yet";

  const rawDate = channel.lastMessage()?.created_at;
  const lastTime = rawDate
    ? new Date(rawDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <div className="chat-preview-item" onClick={() => onSelect?.(channel)}>
      <div className="chat-preview-avatar">
        {channelName.charAt(0).toUpperCase()}
      </div>
      <div className="chat-preview-content">
        <div className="chat-preview-top">
          <span className="chat-preview-name">{channelName}</span>
          <span className="chat-preview-time">{lastTime}</span>
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
      <span className="text-[#8BA0BF] mt-3 text-sm">{text}</span>
    </div>
  );
}

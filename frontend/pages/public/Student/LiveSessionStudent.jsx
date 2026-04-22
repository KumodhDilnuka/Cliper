import React, { useState, useEffect, useRef, useCallback } from "react";
import SidebarStudent from "../../../components/Sidebar_student";
import TopBar from "../../../components/TopBar";

const POLL_INTERVAL = 5000; // poll messages every 5 s

const LiveSessionStudent = () => {
  // ── room state ─────────────────────────────────────────────────────────────
  const [room, setRoom]               = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);

  // ── chat state ─────────────────────────────────────────────────────────────
  const [messages, setMessages]   = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending]     = useState(false);

  const chatBottomRef = useRef(null);
  const pollRef       = useRef(null);

  const token = localStorage.getItem("token");

  // ── fetch any active room ─────────────────────────────────────────────────
  const fetchActiveRoom = useCallback(async () => {
    try {
      const res  = await fetch("/api/rooms/active");
      const data = await res.json();
      if (data.success && data.rooms && data.rooms.length > 0) {
        setRoom(data.rooms[0]); // join the first active room
      } else {
        setRoom(null);
      }
    } catch {
      setRoom(null);
    } finally {
      setRoomLoading(false);
    }
  }, []);

  // ── fetch messages for a room ─────────────────────────────────────────────
  const fetchMessages = useCallback(async (roomId) => {
    try {
      const res  = await fetch(`/api/messages/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch {
      /* silently ignore */
    }
  }, [token]);

  // ── on mount: check for active room ──────────────────────────────────────
  useEffect(() => {
    fetchActiveRoom();
  }, [fetchActiveRoom]);

  // ── when room changes: load messages + start polling ──────────────────────
  useEffect(() => {
    if (!room) {
      clearInterval(pollRef.current);
      setMessages([]);
      return;
    }
    fetchMessages(room.roomId);
    pollRef.current = setInterval(() => fetchMessages(room.roomId), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [room, fetchMessages]);

  // ── auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!chatInput.trim() || !room) return;
    setSending(true);
    try {
      const res  = await fetch("/api/messages", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId: room.roomId, message: chatInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setChatInput("");
        fetchMessages(room.roomId);
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  // ── format time ───────────────────────────────────────────────────────────
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── helper: detect if a message belongs to "me" ──────────────────────────
  // We compare stored userId if available; fall back to senderType check
  const userId = (() => {
    try { return JSON.parse(atob(token.split(".")[1]))?.id; } catch { return null; }
  })();
  const isMe = (msg) =>
    userId ? msg.senderId === userId : false;

  // ── loading ───────────────────────────────────────────────────────────────
  if (roomLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <SidebarStudent />
        <div className="flex flex-col items-center gap-4 opacity-60">
          <span className="material-symbols-outlined text-5xl text-[#0040a1] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-[#424654]">Checking for live sessions…</p>
        </div>
      </div>
    );
  }

  // ── NO ACTIVE ROOM ────────────────────────────────────────────────────────
  if (!room) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] overflow-hidden font-['Inter']">
        <SidebarStudent />
        <div className="md:ml-64 min-h-screen">
          <TopBar mode="student" title="Academic Atelier" subtitle="Live Session" />

          <main className="pt-16 flex items-center justify-center min-h-screen pb-24 px-6">
            <div className="max-w-md w-full text-center">
              {/* Illustration */}
              <div className="relative mx-auto mb-8 w-44 h-44">
                <div className="absolute inset-0 rounded-full bg-[#f2f4f6] blur-2xl opacity-80" />
                <div className="relative w-44 h-44 rounded-full bg-[#eef1ff] flex items-center justify-center border border-[#c3c6d6]/20 shadow-sm">
                  <span className="material-symbols-outlined text-7xl text-[#c3c6d6]">
                    signal_disconnected
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight mb-3 text-[#191c1e]">
                No Session Right Now
              </h2>
              <p className="text-[#424654] text-sm leading-relaxed mb-6">
                You don't have an active session at this time.
                <br />
                Please ask your lecturer to create a new room to continue.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f2f4f6] border border-[#c3c6d6]/30 text-[#424654] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Waiting for a session to start…
              </div>

              <p className="mt-8 text-[11px] text-[#737785]">
                This page will show your session chat once a lecturer starts a room.
              </p>
            </div>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 md:hidden bg-white/85 backdrop-blur-md rounded-t-2xl shadow-[0px_-10px_30px_rgba(25,28,30,0.06)] border-t border-[#c3c6d6]/20">
          <a href="#" className="flex flex-col items-center justify-center text-[#424654]">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-[#424654]">
            <span className="material-symbols-outlined">info</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Hall Info</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-[#424654]">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </a>
        </nav>
      </div>
    );
  }

  // ── ACTIVE SESSION ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] overflow-hidden font-['Inter']">
      <SidebarStudent />

      <div className="md:ml-64 min-h-screen">
        <TopBar mode="student" title="Academic Atelier" subtitle="Live Session" />

        <main className="pt-16 pb-24 md:pb-6 h-screen flex flex-col bg-[#f8f9fb]">
          {/* Live Status Bar */}
          <div className="px-6 py-4 flex flex-wrap items-center justify-between bg-[#f2f4f6]/70 backdrop-blur-sm sticky top-16 z-30">
            <div className="flex flex-col">
              <h1 className="font-['Manrope'] text-lg font-extrabold tracking-tight text-[#191c1e]">
                {room.courseName}
              </h1>
              <p className="text-sm text-[#424654]">
                {room.hall} • Room {room.roomId}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <div className="flex items-center gap-2 bg-green-600/10 text-green-700 px-3 py-1.5 rounded-full ring-1 ring-green-600/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-bold tracking-wide uppercase">Session Live</span>
              </div>
            </div>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 opacity-50">
                <span className="material-symbols-outlined text-5xl text-[#c3c6d6]">chat</span>
                <p className="text-sm text-[#737785]">
                  No messages yet. Be the first to ask a question!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isLecturer =
                  msg.senderType === "lecturer" || msg.senderType === "admin";
                const isMine = isMe(msg);

                // Lecturer message
                if (isLecturer) {
                  return (
                    <div
                      key={msg._id}
                      className="flex items-end gap-3 max-w-[85%] self-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#dbe0e5] flex-shrink-0 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-sm text-[#5e6368]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          school
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="bg-[#dbe0e5] text-[#5e6368] px-5 py-3 rounded-t-xl rounded-br-xl rounded-bl-sm shadow-sm">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <span className="text-[10px] font-medium text-[#424654]/60 uppercase tracking-widest px-1">
                          {msg.senderName} • {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                }

                // My message
                if (isMine) {
                  return (
                    <div
                      key={msg._id}
                      className="flex items-end gap-3 max-w-[85%] self-end flex-row-reverse"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0056d2]/10 flex-shrink-0 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-sm text-[#0040a1]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          person
                        </span>
                      </div>
                      <div className="space-y-1 flex flex-col items-end">
                        <div className="bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white px-5 py-3 rounded-t-xl rounded-bl-xl rounded-br-sm shadow-sm">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <span className="text-[10px] font-medium text-[#424654]/60 uppercase tracking-widest px-1">
                          You • {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                }

                // Other student message
                return (
                  <div
                    key={msg._id}
                    className="flex items-end gap-3 max-w-[85%] self-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e6e8ea] flex-shrink-0 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-sm text-[#424654]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        person
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-[#f2f4f6] text-[#191c1e] px-5 py-3 rounded-t-xl rounded-br-xl rounded-bl-sm border border-[#c3c6d6]/20">
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#424654]/60 uppercase tracking-widest px-1">
                        {msg.senderName} • {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-[#f8f9fb]">
            <div className="max-w-4xl mx-auto relative">
              <div className="flex items-center gap-2 p-2 rounded-2xl shadow-[0px_10px_30px_rgba(25,28,30,0.06)] ring-1 ring-[#c3c6d6]/20 bg-white/85 backdrop-blur-md">
                <button className="p-2 text-[#424654] hover:bg-[#e6e8ea] rounded-xl transition-colors">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Ask something in ${room.courseName}…`}
                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm px-2 py-3 placeholder:text-[#737785]"
                />

                <button
                  onClick={handleSend}
                  disabled={sending || !chatInput.trim()}
                  className="bg-[#0040a1] text-white p-3 rounded-xl hover:opacity-90 transition-all active:scale-95 flex items-center justify-center disabled:opacity-40"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    send
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-center mt-3 text-[#424654]/50 uppercase tracking-widest">
                Live session • {room.hall} • Academic Atelier Platform
              </p>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 md:hidden bg-white/85 backdrop-blur-md rounded-t-2xl shadow-[0px_-10px_30px_rgba(25,28,30,0.06)] border-t border-[#c3c6d6]/20">
          <a
            href="#"
            className="flex flex-col items-center justify-center bg-[#0056D2] text-white rounded-xl px-4 py-1 scale-95 duration-150"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider">
              Chat
            </span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-[#424654]">
            <span className="material-symbols-outlined">info</span>
            <span className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider">
              Hall Info
            </span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center text-[#424654]">
            <span className="material-symbols-outlined">person</span>
            <span className="font-['Manrope'] text-[10px] font-bold uppercase tracking-wider">
              Profile
            </span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default LiveSessionStudent;
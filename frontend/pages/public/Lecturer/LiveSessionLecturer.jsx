import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LecturerSidebar from "../../../components/Sidebar_lec";
import TopBar from "../../../components/TopBar";
import CreateRoomModal from "../../../components/CreateRoomModal";

const POLL_INTERVAL = 5000; //pol time ms
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");

/* ── icon helper ──────────────────────────────────────────────────────────── */
const typeIcon = (type) => {
  switch (type) {
    case "pdf":   return "picture_as_pdf";
    case "image": return "image";
    case "doc":   return "description";
    case "ppt":   return "slideshow";
    case "sheet": return "table_chart";
    case "link":  return "link";
    default:      return "insert_drive_file";
  }
};

const LiveSessionLecturer = () => {
  const navigate = useNavigate();
  const { roomId: paramRoomId } = useParams();

  // ── room state ─────────────────────────────────────────────────────────────
  const [room, setRoom]               = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError]     = useState("");

  // ── chat state ─────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]       = useState("");
  const [sending, setSending]           = useState(false);
  const [clearing, setClearing]         = useState(false);

  // ── resource state ─────────────────────────────────────────────────────────
  const [resources, setResources]       = useState([]);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkName, setLinkName]         = useState("");
  const [linkUrl, setLinkUrl]           = useState("");
  const [addingLink, setAddingLink]     = useState(false);

  // ── modal state (create room) ──────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen]   = useState(false);

  const chatBottomRef = useRef(null);
  const pollRef       = useRef(null);
  const fileInputRef  = useRef(null);

  const token = localStorage.getItem("token");

  // ── fetch room ─────────────────────────────────────────────────────────────
  const fetchMyRoom = useCallback(async () => {
    try {
      if (paramRoomId) {
        const res  = await fetch(`${API}/api/rooms/${paramRoomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.room) {
          setRoom(data.room);
        } else {
          const res2  = await fetch(`${API}/api/rooms/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data2 = await res2.json();
          if (data2.success) {
            const found = data2.rooms.find((r) => r.roomId === paramRoomId);
            setRoom(found || null);
            if (!found) setRoomError(`Room "${paramRoomId}" not found.`);
          } else {
            setRoomError("Could not load the room.");
          }
        }
      } else {
        const res  = await fetch(`${API}/api/rooms/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const active = data.rooms.find((r) => r.status === "active" && r.isActive);
          setRoom(active || null);
        } else {
          setRoomError("Could not load your rooms.");
        }
      }
    } catch {
      setRoomError("Network error. Please try again.");
    } finally {
      setRoomLoading(false);
    }
  }, [token, paramRoomId]);

  // ── fetch messages ─────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (roomId) => {
    try {
      const res  = await fetch(`${API}/api/messages/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setChatMessages(data.messages);
    } catch { /* ignore */ }
  }, [token]);

  // ── fetch resources ────────────────────────────────────────────────────────
  const fetchResources = useCallback(async (roomId) => {
    try {
      const res  = await fetch(`${API}/api/resources/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setResources(data.resources);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchMyRoom(); }, [fetchMyRoom]);

  useEffect(() => {
    if (!room) {
      clearInterval(pollRef.current);
      setChatMessages([]);
      setResources([]);
      return;
    }
    fetchMessages(room.roomId);
    fetchResources(room.roomId);
    pollRef.current = setInterval(() => fetchMessages(room.roomId), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [room, fetchMessages, fetchResources]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── send message ───────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!chatInput.trim() || !room) return;
    setSending(true);
    try {
      const res  = await fetch(`${API}/api/messages`, {
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

  // ── clear chat ─────────────────────────────────────────────────────────────
  const handleClear = async () => {
    if (!room || !window.confirm("Clear all messages in this session?")) return;
    setClearing(true);
    try {
      await fetch(`${API}/api/messages/clear/${room.roomId}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatMessages([]);
    } catch { /* ignore */ }
    setClearing(false);
  };

  // ── upload file resource ───────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !room) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res  = await fetch(`${API}/api/resources/${room.roomId}/upload`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchResources(room.roomId);
      } else {
        setUploadError(data.message || "Upload failed");
      }
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      // reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── add link resource ──────────────────────────────────────────────────────
  const handleAddLink = async () => {
    if (!linkName.trim() || !linkUrl.trim() || !room) return;
    setAddingLink(true);
    try {
      const res  = await fetch(`${API}/api/resources/${room.roomId}/link`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ originalName: linkName.trim(), fileUrl: linkUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setShowLinkModal(false);
        setLinkName("");
        setLinkUrl("");
        fetchResources(room.roomId);
      }
    } catch { /* ignore */ }
    setAddingLink(false);
  };

  // ── delete resource ────────────────────────────────────────────────────────
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Remove this resource?")) return;
    try {
      await fetch(`${API}/api/resources/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch { /* ignore */ }
  };

  // ── open / download resource ───────────────────────────────────────────────
  const handleOpenResource = (resource) => {
    const url = resource.fileType === "link"
      ? resource.fileUrl
      : `${API}/uploads/resources/${resource.fileName}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── room created callback ──────────────────────────────────────────────────
  const handleRoomCreated = () => {
    setIsModalOpen(false);
    setRoomLoading(true);
    fetchMyRoom();
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (roomLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <LecturerSidebar onCreateRoom={() => setIsModalOpen(true)} />
        <div className="flex flex-col items-center gap-4 opacity-60">
          <span className="material-symbols-outlined text-5xl text-[#0040a1] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-[#424654]">Loading your session…</p>
        </div>
      </div>
    );
  }

  // ── NO ACTIVE ROOM ────────────────────────────────────────────────────────
  if (!room) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e]">
        <LecturerSidebar onCreateRoom={() => setIsModalOpen(true)} />
        <TopBar mode="lecturer" title="Academic Atelier" subtitle="Live Session" />
        <CreateRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRoomCreated={handleRoomCreated}
        />
        <main className="md:ml-64 pt-20 px-4 md:px-8 pb-24 md:pb-8 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full text-center">
            <div className="relative mx-auto mb-8 w-40 h-40">
              <div className="absolute inset-0 rounded-full bg-[#dae2ff] blur-2xl opacity-60" />
              <div className="relative w-40 h-40 rounded-full bg-[#eef1ff] flex items-center justify-center border border-[#c3c6d6]/20 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-[#0040a1]">sensors_off</span>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">No Active Session</h2>
            <p className="text-[#424654] text-sm leading-relaxed mb-8">
              You don't have a session running at this time.<br />
              Create a new room to start a live session with your students.
            </p>
            {roomError && <p className="text-red-500 text-xs mb-4">{roomError}</p>}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white text-sm font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.97] transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Create New Room
            </button>
            <p className="mt-6 text-[11px] text-[#737785]">
              Once you create a room, it will appear here automatically.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── ACTIVE ROOM ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <LecturerSidebar onCreateRoom={() => setIsModalOpen(true)} />
      <TopBar
        mode="lecturer"
        title="Academic Atelier"
        subtitle={`Session: ${room.courseName}`}
      />

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />

      {/* ── Hidden file input ──────────────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ── Link modal ─────────────────────────────────────────────────────── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#191c1e]/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h4 className="font-bold text-lg mb-4">Add External Link</h4>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#737785] mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="e.g. Economic Simulation Tool"
              className="w-full rounded-xl border border-[#c3c6d6] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0040a1]/20 mb-3"
            />
            <label className="block text-xs font-bold uppercase tracking-widest text-[#737785] mb-1">
              URL
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-[#c3c6d6] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0040a1]/20 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowLinkModal(false); setLinkName(""); setLinkUrl(""); }}
                className="flex-1 rounded-xl bg-[#e6e8ea] py-2 text-sm font-bold hover:bg-[#dbe0e5]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                disabled={addingLink || !linkName.trim() || !linkUrl.trim()}
                className="flex-1 rounded-xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
              >
                {addingLink ? "Adding…" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="md:ml-64 pt-20 px-4 md:px-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">

          {/* ── Top hero card ──────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-[#f2f4f6] rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#0040a1]/10 text-[#0040a1] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#0040a1] animate-pulse" />
                  Live Now
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                  {room.courseName}
                </h2>
                <p className="text-[#424654] max-w-2xl leading-relaxed text-sm md:text-base">
                  Your session is currently active in{" "}
                  <span className="text-[#0040a1] font-semibold">{room.hall}</span>.
                  &nbsp;Room ID:{" "}
                  <span className="font-mono text-xs bg-[#dae2ff] text-[#0040a1] px-1.5 py-0.5 rounded">
                    {room.roomId}
                  </span>
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                <button className="bg-[#0056d2] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined text-lg">sensors</span>
                  Broadcast Announcement
                </button>
                <button className="bg-white text-[#424654] px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#e0e3e5] transition-all">
                  <span className="material-symbols-outlined text-lg">share</span>
                  Invite Panelist
                </button>
              </div>

              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#0040a1]/5 rounded-full blur-3xl group-hover:bg-[#0040a1]/10 transition-colors" />
            </div>

            {/* ── Active Resources panel ────────────────────────────────────── */}
            <div className="md:col-span-4 bg-[#f2f4f6] rounded-2xl p-6 md:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h6 className="font-bold text-sm">Active Resources</h6>
                <span className="text-[10px] font-bold text-[#0040a1] bg-[#dae2ff] px-2 py-0.5 rounded-full">
                  {resources.length}
                </span>
              </div>

              {/* Resource list */}
              <div className="flex-1 overflow-y-auto space-y-2 max-h-48 pr-1">
                {resources.length === 0 ? (
                  <p className="text-[11px] text-[#737785] text-center py-4">
                    No resources yet. Upload a file or add a link below.
                  </p>
                ) : (
                  resources.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center gap-3 group bg-white rounded-xl px-3 py-2 shadow-sm"
                    >
                      <button
                        onClick={() => handleOpenResource(r)}
                        className="w-8 h-8 shrink-0 rounded bg-[#eef1ff] flex items-center justify-center text-[#0040a1] group-hover:bg-[#0040a1] group-hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {typeIcon(r.fileType)}
                        </span>
                      </button>

                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenResource(r)}>
                        <p className="text-[11px] font-bold text-[#191c1e] leading-tight truncate">
                          {r.originalName}
                        </p>
                        <p className="text-[9px] text-[#737785]">
                          {r.fileType === "link" ? "External link" : `${(r.fileSize / 1024).toFixed(1)} KB`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteResource(r._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ba1a1a] hover:text-red-700"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Upload error */}
              {uploadError && (
                <p className="text-[10px] text-[#ba1a1a] mt-2">{uploadError}</p>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 py-2 border border-dashed border-[#c3c6d6] rounded-lg text-[#737785] text-[10px] font-bold uppercase tracking-widest hover:border-[#0040a1] hover:text-[#0040a1] transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                  )}
                  {uploading ? "Uploading…" : "Upload File"}
                </button>

                <button
                  onClick={() => setShowLinkModal(true)}
                  className="flex-1 py-2 border border-dashed border-[#c3c6d6] rounded-lg text-[#737785] text-[10px] font-bold uppercase tracking-widest hover:border-[#0040a1] hover:text-[#0040a1] transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add_link</span>
                  Add Link
                </button>
              </div>
            </div>
          </section>

          {/* ── Chat panel ────────────────────────────────────────────────── */}
          <section>
            <div className="bg-white border border-[#c3c6d6]/20 rounded-2xl flex flex-col h-[520px] overflow-hidden shadow-sm">
              {/* Header */}
              <div className="p-4 bg-[#f2f4f6] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0040a1]">chat_bubble</span>
                <h5 className="font-bold text-sm">Session Chat</h5>
                <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Public
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                    <span className="material-symbols-outlined text-4xl text-[#c3c6d6]">chat</span>
                    <p className="text-xs text-[#737785]">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isCurrentUser = msg.senderType === "lecturer" || msg.senderType === "admin";
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col max-w-[85%] ${
                          isCurrentUser ? "items-end self-end ml-auto" : "items-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl shadow-sm ${
                            isCurrentUser
                              ? "bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white rounded-br-sm"
                              : "bg-[#dbe0e5] text-[#5e6368] rounded-bl-sm"
                          }`}
                        >
                          <p className="text-xs leading-relaxed">{msg.message}</p>
                        </div>
                        <span className="text-[10px] text-[#424654] mt-1 px-1">
                          {msg.senderName} • {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white/85 backdrop-blur-md border-t border-[#c3c6d6]/10">
                <div className="bg-[#e0e3e5] rounded-xl p-3 flex items-center gap-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0040a1]/20 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message to the hall…"
                    className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-[#424654]/60 text-[#191c1e]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !chatInput.trim()}
                    className="text-[#0040a1] hover:scale-110 transition-transform disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3 px-1">
                  <div className="flex gap-2">
                    <button className="text-[#424654] hover:text-[#0040a1] transition-colors">
                      <span className="material-symbols-outlined text-lg">attachment</span>
                    </button>
                    <button className="text-[#424654] hover:text-[#0040a1] transition-colors">
                      <span className="material-symbols-outlined text-lg">mood</span>
                    </button>
                  </div>
                  <button
                    onClick={handleClear}
                    disabled={clearing}
                    className="text-[10px] font-bold text-[#822800] uppercase tracking-widest hover:underline disabled:opacity-40"
                  >
                    {clearing ? "Clearing…" : "Clear History"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 py-3 md:hidden bg-white/85 backdrop-blur-md border-t border-[#c3c6d6]/20 shadow-[0px_-10px_30px_rgba(25,28,30,0.06)] rounded-t-2xl">
        <a className="flex flex-col items-center justify-center text-[#424654] transition-all" href="#">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-[#0056D2] text-white rounded-xl px-4 py-1 scale-95" href="#">
          <span className="material-symbols-outlined">info</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Hall Info</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#424654] transition-all" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </a>
      </nav>
    </div>
  );
};

export default LiveSessionLecturer;
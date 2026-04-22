import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SidebarStudent from "../../../components/Sidebar_student";
import Navbar from "../../../components/cjNavbar";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");
const POLL_INTERVAL = 5000;

const filterOptions = [
  { id: "all", label: "All Sessions" },
  { id: "my", label: "My Courses" },
  { id: "public", label: "Public" },
  { id: "trending", label: "Trending" },
];

const modeStyles = {
  verbal: {
    label: "Verbal Mode",
    badge: "bg-[#dae2ff] text-[#0040a1]",
    accent: "from-[#0040a1] to-[#0056d2]",
  },
  written: {
    label: "Written Only",
    badge: "bg-[#dbe0e5] text-[#5e6368]",
    accent: "from-[#822800] to-[#a93802]",
  },
  hybrid: {
    label: "Hybrid",
    badge: "bg-[#e8f0ff] text-[#0056d2]",
    accent: "from-[#3f7cff] to-[#0056d2]",
  },
};

const formatClock = (value) =>
  new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (value) =>
  new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

const getLecturerName = (room) => {
  const creator = room.createdBy;
  if (!creator || typeof creator === "string") return "Lecturer";
  const fullName = [creator.firstName, creator.lastName].filter(Boolean).join(" ");
  return fullName || creator.name || "Lecturer";
};

function StudentLectureLobby() {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);

  const chatBottomRef = useRef(null);
  const pollRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchActiveRooms = useCallback(async () => {
    try {
      setRoomsLoading(true);
      setRoomsError("");
      const res = await fetch(`${API}/api/rooms/active`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load sessions");
      }

      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch (error) {
      setRooms([]);
      setRoomsError(error.message || "Could not load active sessions.");
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (roomId) => {
      if (!token) return;

      try {
        const res = await fetch(`${API}/api/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages || []);
        }
      } catch {
        // Ignore background polling failures.
      }
    },
    [token]
  );

  useEffect(() => {
    fetchActiveRooms();
  }, [fetchActiveRooms]);

  useEffect(() => {
    if (!joinedRoom) {
      clearInterval(pollRef.current);
      setMessages([]);
      return;
    }

    fetchMessages(joinedRoom.roomId);
    pollRef.current = setInterval(
      () => fetchMessages(joinedRoom.roomId),
      POLL_INTERVAL
    );

    return () => clearInterval(pollRef.current);
  }, [joinedRoom, fetchMessages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredRooms = useMemo(() => {
    if (activeFilter === "trending") {
      return [...rooms].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return rooms;
  }, [activeFilter, rooms]);

  const todaysRooms = useMemo(
    () =>
      [...rooms].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [rooms]
  );

  const currentUserId = (() => {
    try {
      return JSON.parse(atob(token.split(".")[1]))?.id;
    } catch {
      return null;
    }
  })();

  const openPinModal = (room) => {
    setSelectedRoom(room);
    setPinInput("");
    setPinError("");
  };

  const closePinModal = () => {
    setSelectedRoom(null);
    setPinInput("");
    setPinError("");
  };

  const handleJoinRoom = async () => {
    if (!selectedRoom) return;
    if (!pinInput.trim()) {
      setPinError("Enter the session PIN shared by the lecturer.");
      return;
    }

    try {
      setPinSubmitting(true);
      setPinError("");

      const res = await fetch(`${API}/api/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.roomId,
          sessionPin: pinInput.trim(),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Could not join room");
      }

      setJoinedRoom(data.room);
      closePinModal();
    } catch (error) {
      setPinError(error.message || "Invalid session pin.");
    } finally {
      setPinSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!joinedRoom || !chatInput.trim() || !token) return;

    try {
      setSending(true);
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: joinedRoom.roomId,
          message: chatInput.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setChatInput("");
        fetchMessages(joinedRoom.roomId);
      }
    } finally {
      setSending(false);
    }
  };

  const renderLobby = () => (
    <main className="min-h-screen bg-[#f8f9fb] md:ml-64">
      <Navbar
        mode="student"
        withSidebar
        title="Academic Atelier"
        searchPlaceholder="Search sessions, topics, or lecturers..."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-6 pb-10 pt-24 md:px-10">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#191c1e]">
                Lecture Q&A Lobby
              </h2>
              <p className="mt-1 text-[#424654]">
                Connect with experts and peers in real-time academic dialogues.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 rounded-xl bg-[#f2f4f6] p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActiveFilter(option.id)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
                    activeFilter === option.id
                      ? "bg-white text-[#0040a1] shadow-sm"
                      : "text-[#424654] hover:bg-white/60"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ba1a1a] animate-pulse" />
            <h3 className="text-lg font-bold">Live Now</h3>
          </div>

          {roomsLoading ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
              <p className="text-sm font-semibold text-[#424654]">
                Loading active sessions...
              </p>
            </div>
          ) : roomsError ? (
            <div className="rounded-xl bg-[#ffdad6] p-6 text-sm font-medium text-[#93000a]">
              {roomsError}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
              <span className="material-symbols-outlined text-5xl text-[#c3c6d6]">
                sensors_off
              </span>
              <h4 className="mt-4 text-xl font-bold text-[#191c1e]">
                No live rooms available
              </h4>
              <p className="mt-2 text-sm text-[#424654]">
                Once a lecturer launches a room, it will appear here for students to join.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => {
                const mode = modeStyles[room.answeringMode] || modeStyles.written;
                return (
                  <article
                    key={room._id || room.roomId}
                    className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0px_10px_30px_rgba(25,28,30,0.06)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className={`h-2 bg-gradient-to-r ${mode.accent}`} />

                    <div className="flex-1 space-y-4 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${mode.badge}`}>
                          {mode.label}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#ba1a1a]">
                          <span className="material-symbols-outlined text-sm">
                            groups
                          </span>
                          Live
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold leading-tight text-[#191c1e]">
                          {room.courseName}
                        </h4>
                        <div className="mt-2 flex items-center gap-2 text-sm text-[#424654]">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>
                          <span>{room.hall}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dae2ff] text-[#0040a1]">
                          <span className="material-symbols-outlined text-lg">
                            school
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#191c1e]">
                            {getLecturerName(room)}
                          </p>
                          <p className="text-xs text-[#424654]">
                            {room.roomId} • {formatDate(room.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f2f4f6]/60 p-4">
                      <button
                        type="button"
                        onClick={() => openPinModal(room)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#0040a1] to-[#0056d2] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <span>Join Session</span>
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Scheduled for Today</h3>
            <button
              type="button"
              onClick={fetchActiveRooms}
              className="text-sm font-bold text-[#0040a1] hover:underline"
            >
              View Calendar
            </button>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
            {todaysRooms.length === 0 ? (
              <div className="p-6 text-sm text-[#424654]">
                No sessions available for today yet.
              </div>
            ) : (
              todaysRooms.map((room, index) => (
                <button
                  key={`${room.roomId}-schedule`}
                  type="button"
                  onClick={() => openPinModal(room)}
                  className={`group flex w-full items-center p-5 text-left transition-colors hover:bg-[#f2f4f6] ${
                    index !== todaysRooms.length - 1 ? "border-b border-[#c3c6d6]/20" : ""
                  }`}
                >
                  <div className="w-16 border-r border-[#c3c6d6]/20 pr-5 text-center">
                    <span className="block text-xs font-bold text-[#424654]">
                      {formatClock(room.createdAt)}
                    </span>
                    <span className="text-[10px] font-medium text-[#737785]">
                      Live
                    </span>
                  </div>

                  <div className="flex-1 px-6">
                    <h5 className="font-bold text-[#191c1e]">{room.courseName}</h5>
                    <p className="text-sm text-[#424654]">
                      {getLecturerName(room)} • {room.hall}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-bold text-[#191c1e]">
                        {room.roomId}
                      </span>
                      <span className="text-[10px] text-[#424654]">
                        PIN required
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[#424654] transition-colors group-hover:text-[#0040a1]">
                      event_note
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      {selectedRoom ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#191c1e]/45 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0040a1]">
                  Join Session
                </p>
                <h4 className="mt-2 text-2xl font-extrabold text-[#191c1e]">
                  {selectedRoom.courseName}
                </h4>
                <p className="mt-2 text-sm text-[#424654]">
                  Enter the PIN your lecturer shared for {selectedRoom.roomId}.
                </p>
              </div>

              <button
                type="button"
                onClick={closePinModal}
                className="rounded-full p-2 text-[#424654] hover:bg-[#f2f4f6]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f2f4f6] p-4 text-sm text-[#424654]">
              <p className="font-semibold text-[#191c1e]">{selectedRoom.hall}</p>
              <p className="mt-1">Lecturer: {getLecturerName(selectedRoom)}</p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#737785]">
                Session PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                placeholder="Enter 4 to 6 digit PIN"
                className="w-full rounded-2xl border border-[#c3c6d6] bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#0040a1]/20"
              />
              {pinError ? (
                <p className="mt-2 text-sm font-medium text-[#ba1a1a]">{pinError}</p>
              ) : null}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePinModal}
                className="flex-1 rounded-2xl bg-[#e6e8ea] px-4 py-3 text-sm font-bold text-[#191c1e] transition-colors hover:bg-[#dbe0e5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleJoinRoom}
                disabled={pinSubmitting}
                className="flex-1 rounded-2xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {pinSubmitting ? "Checking..." : "Enter Room"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );

  const renderChat = () => (
    <main className="min-h-screen bg-[#f8f9fb] md:ml-64">
      <Navbar
        mode="student"
        withSidebar
        title="Academic Atelier"
        searchPlaceholder="Search sessions, topics, or lecturers..."
      />

      <div className="px-6 pb-8 pt-24 md:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] p-8 text-white shadow-[0px_18px_40px_rgba(0,64,161,0.25)] lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Session Live
              </div>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
                {joinedRoom.courseName}
              </h1>
              <p className="mt-3 text-sm text-white/85">
                {joinedRoom.hall} • {joinedRoom.roomId} • Joined with lecturer PIN
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setJoinedRoom(null)}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0040a1] transition-colors hover:bg-[#dae2ff]"
                >
                  Back to Lobby
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-[0px_10px_30px_rgba(25,28,30,0.06)] lg:col-span-4">
              <p className="text-sm font-semibold text-[#424654]">In this session</p>
              <h3 className="mt-2 text-5xl font-extrabold text-[#191c1e]">
                {messages.length}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-[#0040a1]">
                Live messages
              </p>

              <div className="mt-6 rounded-2xl bg-[#f2f4f6] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#737785]">
                  Lecturer
                </p>
                <p className="mt-2 text-sm font-bold text-[#191c1e]">
                  {getLecturerName(joinedRoom)}
                </p>
                <p className="mt-1 text-sm text-[#424654]">{joinedRoom.hall}</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-[#c3c6d6]/20 bg-white shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
            <div className="border-b border-[#c3c6d6]/15 bg-[#f2f4f6] px-6 py-4">
              <h4 className="font-bold text-[#191c1e]">Session Chat</h4>
              <p className="text-sm text-[#424654]">
                Ask questions and follow the lecture in real time.
              </p>
            </div>

            <div className="flex h-[60vh] flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <span className="material-symbols-outlined text-5xl text-[#c3c6d6]">
                      forum
                    </span>
                    <p className="text-sm text-[#424654]">
                      No questions yet. Be the first one to ask.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isLecturer =
                      msg.senderType === "lecturer" || msg.senderType === "admin";
                    const isMine = currentUserId ? msg.senderId === currentUserId : false;

                    if (isLecturer) {
                      return (
                        <div key={msg._id} className="max-w-[85%]">
                          <div className="rounded-2xl rounded-bl-sm bg-[#dbe0e5] px-5 py-3 text-[#191c1e]">
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="mt-1 px-1 text-[10px] uppercase tracking-widest text-[#737785]">
                            {msg.senderName} • {formatClock(msg.createdAt)}
                          </p>
                        </div>
                      );
                    }

                    if (isMine) {
                      return (
                        <div key={msg._id} className="ml-auto max-w-[85%]">
                          <div className="rounded-2xl rounded-br-sm bg-gradient-to-br from-[#0040a1] to-[#0056d2] px-5 py-3 text-white">
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="mt-1 px-1 text-right text-[10px] uppercase tracking-widest text-[#737785]">
                            You • {formatClock(msg.createdAt)}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={msg._id} className="max-w-[85%]">
                        <div className="rounded-2xl rounded-bl-sm border border-[#c3c6d6]/20 bg-[#f2f4f6] px-5 py-3 text-[#191c1e]">
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <p className="mt-1 px-1 text-[10px] uppercase tracking-widest text-[#737785]">
                          {msg.senderName} • {formatClock(msg.createdAt)}
                        </p>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              <div className="border-t border-[#c3c6d6]/15 bg-white p-4">
                <div className="flex items-center gap-2 rounded-2xl bg-[#f2f4f6] p-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Ask something in ${joinedRoom.courseName}...`}
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#737785]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending || !chatInput.trim()}
                    className="rounded-xl bg-[#0040a1] p-3 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e]">
      <SidebarStudent />
      {joinedRoom ? renderChat() : renderLobby()}
    </div>
  );
}

export default StudentLectureLobby;

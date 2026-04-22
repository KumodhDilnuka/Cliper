import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar_lec from "../../../components/Sidebar_lec";
import TopBar from "../../../components/TopBar";
import CreateRoomModal from "../../../components/CreateRoomModal";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");

const cardImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
];

const statusMeta = {
  active: {
    label: "Live",
    badge: "bg-red-600 text-white",
    button: "bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white hover:brightness-110",
    action: "Enter Room",
    icon: "group",
  },
  scheduled: {
    label: "Scheduled",
    badge: "bg-[#0056d2] text-white",
    button: "text-[#0040a1] hover:bg-blue-50",
    action: "Manage",
    icon: "event",
  },
  ended: {
    label: "Completed",
    badge: "bg-gray-200 text-gray-700",
    button: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    action: "View Details",
    icon: "analytics",
  },
};

const LecActiveRooms = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please log in again.");
        setRooms([]);
        return;
      }

      const res = await fetch(`${API}/api/rooms/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Your session has expired. Please log in again.");
        setRooms([]);
        return;
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to load rooms");
      }

      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch (err) {
      setRooms([]);
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rooms;

    return rooms.filter((room) => {
      const haystack = [
        room.courseName,
        room.hall,
        room.roomId,
        room.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [rooms, search]);

  const stats = useMemo(
    () => ({
      active: rooms.filter((room) => room.status === "active").length,
      scheduled: rooms.filter((room) => room.status === "scheduled").length,
      ended: rooms.filter((room) => room.status === "ended").length,
    }),
    [rooms]
  );

  const getCardImage = (index) => cardImages[index % cardImages.length];

  const formatSchedule = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] overflow-hidden">
      <Sidebar_lec onCreateRoom={() => setIsModalOpen(true)} />
      <TopBar
        mode="lecturer"
        title="Lecture Rooms"
        subtitle="Manage your active, scheduled, and past lecture sessions"
      />

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoomCreated={(room) => {
          setRooms((prev) => [room, ...prev]);
          setIsModalOpen(false);
        }}
      />

      <main className="pt-20 md:ml-64 min-h-screen overflow-y-auto px-6 md:px-10 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My Academic Rooms
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your active, scheduled, and past lecture sessions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchRooms}
              className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                refresh
              </span>
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">
                add_circle
              </span>
              <span>Create New Room</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex items-center bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm max-w-md">
            <span className="material-symbols-outlined text-gray-400 text-sm mr-2">
              search
            </span>
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="h-36 bg-slate-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-2/3 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => {
              const meta = statusMeta[room.status] || statusMeta.active;
              const scheduleText = formatSchedule(room.scheduledFor);
              return (
                <div
                  key={room._id || room.roomId}
                  className={`bg-white rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 flex flex-col border ${
                    room.status === "ended"
                      ? "opacity-80 hover:opacity-100 border-gray-100"
                      : "border-transparent hover:border-blue-100"
                  }`}
                >
                  <div
                    className={`h-36 bg-slate-200 relative ${
                      room.status === "ended" ? "grayscale group-hover:grayscale-0" : ""
                    }`}
                  >
                    <img
                      src={getCardImage(index)}
                      alt={room.courseName}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>

                    {scheduleText ? (
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#0040a1]">
                        {scheduleText}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {room.courseName}
                    </h3>

                    <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      {room.hall}
                    </p>

                    <p className="text-xs text-[#737785] mb-4">
                      {room.roomId}
                      {room.durationMinutes ? ` • ${room.durationMinutes} mins` : ""}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="material-symbols-outlined text-lg">
                          {meta.icon}
                        </span>
                        <span className="text-sm font-semibold capitalize">
                          {room.status}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (room.status === "active") {
                            navigate(`/live-sessionLecturer/${room.roomId}`);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${meta.button}`}
                      >
                        {meta.action}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-gray-300 bg-white/80 p-12 text-center text-gray-500">
              <p className="text-lg font-bold text-gray-800">No rooms found</p>
              <p className="mt-2 text-sm">
                Create a new room and it will appear here automatically.
              </p>
            </div>
          )}

          {/* Add New Room Card */}
          {!loading ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center p-8 min-h-[320px]"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-[#0040a1]">
                  add
                </span>
              </div>
              <p className="font-bold text-gray-900">Create New Room</p>
              <p className="text-gray-500 text-sm text-center mt-2 max-w-[180px]">
                Set up a new lecture environment for your students.
              </p>
            </button>
          ) : null}
        </div>

        {/* Bottom Insights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/85 backdrop-blur-md p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-white/20 shadow-sm">
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2">Lecturer Insight</h4>
              <p className="text-gray-600 leading-relaxed">
                You currently have {stats.active} live room(s), {stats.scheduled} scheduled
                room(s), and {stats.ended} completed room(s). Keep your room list updated
                so students can find the correct lecture session quickly.
              </p>
              <button
                onClick={fetchRooms}
                className="mt-6 text-[#0040a1] font-bold text-sm flex items-center gap-2 hover:underline"
              >
                Refresh room data
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="w-32 h-32 shrink-0 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
              <div className="text-center">
                <span className="block text-2xl font-black text-[#0040a1]">
                  {rooms.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
                  Total Rooms
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0040a1] to-[#0056d2] p-8 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden">
            <div className="z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                Upcoming Sessions
              </span>
              <p className="text-2xl font-bold mt-2">{stats.scheduled}</p>
              <p className="text-sm opacity-90 mt-1">
                Rooms scheduled for future release
              </p>
            </div>

            <div className="z-10 mt-6 flex items-center justify-between">
              <span className="text-xs font-medium">Keep students informed</span>
              <span className="material-symbols-outlined text-4xl opacity-30">
                event_upcoming
              </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md flex justify-around items-center py-3 px-2 z-50 border-t border-gray-200">
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Dash</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-[#0040a1]">
          <span className="material-symbols-outlined">meeting_room</span>
          <span className="text-[10px] font-bold">Rooms</span>
        </button>

        <button className="w-12 h-12 bg-gradient-to-br from-[#0040a1] to-[#0056d2] rounded-full flex items-center justify-center text-white -mt-8 shadow-lg">
          <span className="material-symbols-outlined">add</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined">library_books</span>
          <span className="text-[10px] font-bold">Resources</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-gray-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default LecActiveRooms;

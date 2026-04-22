import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");

const answeringModes = [
  { id: "verbal", label: "Verbal", icon: "record_voice_over" },
  { id: "written", label: "Chat", icon: "chat_bubble" },
  { id: "hybrid", label: "Hybrid", icon: "dynamic_feed" },
];

const initialForm = {
  courseName:    "",
  hall:          "",
  sessionPin:    "",
  description:   "",
  answeringMode: "written",
  scheduleType:  "now",
  scheduledFor:  "",
  durationMinutes: "60",
};

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData]       = useState(initialForm);
  const [errors,   setErrors]         = useState({});
  const [loading,  setLoading]        = useState(false);
  const [success,  setSuccess]        = useState(false);
  const [prevRooms, setPrevRooms]     = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // ── fetch previous rooms when modal opens ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    setRoomsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ submit: "Your session has expired. Please log in again." });
      setRoomsLoading(false);
      return;
    }

    fetch(`${API}/api/rooms/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json();
        if (r.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setErrors({ submit: "Your session has expired. Please log in again." });
          setTimeout(() => navigate("/login"), 800);
          return { success: false };
        }
        return data;
      })
      .then((data) => {
        if (data.success) setPrevRooms(data.rooms.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setRoomsLoading(false));
  }, [isOpen, navigate]);

  // ── close on Escape ────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p)  => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.courseName.trim()) errs.courseName = "Course name is required";
    if (!formData.hall.trim())       errs.hall       = "Hall / Location is required";
    if (!formData.sessionPin.trim()) {
      errs.sessionPin = "Session pin is required";
    } else if (!/^\d{4,6}$/.test(formData.sessionPin.trim())) {
      errs.sessionPin = "Session pin must be 4–6 digits";
    }
    if (formData.scheduleType === "later") {
      if (!formData.scheduledFor) {
        errs.scheduledFor = "Scheduled date and time is required";
      } else if (new Date(formData.scheduledFor) <= new Date()) {
        errs.scheduledFor = "Choose a future date and time";
      }
    }
    if (!formData.durationMinutes || Number(formData.durationMinutes) < 15) {
      errs.durationMinutes = "Duration must be at least 15 minutes";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "Your session has expired. Please log in again." });
        setLoading(false);
        return;
      }

      const res   = await fetch(`${API}/api/rooms/create`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseName: formData.courseName,
          hall: formData.hall,
          sessionPin: formData.sessionPin,
          description: formData.description,
          answeringMode: formData.answeringMode,
          scheduledFor:
            formData.scheduleType === "later" ? formData.scheduledFor : null,
          durationMinutes: Number(formData.durationMinutes),
        }),
      });
      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setErrors({ submit: "Your session has expired. Please log in again." });
        setTimeout(() => navigate("/login"), 800);
      } else if (data.success) {
        setSuccess(true);
        onRoomCreated?.(data.room);
        setTimeout(() => {
          setSuccess(false);
          setFormData(initialForm);
          setErrors({});
          onClose();
        }, 1800);
      } else {
        setErrors({ submit: data.message || "Failed to create room" });
      }
    } catch {
      setErrors({ submit: "Network error – please try again" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(25,28,30,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#f8f9fb] rounded-2xl shadow-2xl animate-modal-in"
        style={{ animation: "modalIn 0.25s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#424654] hover:text-[#0040a1] shadow-sm transition-all"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* ── LEFT: Form ─────────────────────────────────────────────── */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl p-6 md:p-10 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
                <header className="mb-8">
                  <h3
                    className="text-3xl font-extrabold tracking-tight text-[#191c1e] mb-2"
                    style={{ fontFamily: "Manrope, Inter, sans-serif" }}
                  >
                    Create a Room
                  </h3>
                  <p className="text-[#424654] leading-relaxed text-sm">
                    Design a focused learning environment. Configure your session
                    parameters below to initialize the virtual atelier.
                  </p>
                </header>

                {/* Success banner */}
                {success && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold animate-fade-in">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    Room launched successfully!
                  </div>
                )}

                {/* Global error */}
                {errors.submit && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    {errors.submit}
                  </div>
                )}

                <form className="space-y-7" onSubmit={handleSubmit}>
                  {/* Course Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                      placeholder="e.g. Advanced Quantum Mechanics"
                      className={`w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#c3c6d6] ring-1 transition-all duration-200 ${
                        errors.courseName
                          ? "ring-red-400 bg-red-50"
                          : "ring-transparent focus:ring-[#0040a1]/25 focus:bg-white"
                      }`}
                    />
                    {errors.courseName && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">error_outline</span>
                        {errors.courseName}
                      </p>
                    )}
                  </div>

                  {/* Hall + Pin row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                        Hall / Location
                      </label>
                      <input
                        type="text"
                        name="hall"
                        value={formData.hall}
                        onChange={handleChange}
                        placeholder="e.g. Main Auditorium A-1"
                        className={`w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#c3c6d6] ring-1 transition-all duration-200 ${
                          errors.hall
                            ? "ring-red-400 bg-red-50"
                            : "ring-transparent focus:ring-[#0040a1]/25 focus:bg-white"
                        }`}
                      />
                      {errors.hall && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error_outline</span>
                          {errors.hall}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                        Session PIN
                      </label>
                      <input
                        type="text"
                        name="sessionPin"
                        value={formData.sessionPin}
                        onChange={handleChange}
                        placeholder="e.g. 1234"
                        maxLength={6}
                        className={`w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#c3c6d6] ring-1 transition-all duration-200 ${
                          errors.sessionPin
                            ? "ring-red-400 bg-red-50"
                            : "ring-transparent focus:ring-[#0040a1]/25 focus:bg-white"
                        }`}
                      />
                      {errors.sessionPin && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error_outline</span>
                          {errors.sessionPin}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                      Session Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add context, agenda, or lecture focus for students..."
                      rows={3}
                      className="w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#c3c6d6] ring-1 ring-transparent transition-all duration-200 focus:ring-[#0040a1]/25 focus:bg-white resize-none"
                    />
                  </div>

                  {/* Launch Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                      Launch Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "now", label: "Launch Now", icon: "rocket_launch" },
                        { id: "later", label: "Schedule Later", icon: "event" },
                      ].map((option) => {
                        const isActive = formData.scheduleType === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({ ...p, scheduleType: option.id }))
                            }
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              isActive
                                ? "border-[#0040a1] bg-[#0056d2]/8 shadow-sm"
                                : "border-transparent bg-[#f2f4f6] hover:bg-[#e6e8ea]"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <span
                                className={`material-symbols-outlined text-3xl ${
                                  isActive ? "text-[#0040a1]" : "text-[#737785]"
                                }`}
                              >
                                {option.icon}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  isActive ? "text-[#0040a1]" : "text-[#424654]"
                                }`}
                              >
                                {option.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                        {formData.scheduleType === "later" ? "Scheduled For" : "Start Time"}
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduledFor"
                        value={formData.scheduledFor}
                        onChange={handleChange}
                        disabled={formData.scheduleType !== "later"}
                        className={`w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium ring-1 transition-all duration-200 ${
                          errors.scheduledFor
                            ? "ring-red-400 bg-red-50"
                            : "ring-transparent focus:ring-[#0040a1]/25 focus:bg-white"
                        } disabled:opacity-60`}
                      />
                      {errors.scheduledFor && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error_outline</span>
                          {errors.scheduledFor}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        min="15"
                        max="480"
                        step="15"
                        className={`w-full bg-[#f2f4f6] border-none rounded-lg px-5 py-4 outline-none text-[#191c1e] font-medium ring-1 transition-all duration-200 ${
                          errors.durationMinutes
                            ? "ring-red-400 bg-red-50"
                            : "ring-transparent focus:ring-[#0040a1]/25 focus:bg-white"
                        }`}
                      />
                      {errors.durationMinutes && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error_outline</span>
                          {errors.durationMinutes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Answering Mode */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-[#424654] block uppercase tracking-wider">
                      Answering Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {answeringModes.map((mode) => {
                        const isActive = formData.answeringMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({ ...p, answeringMode: mode.id }))
                            }
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              isActive
                                ? "border-[#0040a1] bg-[#0056d2]/8 shadow-sm"
                                : "border-transparent bg-[#f2f4f6] hover:bg-[#e6e8ea]"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <span
                                className={`material-symbols-outlined text-3xl ${
                                  isActive ? "text-[#0040a1]" : "text-[#737785]"
                                }`}
                              >
                                {mode.icon}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  isActive ? "text-[#0040a1]" : "text-[#424654]"
                                }`}
                              >
                                {mode.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full py-5 rounded-xl text-white font-bold text-lg tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-[0px_10px_30px_rgba(0,64,161,0.3)] disabled:opacity-60 flex items-center justify-center gap-3"
                    style={{
                      background: "linear-gradient(135deg, #0040a1 0%, #0056d2 100%)",
                      fontFamily: "Manrope, Inter, sans-serif",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Launching Room…
                      </>
                    ) : success ? (
                      <>
                        <span className="material-symbols-outlined">check_circle</span>
                        Room Launched!
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">rocket_launch</span>
                        Launch Room
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── RIGHT: Stats + Previous Rooms ──────────────────────────── */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              {/* Daily Engagement card */}
              <div
                className="text-white p-6 rounded-xl shadow-[0px_10px_30px_rgba(0,64,161,0.25)] relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0040a1 0%, #0056d2 100%)" }}
              >
                <div className="relative z-10">
                  <h4 className="text-xs font-semibold opacity-75 uppercase tracking-widest mb-4">
                    Daily Engagement
                  </h4>
                  <div className="flex items-end gap-2">
                    <span
                      className="text-4xl font-extrabold"
                      style={{ fontFamily: "Manrope, Inter, sans-serif" }}
                    >
                      124
                    </span>
                    <span className="text-sm mb-1 opacity-70">Students Online</span>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontSize: 120 }}>
                    groups
                  </span>
                </div>
              </div>

              {/* Previous Rooms */}
              <div className="bg-white rounded-xl p-6 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
                <div className="flex justify-between items-center mb-5">
                  <h4
                    className="font-bold text-[#191c1e]"
                    style={{ fontFamily: "Manrope, Inter, sans-serif" }}
                  >
                    Previous Rooms
                  </h4>
                  <span className="text-xs font-bold text-[#0040a1] cursor-pointer hover:underline">
                    View Archive
                  </span>
                </div>

                <div className="space-y-3">
                  {roomsLoading ? (
                    [1, 2].map((i) => (
                      <div key={i} className="h-16 rounded-xl bg-[#f2f4f6] animate-pulse" />
                    ))
                  ) : prevRooms.length > 0 ? (
                    prevRooms.map((room) => (
                      <div
                        key={room._id}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#dbe0e5] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#595f63] text-[20px]">
                            history
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#191c1e] truncate">
                            {room.courseName}
                          </p>
                          <p className="text-xs text-[#424654] capitalize">
                            {room.status === "active" ? "🟢 Active" : "Completed"} • {room.hall}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[#c3c6d6] group-hover:text-[#0040a1] transition-colors text-[20px]">
                          chevron_right
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#737785] text-center py-4">
                      No previous rooms yet
                    </p>
                  )}

                  {/* Tip */}
                  <div className="mt-4 p-4 bg-[#ffdbcf] rounded-lg flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#812800] text-[18px] shrink-0 mt-0.5">
                      auto_awesome
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#380d00]">Pro Tip</p>
                      <p className="text-[11px] text-[#812800] leading-snug mt-1">
                        Written mode increases participation by 40% in early morning sessions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CreateRoomModal;

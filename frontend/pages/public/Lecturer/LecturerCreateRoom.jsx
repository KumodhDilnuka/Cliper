import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar_lec";
import TopBar from "../../../components/TopBar";
import CreateRoomModal from "../../../components/CreateRoomModal";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");


const answeringModes = [
  {
    id: "verbal",
    label: "Verbal",
    icon: "record_voice_over",
  },
  {
    id: "written",
    label: "Written",
    icon: "edit_note",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    icon: "dynamic_feed",
  },
];

const LecturerCreateRoom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    hall: "",
    sessionPin: "",
    answeringMode: "written",
  });
  const [errors, setErrors] = useState({});
  const [previousRooms, setPreviousRooms] = useState([]);

  // fetch lecturer's previous rooms
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/rooms/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPreviousRooms(data.rooms);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      answeringMode: mode,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.hall.trim()) {
      newErrors.hall = "Hall / Location is required";
    }

    if (!formData.sessionPin.trim()) {
      newErrors.sessionPin = "Session pin is required";
    } else if (!/^\d{4,6}$/.test(formData.sessionPin.trim())) {
      newErrors.sessionPin = "Session pin must be 4 to 6 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Room launched successfully!");
        setFormData({ courseName: "", hall: "", sessionPin: "", answeringMode: "written" });
        setErrors({});
      } else {
        setErrors({ submit: data.message || "Failed to create room" });
      }
    } catch {
      setErrors({ submit: "Network error – please try again" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] antialiased overflow-hidden font-['Inter']">
      <Sidebar onCreateRoom={() => setIsModalOpen(true)} />

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoomCreated={(room) => {
          setPreviousRooms((p) => [room, ...p]);
          setIsModalOpen(false);
        }}
      />

      <div className="md:ml-64 min-h-screen">
        <TopBar mode="lecturer" title="Lecture Manager" />

        <main className="pt-16 h-screen overflow-y-auto bg-[#f8f9fb] relative">
          <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12 relative z-10">
            <div className="grid grid-cols-12 gap-8 items-start">
              {/* Left Section */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white rounded-xl p-6 md:p-10 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
                  <header className="mb-10">
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#191c1e] mb-2 font-['Manrope']">
                      Create a Room
                    </h3>
                    <p className="text-[#424654] leading-relaxed">
                      Design a focused learning environment. Configure your
                      session parameters below to initialize the virtual atelier.
                    </p>
                  </header>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Course Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#424654] block uppercase tracking-wider">
                        Course Name
                      </label>
                      <input
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                        placeholder="e.g. Advanced Quantum Mechanics"
                        className={`w-full bg-[#e0e3e5] border-none rounded-lg px-6 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#737785] ring-1 transition-all duration-200 ${
                          errors.courseName
                            ? "ring-red-500 bg-red-50"
                            : "ring-transparent focus:ring-[#0040a1]/20 focus:bg-white"
                        }`}
                      />
                      {errors.courseName && (
                        <p className="text-sm text-red-500">
                          {errors.courseName}
                        </p>
                      )}
                    </div>

                    {/* Hall + Pin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#424654] block uppercase tracking-wider">
                          Hall / Location
                        </label>
                        <input
                          type="text"
                          name="hall"
                          value={formData.hall}
                          onChange={handleChange}
                          placeholder="e.g. Main Auditorium A-1"
                          className={`w-full bg-[#e0e3e5] border-none rounded-lg px-6 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#737785] ring-1 transition-all duration-200 ${
                            errors.hall
                              ? "ring-red-500 bg-red-50"
                              : "ring-transparent focus:ring-[#0040a1]/20 focus:bg-white"
                          }`}
                        />
                        {errors.hall && (
                          <p className="text-sm text-red-500">{errors.hall}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#424654] block uppercase tracking-wider">
                          Session Pin
                        </label>
                        <input
                          type="text"
                          name="sessionPin"
                          value={formData.sessionPin}
                          onChange={handleChange}
                          placeholder="e.g. 1234"
                          className={`w-full bg-[#e0e3e5] border-none rounded-lg px-6 py-4 outline-none text-[#191c1e] font-medium placeholder:text-[#737785] ring-1 transition-all duration-200 ${
                            errors.sessionPin
                              ? "ring-red-500 bg-red-50"
                              : "ring-transparent focus:ring-[#0040a1]/20 focus:bg-white"
                          }`}
                        />
                        {errors.sessionPin && (
                          <p className="text-sm text-red-500">
                            {errors.sessionPin}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Answering Mode */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-[#424654] block uppercase tracking-wider">
                        Answering Mode
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {answeringModes.map((mode) => {
                          const isActive = formData.answeringMode === mode.id;

                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => handleModeSelect(mode.id)}
                              className={`group cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                isActive
                                  ? "border-[#0040a1] bg-[#0056d2]/10"
                                  : "border-transparent bg-[#f2f4f6] hover:bg-[#e6e8ea]"
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3 text-center">
                                <span className="material-symbols-outlined text-[#0040a1] text-3xl">
                                  {mode.icon}
                                </span>
                                <span className="text-sm font-bold text-[#191c1e]">
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
                      className="w-full bg-gradient-to-br from-[#0040a1] to-[#0056d2] py-5 rounded-xl text-white font-['Manrope'] font-bold text-lg tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-[0px_10px_30px_rgba(25,28,30,0.06)]"
                    >
                      Launch Room
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Section */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Quick Stats */}
                <div className="bg-[#0040a1] text-white p-6 rounded-xl shadow-[0px_10px_30px_rgba(25,28,30,0.06)] relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-sm font-semibold opacity-80 uppercase tracking-widest mb-4">
                      Daily Engagement
                    </h4>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-extrabold font-['Manrope']">
                        124
                      </span>
                      <span className="text-sm mb-1 opacity-70">
                        Students Online
                      </span>
                    </div>
                  </div>

                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <span className="material-symbols-outlined text-[120px]">
                      groups
                    </span>
                  </div>
                </div>

                {/* Previous Rooms */}
                <div className="bg-white rounded-xl p-6 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-['Manrope'] font-bold text-[#191c1e]">
                      Previous Rooms
                    </h4>
                    <span className="text-xs font-bold text-[#0040a1] cursor-pointer hover:underline">
                      View Archive
                    </span>
                  </div>

                  <div className="space-y-4">
                    {previousRooms.map((room) => (
                      <div
                        key={room.id}
                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#dbe0e5] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#595f63]">
                            history
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#191c1e]">
                            {room.name}
                          </p>
                          <p className="text-xs text-[#424654]">
                            {room.status}
                          </p>
                        </div>

                        <span className="material-symbols-outlined text-[#737785] group-hover:text-[#0040a1] transition-colors">
                          chevron_right
                        </span>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-[#ffdbcf] rounded-lg flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#812800]">
                        auto_awesome
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#380d00]">
                          Tip for Dr. Aris
                        </p>
                        <p className="text-[11px] text-[#812800] leading-snug mt-1">
                          Written mode increases participation by 40% in early
                          morning sessions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LecturerCreateRoom;
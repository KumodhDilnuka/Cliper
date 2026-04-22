import React from "react";
import SidebarStudent from "../../../components/Sidebar_student";
import TopBar from "../../../components/TopBar";

const StudentPublicRooms = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] flex min-h-screen">
      
      <SidebarStudent />

      <main className="flex-1 md:ml-64 overflow-y-auto">
        
        <TopBar />

        <div className="p-6 lg:p-8 mt-16">

          {/* Header */}
          <div className="max-w-6xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-2">
              Public Rooms Lobby
            </h1>
            <p className="text-gray-500">
              Join a dialogue, share knowledge, and explore collaborative study spaces.
            </p>

            {/* Search */}
            <div className="mt-8">
              <input
                placeholder="Search for rooms, topics, or lecturers..."
                className="w-full px-6 py-4 rounded-2xl bg-gray-100"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="px-6 py-2 rounded-full bg-blue-600 text-white">
                All Rooms
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-200">
                My Department
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-200">
                Public
              </button>
              <button className="px-6 py-2 rounded-full bg-gray-200">
                Trending
              </button>
            </div>
          </div>

          {/* Live Now */}
          <section className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Live Now</h2>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {/* Card */}
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="font-bold text-lg mb-2">
                  Introduction to Microeconomics
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Dr. Sarah Kensington
                </p>

                <div className="flex justify-between mb-4 text-sm">
                  <span>Hall A-1</span>
                  <span>124 students</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                  Join Room
                </button>
              </div>

              {/* Card */}
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="font-bold text-lg mb-2">
                  Ethics in the Age of AI
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Prof. Marcus Thorne
                </p>

                <div className="flex justify-between mb-4 text-sm">
                  <span>Lab B-4</span>
                  <span>86 students</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                  Join Room
                </button>
              </div>

              {/* Card */}
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="font-bold text-lg mb-2">
                  Organic Synthesis
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Dr. Elena Rodriguez
                </p>

                <div className="flex justify-between mb-4 text-sm">
                  <span>Hall C-2</span>
                  <span>210 students</span>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
                  Join Room
                </button>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default StudentPublicRooms;
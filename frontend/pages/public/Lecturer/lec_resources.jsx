import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar_lec";
import TopBar from "../../../components/TopBar";

const courseModules = [
  {
    id: 1,
    title: "Macroeconomics 101",
    description: "Principles of aggregate economic behavior and policy.",
    files: "24 Files",
    iconBg: "bg-blue-100",
    iconColor: "text-[#0040a1]",
    extraUsers: "+122",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAygHDlS9Iddm1bYNfretizbYvvvAiKBS17Zr5SE1diKV7U0O2gkK6A6FaPIwTQgjuXI_AkVDaKdqglqwvEhxZPBnkxYjAjP1Zoq9hTixYh5kY6S1bqKe819yxWlcWxCYHRpB2k9ys7eau8OdS14ash-KcYEL4a8MmKJdupO_HQoib-ucT8D6m6N2C1yuszGpTeNI3NG-okPjxUBviKwD4LFMZoXnIbUyYWGZ12xsKoKHuua-QVgf0DBY74EmeMRk8MenVPuyRm6vc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGqudg7UVz3Deo9jsrFkCMBEJni_fZ_wiIz-fuwNvcgLyNiX12Tl09l7zMpLOP_38vrmSFqqQMEZ-ypEY27zCBD9QR6pbYtcduY82E3cLBXEWhMXzkT9srxKqJb_UruJ1obTu0sgecSSdo95MuZbwpkJMqqfBav80q73CgYmeYlVyxO_fw27P1HtRYiJnTAyB46k4Jo85iNLtVGpyocyxWVEaeZDB5kKowtZlPqTagvVEi5ifWh0Rn1uYoMKv6SUzt61D-MKuJUGU",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8UeUyDSD9XW63Jr19KAw_-jX5sJyeFcE2W2NRAIf-HRTN0c-kDn2t3PHLiEHRjRtixMSyOAQDqKvNnCnuV9SxvQs4LWdnYqls0dgtjhGSpa9PUrzFQcjcIl_pHeHg_wmN6qIIyB3RATjM8VfKpJbrt-Ze58fokonOiAkQCya6dyf8URhN5_5I6UGcwLUP4nmhtPIjG2D_5lp-BauSc6iYn4bwyTRkmSw1UEDANWgsEiN2qOGc_MZ86NtKKw1oWZqWOclPWSrPV2g",
    ],
  },
  {
    id: 2,
    title: "International Trade",
    description: "Theories of exchange, tariffs, and global commerce.",
    files: "12 Files",
    iconBg: "bg-orange-100",
    iconColor: "text-[#a93802]",
    extraUsers: "+84",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg3k6uLfFq3_SNdTW48qsJnc13o3KtX8G-7tjgto1AmFX6DlVgG8PKu-1flvDRRL6lKSf3csJDrPmarue4KynU65ITR-mgfM4ovGp8vWQ1Oq4syWqj6Kkcz_bSn5j4_VAVwoKOPgUKidcBCcGh4Chezlv0U9pMzOMfftwa0EdbRFEEdfv7WIOEGFvbb-C7696W3nZLAs-ngKJC5qw_YZrZ0Btq-pklNEFAz0ObGulNRCW9LNb8Y74_NLyIdD5W9fePBCGjlBTmJic",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkR9Al7r13Cvdgfgx49ytJAEryPCaAnH7wFKYKz-c1j9nDFPQ5S6P_OeG5INcinNrReqdAQwWl6CTIZ2a-TNkfzdbIoiGLBBRPqEdehLF5gQatQszq-zHcdb7WyfAcF3izpfN_T8_-ShX8iLzFGAbX_wchrt9iPMLNFv0PHbpeSH8Q2RkBi0pYzoYY3tDsfYKYxzsRNd0BPxEamoQSCDRe32rPzXARVzEcTQ4Hxnp1xlg_9Glk6N3WCa0fiiw5y46j8Bcj5bT_tYU",
    ],
  },
  {
    id: 3,
    title: "Research Papers",
    description: "Ongoing studies and peer-reviewed submissions.",
    files: "8 Files",
    iconBg: "bg-gray-200",
    iconColor: "text-[#595f63]",
    extraUsers: "+12",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3IOtaUfwsbxTcX7cvJ_Q6RCYDsaDD62_az5D-6FrLL4cefmq9lPZg_b5mHRx64kEel8ukxRJBcDGLqNA7dc6N0GKnnERqX_TEvyiXcKzhTe-DQ-nfAQ-3vHew-722GfKsd8ArmUtyj5xkr2N0WdvU1sGxMTR2HRHl88QV7yZuvLjYkWJzbKCTuHqcW6k0t7otEkOkQK0WuF2BrXTQ_8u2Av1Ee3skpRZoHtYJQrZ4CC9eXrDV_mcFn-rOi9YfOtEhD8NrMFND2VU",
    ],
  },
];

const recentFiles = [
  {
    id: 1,
    name: "2024_Syllabus_Macro.pdf",
    course: "Macroeconomics 101",
    status: "Published",
    size: "2.4 MB",
    lastModified: "Oct 12, 2023",
    icon: "picture_as_pdf",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    statusStyle: "bg-blue-100 text-[#0040a1]",
  },
  {
    id: 2,
    name: "Week_4_Trade_Theories.pptx",
    course: "International Trade",
    status: "Draft",
    size: "15.8 MB",
    lastModified: "Oct 15, 2023",
    icon: "slideshow",
    iconBg: "bg-orange-100",
    iconColor: "text-[#a93802]",
    statusStyle: "bg-gray-100 text-gray-600",
  },
  {
    id: 3,
    name: "Guest_Lecture_Nobel_Prize.mp4",
    course: "Research Papers",
    status: "Published",
    size: "1.2 GB",
    lastModified: "Oct 18, 2023",
    icon: "movie",
    iconBg: "bg-blue-100",
    iconColor: "text-[#0040a1]",
    statusStyle: "bg-blue-100 text-[#0040a1]",
  },
  {
    id: 4,
    name: "Q3_Economic_Forecast.docx",
    course: "Research Papers",
    status: "Published",
    size: "842 KB",
    lastModified: "Oct 20, 2023",
    icon: "description",
    iconBg: "bg-sky-100",
    iconColor: "text-[#0056d2]",
    statusStyle: "bg-blue-100 text-[#0040a1]",
  },
];

const LecturerResources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const filteredFiles = recentFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] antialiased font-['Inter'] overflow-hidden">
      <Sidebar />

      <div className="md:ml-64 min-h-screen">
        <TopBar mode="lecturer" title="Resources Dashboard" subtitle="Manage academic materials" />

        <main className="pt-20 px-4 md:px-8 pb-24 md:pb-12 h-screen overflow-y-auto bg-[#f8f9fb]">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#191c1e] mb-2 font-['Manrope']">
                  Resources
                </h1>
                <p className="text-[#424654] font-medium">
                  Manage and organize academic materials for your courses.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#424654] opacity-60">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#e0e3e5]/70 border-none rounded-xl pl-12 pr-4 py-3 w-full md:w-80 focus:ring-2 focus:ring-[#0040a1]/20 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Course Modules */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-['Manrope']">
                  Course Modules
                </h3>
                <button className="text-[#0040a1] font-bold text-sm flex items-center gap-1 hover:underline">
                  View All
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courseModules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white p-6 rounded-xl hover:bg-[#f2f4f6] transition-all duration-300 group cursor-pointer border-b-2 border-transparent hover:border-[#0040a1] shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl ${module.iconBg} flex items-center justify-center ${module.iconColor}`}
                      >
                        <span className="material-symbols-outlined text-3xl">
                          folder
                        </span>
                      </div>

                      <span className="text-xs font-bold text-[#424654] bg-[#eceef0] px-2 py-1 rounded">
                        {module.files}
                      </span>
                    </div>

                    <h4 className="font-bold text-lg mb-1 text-[#191c1e]">
                      {module.title}
                    </h4>

                    <p className="text-sm text-[#424654] mb-4">
                      {module.description}
                    </p>

                    <div className="flex items-center -space-x-2">
                      {module.avatars.map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt="Student thumbnail"
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      <div className="w-6 h-6 rounded-full bg-[#eceef0] flex items-center justify-center text-[8px] font-bold">
                        {module.extraUsers}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Files */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-['Manrope']">
                  Recent Files
                </h3>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-[#0040a1] text-white"
                        : "bg-[#e6e8ea] text-[#424654]"
                    }`}
                  >
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-[#0040a1] text-white"
                        : "bg-[#e6e8ea] text-[#424654]"
                    }`}
                  >
                    <span className="material-symbols-outlined">list</span>
                  </button>
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[820px]">
                      <thead>
                        <tr className="bg-[#f2f4f6] text-[#424654] text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Size</th>
                          <th className="px-6 py-4">Last Modified</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {filteredFiles.map((file) => (
                          <tr
                            key={file.id}
                            className="hover:bg-[#f2f4f6] transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg ${file.iconBg} ${file.iconColor} flex items-center justify-center`}
                                >
                                  <span className="material-symbols-outlined">
                                    {file.icon}
                                  </span>
                                </div>

                                <div>
                                  <p className="font-semibold text-sm text-[#191c1e]">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-[#424654]">
                                    {file.course}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${file.statusStyle}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    file.status === "Published"
                                      ? "bg-[#0040a1]"
                                      : "bg-gray-500"
                                  }`}
                                ></span>
                                {file.status}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-[#424654]">
                              {file.size}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#424654]">
                              {file.lastModified}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-[#e0e3e5] rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                <span className="material-symbols-outlined text-[#424654]">
                                  more_vert
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}

                        {filteredFiles.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-10 text-center text-sm text-gray-500"
                            >
                              No files found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white rounded-2xl p-5 shadow-sm hover:bg-[#f2f4f6] transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${file.iconBg} ${file.iconColor} flex items-center justify-center`}
                        >
                          <span className="material-symbols-outlined text-2xl">
                            {file.icon}
                          </span>
                        </div>

                        <button className="p-2 rounded-full hover:bg-[#e0e3e5] transition-colors">
                          <span className="material-symbols-outlined text-[#424654]">
                            more_vert
                          </span>
                        </button>
                      </div>

                      <h4 className="font-bold text-[#191c1e] mb-1 break-words">
                        {file.name}
                      </h4>
                      <p className="text-sm text-[#424654] mb-4">{file.course}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${file.statusStyle}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              file.status === "Published"
                                ? "bg-[#0040a1]"
                                : "bg-gray-500"
                            }`}
                          ></span>
                          {file.status}
                        </span>

                        <span className="text-sm text-[#424654]">{file.size}</span>
                      </div>

                      <p className="text-xs text-[#424654]">
                        Last Modified: {file.lastModified}
                      </p>
                    </div>
                  ))}

                  {filteredFiles.length === 0 && (
                    <div className="col-span-full bg-white rounded-2xl p-10 text-center text-sm text-gray-500 shadow-sm">
                      No files found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Floating Button */}
        <button className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-[#0040a1] rounded-2xl flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform active:scale-95 group z-30">
          <span className="material-symbols-outlined text-3xl">add</span>
          <div className="absolute right-20 bg-[#2d3133] text-[#eff1f3] px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap hidden md:block">
            New Resource
          </div>
        </button>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f8f9fb]/95 backdrop-blur-xl border-t border-gray-200 h-16 flex items-center justify-around px-4 z-40">
          <div className="flex flex-col items-center gap-0.5 text-[#424654]">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-medium">Dashboard</span>
          </div>

          <div className="flex flex-col items-center gap-0.5 text-[#424654]">
            <span className="material-symbols-outlined">school</span>
            <span className="text-[10px] font-medium">Rooms</span>
          </div>

          <div className="flex flex-col items-center gap-0.5 text-[#0056D2]">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="text-[10px] font-bold">Resources</span>
          </div>

          <div className="flex flex-col items-center gap-0.5 text-[#424654]">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-[10px] font-medium">Schedule</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LecturerResources;
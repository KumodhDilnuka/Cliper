import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" | "lecturer"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = (user) => {
    const redirectTo = searchParams.get("redirect");
    if (redirectTo) {
      navigate(redirectTo);
    } else if (user.type === "lecturer" || user.type === "admin") {
      navigate("/lecturer/lec_active-rooms");
    } else {
      navigate("/StudentDashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      redirectAfterLogin(data.user);
    } catch {
      setError("Could not connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-sans relative">
      {/* Close button */}
      <button
        onClick={() => navigate("/")}
        aria-label="Close login page"
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-[#191c1e] hover:bg-gray-100 transition"
      >
        ✕
      </button>

      <main className="h-full flex flex-col md:flex-row">
        {/* Left Side */}
        <section className="w-full md:w-1/2 h-full flex items-center justify-center px-5 py-4 lg:px-10 bg-[#f2f4f6]">
          <div className="max-w-md w-full space-y-5">
            {/* Brand */}
            <header className="space-y-1">
              <h1 className="font-extrabold text-2xl lg:text-3xl tracking-tight text-[#0040a1]">
                Cliper Login
              </h1>
              <p className="text-sm lg:text-base text-[#424654] leading-relaxed">
                Welcome back to your curated digital workspace. Please login in to
                continue your research.
              </p>
            </header>

            {/* Login Card */}
            <div className="bg-white p-5 lg:p-6 rounded-xl space-y-4 shadow-sm">
              {/* Role Toggle */}
              <div className="flex p-1 bg-[#f2f4f6] rounded-lg" role="tablist">
                <button
                  type="button"
                  aria-selected={role === "student"}
                  role="tab"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                    role === "student"
                      ? "text-white"
                      : "text-[#424654] hover:text-[#0040a1]"
                  }`}
                  style={
                    role === "student"
                      ? {
                          background:
                            "linear-gradient(135deg, #0040a1 0%, #0056d2 100%)",
                        }
                      : {}
                  }
                >
                  Student
                </button>

                <button
                  type="button"
                  aria-selected={role === "lecturer"}
                  role="tab"
                  onClick={() => setRole("lecturer")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                    role === "lecturer"
                      ? "text-white"
                      : "text-[#424654] hover:text-[#0040a1]"
                  }`}
                  style={
                    role === "lecturer"
                      ? {
                          background:
                            "linear-gradient(135deg, #0040a1 0%, #0056d2 100%)",
                        }
                      : {}
                  }
                >
                  Lecturer
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#424654]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#e6e8ea] border-none outline-none focus:ring-2 focus:ring-[#0040a1]/30 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#424654]"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-semibold text-[#0040a1] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-[#e6e8ea] border-none outline-none focus:ring-2 focus:ring-[#0040a1]/30 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-md disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, #0040a1 0%, #0056d2 100%)",
                  }}
                >
                  {loading ? "Signing in…" : "Login"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#c3c6d6]/30"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-4 text-[#737785] font-medium tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-all text-[#191c1e] font-medium text-sm border border-transparent hover:border-[#c3c6d6]"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUGX60refoY8avGBRgCjUJAprRlBRb__L49y-RL3_c5eBi1wklSZjs9j2aJQ_3UG9pA_SN2ROFC6qtCYZrY5tFegJTJW5Mb4R1b_fkR0uYm73jtGPC7VrDHOXyQbRNl2nBrHEQpiEtVa1CpVQiCNVqqDiipIoeik5_0lmaRcc7CwO_D25Nx72-uUvZlQ-8AbRMUthxIVThZ41eky92eNYBFF_8iC3IxGzNSJHzuHXQ3IfDYtrMXZPdb-qqWehOzzuUQq1gBuKHPjo"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] transition-all text-[#191c1e] font-medium text-sm border border-transparent hover:border-[#c3c6d6]"
                >
                  <span className="text-lg">🏛️</span>
                  EduID
                </button>
              </div>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-[#424654]">
              Don&apos;t have an institutional account?{" "}
              <a
                href="/signup"
                className="text-[#0040a1] font-bold hover:underline"
              >
                Request Access
              </a>
            </p>
          </div>
        </section>

        {/* Right Side */}
        <section className="hidden md:block md:w-1/2 h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0040a1]/20 mix-blend-multiply z-10"></div>

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC93-KXKsugYx0z8R-ObTkzLXqlu48kBRZSa_fbJf6DVuypAcZSpAOmPB3vUGZxeGC5zCjNGfUFzU_51xXmAct5R_ZAWd5c88LJ4WK48ZIhcWvMjVe6ykNdZRKDKHjboHgNBSQliqiTrxiLTyIiJCPNTix8I58ZE9VdcditjfyABIiucBjxmi_eaOFVCaMWbYeeJEoYhkhYSSOScbmi_lNCEJG1jzTB-AYO2DKh2znfwu2raqQ8_hV08ME_Q6QaS7ldnQreV1sGN-E"
            alt="Academic Environment"
            className="h-full w-full object-cover"
          />

          <div
            className="absolute bottom-8 left-8 right-8 z-20 p-6 rounded-xl border border-white/20"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="inline-block px-3 py-1 bg-[#dae2ff] text-[#001847] text-xs font-bold rounded-full mb-3">
              Featured Lecture
            </span>

            <h2 className="font-bold text-xl lg:text-2xl text-[#191c1e] mb-2">
              The Architecture of Modern Thought
            </h2>

            <p className="text-sm lg:text-base text-[#424654] leading-relaxed">
              Join Professor Elena Vance for a deep dive into historical archives
              and contemporary creative synthesis. Your journey starts here.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex -space-x-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD7xmHBLnClMoSwzvnIfdjDf-exjPWlj8-ALOrM1ixHXIZmIpa8Xy2YsjWdMOLV9TgsTS8qcdlNXAjWlqwOdI-k0d_w2T6M9PbBsJgJ4l-10GO6dPO3xTWzGJ6tiIjlcYPj1g2-IyqBgCaLKxFcplbZrvvBfFhT2ILR2vhIBh1Xg2ADoiHOCYykSxDGVWU85S4ekZwl3O15kV62xKqTE9yXBueYmsIiwfFBpdiKL5H_zm-xfpjYtSf9UNrVLx7hEW9XD7EQyn2qko"
                  alt="Student"
                  className="w-8 h-8 rounded-full ring-2 ring-white"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG7aRbO1D8mKqjhXy3KmqXMYAE1T0PpGbYDkdn_jCHEvAKNtrJ4k2UDOEmsYq4MwzT7W97Lz5oW4o8jMj21kyOyue9AkEBSL0i59wBvvLNxzWBNrPt-ICzDE7pBr7UbHpdct71VqvwqZOFR0HZKMDcD2q19nU5YV4FW5g7zFrZA5kLhP9XFrhySe5lKB4Sq8EmeYm654v_z9D-WI8iIzUiofrZxqB0oNdVzzv4w3xPRBG47MRvelwfQEULhwh6GfOyIXbWr_SJing"
                  alt="Professor"
                  className="w-8 h-8 rounded-full ring-2 ring-white"
                />
                <div className="w-8 h-8 rounded-full ring-2 ring-white bg-[#0056d2] flex items-center justify-center text-[10px] text-[#ccd8ff] font-bold">
                  +12k
                </div>
              </div>

              <span className="text-xs font-medium text-[#424654]">
                Academics are currently active
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
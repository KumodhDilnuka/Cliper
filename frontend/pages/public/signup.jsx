import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api$/, "");

const SignUp = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          type: role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Could not connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    
    <div className="bg-[#f8f9fb] font-body text-[#191c1e] selection:bg-[#0056d2] selection:text-[#ccd8ff] overflow-hidden h-screen w-screen">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center"
      >
        ✕
      </button>
      <main className="flex h-full w-full">
        {/* Left Side: Registration Form */}
        <section className="w-full lg:w-[45%] xl:w-[40%] bg-[#f8f9fb] flex flex-col h-full overflow-y-auto">
          {/* Branding Header */}
          <header className="px-8 py-10 lg:px-12">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[#0040a1] text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0040a1]">
                Cliper
              </h1>
            </div>
          </header>

          <div className="flex-1 px-8 lg:px-12 pb-16 flex flex-col justify-center max-w-xl mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Create your account</h2>
              <p className="text-[#424654]">
                Join the curated dialogue of modern academia.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="bg-[#f2f4f6] p-1.5 rounded-xl flex mb-8 w-full shadow-sm">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  role === "student"
                    ? "bg-white text-[#0040a1] shadow-sm"
                    : "text-[#424654] hover:text-[#191c1e]"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("lecturer")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  role === "lecturer"
                    ? "bg-white text-[#0040a1] shadow-sm"
                    : "text-[#424654] hover:text-[#191c1e]"
                }`}
              >
                Lecturer
              </button>
            </div>

            {/* Social Sign-up */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c3c6d6]/30 rounded-lg hover:bg-[#f2f4f6] transition-colors duration-200 shadow-sm"
              >
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ooyqKgIkmdCYEdAeMuDRp0oyui5aNo8HM_0E7rcH5dpa7GSMQ2HvSoRnNyhVU8QxrJEy89oE4cLHq-udfUYZ3AgwfRaDLS58xyCT4i2Pvg668gdkcudMWFescB0lb-RvsNd8_l8LyibgF2ocAM-phCwYBwDZbLwyR7hLSvRchmH0VpMrPZS2xrlQ-wAb18d7niYgSCfH0z9tLGS42lz8q9KP-uiUALc-r5NqL5zxhYocoO7IDYIopI_9AMqrlvglu4KV7o0vDgc"
                />
                <span className="text-sm font-medium">Continue with Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#c3c6d6]/30 rounded-lg hover:bg-[#f2f4f6] transition-colors duration-200 shadow-sm"
              >
                <span className="material-symbols-outlined text-[#595f63] text-xl">
                  school
                </span>
                <span className="text-sm font-medium">Continue with EduID</span>
              </button>
            </div>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-[#c3c6d6]/20"></div>
              <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-[#737785]">
                Or register with email
              </span>
              <div className="flex-grow border-t border-[#c3c6d6]/20"></div>
            </div>

            {/* Error / Success banners */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                {success}
              </div>
            )}

            {/* Form Fields */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* First + Last Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-[#424654] px-1"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-[#e0e3e5]/40 border-none rounded-xl focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]/60 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-[#424654] px-1"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-[#e0e3e5]/40 border-none rounded-xl focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]/60 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-[#424654] px-1"
                  htmlFor="email"
                >
                  University Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-[#e0e3e5]/40 border-none rounded-xl focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]/60 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-[#424654] px-1"
                  htmlFor="password"
                >
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-[#e0e3e5]/40 border-none rounded-xl focus:ring-2 focus:ring-[#0040a1]/20 focus:bg-white transition-all text-[#191c1e] placeholder:text-[#737785]/60 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737785] hover:text-[#0040a1] transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-br from-[#0040a1] to-[#0056d2] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 text-lg disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-[#424654]">
                Already have an account?
                <a
                  onClick={() => navigate("/login")}
                  className="text-[#0040a1] font-bold hover:underline cursor-pointer ml-1"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>

          {/* Footer Compliance */}
          <footer className="px-8 py-8 lg:px-12 flex flex-wrap gap-4 justify-center items-center border-t border-[#c3c6d6]/10 mt-auto">
            <span className="text-[10px] uppercase tracking-widest text-[#737785]">
              © 2024 Academic Atelier. The Curated Dialogue.
            </span>
            <div className="flex gap-4">
              <a
                className="text-[10px] uppercase tracking-widest text-[#737785] hover:text-[#0040a1] transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[10px] uppercase tracking-widest text-[#737785] hover:text-[#0040a1] transition-colors"
                href="#"
              >
                Institutional Access
              </a>
            </div>
          </footer>
        </section>

        {/* Right Side: Inspirational Imagery */}
        <section className="hidden lg:block lg:flex-1 relative overflow-hidden bg-[#f2f4f6]">
          <div className="absolute inset-0 z-0">
            <img
              alt="Inspirational academic workspace"
              className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaS3BZLLeJRv1YLwt25KFWznSTVRpW5x-2lAozTRCiLxZAkCDUs6J62BvsbPLsEDcI7kDlumMHQ9TEsR4qfSIII14rfo0-x94iKG2VvZaLmo-miG_KxXK_2Nn29ENqJgJ0C0dMgzOHJTJ2sbOKbzLv_P9dQPDmpjXlF0CfDtsxgcWUPT3VfuXTzkj0xDG9P2v4kryC3GIInjxf3C_qE0nixDWTLSrX_4AAYRlkSMI_xn-vSrX6QASKWrx5ZA9QkTl2DtU8tmcxHIg"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0040a1]/30 to-transparent mix-blend-multiply"></div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-20 z-10">
            <div className="bg-white/85 backdrop-blur-md p-12 rounded-[2rem] max-w-2xl border border-white/20 shadow-2xl">
              <div className="mb-6">
                <span className="material-symbols-outlined text-[#0040a1] text-5xl mb-4">
                  format_quote
                </span>
                <h3 className="text-4xl font-extrabold text-[#0040a1] leading-tight tracking-tight">
                  &ldquo;The purpose of education is to turn mirrors into windows.&rdquo;
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-1 border-t-4 border-[#0040a1] rounded-full"></div>
                <p className="text-sm uppercase tracking-[0.2em] font-bold text-[#424654]">
                  Sydney J. Harris
                </p>
              </div>
            </div>
          </div>

          {/* Visual Decoration */}
          <div className="absolute bottom-10 right-10 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/40"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUp;
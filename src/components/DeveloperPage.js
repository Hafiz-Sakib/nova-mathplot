import React, { useState, useRef } from "react";
import developerImg from "../images/developer.png";
import { useTheme } from "../ThemeContext";

/* ─── Skills data ─── */
const SKILLS = [
  { name: "React.js", level: 90, color: "#61dafb" },
  { name: "Next.js", level: 85, color: "#ffffff" },
  { name: "JavaScript", level: 92, color: "#f7df1e" },
  { name: "TypeScript", level: 78, color: "#3178c6" },
  { name: "Three.js", level: 75, color: "#a78bfa" },
  { name: "Node.js", level: 80, color: "#34d399" },
  { name: "MongoDB", level: 72, color: "#10b981" },
  { name: "Tailwind CSS", level: 88, color: "#38bdf8" },
  { name: "DSA / Algorithms", level: 82, color: "#fb923c" },
  { name: "C / C++", level: 76, color: "#22d3ee" },
];

const PROJECTS = [
  {
    name: "NOVA MathPlot",
    desc: "Scientific visualization platform — 2D/3D plotting, complex analysis, activation functions, parametric curves.",
    tech: ["React", "Three.js", "Math.js"],
    color: "#22d3ee",
    link: "https://nova-mathplot.vercel.app/",
    github: "https://github.com/Hafiz-Sakib/nova-mathplot",
  },
  {
    name: "Tour Guide",
    desc: "Location-based travel guide app — latest personal project exploring interactive maps and point-of-interest discovery.",
    tech: ["React", "Maps API", "Firebase"],
    color: "#34d399",
    link: "https://hafizsakib.vercel.app/",
    github: "https://github.com/Hafiz-Sakib",
  },
  {
    name: "Open Source Contributions",
    desc: "Actively contributing to and collaborating on open source projects. Solving competitive programming problems on multiple judges.",
    tech: ["C++", "Python", "Algorithms"],
    color: "#a78bfa",
    link: "https://github.com/Hafiz-Sakib",
    github: "https://github.com/Hafiz-Sakib",
  },
];

const SOCIAL_LINKS = [
  {
    label: "Portfolio",
    href: "https://hafizsakib.vercel.app/",
    icon: "🌐",
    color: "#22d3ee",
  },
  {
    label: "GitHub",
    href: "https://github.com/Hafiz-Sakib",
    icon: "⌥",
    color: "#a78bfa",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/hafizsakib",
    icon: "in",
    color: "#0ea5e9",
  },
  {
    label: "Email",
    href="https://mail.google.com/mail/?view=cm&fs=1&to=hafizsakib5@gmail.com",
    icon: "✉",
    color: "#34d399",
  },
  {
    label: "Twitter/X",
    href: "https://twitter.com/hafiz_sakib1",
    icon: "𝕏",
    color: "#64748b",
  },
];


export default function DeveloperPage({ setPage }) {
  const { isDark } = useTheme();
  const [devImage, setDevImage] = useState(null);
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDevImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: isDark
          ? "rgb(2,8,20)"
          : "linear-gradient(145deg, #eef4ff 0%, #e8f0fc 100%)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* ── PAGE HEADER ── */}
      <div
        className="relative px-4 sm:px-8 pt-10 pb-8 border-b overflow-hidden"
        style={{ borderColor: "rgba(244,114,182,0.15)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(244,114,182,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setPage && setPage("home")}
              className="font-mono text-xs transition-colors"
              style={{ color: "#334155" }}
              onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
              onMouseLeave={(e) => (e.target.style.color = "#334155")}
            >
              Home
            </button>
            <span style={{ color: "#1e293b" }}>/</span>
            <span className="font-mono text-xs" style={{ color: "#f472b6" }}>
              Developer
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: "rgba(244,114,182,0.1)",
                border: "1px solid rgba(244,114,182,0.3)",
                boxShadow: "0 0 18px rgba(244,114,182,0.18)",
              }}
            >
              &lt;/&gt;
            </div>
            <h1
              className="font-orbitron font-black text-2xl sm:text-3xl tracking-wider"
              style={{
                background: "linear-gradient(90deg,#f472b6,#a78bfa,#22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About the Developer
            </h1>
          </div>
          <p className="font-rajdhani text-base" style={{ color: "#475569" }}>
            The mind behind NOVA MathPlot
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        {/* ── PROFILE CARD ── */}
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: isDark ? "rgba(4,10,24,0.9)" : "rgba(255,255,255,0.88)",
            border: "1px solid rgba(244,114,182,0.18)",
            boxShadow: "0 0 40px rgba(244,114,182,0.06)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(244,114,182,0.6),transparent)",
            }}
          />

          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            {/* Developer Profile Image */}
            <div className="relative flex-shrink-0">
              <div
                className="relative w-36 h-36 rounded-full overflow-hidden"
                style={{
                  border: "2px solid rgba(244,114,182,0.35)",
                  boxShadow: "0 0 30px rgba(244,114,182,0.20)",
                }}
              >
                <img
                  src={developerImg}
                  alt="Developer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300/1e2937/22d3ee?text=👨‍💻";
                  }}
                />
              </div>

              {/* Optional Label */}
              <div className="mt-2 text-center">
                <p className="text-xs font-mono text-pink-400">
                  Developer Profile
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <h2
                  className="font-orbitron font-black text-xl sm:text-2xl"
                  style={{ color: isDark ? "#e2e8f0" : "#0f172a" }}
                >
                  Mohammad Hafizur Rahman Sakib
                </h2>
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: isDark
                      ? "rgba(34,211,238,0.1)"
                      : "rgba(6,182,212,0.08)",
                    color: "#22d3ee",
                    border: "1px solid rgba(34,211,238,0.25)",
                  }}
                >
                  Open to Collab
                </span>
              </div>
              <p
                className="font-rajdhani text-base mb-1"
                style={{ color: "#64748b" }}
              >
                Full Stack Developer · Bangladesh 🇧🇩
              </p>
              <p
                className="font-mono text-xs mb-4"
                style={{ color: "#334155" }}
              >
                hafizsakib5@gmail.com
              </p>

              <p
                className="font-rajdhani text-base leading-relaxed mb-5"
                style={{ color: isDark ? "#94a3b8" : "#475569" }}
              >
                I'm a passionate Full Stack Developer currently pursuing my
                Computer Science degree. I build fast, clean, and interactive
                web applications — from scientific visualization platforms like
                NOVA MathPlot to real-world MERN apps. I love exploring
                mathematics, tackling DSA challenges on competitive programming
                platforms, and pushing the limits of browser-based graphics.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={{
                      background: `${s.color}0d`,
                      border: `1px solid ${s.color}25`,
                      color: s.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${s.color}18`;
                      e.currentTarget.style.borderColor = `${s.color}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${s.color}0d`;
                      e.currentTarget.style.borderColor = `${s.color}25`;
                    }}
                  >
                    <span style={{ fontSize: "0.75rem" }}>{s.icon}</span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            background: isDark
              ? "rgba(4,10,24,0.85)"
              : "rgba(255,255,255,0.88)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)",
            }}
          />
          <div className="flex items-center gap-2 mb-6">
            <span
              className="font-orbitron font-bold text-xs tracking-widest"
              style={{ color: "#a78bfa" }}
            >
              ⬡ SKILLS
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SKILLS.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-1">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "#64748b" }}
                  >
                    {s.name}
                  </span>
                  <span
                    className="font-orbitron font-bold text-xs"
                    style={{ color: s.color }}
                  >
                    {s.level}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.level}%`,
                      background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                      boxShadow: `0 0 8px ${s.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span
              className="font-orbitron font-bold text-xs tracking-widest"
              style={{ color: "#22d3ee" }}
            >
              ⟐ PROJECTS
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {PROJECTS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl p-5 relative overflow-hidden group transition-all duration-200"
                style={{
                  background: isDark
                    ? "rgba(4,10,24,0.85)"
                    : "rgba(255,255,255,0.88)",
                  border: `1px solid ${p.color}22`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${p.color}45`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${p.color}12`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${p.color}22`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg,transparent,${p.color}60,transparent)`,
                  }}
                />
                <h3
                  className="font-orbitron font-bold text-sm mb-2"
                  style={{ color: p.color }}
                >
                  {p.name}
                </h3>
                <p
                  className="font-rajdhani text-sm leading-relaxed mb-3"
                  style={{ color: "#64748b" }}
                >
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                      style={{
                        background: `${p.color}10`,
                        color: `${p.color}bb`,
                        border: `1px solid ${p.color}20`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-mono transition-all"
                    style={{
                      background: `${p.color}10`,
                      border: `1px solid ${p.color}25`,
                      color: p.color,
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = `${p.color}20`)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = `${p.color}10`)
                    }
                  >
                    Live →
                  </a>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-mono transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#475569",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                    onMouseLeave={(e) => (e.target.style.color = "#475569")}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EDUCATION & INTERESTS ── */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Education */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: isDark
                ? "rgba(4,10,24,0.85)"
                : "rgba(255,255,255,0.88)",
              border: "1px solid rgba(34,211,238,0.15)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(34,211,238,0.5),transparent)",
              }}
            />
            <div
              className="font-orbitron font-bold text-xs tracking-widest mb-5"
              style={{ color: "#22d3ee" }}
            >
              ◈ EDUCATION
            </div>
            <div className="flex flex-col gap-4">
              {[
                {
                  degree: "B.Sc. in Computer Science",
                  institute: "University — In Progress",
                  year: "2021–Present",
                  color: "#22d3ee",
                },
                {
                  degree: "Higher Secondary (HSC)",
                  institute: "Sir Ashotush Govt. College",
                  year: "2018–2020",
                  color: "#34d399",
                },
                {
                  degree: "Secondary (SSC)",
                  institute: "High School",
                  year: "–2018",
                  color: "#a78bfa",
                },
              ].map((e) => (
                <div key={e.degree} className="flex gap-3">
                  <div
                    className="w-1 rounded-full flex-shrink-0 mt-1"
                    style={{
                      background: e.color,
                      boxShadow: `0 0 6px ${e.color}`,
                      minHeight: "40px",
                    }}
                  />
                  <div>
                    <div
                      className="font-orbitron font-bold text-xs"
                      style={{ color: e.color }}
                    >
                      {e.degree}
                    </div>
                    <div
                      className="font-rajdhani text-sm"
                      style={{ color: "#64748b" }}
                    >
                      {e.institute}
                    </div>
                    <div
                      className="font-mono text-[10px]"
                      style={{ color: "#334155" }}
                    >
                      {e.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests & hobbies */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: isDark
                ? "rgba(4,10,24,0.85)"
                : "rgba(255,255,255,0.88)",
              border: "1px solid rgba(251,146,60,0.15)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(251,146,60,0.5),transparent)",
              }}
            />
            <div
              className="font-orbitron font-bold text-xs tracking-widest mb-5"
              style={{ color: "#fb923c" }}
            >
              ◈ INTERESTS
            </div>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: "🧮",
                  label: "Data Structures & Algorithms",
                  sub: "Solving problems on multiple judges",
                },
                { icon: "🎮", label: "Gaming", sub: "Loves playing games" },
                { icon: "🏋️", label: "Gym & Fitness", sub: "Regular gym-goer" },
                {
                  icon: "📐",
                  label: "Math Visualization",
                  sub: "Fascinated by geometric & analytical math",
                },
                {
                  icon: "🤝",
                  label: "Open Source",
                  sub: "Looking to collaborate on OSS projects",
                },
              ].map((i) => (
                <div key={i.label} className="flex items-start gap-3">
                  <span style={{ fontSize: "1rem" }}>{i.icon}</span>
                  <div>
                    <div
                      className="font-rajdhani font-semibold text-sm"
                      style={{ color: isDark ? "#94a3b8" : "#475569" }}
                    >
                      {i.label}
                    </div>
                    <div
                      className="font-mono text-[10px]"
                      style={{ color: "#334155" }}
                    >
                      {i.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTACT CTA ── */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: isDark ? "rgba(4,10,24,0.9)" : "rgba(255,255,255,0.88)",
            border: "1px solid rgba(244,114,182,0.2)",
            boxShadow: "0 0 40px rgba(244,114,182,0.05)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(244,114,182,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div
              className="font-orbitron font-black text-xl sm:text-2xl mb-2"
              style={{
                background: "linear-gradient(90deg,#f472b6,#a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Let's Build Together
            </div>
            <p
              className="font-rajdhani text-base mb-6"
              style={{ color: "#64748b" }}
            >
              Open to collaboration, freelance work, and interesting open source
              projects
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=hafizsakib5@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(244,114,182,0.12)",
                  border: "1px solid rgba(244,114,182,0.3)",
                  color: "#f472b6",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(244,114,182,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(244,114,182,0.12)")
                }
              >
                ✉ Send Email
              </a>
              <a
                href="https://github.com/Hafiz-Sakib"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  color: "#a78bfa",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(139,92,246,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(139,92,246,0.1)")
                }
              >
                ⌥ GitHub Profile
              </a>
              <a
                href="https://hafizsakib.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#22d3ee",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(34,211,238,0.15)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(34,211,238,0.08)")
                }
              >
                🌐 Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* ── BACK BUTTON ── */}
        <div className="flex justify-center pb-4">
          <button
            onClick={() => setPage && setPage("home")}
            className="font-mono text-xs transition-colors"
            style={{ color: "#334155" }}
            onMouseEnter={(e) => (e.target.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.target.style.color = "#334155")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

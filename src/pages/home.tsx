import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase — replace with your actual URL and anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

const MINION_IMAGES = [
  { src: "/Mini-1.jpg", label: "Punk Boss" },
  { src: "/Mini-2.jpg", label: "Cool Guy" },
  { src: "/Mini-3.jpg", label: "Spiky Red" },
  { src: "/Mini-4.jpg", label: "Green Flame" },
];

// Floating positions & animations (deterministic so no hydration issues)
const FLOATERS = [
  { x: 6,  y: 12, delay: 0,   dur: 6.2, rotate: -8  },
  { x: 78, y: 8,  delay: 1.1, dur: 7.0, rotate: 6   },
  { x: 55, y: 60, delay: 0.5, dur: 5.8, rotate: -4  },
  { x: 18, y: 65, delay: 1.8, dur: 6.5, rotate: 10  },
];

const TASKS = [
  {
    id: "follow",
    icon: "𝕏",
    label: "Follow Minions",
    desc: "Be the first to know",
    href: "https://x.com/theminionxyz",
  },
  {
    id: "like",
    icon: "🔁",
    label: "Like & Retweet",
    desc: "Spread the minion wave",
    href: "https://x.com/theminionxyz",
  },
  {
    id: "comment",
    icon: "💬",
    label: "Comment & Tag 2 Frens",
    desc: "More frens = more fun",
    href: "https://x.com/theminionxyz",
  },
];

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const [wallet, setWallet] = useState("");
  const [twitter, setTwitter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit() {
    if (!wallet.trim() || !twitter.trim()) {
      setError("Fill in both fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    const { error: dbErr } = await supabase
      .from("minions")
      .insert([{ wallet: wallet.trim(), twitter: twitter.trim() }]);
    setSubmitting(false);
    if (dbErr) {
      setError("Something went wrong. Try again.");
    } else {
      setSubmitted(true);
    }
  }

  function toggleTask(id: string) {
    setTasksDone((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8c8e8 0%, #b8d4ec 40%, #8fb8d8 100%)",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Floating Minion Characters ── */}
      {MINION_IMAGES.map((m, i) => {
        const f = FLOATERS[i];
        return (
          <div
            key={m.src}
            style={{
              position: "fixed",
              left: `${f.x}%`,
              top: `${f.y}%`,
              zIndex: 0,
              animation: `floatBob${i} ${f.dur}s ease-in-out ${f.delay}s infinite`,
              transform: `rotate(${f.rotate}deg)`,
              opacity: visible ? 0.92 : 0,
              transition: "opacity 1.2s ease",
            }}
          >
            {/* Glass card */}
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1.5px solid rgba(255,255,255,0.45)",
                borderRadius: "24px",
                padding: "10px 10px 6px",
                boxShadow: "0 8px 32px rgba(100,140,200,0.25), 0 1px 0 rgba(255,255,255,0.6) inset",
              }}
            >
              <img
                src={m.src}
                alt={m.label}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <p
                style={{
                  margin: "6px 0 2px",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(40,60,80,0.8)",
                  letterSpacing: "0.05em",
                }}
              >
                {m.label}
              </p>
            </div>
          </div>
        );
      })}

      {/* ── Keyframe styles injected inline ── */}
      <style>{`
        @keyframes floatBob0 {
          0%,100%{transform:rotate(-8deg) translateY(0px);}
          50%{transform:rotate(-8deg) translateY(-18px);}
        }
        @keyframes floatBob1 {
          0%,100%{transform:rotate(6deg) translateY(0px);}
          50%{transform:rotate(6deg) translateY(-22px);}
        }
        @keyframes floatBob2 {
          0%,100%{transform:rotate(-4deg) translateY(0px);}
          50%{transform:rotate(-4deg) translateY(-16px);}
        }
        @keyframes floatBob3 {
          0%,100%{transform:rotate(10deg) translateY(0px);}
          50%{transform:rotate(10deg) translateY(-20px);}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(40px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes taskIn {
          from{opacity:0;transform:translateX(-30px);}
          to{opacity:1;transform:translateX(0);}
        }
        @keyframes popIn {
          0%{opacity:0;transform:scale(0.7);}
          80%{transform:scale(1.05);}
          100%{opacity:1;transform:scale(1);}
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(100,180,255,0.5);}
          50%{box-shadow:0 0 0 14px rgba(100,180,255,0);}
        }
        @keyframes confetti {
          0%{transform:translateY(-10px) rotate(0deg);opacity:1;}
          100%{transform:translateY(80px) rotate(720deg);opacity:0;}
        }
      `}</style>

      {/* ── Main Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "40px 20px",
          gap: "28px",
        }}
      >
        {/* Logo + Title */}
        <div
          style={{
            animation: visible ? "slideUp 0.8s ease forwards" : "none",
            opacity: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: "32px",
              padding: "28px 40px 24px",
              boxShadow: "0 16px 48px rgba(80,120,180,0.2)",
              display: "inline-block",
            }}
          >
            <img
              src="/mini-logo.jpg"
              alt="Minions Logo"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.7)",
                marginBottom: "14px",
                boxShadow: "0 4px 20px rgba(100,140,200,0.3)",
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.4rem,6vw,3.6rem)",
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#1a2a3a",
                textShadow: "0 2px 0 rgba(255,255,255,0.6)",
              }}
            >
              MINIONS
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "1rem",
                color: "rgba(30,50,80,0.75)",
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            >
              10,000 little cool minions on ETH
            </p>
          </div>
        </div>

        {/* Tasks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {TASKS.map((task, i) => (
            <a
              key={task.id}
              href={task.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: "none",
                animation: visible
                  ? `taskIn 0.6s ease ${0.3 + i * 0.15}s both`
                  : "none",
                opacity: 0,
              }}
            >
              <div
                style={{
                  background: tasksDone[task.id]
                    ? "rgba(100,200,120,0.22)"
                    : "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1.5px solid ${tasksDone[task.id] ? "rgba(80,200,100,0.6)" : "rgba(255,255,255,0.45)"}`,
                  borderRadius: "20px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "0 4px 20px rgba(80,120,180,0.12)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02) translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(80,120,180,0.22)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(80,120,180,0.12)";
                }}
              >
                <span style={{ fontSize: "2rem", minWidth: "36px", textAlign: "center" }}>
                  {task.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem", color: "#1a2a3a" }}>
                    {task.label}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "rgba(30,50,80,0.65)" }}>
                    {task.desc}
                  </p>
                </div>
                <span style={{ fontSize: "1.4rem" }}>
                  {tasksDone[task.id] ? "✅" : "→"}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Whitelist Button */}
        <div
          style={{
            animation: visible ? "slideUp 0.8s ease 0.7s both" : "none",
            opacity: 0,
          }}
        >
          <button
            onClick={() => setFormOpen(true)}
            style={{
              background: "linear-gradient(135deg, #1a2a3a 0%, #2d4a6a 100%)",
              color: "#fff",
              border: "2.5px solid rgba(255,255,255,0.3)",
              borderRadius: "50px",
              padding: "18px 52px",
              fontSize: "1.1rem",
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              animation: "pulse 2.5s ease-in-out infinite",
              boxShadow: "0 8px 32px rgba(30,60,100,0.35)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "")
            }
          >
            🎯 Join Whitelist
          </button>
        </div>

        {/* Supply tag */}
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            color: "rgba(30,50,80,0.55)",
            letterSpacing: "0.08em",
            fontWeight: 600,
            animation: visible ? "slideUp 0.8s ease 0.9s both" : "none",
            opacity: 0,
          }}
        >
          10,000 SUPPLY · ETH BLOCKCHAIN
        </p>
      </div>

      {/* ── Whitelist Modal ── */}
      {formOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,20,40,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setFormOpen(false);
              setSubmitted(false);
              setWallet("");
              setTwitter("");
            }
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: "28px",
              padding: "36px 32px 32px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 24px 64px rgba(20,40,80,0.35)",
              animation: "popIn 0.4s ease forwards",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => {
                setFormOpen(false);
                setSubmitted(false);
                setWallet("");
                setTwitter("");
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "18px",
                background: "none",
                border: "none",
                fontSize: "1.3rem",
                cursor: "pointer",
                color: "rgba(30,50,80,0.7)",
              }}
            >
              ✕
            </button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🎉</div>
                <h2 style={{ margin: "0 0 8px", color: "#1a2a3a", fontWeight: 900, fontSize: "1.5rem" }}>
                  You&apos;re in!
                </h2>
                <p style={{ color: "rgba(30,50,80,0.7)", margin: 0 }}>
                  Your spot is saved. Welcome to the minion family.
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <img
                    src="/mini-logo.jpg"
                    alt="logo"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "10px",
                      border: "2px solid rgba(255,255,255,0.7)",
                    }}
                  />
                  <h2 style={{ margin: 0, color: "#1a2a3a", fontWeight: 900, fontSize: "1.4rem" }}>
                    Claim Your Spot
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "rgba(30,50,80,0.65)" }}>
                    Whitelist is limited — be early.
                  </p>
                </div>

                <label style={{ display: "block", marginBottom: "14px" }}>
                  <span style={labelStyle}>Wallet Address</span>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "block", marginBottom: "20px" }}>
                  <span style={labelStyle}>Twitter / X Handle</span>
                  <input
                    type="text"
                    placeholder="@yourusername"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    style={inputStyle}
                  />
                </label>

                {error && (
                  <p style={{ color: "#e05050", fontSize: "0.82rem", margin: "-8px 0 12px", fontWeight: 600 }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #1a2a3a 0%, #2d4a6a 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "14px",
                    padding: "15px",
                    fontSize: "1rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {submitting ? "Saving..." : "🚀 Submit"}
                </button>

                <p style={{ textAlign: "center", marginTop: "14px", fontSize: "0.75rem", color: "rgba(30,50,80,0.5)" }}>
                  Make sure you&apos;ve completed all tasks above first!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "0.8rem",
  fontWeight: 700,
  color: "rgba(30,50,80,0.75)",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.4)",
  border: "1.5px solid rgba(255,255,255,0.6)",
  borderRadius: "12px",
  padding: "12px 14px",
  fontSize: "0.95rem",
  color: "#1a2a3a",
  outline: "none",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

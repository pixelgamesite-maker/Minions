import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

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

const INIT_POS = [
  { x: 18, y: 10 },
  { x: 72, y: 8  },
  { x: 10, y: 62 },
  { x: 68, y: 60 },
];

const TASKS = [
  { id: "follow",  label: "Follow Minions",        desc: "Be the first to know",    href: "https://x.com/theminionxyz" },
  { id: "like",    label: "Like & Retweet",         desc: "Spread the minion wave",  href: "https://x.com/theminionxyz" },
  { id: "comment", label: "Comment & Tag 2 Frens",  desc: "More frens = more fun",   href: "https://x.com/theminionxyz" },
];

// ── Draggable minion ──────────────────────────────────────────
function DraggableMinion({
  img, label, initX, initY, bobDelay, bobDur,
}: {
  img: string; label: string; initX: number; initY: number;
  bobDelay: number; bobDur: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: initX, y: initY });
  const dragging = useRef(false);
  const origin = useRef({ px: 0, py: 0, ex: 0, ey: 0 });

  function applyPos() {
    if (ref.current) {
      ref.current.style.left = pos.current.x + "%";
      ref.current.style.top  = pos.current.y + "%";
    }
  }

  useEffect(() => { applyPos(); }, []);

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    origin.current = {
      px: pos.current.x,
      py: pos.current.y,
      ex: e.clientX,
      ey: e.clientY,
    };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    if (ref.current) ref.current.style.animation = "none";
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = ((e.clientX - origin.current.ex) / window.innerWidth)  * 100;
    const dy = ((e.clientY - origin.current.ey) / window.innerHeight) * 100;
    pos.current = {
      x: Math.min(90, Math.max(0, origin.current.px + dx)),
      y: Math.min(90, Math.max(0, origin.current.py + dy)),
    };
    applyPos();
  }

  function onPointerUp() {
    dragging.current = false;
    if (ref.current) ref.current.style.animation = "";
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "fixed",
        zIndex: 0,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        animation: `bob ${bobDur}s ease-in-out ${bobDelay}s infinite`,
      }}
    >
      <img
        src={img}
        alt={label}
        draggable={false}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
          border: "2.5px solid rgba(255,255,255,0.7)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Home() {
  const [formOpen, setFormOpen]   = useState(false);
  const [wallet,   setWallet]     = useState("");
  const [twitter,  setTwitter]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,    setError]      = useState("");
  const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({});
  const [mounted,  setMounted]    = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("minions_tasks");
      if (saved) setTasksDone(JSON.parse(saved));
    } catch {}
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Persist tasks to localStorage
  useEffect(() => {
    if (mounted) localStorage.setItem("minions_tasks", JSON.stringify(tasksDone));
  }, [tasksDone, mounted]);

  function toggleTask(id: string) {
    setTasksDone((p) => ({ ...p, [id]: !p[id] }));
  }

  async function handleSubmit() {
    if (!wallet.trim() || !twitter.trim()) { setError("Fill in both fields."); return; }
    setError("");
    setSubmitting(true);
    const { error: dbErr } = await supabase
      .from("minions")
      .insert([{ wallet: wallet.trim(), twitter: twitter.trim() }]);
    setSubmitting(false);
    if (dbErr) setError("Something went wrong. Try again.");
    else setSubmitted(true);
  }

  function closeForm() {
    setFormOpen(false); setSubmitted(false); setWallet(""); setTwitter(""); setError("");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#b8d4ec 0%,#a4c4e0 60%,#8fb8d8 100%)",
      fontFamily: "'Segoe UI',Arial,sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes bob {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-12px);}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(32px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes taskIn {
          from{opacity:0;transform:translateY(20px);}
          to{opacity:1;transform:translateY(0);}
        }
        @keyframes popIn {
          0%{opacity:0;transform:scale(0.82);}
          80%{transform:scale(1.03);}
          100%{opacity:1;transform:scale(1);}
        }
        @keyframes subtlePulse {
          0%,100%{box-shadow:0 4px 24px rgba(20,40,80,0.28);}
          50%{box-shadow:0 4px 36px rgba(20,40,80,0.45);}
        }
        input::placeholder{color:rgba(30,50,80,0.38);}
        input:focus{border-color:rgba(30,60,120,0.45)!important;outline:none;}
      `}</style>

      {/* ── Floating minions ── */}
      {MINION_IMAGES.map((m, i) => (
        <DraggableMinion
          key={m.src}
          img={m.src}
          label={m.label}
          initX={INIT_POS[i].x}
          initY={INIT_POS[i].y}
          bobDelay={i * 0.4}
          bobDur={5 + i * 0.5}
        />
      ))}

      {/* ── Main content ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "60px 24px 48px",
        gap: "20px",
      }}>

        {/* Logo + title */}
        <div style={{
          textAlign: "center",
          animation: mounted ? "slideUp 0.7s ease both" : "none",
          opacity: mounted ? undefined : 0,
        }}>
          <img src="/mini-logo.jpg" alt="Minions" style={{
            width: "64px", height: "64px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid rgba(255,255,255,0.85)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
            marginBottom: "14px",
          }} />
          <h1 style={{
            margin: 0,
            fontSize: "clamp(2.8rem,8vw,4rem)",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0f1e2e",
            lineHeight: 1,
          }}>
            MINIONS
          </h1>
          <p style={{
            margin: "8px 0 0",
            fontSize: "0.95rem",
            color: "rgba(15,30,46,0.6)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}>
            10,000 little cool minions on ETH.
          </p>
        </div>

        {/* Tasks */}
        <div style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {TASKS.map((task, i) => (
            <a
              key={task.id}
              href={task.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: "none",
                animation: mounted ? `taskIn 0.55s ease ${0.2 + i * 0.12}s both` : "none",
                opacity: mounted ? undefined : 0,
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: "16px",
                background: tasksDone[task.id]
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.3)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: tasksDone[task.id]
                  ? "1.5px solid rgba(255,255,255,0.9)"
                  : "1.5px solid rgba(255,255,255,0.55)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                transition: "background 0.2s, transform 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = ""}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "#0f1e2e" }}>
                    {task.label}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "rgba(15,30,46,0.55)" }}>
                    {task.desc}
                  </p>
                </div>
                <span style={{ fontSize: "1.1rem", marginLeft: "12px" }}>
                  {tasksDone[task.id] ? "✅" : "→"}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Whitelist button — NPC style */}
        <div style={{
          animation: mounted ? "slideUp 0.7s ease 0.55s both" : "none",
          opacity: mounted ? undefined : 0,
          width: "100%",
          maxWidth: "380px",
        }}>
          <button
            onClick={() => setFormOpen(true)}
            style={{
              width: "100%",
              background: "#0f1e2e",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "17px 0",
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              animation: "subtlePulse 3s ease-in-out infinite",
              transition: "transform 0.15s, opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = ""}
          >
            JOIN WHITELIST
          </button>
        </div>

        {/* Supply */}
        <p style={{
          margin: 0,
          fontSize: "0.72rem",
          color: "rgba(15,30,46,0.42)",
          letterSpacing: "0.1em",
          fontWeight: 600,
          textTransform: "uppercase",
          animation: mounted ? "slideUp 0.7s ease 0.7s both" : "none",
          opacity: mounted ? undefined : 0,
        }}>
          10,000 Supply · ETH Blockchain
        </p>
      </div>

      {/* ── Whitelist modal ── */}
      {formOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(8,16,28,0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "20px",
          }}
        >
          <div style={{
            width: "100%", maxWidth: "380px",
            background: "rgba(230,240,252,0.75)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1.5px solid rgba(255,255,255,0.75)",
            borderRadius: "24px",
            padding: "32px 28px 28px",
            boxShadow: "0 24px 60px rgba(8,16,28,0.35)",
            animation: "popIn 0.35s ease forwards",
            position: "relative",
          }}>
            {/* Close */}
            <button onClick={closeForm} style={{
              position: "absolute", top: "14px", right: "16px",
              background: "none", border: "none",
              fontSize: "1.1rem", cursor: "pointer",
              color: "rgba(15,30,46,0.5)", lineHeight: 1,
            }}>✕</button>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎉</div>
                <h2 style={{ margin: "0 0 6px", color: "#0f1e2e", fontWeight: 900, fontSize: "1.4rem" }}>
                  You're in!
                </h2>
                <p style={{ color: "rgba(15,30,46,0.6)", margin: 0, fontSize: "0.9rem" }}>
                  Spot saved. Welcome to the minion family.
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "22px" }}>
                  <img src="/mini-logo.jpg" alt="logo" style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    objectFit: "cover", marginBottom: "10px",
                    border: "2px solid rgba(255,255,255,0.8)",
                  }} />
                  <h2 style={{ margin: 0, color: "#0f1e2e", fontWeight: 900, fontSize: "1.3rem" }}>
                    Claim Your Spot
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "rgba(15,30,46,0.55)" }}>
                    Whitelist is limited — be early.
                  </p>
                </div>

                <label style={{ display: "block", marginBottom: "12px" }}>
                  <span style={labelStyle}>Wallet Address</span>
                  <input
                    type="text" placeholder="0x..."
                    value={wallet} onChange={e => setWallet(e.target.value)}
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "block", marginBottom: "18px" }}>
                  <span style={labelStyle}>Twitter / X Handle</span>
                  <input
                    type="text" placeholder="@yourusername"
                    value={twitter} onChange={e => setTwitter(e.target.value)}
                    style={inputStyle}
                  />
                </label>

                {error && (
                  <p style={{ color: "#c0392b", fontSize: "0.8rem", margin: "-6px 0 12px", fontWeight: 600 }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    background: "#0f1e2e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.65 : 1,
                    transition: "opacity 0.2s, transform 0.15s",
                  }}
                  onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"}
                  onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = ""}
                >
                  {submitting ? "Saving..." : "Submit"}
                </button>
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
  marginBottom: "5px",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "rgba(15,30,46,0.6)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.55)",
  border: "1.5px solid rgba(255,255,255,0.7)",
  borderRadius: "10px",
  padding: "11px 13px",
  fontSize: "0.92rem",
  color: "#0f1e2e",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

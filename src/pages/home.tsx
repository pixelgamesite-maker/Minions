import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

/* ─── Google Font injected once ─── */
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@700&display=swap";

const MINIONS = [
  { src: "/Mini-1.jpg", id: "m1" },
  { src: "/Mini-2.jpg", id: "m2" },
  { src: "/Mini-3.jpg", id: "m3" },
  { src: "/Mini-4.jpg", id: "m4" },
];

const INIT_POS = [
  { x: 4,  y: 6  },
  { x: 74, y: 4  },
  { x: 2,  y: 70 },
  { x: 72, y: 68 },
];

const TASKS = [
  { id: "follow",  label: "Follow on X",            sub: "@theminionxyz", href: "https://x.com/theminionxyz" },
  { id: "like",    label: "Like & retweet",          sub: "Spread the word",  href: "https://x.com/theminionxyz" },
  { id: "comment", label: "Comment & tag 2 friends", sub: "Reply to the pinned post", href: "https://x.com/theminionxyz" },
];

/* ─── Draggable character ─── */
function Minion({ src, initX, initY, delay }: { src: string; initX: number; initY: number; delay: number }) {
  const el = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: initX, y: initY });
  const drag = useRef(false);
  const start = useRef({ px: 0, py: 0, ex: 0, ey: 0 });

  const sync = useCallback(() => {
    if (!el.current) return;
    el.current.style.left = pos.current.x + "vw";
    el.current.style.top  = pos.current.y + "vh";
  }, []);

  useEffect(() => { sync(); }, [sync]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = true;
    start.current = { px: pos.current.x, py: pos.current.y, ex: e.clientX, ey: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (el.current) el.current.style.animation = "none";
    e.preventDefault();
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    pos.current = {
      x: Math.min(88, Math.max(0, start.current.px + (e.clientX - start.current.ex) / window.innerWidth  * 100)),
      y: Math.min(88, Math.max(0, start.current.py + (e.clientY - start.current.ey) / window.innerHeight * 100)),
    };
    sync();
  };

  const onUp = () => {
    drag.current = false;
    if (el.current) el.current.style.animation = "";
  };

  return (
    <div
      ref={el}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      style={{
        position: "fixed",
        zIndex: 1,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        animation: `bob 6s ease-in-out ${delay}s infinite`,
        willChange: "transform",
      }}
    >
      <img
        src={src}
        draggable={false}
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          display: "block",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── Main ─── */
export default function Home() {
  const [open,       setOpen]       = useState(false);
  const [wallet,     setWallet]     = useState("");
  const [twitter,    setTwitter]    = useState("");
  const [sending,    setSending]    = useState(false);
  const [done,       setDone]       = useState(false);
  const [err,        setErr]        = useState("");
  const [tasks,      setTasks]      = useState<Record<string,boolean>>({});
  const [ready,      setReady]      = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_LINK;
    document.head.appendChild(link);
    try {
      const s = localStorage.getItem("mn_tasks");
      if (s) setTasks(JSON.parse(s));
    } catch {}
    setTimeout(() => setReady(true), 80);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("mn_tasks", JSON.stringify(tasks));
  }, [tasks, ready]);

  const allDone = TASKS.every(t => tasks[t.id]);

  async function submit() {
    if (!wallet.trim() || !twitter.trim()) { setErr("Both fields are required."); return; }
    if (!allDone) { setErr("Complete all tasks first."); return; }
    setErr(""); setSending(true);
    const { error: e } = await supabase.from("minions").insert([{ wallet: wallet.trim(), twitter: twitter.trim() }]);
    setSending(false);
    if (e) setErr("Something went wrong. Try again.");
    else setDone(true);
  }

  function close() { setOpen(false); setDone(false); setWallet(""); setTwitter(""); setErr(""); }

  const mono = "'Space Mono', monospace";
  const sans = "'Space Grotesk', sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e14", fontFamily: sans, position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes bob {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes taskSlide {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        ::placeholder { color: rgba(255,255,255,0.2); }
        * { box-sizing: border-box; }
        input { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* ── Minion characters ── */}
      {MINIONS.map((m, i) => (
        <Minion key={m.id} src={m.src} initX={INIT_POS[i].x} initY={INIT_POS[i].y} delay={i * 0.7} />
      ))}

      {/* ── Noise texture overlay ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />

      {/* ── Logo top-left ── */}
      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 10, display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/mini-logo.jpg" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} alt="Minions" />
        <span style={{ fontFamily: mono, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Minions
        </span>
      </div>

      {/* ── Center content ── */}
      <div style={{
        position: "relative", zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "80px 24px 60px", gap: "0",
      }}>

        {/* Supply pill */}
        <div style={{
          animation: ready ? "fadeUp 0.6s ease 0.05s both" : "none",
          marginBottom: "20px",
        }}>
          <span style={{
            fontFamily: mono, fontSize: "0.65rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "999px",
            padding: "5px 14px", display: "inline-block",
          }}>
            10,000 on ETH
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: mono,
          fontSize: "clamp(3rem, 14vw, 6.5rem)",
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 6px",
          letterSpacing: "-0.02em",
          lineHeight: 0.95,
          textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.12s both" : "none",
          opacity: ready ? undefined : 0,
        }}>
          MINIONS
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: sans, fontSize: "1rem", color: "rgba(255,255,255,0.4)",
          margin: "0 0 40px", fontWeight: 400, textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.2s both" : "none",
          opacity: ready ? undefined : 0,
        }}>
          10,000 little cool minions coming on ETH
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setOpen(true)}
          style={{
            animation: ready ? "fadeUp 0.6s ease 0.28s both" : "none",
            opacity: ready ? undefined : 0,
            fontFamily: mono,
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0c0e14",
            background: "linear-gradient(90deg, #e8f4fd 0%, #ffffff 40%, #c8e8ff 70%, #ffffff 100%)",
            backgroundSize: "200% auto",
            border: "none",
            borderRadius: "8px",
            padding: "18px 48px",
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.animation = "shimmer 1.5s linear infinite, fadeUp 0.6s ease 0.28s both";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
          }}
          onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"}
          onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = ""}
        >
          Join Whitelist
        </button>

      </div>

      {/* ── Modal overlay ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) close(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{
            width: "100%", maxWidth: "400px",
            background: "#13161f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "32px 28px",
            animation: "modalIn 0.3s ease both",
            position: "relative",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          }}>

            {/* Close */}
            <button onClick={close} style={{
              position: "absolute", top: "16px", right: "18px",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.3)", fontSize: "1.1rem", lineHeight: 1,
              fontFamily: sans,
            }}>✕</button>

            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>✓</div>
                <h2 style={{ fontFamily: mono, color: "#fff", margin: "0 0 8px", fontSize: "1.3rem", letterSpacing: "-0.01em" }}>
                  You're in.
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: sans, fontSize: "0.9rem" }}>
                  Spot saved. Welcome to the family.
                </p>
              </div>
            ) : (
              <>
                {/* Modal header */}
                <div style={{ marginBottom: "28px" }}>
                  <span style={{
                    fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
                  }}>
                    Whitelist
                  </span>
                  <h2 style={{
                    fontFamily: mono, color: "#ffffff", margin: "4px 0 0",
                    fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em",
                  }}>
                    Claim your spot
                  </h2>
                </div>

                {/* Tasks */}
                <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{
                    fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
                    margin: "0 0 4px",
                  }}>
                    Complete to unlock
                  </p>
                  {TASKS.map((t, i) => (
                    <a
                      key={t.id}
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTasks(p => ({ ...p, [t.id]: true }))}
                      style={{
                        textDecoration: "none",
                        animation: `taskSlide 0.4s ease ${i * 0.08}s both`,
                      }}
                    >
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: tasks[t.id] ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                        border: tasks[t.id]
                          ? "1px solid rgba(255,255,255,0.15)"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "background 0.2s, border 0.2s",
                        cursor: "pointer",
                      }}>
                        <div>
                          <p style={{
                            margin: 0, fontFamily: sans, fontWeight: 600,
                            fontSize: "0.88rem", color: tasks[t.id] ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                            transition: "color 0.2s",
                          }}>
                            {t.label}
                          </p>
                          <p style={{
                            margin: "2px 0 0", fontFamily: sans, fontSize: "0.73rem",
                            color: "rgba(255,255,255,0.28)",
                          }}>
                            {t.sub}
                          </p>
                        </div>
                        <div style={{
                          width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                          border: tasks[t.id] ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                          background: tasks[t.id] ? "#ffffff" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {tasks[t.id] && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="#0c0e14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 22px" }} />

                {/* Inputs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{
                      display: "block", fontFamily: sans, fontSize: "0.72rem", fontWeight: 600,
                      color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: "6px",
                    }}>
                      Wallet address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={wallet}
                      onChange={e => setWallet(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", padding: "12px 14px",
                        fontSize: "0.9rem", color: "#fff",
                        fontFamily: mono, outline: "none",
                        transition: "border 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: "block", fontFamily: sans, fontSize: "0.72rem", fontWeight: 600,
                      color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
                      textTransform: "uppercase", marginBottom: "6px",
                    }}>
                      X / Twitter handle
                    </label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px", padding: "12px 14px",
                        fontSize: "0.9rem", color: "#fff",
                        fontFamily: mono, outline: "none",
                        transition: "border 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                  </div>
                </div>

                {err && (
                  <p style={{ fontFamily: sans, fontSize: "0.8rem", color: "#ff6b6b", margin: "0 0 12px", fontWeight: 500 }}>
                    {err}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={sending}
                  style={{
                    width: "100%",
                    background: allDone ? "#ffffff" : "rgba(255,255,255,0.08)",
                    color: allDone ? "#0c0e14" : "rgba(255,255,255,0.3)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px",
                    fontFamily: mono,
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: allDone ? "pointer" : "not-allowed",
                    transition: "all 0.25s",
                  }}
                  onMouseDown={e => allDone && ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                  onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.transform = "")}
                >
                  {sending ? "Saving..." : allDone ? "Submit" : "Complete tasks to unlock"}
                </button>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

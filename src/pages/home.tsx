import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@700&display=swap";

const MINIONS = [
  "/Mini-1.jpg", "/Mini-2.jpg", "/Mini-3.jpg",
  "/Mini-4.jpg", "/Mini-5.jpg", "/Mini-6.jpg",
  "/Mini-7.jpg", "/Mini-8.jpg", "/Mini-9.jpg",
];

function isValidEvm(addr: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr.trim());
}
function isValidUrl(url: string) {
  try { return new URL(url.trim()).protocol === "https:"; }
  catch { return false; }
}

const mono = "'Space Mono', monospace";
const sans = "'Space Grotesk', sans-serif";

/* ─── Flip Card ─── */
function FlipCard({
  index, icon, title, subtitle, done, locked,
  children, onFlip,
}: {
  index: number; icon: string; title: string; subtitle: string;
  done: boolean; locked: boolean;
  children?: React.ReactNode;
  onFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  // auto-flip open if already done (from localStorage)
  useEffect(() => {
    if (done) setFlipped(true);
  }, [done]);

  function handleClick() {
    if (locked) return;
    if (!flipped) {
      setFlipped(true);
      onFlip?.();
    }
  }

  const cardColor = [
    "linear-gradient(135deg,#1a1f35 0%,#0f1420 100%)",
    "linear-gradient(135deg,#1a2535 0%,#0f1820 100%)",
    "linear-gradient(135deg,#1f1a35 0%,#140f20 100%)",
    "linear-gradient(135deg,#1a3525 0%,#0f2018 100%)",
  ][index] ?? "linear-gradient(135deg,#1a1f35,#0f1420)";

  const glowColor = ["rgba(100,120,255,0.15)","rgba(60,160,220,0.15)","rgba(180,100,255,0.15)","rgba(60,200,130,0.15)"][index] ?? "rgba(255,255,255,0.08)";

  return (
    <div
      onClick={handleClick}
      style={{
        perspective: "1000px",
        cursor: locked ? "not-allowed" : flipped ? "default" : "pointer",
        animation: `cardIn 0.45s ease ${0.1 + index * 0.1}s both`,
      }}
    >
      <div style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        minHeight: flipped ? "auto" : "130px",
      }}>

        {/* ── FRONT (locked face) ── */}
        <div style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          position: flipped ? "absolute" : "relative",
          inset: 0,
          background: cardColor,
          border: `1px solid ${locked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          minHeight: "130px",
          boxShadow: `0 4px 24px ${glowColor}, 0 1px 0 rgba(255,255,255,0.06) inset`,
          opacity: locked ? 0.45 : 1,
        }}>
          <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{locked ? "🔒" : icon}</span>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: mono, fontSize: "0.72rem", fontWeight: 700, color: locked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
              {title}
            </p>
            {!locked && (
              <p style={{ margin: "4px 0 0", fontFamily: sans, fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
                Tap to open
              </p>
            )}
          </div>
        </div>

        {/* ── BACK (task content) ── */}
        <div style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          position: flipped ? "relative" : "absolute",
          inset: 0,
          background: done
            ? "linear-gradient(135deg,#0f2a1a 0%,#0a1f12 100%)"
            : cardColor,
          border: `1px solid ${done ? "rgba(80,220,120,0.3)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: "16px",
          padding: "18px 16px",
          boxShadow: done
            ? "0 4px 24px rgba(60,200,100,0.15)"
            : `0 4px 24px ${glowColor}`,
          minHeight: "130px",
        }}>
          {/* card header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem" }}>{icon}</span>
              <div>
                <p style={{ margin: 0, fontFamily: mono, fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
                  {title}
                </p>
                <p style={{ margin: "1px 0 0", fontFamily: sans, fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                  {subtitle}
                </p>
              </div>
            </div>
            {/* done badge */}
            {done && (
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                background: "#3ddc84", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#0a1f12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          {/* task body */}
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Auto-rotating gallery ─── */
function MinionGallery() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(advance, 3000);
    return () => clearTimeout(timerRef.current);
  }, [current]);

  function advance() {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => (c + 1) % MINIONS.length);
      setAnimating(false);
    }, 300);
  }

  function goTo(i: number) {
    if (i === current) return;
    clearTimeout(timerRef.current);
    setAnimating(true);
    setTimeout(() => { setCurrent(i); setAnimating(false); }, 300);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
      {/* main image */}
      <div style={{
        width: "100%", maxWidth: "320px",
        aspectRatio: "1/1",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
      }}>
        <img
          src={MINIONS[current]}
          alt={`Minion ${current + 1}`}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            opacity: animating ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
      {/* counter */}
      <p style={{ fontFamily: mono, fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", margin: 0 }}>
        {String(current + 1).padStart(2,"0")} / {String(MINIONS.length).padStart(2,"0")}
      </p>
      {/* dots */}
      <div style={{ display: "flex", gap: "6px" }}>
        {MINIONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === current ? "#ffffff" : "rgba(255,255,255,0.2)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function Home() {
  const [open,     setOpen]     = useState(false);
  const [wallet,   setWallet]   = useState("");
  const [twitter,  setTwitter]  = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [sending,  setSending]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [err,      setErr]      = useState("");
  const [tasks,    setTasks]    = useState<Record<string, boolean>>({});
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_LINK;
    document.head.appendChild(link);
    try {
      const saved = localStorage.getItem("mn_tasks_v2");
      if (saved) {
        const p = JSON.parse(saved);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
    } catch {}
    setTimeout(() => setReady(true), 80);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("mn_tasks_v2", JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  const card1Done = twitter.trim().length > 1;
  const card2Done = !!tasks["like"];
  const card3Done = isValidUrl(quoteUrl);
  const card4Done = isValidEvm(wallet);
  const allDone   = card1Done && card2Done && card3Done && card4Done;

  async function submit() {
    if (!allDone) { setErr("Complete all cards first."); return; }
    setErr(""); setSending(true);
    const { error: e } = await supabase.from("minions").insert([{
      wallet: wallet.trim(), twitter: twitter.trim(), quote_url: quoteUrl.trim(),
    }]);
    setSending(false);
    if (e) setErr("Something went wrong. Try again.");
    else setSuccess(true);
  }

  function close() {
    setOpen(false); setSuccess(false); setErr("");
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "rgba(255,255,255,0.3)"; }
  function blurBorder(e: React.FocusEvent<HTMLInputElement>)  { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
    padding: "10px 12px", fontSize: "0.82rem", color: "#fff",
    fontFamily: mono, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e14", fontFamily: sans, overflowX: "hidden" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(18px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.96) translateY(14px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes stamp {
          0%   { transform:scale(0) rotate(-20deg); opacity:0; }
          60%  { transform:scale(1.2) rotate(4deg); opacity:1; }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        * { box-sizing:border-box; }
        ::placeholder { color:rgba(255,255,255,0.18); font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
      `}</style>

      {/* ── Logo ── */}
      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 10, display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/mini-logo.jpg" style={{ width: "34px", height: "34px", borderRadius: "8px", objectFit: "cover" }} alt="" />
        <span style={{ fontFamily: mono, fontSize: "0.68rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Minions
        </span>
      </div>

      {/* ── Hero ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "100px 24px 60px",
      }}>
        <div style={{ animation: ready ? "fadeUp 0.6s ease 0.05s both" : "none", marginBottom: "18px" }}>
          <span style={{
            fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px", padding: "5px 14px", display: "inline-block",
          }}>
            10,000 on ETH
          </span>
        </div>

        <h1 style={{
          fontFamily: mono, fontSize: "clamp(3rem,14vw,6.5rem)", fontWeight: 700,
          color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 0.95, textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.12s both" : "none", opacity: ready ? undefined : 0,
        }}>
          MINIONS
        </h1>

        <p style={{
          fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.35)",
          margin: "0 0 36px", textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.2s both" : "none", opacity: ready ? undefined : 0,
        }}>
          10,000 little cool minions coming on ETH
        </p>

        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: mono, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "#0c0e14", background: "#ffffff",
            border: "none", borderRadius: "8px", padding: "17px 44px", cursor: "pointer",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 28px rgba(0,0,0,0.5)",
            transition: "transform 0.15s, background 0.15s, box-shadow 0.15s",
            animation: ready ? "fadeUp 0.6s ease 0.28s both" : "none", opacity: ready ? undefined : 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#e8f0ff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
          onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"}
          onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = ""}
        >
          Join Whitelist
        </button>
      </div>

      {/* ── Meet the Minions ── */}
      <div style={{ padding: "0 24px 100px", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px", animation: ready ? "fadeUp 0.6s ease 0.35s both" : "none", opacity: ready ? undefined : 0 }}>
          <span style={{ fontFamily: mono, fontSize: "0.52rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            The collection
          </span>
          <h2 style={{ fontFamily: mono, color: "#fff", margin: "4px 0 0", fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Meet the Minions
          </h2>
        </div>
        <div style={{ animation: ready ? "fadeUp 0.6s ease 0.45s both" : "none", opacity: ready ? undefined : 0 }}>
          <MinionGallery />
        </div>
        <p style={{
          fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: "36px",
          animation: ready ? "fadeUp 0.6s ease 0.55s both" : "none", opacity: ready ? undefined : 0,
        }}>
          10,000 Supply · ETH Blockchain
        </p>
      </div>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) close(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <div style={{
            width: "100%", maxWidth: "440px", maxHeight: "94vh", overflowY: "auto",
            background: "#0e111a",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "22px", padding: "26px 20px 24px",
            animation: "modalIn 0.3s ease both", position: "relative",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
          }}>

            <button onClick={close} style={{
              position: "absolute", top: "14px", right: "16px",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.22)", fontSize: "1rem", lineHeight: 1,
            }}>✕</button>

            {success ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#3ddc84,#2ab865)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px", animation: "stamp 0.5s cubic-bezier(0.23,1,0.32,1) both",
                  boxShadow: "0 8px 24px rgba(60,200,100,0.35)",
                }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                    <path d="M2 9L8 15L20 2" stroke="#0a1f12" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: mono, color: "#fff", margin: "0 0 8px", fontSize: "1.3rem", letterSpacing: "-0.01em" }}>You're in.</h2>
                <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: sans, fontSize: "0.88rem" }}>
                  Spot saved. Welcome to the family.
                </p>
              </div>
            ) : (
              <>
                {/* Modal header */}
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontFamily: mono, fontSize: "0.52rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                    Whitelist
                  </span>
                  <h2 style={{ fontFamily: mono, color: "#fff", margin: "4px 0 2px", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                    Claim your spot
                  </h2>
                  {/* progress bar */}
                  <div style={{ marginTop: "10px", height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "2px",
                      background: "linear-gradient(90deg,#4f8eff,#a78bfa)",
                      width: `${([card1Done,card2Done,card3Done,card4Done].filter(Boolean).length / 4) * 100}%`,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  <p style={{ fontFamily: sans, fontSize: "0.68rem", color: "rgba(255,255,255,0.25)", margin: "6px 0 0" }}>
                    {[card1Done,card2Done,card3Done,card4Done].filter(Boolean).length} of 4 completed
                  </p>
                </div>

                {/* 2×2 flip card grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>

                  {/* Card 1 — X Handle */}
                  <FlipCard index={0} icon="𝕏" title="X Handle" subtitle="Your username" done={card1Done} locked={false}>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={inputStyle}
                      onFocus={focusBorder} onBlur={blurBorder}
                    />
                    {card1Done && (
                      <p style={{ fontFamily: sans, fontSize: "0.65rem", color: "#3ddc84", margin: "6px 0 0" }}>
                        Looks good
                      </p>
                    )}
                  </FlipCard>

                  {/* Card 2 — Like & Retweet */}
                  <FlipCard index={1} icon="♻" title="Like & RT" subtitle="Pinned post" done={card2Done} locked={!card1Done}
                    onFlip={() => {
                      window.open("https://x.com/theminionxyz","_blank");
                      setTimeout(() => setTasks(p => ({ ...p, like: true })), 800);
                    }}
                  >
                    {card2Done ? (
                      <p style={{ fontFamily: sans, fontSize: "0.72rem", color: "#3ddc84", margin: 0 }}>
                        Liked & retweeted
                      </p>
                    ) : (
                      <p style={{ fontFamily: sans, fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                        Opening X...
                      </p>
                    )}
                  </FlipCard>

                  {/* Card 3 — Quote tweet */}
                  <FlipCard index={2} icon="💬" title="Quote Tweet" subtitle="Paste your link" done={card3Done} locked={!card2Done}>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={quoteUrl}
                      onChange={e => setQuoteUrl(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={inputStyle}
                      onFocus={focusBorder} onBlur={blurBorder}
                    />
                    {quoteUrl && !isValidUrl(quoteUrl) && (
                      <p style={{ fontFamily: sans, fontSize: "0.62rem", color: "#ff6b6b", margin: "5px 0 0" }}>
                        Needs https://
                      </p>
                    )}
                    {card3Done && (
                      <p style={{ fontFamily: sans, fontSize: "0.62rem", color: "#3ddc84", margin: "5px 0 0" }}>
                        Valid link
                      </p>
                    )}
                  </FlipCard>

                  {/* Card 4 — EVM Wallet */}
                  <FlipCard index={3} icon="◈" title="EVM Wallet" subtitle="0x address" done={card4Done} locked={!card3Done}>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={wallet}
                      onChange={e => setWallet(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={inputStyle}
                      onFocus={focusBorder} onBlur={blurBorder}
                    />
                    {wallet && !isValidEvm(wallet) && (
                      <p style={{ fontFamily: sans, fontSize: "0.62rem", color: "#ff6b6b", margin: "5px 0 0" }}>
                        Invalid address
                      </p>
                    )}
                    {card4Done && (
                      <p style={{ fontFamily: sans, fontSize: "0.62rem", color: "#3ddc84", margin: "5px 0 0" }}>
                        Valid wallet
                      </p>
                    )}
                  </FlipCard>

                </div>

                {err && (
                  <p style={{ fontFamily: sans, fontSize: "0.78rem", color: "#ff6b6b", margin: "0 0 10px", fontWeight: 500 }}>
                    {err}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={sending || !allDone}
                  style={{
                    width: "100%",
                    background: allDone
                      ? "linear-gradient(135deg,#4f8eff 0%,#a78bfa 100%)"
                      : "rgba(255,255,255,0.05)",
                    color: allDone ? "#fff" : "rgba(255,255,255,0.2)",
                    border: "1px solid " + (allDone ? "transparent" : "rgba(255,255,255,0.06)"),
                    borderRadius: "10px", padding: "15px",
                    fontFamily: mono, fontSize: "0.75rem", fontWeight: 700,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    cursor: allDone && !sending ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    boxShadow: allDone ? "0 8px 24px rgba(79,142,255,0.35)" : "none",
                  }}
                  onMouseDown={e => allDone && ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                  onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.transform = "")}
                >
                  {sending ? "Saving..." : allDone ? "Submit" : "Complete all cards"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

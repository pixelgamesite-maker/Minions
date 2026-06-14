import { useState, useEffect } from "react";
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

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "11px 13px",
  fontSize: "0.88rem",
  color: "#fff",
  fontFamily: mono,
  outline: "none",
  transition: "border 0.2s",
  boxSizing: "border-box",
  ...extra,
});

const lbl: React.CSSProperties = {
  display: "block",
  fontFamily: sans,
  fontSize: "0.68rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.32)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: "5px",
};

function TaskRow({ label, sub, done }: { label: string; sub: string; done: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "11px 13px", borderRadius: "10px",
      background: done ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
      border: "1px solid " + (done ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"),
      transition: "background 0.2s, border 0.2s", cursor: "pointer",
    }}>
      <div>
        <p style={{ margin: 0, fontFamily: sans, fontWeight: 600, fontSize: "0.85rem", color: done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)", transition: "color 0.2s" }}>
          {label}
        </p>
        <p style={{ margin: "2px 0 0", fontFamily: sans, fontSize: "0.7rem", color: "rgba(255,255,255,0.24)" }}>
          {sub}
        </p>
      </div>
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
        border: done ? "none" : "1.5px solid rgba(255,255,255,0.14)",
        background: done ? "#ffffff" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        {done && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.2 5.8L8 1" stroke="#0c0e14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [open,     setOpen]     = useState(false);
  const [wallet,   setWallet]   = useState("");
  const [twitter,  setTwitter]  = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [sending,  setSending]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [err,      setErr]      = useState("");
  const [tasks,    setTasks]    = useState<Record<string, boolean>>({});
  const [ready,    setReady]    = useState(false);

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

  const allTasksDone = !!(tasks["follow"] && tasks["like"] && tasks["comment"]);
  const allDone = allTasksDone && isValidEvm(wallet) && isValidUrl(quoteUrl) && twitter.trim().length > 0;

  async function submit() {
    if (!isValidEvm(wallet))  { setErr("Enter a valid EVM wallet address (0x…)."); return; }
    if (!twitter.trim())       { setErr("Enter your X / Twitter handle."); return; }
    if (!isValidUrl(quoteUrl)) { setErr("Enter a valid https:// quote tweet link."); return; }
    if (!allTasksDone)         { setErr("Complete all tasks first."); return; }
    setErr(""); setSending(true);
    const { error: e } = await supabase.from("minions").insert([{
      wallet: wallet.trim(), twitter: twitter.trim(), quote_url: quoteUrl.trim(),
    }]);
    setSending(false);
    if (e) setErr("Something went wrong. Try again.");
    else setDone(true);
  }

  function close() {
    setOpen(false); setDone(false); setWallet(""); setTwitter(""); setQuoteUrl(""); setErr("");
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = "rgba(255,255,255,0.28)"; }
  function blurBorder(e: React.FocusEvent<HTMLInputElement>)  { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e14", fontFamily: sans, overflowX: "hidden" }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes taskSlide {
          from { opacity:0; transform:translateX(-14px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.95) translateY(12px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(20px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        * { box-sizing:border-box; }
        ::placeholder { color:rgba(255,255,255,0.18); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; }
      `}</style>

      {/* ── Logo top-left ── */}
      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 10, display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/mini-logo.jpg" style={{ width: "34px", height: "34px", borderRadius: "8px", objectFit: "cover" }} alt="" />
        <span style={{ fontFamily: mono, fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Minions
        </span>
      </div>

      {/* ── Hero ── */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "100px 24px 60px",
      }}>
        {/* pill */}
        <div style={{ animation: ready ? "fadeUp 0.6s ease 0.05s both" : "none", marginBottom: "18px" }}>
          <span style={{
            fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px", padding: "5px 14px", display: "inline-block",
          }}>
            10,000 on ETH
          </span>
        </div>

        <h1 style={{
          fontFamily: mono, fontSize: "clamp(3rem,14vw,6.5rem)", fontWeight: 700,
          color: "#ffffff", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 0.95,
          textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.12s both" : "none", opacity: ready ? undefined : 0,
        }}>
          MINIONS
        </h1>

        <p style={{
          fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.38)",
          margin: "0 0 36px", textAlign: "center",
          animation: ready ? "fadeUp 0.6s ease 0.2s both" : "none", opacity: ready ? undefined : 0,
        }}>
          10,000 little cool minions coming on ETH
        </p>

        {/* CTA */}
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: mono, fontSize: "0.8rem", fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#0c0e14", background: "#ffffff", border: "none",
            borderRadius: "8px", padding: "17px 44px", cursor: "pointer",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 8px 28px rgba(0,0,0,0.5)",
            transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
            animation: ready ? "fadeUp 0.6s ease 0.28s both" : "none", opacity: ready ? undefined : 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#e8f0ff"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
          onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"}
          onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = ""}
        >
          Join Whitelist
        </button>
      </div>

      {/* ── Meet the Minions ── */}
      <div style={{ padding: "0 24px 100px", maxWidth: "680px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ marginBottom: "28px", animation: ready ? "fadeUp 0.6s ease 0.35s both" : "none", opacity: ready ? undefined : 0 }}>
          <span style={{
            fontFamily: mono, fontSize: "0.55rem", letterSpacing: "0.24em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
          }}>
            The collection
          </span>
          <h2 style={{
            fontFamily: mono, color: "#fff", margin: "4px 0 0",
            fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 700, letterSpacing: "-0.02em",
          }}>
            Meet the Minions
          </h2>
        </div>

        {/* 3-column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}>
          {MINIONS.map((src, i) => (
            <div
              key={src}
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                aspectRatio: "1 / 1",
                animation: ready ? `cardIn 0.5s ease ${0.38 + i * 0.06}s both` : "none",
                opacity: ready ? undefined : 0,
              }}
            >
              <img
                src={src}
                alt={`Minion ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.16em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
          textAlign: "center", marginTop: "32px",
          animation: ready ? "fadeUp 0.6s ease 0.9s both" : "none", opacity: ready ? undefined : 0,
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
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <div style={{
            width: "100%", maxWidth: "420px", maxHeight: "92vh", overflowY: "auto",
            background: "#13161f", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "28px 24px",
            animation: "modalIn 0.28s ease both", position: "relative",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}>

            <button onClick={close} style={{
              position: "absolute", top: "14px", right: "16px",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.25)", fontSize: "1rem", lineHeight: 1, fontFamily: sans,
            }}>✕</button>

            {done ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%", background: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                }}>
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <path d="M2 8L7.5 13.5L18 2" stroke="#0c0e14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: mono, color: "#fff", margin: "0 0 8px", fontSize: "1.25rem" }}>You're in.</h2>
                <p style={{ color: "rgba(255,255,255,0.38)", margin: 0, fontFamily: sans, fontSize: "0.88rem" }}>
                  Spot saved. Welcome to the family.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "22px" }}>
                  <span style={{ fontFamily: mono, fontSize: "0.55rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
                    Whitelist
                  </span>
                  <h2 style={{ fontFamily: mono, color: "#fff", margin: "4px 0 0", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                    Claim your spot
                  </h2>
                </div>

                {/* Tasks */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontFamily: mono, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 8px" }}>
                    Complete to unlock
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                    <a href="https://x.com/theminionxyz" target="_blank" rel="noopener noreferrer"
                      onClick={() => setTasks(p => ({ ...p, follow: true }))}
                      style={{ textDecoration: "none", animation: "taskSlide 0.35s ease 0s both" }}>
                      <TaskRow label="Follow on X" sub="@theminionxyz" done={!!tasks["follow"]} />
                    </a>

                    <div style={{ animation: "taskSlide 0.35s ease 0.08s both" }}>
                      <a href="https://x.com/theminionxyz" target="_blank" rel="noopener noreferrer"
                        onClick={() => setTasks(p => ({ ...p, like: true }))}
                        style={{ textDecoration: "none" }}>
                        <TaskRow label="Like & Quote tweet" sub="Quote the pinned post" done={!!tasks["like"]} />
                      </a>
                      <div style={{ marginTop: "6px" }}>
                        <input
                          type="url"
                          placeholder="https://x.com/your-quote-link"
                          value={quoteUrl}
                          onChange={e => setQuoteUrl(e.target.value)}
                          style={inp({ fontSize: "0.78rem", padding: "9px 12px" })}
                          onFocus={focusBorder} onBlur={blurBorder}
                        />
                        {quoteUrl && !isValidUrl(quoteUrl) && (
                          <p style={{ fontFamily: sans, fontSize: "0.7rem", color: "#ff6b6b", margin: "4px 0 0" }}>
                            Must be a valid https:// link
                          </p>
                        )}
                      </div>
                    </div>

                    <a href="https://x.com/theminionxyz" target="_blank" rel="noopener noreferrer"
                      onClick={() => setTasks(p => ({ ...p, comment: true }))}
                      style={{ textDecoration: "none", animation: "taskSlide 0.35s ease 0.16s both" }}>
                      <TaskRow label="Comment & tag 2 friends" sub="Reply to the pinned post" done={!!tasks["comment"]} />
                    </a>

                  </div>
                </div>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 18px" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={lbl}>EVM Wallet Address</label>
                    <input type="text" placeholder="0x..." value={wallet}
                      onChange={e => setWallet(e.target.value)}
                      style={inp()} onFocus={focusBorder} onBlur={blurBorder} />
                    {wallet && !isValidEvm(wallet) && (
                      <p style={{ fontFamily: sans, fontSize: "0.7rem", color: "#ff6b6b", margin: "4px 0 0" }}>
                        Must be a valid 0x… EVM address
                      </p>
                    )}
                  </div>
                  <div>
                    <label style={lbl}>X / Twitter Handle</label>
                    <input type="text" placeholder="@handle" value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                      style={inp()} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>

                {err && (
                  <p style={{ fontFamily: sans, fontSize: "0.78rem", color: "#ff6b6b", margin: "0 0 10px", fontWeight: 500 }}>
                    {err}
                  </p>
                )}

                <button
                  onClick={submit} disabled={sending}
                  style={{
                    width: "100%",
                    background: allDone ? "#ffffff" : "rgba(255,255,255,0.06)",
                    color: allDone ? "#0c0e14" : "rgba(255,255,255,0.22)",
                    border: "1px solid " + (allDone ? "transparent" : "rgba(255,255,255,0.06)"),
                    borderRadius: "8px", padding: "14px", fontFamily: mono,
                    fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: allDone && !sending ? "pointer" : "not-allowed",
                    transition: "all 0.25s",
                  }}
                  onMouseDown={e => allDone && ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                  onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.transform = "")}
                >
                  {sending ? "Saving..." : allDone ? "Submit" : "Complete all tasks to unlock"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


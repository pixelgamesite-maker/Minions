import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

/* ─────────────────── DESIGN TOKENS ─────────────────── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap";

const serif     = "'Cormorant Garamond', Georgia, serif";
const sans      = "'Space Grotesk', sans-serif";
const gold      = "#c9a84c";
const goldLight = "#e2c97e";
const goldDim   = "#a07830";
const blue      = "#5b8fa8";
const blueDeep  = "#0d1f2b";
const bg        = "#050504";

/* ─────────────────── DATA ─────────────────── */
const MINIONS = Array.from({ length: 23 }, (_, i) => `/Mini-${i + 1}.jpg`);

const CLASSES = [
  { name: "Regulars",  desc: "Clean, simple, and easy to love.",                              num: "01" },
  { name: "Cool Ones", desc: "Extra style, stronger attitude, cleaner presence.",              num: "02" },
  { name: "Wild Ones", desc: "Loud traits and chaotic combinations.",                          num: "03" },
  { name: "Bosses",    desc: "Harder to find. Easier to notice.",                             num: "04" },
  { name: "Originals", desc: "The rarest Minions with deeper connection to $MINO.",           num: "05" },
];

const TRAITS = [
  "Hair", "Outfits", "Accessories", "Moods",
  "Colors", "Body details", "Backgrounds", "Special features",
];

const SYSTEMS = [
  { name: "The Lab",          desc: "Upgrade and experiment with your Minions." },
  { name: "The Arena",        desc: "Games, battles, leaderboards, and rewards." },
  { name: "The Playground",   desc: "Holder games, raffles, missions, and community events." },
  { name: "The Mino Machine", desc: "Use $MINO for spins, rerolls, mystery outcomes, special access, and surprise rewards." },
];

const ROADMAP = [
  { phase: "Phase I",   title: "MinoList Opens",    desc: "Applications, collabs, and early access review begin." },
  { phase: "Phase II",  title: "Mint Opens",         desc: "Selected MinoList wallets mint on OpenSea." },
  { phase: "Phase III", title: "Reveal",             desc: "Minions reveal with traits, classes, and rarity." },
  { phase: "Phase IV",  title: "$MINO Details",      desc: "Tokenomics, supply, and claim mechanics are shared." },
  { phase: "Phase V",   title: "The Systems Begin",  desc: "The Lab, Arena, Playground, and Mino Machine start opening." },
];

const FAQS = [
  { q: "What is Minions?",              a: "A 10,000 supply NFT collection of cute, bold characters on Ethereum." },
  { q: "What is the mint price?",       a: "0.001 ETH." },
  { q: "Where is mint?",                a: "OpenSea." },
  { q: "What is The MinoList?",         a: "The only mint access phase." },
  { q: "Is there public mint?",         a: "If there are any Minions left from The MinoList, yes." },
  { q: "What is $MINO?",                a: "The token planned to power future Minions systems after mint." },
  { q: "When will $MINO details drop?", a: "After mint." },
  { q: "Is this financial advice?",     a: "No. Minions is a digital collectible. DYOR." },
];

/* ─────────────────── HELPERS ─────────────────── */
function isValidEvm(a: string) { return /^0x[0-9a-fA-F]{40}$/.test(a.trim()); }
function isValidUrl(u: string) {
  try { return new URL(u.trim()).protocol === "https:"; } catch { return false; }
}

/* ─────────────────── SHARED COMPONENTS ─────────────────── */

function Label({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
      <div style={{ height: "1px", width: "24px", background: `linear-gradient(90deg,transparent,${gold}55)`, flexShrink: 0 }} />
      <span style={{ fontFamily: sans, fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: gold, whiteSpace: "nowrap", fontWeight: 500 }}>
        {text}
      </span>
      <div style={{ height: "1px", flex: 1, background: `linear-gradient(90deg,${gold}33,transparent)` }} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${gold}1a,transparent)` }} />;
}

/* ─────────────────── GALLERY ─────────────────── */
function MinionGallery() {
  const [cur, setCur]           = useState(0);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [fading, setFading]     = useState(false);
  const [revealing, setRevealing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timer.current = setTimeout(() => fade((cur + 1) % MINIONS.length), 3800);
    return () => clearTimeout(timer.current);
  }, [cur]);

  function fade(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 240);
  }

  function rollRandom() {
    if (revealing) return;
    setRevealing(true);
    setRevealed(null);
    // cycle through a few frames then land
    let ticks = 0;
    const total = 10 + Math.floor(Math.random() * 6);
    const spin = setInterval(() => {
      setCur(Math.floor(Math.random() * MINIONS.length));
      ticks++;
      if (ticks >= total) {
        clearInterval(spin);
        const picked = Math.floor(Math.random() * MINIONS.length);
        setCur(picked);
        setRevealed(picked);
        setRevealing(false);
      }
    }, 80);
  }

  const displayIdx = cur;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Main image */}
      <div style={{
        position: "relative",
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        background: blueDeep,
        border: `1px solid ${blue}22`,
        borderBottom: "none",
        aspectRatio: "1/1",
      }}>
        <img
          src={MINIONS[displayIdx]}
          alt={`Minion ${displayIdx + 1}`}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            opacity: fading || revealing ? 0.3 : 1,
            transition: "opacity 0.24s ease",
            filter: revealing ? "blur(2px)" : "none",
          }}
        />
        {/* Overlay badge when revealed */}
        {revealed !== null && !revealing && (
          <div style={{
            position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
            border: `1px solid ${gold}55`, borderRadius: "999px",
            padding: "8px 20px", whiteSpace: "nowrap",
            animation: "fadeUp 0.5s ease both",
          }}>
            <span style={{ fontFamily: serif, fontSize: "0.95rem", fontWeight: 600, color: goldLight, letterSpacing: "0.03em" }}>
              Minion #{String(revealed + 1).padStart(3, "0")}
            </span>
          </div>
        )}
        {/* Revealing spinner overlay */}
        {revealing && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(5,5,4,0.55)",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              border: `3px solid ${gold}33`,
              borderTopColor: gold,
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        )}
        {/* counter badge */}
        <div style={{
          position: "absolute", top: "14px", right: "14px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          border: `1px solid ${gold}22`, borderRadius: "6px",
          padding: "5px 10px",
        }}>
          <span style={{ fontFamily: sans, fontSize: "0.56rem", letterSpacing: "0.18em", color: `${gold}99`, fontWeight: 500 }}>
            {String(displayIdx + 1).padStart(2, "0")} / {String(MINIONS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        background: `linear-gradient(180deg,${blueDeep} 0%,#06090e 100%)`,
        border: `1px solid ${blue}1a`,
        borderTop: `1px solid ${blue}22`,
        borderRadius: "0 0 16px 16px",
        padding: "14px 14px 12px",
        display: "flex", gap: "7px", overflowX: "auto",
      }}>
        {MINIONS.map((src, i) => (
          <button
            key={i}
            onClick={() => { setRevealed(null); fade(i); }}
            style={{
              width: "46px", height: "46px", borderRadius: "7px", overflow: "hidden",
              border: i === displayIdx ? `2px solid ${blue}` : "2px solid transparent",
              flexShrink: 0, padding: 0, cursor: "pointer",
              opacity: i === displayIdx ? 1 : 0.38,
              transition: "all 0.2s ease", background: "transparent",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </button>
        ))}
      </div>

      {/* "Show Me My Minion" button */}
      <div style={{ marginTop: "28px", textAlign: "center" }}>
        <button
          onClick={rollRandom}
          disabled={revealing}
          style={{
            fontFamily: sans, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
            color: revealing ? `${gold}55` : gold,
            background: "transparent",
            border: `1px solid ${revealing ? `${gold}22` : `${gold}44`}`,
            borderRadius: "8px",
            padding: "14px 32px",
            cursor: revealing ? "not-allowed" : "pointer",
            transition: "all 0.25s ease",
            display: "inline-flex", alignItems: "center", gap: "10px",
          }}
          onMouseEnter={e => {
            if (!revealing) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = goldLight;
              (e.currentTarget as HTMLButtonElement).style.color = goldLight;
              (e.currentTarget as HTMLButtonElement).style.background = `${gold}0a`;
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = `${gold}44`;
            (e.currentTarget as HTMLButtonElement).style.color = gold;
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>✦</span>
          {revealing ? "Rolling..." : "Show Me My Minion"}
        </button>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.82rem", color: "rgba(255,255,255,0.28)", margin: "12px 0 0" }}>
          Discover your Minion from the collection.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── FAQ ─────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
        }}
      >
        <span style={{ fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, color: open ? goldLight : "rgba(255,255,255,0.78)", textAlign: "left", letterSpacing: "0.01em", transition: "color 0.22s" }}>
          {q}
        </span>
        <span style={{ color: gold, fontSize: "1.3rem", flexShrink: 0, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)", lineHeight: 1 }}>
          +
        </span>
      </button>
      {open && (
        <p style={{ fontFamily: sans, fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", padding: "0 0 20px", margin: 0, lineHeight: 1.75 }}>
          {a}
        </p>
      )}
    </div>
  );
}

/* ─────────────────── FLIP CARD (modal) ─────────────────── */
function FlipCard({ index, icon, title, subtitle, done, locked, children, onFlip }: {
  index: number; icon: string; title: string; subtitle: string;
  done: boolean; locked: boolean; children?: React.ReactNode; onFlip?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (done) setFlipped(true); }, [done]);
  function handleClick() { if (locked || flipped) return; setFlipped(true); onFlip?.(); }
  const cardBg = `linear-gradient(160deg,#1a1610 0%,#0e0c08 100%)`;
  const borderCol = done ? `${gold}55` : locked ? "rgba(255,255,255,0.04)" : `${gold}33`;

  return (
    <div onClick={handleClick} style={{ perspective: "1000px", cursor: locked ? "not-allowed" : flipped ? "default" : "pointer", animation: `cardIn 0.45s ease ${0.07 * index}s both` }}>
      <div style={{ position: "relative", transformStyle: "preserve-3d", transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1)", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
        {/* FRONT */}
        <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: flipped ? "absolute" : "relative", inset: 0, background: cardBg, border: `1px solid ${borderCol}`, borderRadius: "12px", padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "128px", opacity: locked ? 0.38 : 1, boxShadow: locked ? "none" : `0 0 18px ${gold}0e` }}>
          <span style={{ fontSize: "1.5rem" }}>{locked ? "—" : icon}</span>
          <p style={{ margin: 0, fontFamily: serif, fontSize: "0.92rem", fontWeight: 600, color: locked ? "rgba(255,255,255,0.18)" : goldLight, textAlign: "center" }}>{title}</p>
          {!locked && <p style={{ margin: 0, fontFamily: sans, fontSize: "0.58rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tap to open</p>}
        </div>
        {/* BACK */}
        <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", position: flipped ? "relative" : "absolute", inset: 0, background: done ? "linear-gradient(160deg,#121a10 0%,#0a0f08 100%)" : cardBg, border: `1px solid ${done ? `${gold}55` : `${gold}22`}`, borderRadius: "12px", padding: "14px 12px", minHeight: "128px", boxShadow: done ? `0 0 18px ${gold}18` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p style={{ margin: 0, fontFamily: serif, fontSize: "0.85rem", fontWeight: 600, color: goldLight }}>{title}</p>
              <p style={{ margin: "1px 0 0", fontFamily: sans, fontSize: "0.58rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{subtitle}</p>
            </div>
            {done && (
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.8L8 1" stroke="#0a0c08" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── INPUT STYLE ─────────────────── */
const inp: React.CSSProperties = {
  width: "100%", background: "rgba(0,0,0,0.5)",
  border: `1px solid ${gold}22`, borderRadius: "6px",
  padding: "9px 11px", fontSize: "0.8rem", color: "#fff",
  fontFamily: sans, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
};

/* ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [twitter,   setTwitter]   = useState("");
  const [wallet,    setWallet]    = useState("");
  const [quoteUrl,  setQuoteUrl]  = useState("");
  const [tasks,     setTasks]     = useState<Record<string, boolean>>({});
  const [sending,   setSending]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [err,       setErr]       = useState("");
  const [ready,     setReady]     = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    try {
      const s = localStorage.getItem("mn_v3");
      if (s) { const p = JSON.parse(s); setTasks(p.tasks ?? {}); setWallet(p.wallet ?? ""); setTwitter(p.twitter ?? ""); setQuoteUrl(p.quoteUrl ?? ""); }
    } catch {}
    setTimeout(() => setReady(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("mn_v3", JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  const c1 = twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = isValidUrl(quoteUrl);
  const c4 = isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;

  async function submit() {
    if (!allDone) { setErr("Complete all missions first."); return; }
    setErr(""); setSending(true);
    const { error: e } = await supabase.from("minions").insert([{ wallet: wallet.trim(), twitter: twitter.trim(), quote_url: quoteUrl.trim() }]);
    setSending(false);
    if (e) setErr("Something went wrong. Try again.");
    else setSuccess(true);
  }

  function closeModal() { setModalOpen(false); setSuccess(false); setErr(""); }
  function focusInp(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = `${gold}66`; }
  function blurInp(e: React.FocusEvent<HTMLInputElement>)  { e.target.style.borderColor = `${gold}22`; }

  const goldBtn = (label: string, onClick: () => void, fullWidth = false) => (
    <button
      onClick={onClick}
      style={{
        fontFamily: sans, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
        color: "#050504", background: gold, border: "none", borderRadius: "7px",
        padding: "15px 36px", cursor: "pointer", transition: "all 0.22s ease",
        boxShadow: `0 8px 32px ${gold}2e`, width: fullWidth ? "100%" : "auto",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = goldLight; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 40px ${gold}44`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = gold; (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 32px ${gold}2e`; }}
    >
      {label}
    </button>
  );

  const ghostBtn = (label: string, href: string) => (
    <a
      href={href}
      style={{
        fontFamily: sans, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)", background: "transparent",
        border: "1px solid rgba(255,255,255,0.14)", borderRadius: "7px",
        padding: "15px 36px", display: "inline-block", transition: "all 0.22s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${gold}55`; (e.currentTarget as HTMLAnchorElement).style.color = goldLight; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)"; }}
    >
      {label}
    </a>
  );

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: sans, color: "#fff", overflowX: "hidden" }}>

      <style>{`
        @import url('${FONT_LINK}');
        @keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes modalIn   { from{opacity:0;transform:scale(0.96) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp     { 0%{transform:scale(0) rotate(-12deg);opacity:0} 70%{transform:scale(1.1) rotate(2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes pulseGlow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        * { box-sizing:border-box; }
        ::placeholder { color:rgba(255,255,255,0.18); }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${gold}33; border-radius:4px; }
        html { scroll-behavior:smooth; }
        a { color:inherit; text-decoration:none; }
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 32px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(5,5,4,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(22px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(22px)" : "none",
        borderBottom: scrolled ? `1px solid ${gold}14` : "1px solid transparent",
        transition: "all 0.35s ease",
      }}>
        {/* Logo */}
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <img src="/mini-logo.jpg" style={{ width: "30px", height: "30px", borderRadius: "7px", objectFit: "cover" }} alt="" />
          <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em" }}>MINIONS</span>
        </a>

        {/* Nav links — no Join MinoList button */}
        <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          {[["MinoList", "#minolist"], ["Mint", "#mint"], ["$MINO", "#mino"]].map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{ fontFamily: sans, fontSize: "0.66rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = goldLight)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >{l}</a>
          ))}
          {/* X icon */}
          <a
            href="https://x.com/theminionxyz"
            target="_blank" rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.38)", transition: "color 0.2s", lineHeight: 1, fontSize: "1rem", fontWeight: 700 }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = goldLight)}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)")}
            title="X / Twitter"
          >
            𝕏
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "140px 24px 100px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", borderRadius: "50%", background: `radial-gradient(circle,${blue}09 0%,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: "450px", height: "450px", borderRadius: "50%", background: `radial-gradient(circle,${gold}07 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", left: "-5%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle,${gold}05 0%,transparent 70%)`, pointerEvents: "none" }} />

        {/* Pill */}
        <div style={{ animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0, marginBottom: "28px" }}>
          <span style={{ fontFamily: sans, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: gold, border: `1px solid ${gold}44`, borderRadius: "999px", padding: "7px 20px", display: "inline-block" }}>
            10,000 ON ETH
          </span>
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: serif, fontSize: "clamp(5rem,22vw,10.5rem)", fontWeight: 700,
          color: "#fff", margin: "0", letterSpacing: "0.04em", lineHeight: 0.88,
          animation: ready ? "fadeUp 0.8s ease 0.1s both" : "none", opacity: ready ? undefined : 0,
        }}>
          MINIONS
        </h1>

        {/* Decorative rule */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%", maxWidth: "340px", margin: "28px auto", animation: ready ? "fadeUp 0.7s ease 0.16s both" : "none", opacity: ready ? undefined : 0 }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,transparent,${gold}44)` }} />
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: gold, boxShadow: `0 0 8px ${gold}88` }} />
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${gold}44,transparent)` }} />
        </div>

        {/* Subtext */}
        <p style={{
          fontFamily: serif, fontStyle: "italic", fontSize: "clamp(1rem,2.8vw,1.2rem)",
          color: "rgba(255,255,255,0.42)", margin: "0 0 48px", maxWidth: "420px", lineHeight: 1.75,
          animation: ready ? "fadeUp 0.7s ease 0.2s both" : "none", opacity: ready ? undefined : 0,
        }}>
          10,000 little cool Minions coming on Ethereum.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", animation: ready ? "fadeUp 0.7s ease 0.28s both" : "none", opacity: ready ? undefined : 0 }}>
          {goldBtn("JOIN MINOLIST", () => setModalOpen(true))}
          {ghostBtn("VIEW MINT", "#mint")}
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: "72px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          border: `1px solid ${gold}1e`, borderRadius: "10px", overflow: "hidden",
          backdropFilter: "blur(8px)",
          animation: ready ? "fadeUp 0.7s ease 0.38s both" : "none", opacity: ready ? undefined : 0,
        }}>
          {[["10,000", "Supply"], ["0.001 ETH", "Mint Price"], ["Ethereum", "Chain"], ["OpenSea", "Launchpad"]].map(([v, l], i) => (
            <div key={i} style={{ padding: "20px 22px", background: "rgba(255,255,255,0.018)", borderLeft: i > 0 ? `1px solid ${gold}18` : "none", textAlign: "center" }}>
              <p style={{ margin: 0, fontFamily: serif, fontSize: "1.12rem", fontWeight: 700, color: goldLight }}>{v}</p>
              <p style={{ margin: "3px 0 0", fontFamily: sans, fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.26)", fontWeight: 500 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.38, animation: ready ? "fadeUp 1.2s ease 1.1s both" : "none" }}>
          <span style={{ fontFamily: sans, fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: gold }}>Scroll</span>
          <div style={{ width: "1px", height: "34px", background: `linear-gradient(180deg,${gold},transparent)`, animation: "pulseGlow 2.2s ease infinite" }} />
        </div>
      </section>

      <Divider />

      {/* ══════════ MEET THE MINIONS ══════════ */}
      <section style={{ padding: "110px 0", background: `linear-gradient(180deg,${bg} 0%,${blueDeep}66 50%,${bg} 100%)` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="The Collection" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.05 }}>
            Meet The Minions
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", margin: "0 0 52px", lineHeight: 1.8, maxWidth: "500px" }}>
            Cute. Bold. Mainly for the cool ones.<br />
            Minions is a 10,000 supply character collection built around simple art, clean and noticeable traits.
          </p>
          <MinionGallery />
        </div>
      </section>

      <Divider />

      {/* ══════════ THE TRAITS ══════════ */}
      <section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="The Details" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.05 }}>
            Built Different
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", margin: "0 0 40px", lineHeight: 1.8 }}>
            Every Minion is made from a mix of outfits, hair, moods, colors, accessories, and rare details.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "32px" }}>
            {TRAITS.map(t => (
              <div
                key={t}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 18px", border: `1px solid ${blue}1e`, borderRadius: "9px",
                  background: `${blueDeep}55`, transition: "all 0.22s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${blue}55`; (e.currentTarget as HTMLDivElement).style.background = `${blueDeep}aa`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${blue}1e`; (e.currentTarget as HTMLDivElement).style.background = `${blueDeep}55`; }}
              >
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: blue, flexShrink: 0, boxShadow: `0 0 6px ${blue}88` }} />
                <span style={{ fontFamily: sans, fontSize: "0.86rem", fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>{t}</span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.97rem", color: `${gold}88`, lineHeight: 1.8, margin: 0 }}>
            Some traits are simple. Some are rare. Some make a Minion stand out immediately.<br />
            The goal is clean identity, not overcomplication.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ THE CLASSES ══════════ */}
      <section style={{ padding: "110px 0", background: `linear-gradient(180deg,${bg} 0%,${blueDeep}55 60%,${bg} 100%)` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="The Types" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 44px", lineHeight: 1.05 }}>
            Every Minion Has A Class
          </h2>
          <div>
            {CLASSES.map((c, i) => (
              <div
                key={c.name}
                style={{
                  padding: "24px 0", borderBottom: `1px solid rgba(255,255,255,0.06)`,
                  display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "20px",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "6px"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; }}
              >
                <div>
                  <p style={{ margin: "0 0 6px", fontFamily: serif, fontSize: "1.18rem", fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>{c.name}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.36)", lineHeight: 1.65 }}>{c.desc}</p>
                </div>
                <span style={{ fontFamily: sans, fontSize: "0.52rem", letterSpacing: "0.22em", color: `${blue}55`, fontWeight: 600, flexShrink: 0 }}>
                  {c.num}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ JOIN THE MINOLIST ══════════ */}
      <section id="minolist" style={{ padding: "130px 0", background: `linear-gradient(180deg,${bg} 0%,#0c0a06 55%,${bg} 100%)` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Label text="Access" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 22px", lineHeight: 1.05 }}>
            Join The MinoList
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", margin: "0 auto 14px", lineHeight: 1.85, maxWidth: "480px" }}>
            The MinoList is the only mint access phase.<br />
            Apply through the website, complete missions, submit your wallet, and wait for selection.
          </p>
          <p style={{ fontFamily: sans, fontSize: "0.7rem", color: `${gold}77`, margin: "0 0 44px", letterSpacing: "0.1em", fontWeight: 500 }}>
            Selected wallets mint on OpenSea.
          </p>
          {goldBtn("CLAIM YOUR SPOT", () => setModalOpen(true))}
        </div>
      </section>

      <Divider />

      {/* ══════════ MINT ══════════ */}
      <section style={{ padding: "110px 0" }}>
        <div id="mint" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="The Mint" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.05 }}>
            One Phase. One Mint.
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", margin: "0 0 44px", lineHeight: 1.75 }}>
            The MinoList is the mint.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: `${gold}18`, borderRadius: "12px", overflow: "hidden", marginBottom: "32px" }}>
            {[["10,000", "Supply"], ["0.001 ETH", "Price"], ["Ethereum", "Chain"], ["OpenSea", "Launchpad"]].map(([v, l], i) => (
              <div key={i} style={{ padding: "24px 22px", background: "#060503" }}>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: goldLight }}>{v}</p>
                <p style={{ margin: "5px 0 0", fontFamily: sans, fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.26)", fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>

          <button disabled style={{
            width: "100%", fontFamily: sans, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: "7px", padding: "18px", cursor: "not-allowed",
          }}>
            MINT LOCKED
          </button>
          <p style={{ fontFamily: sans, fontSize: "0.64rem", color: `${gold}44`, textAlign: "center", margin: "12px 0 0", letterSpacing: "0.1em" }}>
            Mint link: Coming soon
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ MINO RESERVE ══════════ */}
      <section style={{ padding: "110px 0", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="Reserve" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 18px", lineHeight: 1.05 }}>
            The Mino Reserve
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0 }}>
            A small allocation kept for collabs, rewards, partnerships, future activations, and community support.<br />
            This is not a public mint phase.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ $MINO ══════════ */}
      <section style={{ padding: "110px 0" }}>
        <div id="mino" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="Token" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(3.8rem,15vw,8rem)", fontWeight: 700, color: goldLight, margin: "0 0 18px", letterSpacing: "0.04em", lineHeight: 0.9 }}>
            $MINO
          </h2>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0 }}>
            $MINO is the energy behind the Minions world.<br />
            It is planned to power future holder systems, games, upgrades, raffles, burns, events, and community rewards.<br />
            Full token details will be shared after mint.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ THE SYSTEMS ══════════ */}
      <section style={{ padding: "110px 0", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="Systems" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 44px", lineHeight: 1.05 }}>
            The Systems
          </h2>
          <div>
            {SYSTEMS.map((s, i) => (
              <div
                key={s.name}
                style={{
                  padding: "24px 0", borderBottom: `1px solid rgba(255,255,255,0.06)`,
                  display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "start", gap: "22px",
                }}
              >
                <span style={{ fontFamily: sans, fontSize: "0.52rem", letterSpacing: "0.2em", color: `${gold}44`, paddingTop: "5px", fontWeight: 600, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ margin: "0 0 6px", fontFamily: serif, fontSize: "1.14rem", fontWeight: 700, color: goldLight }}>{s.name}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.36)", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ ROADMAP ══════════ */}
      <section style={{ padding: "110px 0" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="The Plan" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 56px", lineHeight: 1.05 }}>
            What Comes After Mint
          </h2>
          <div style={{ position: "relative", paddingLeft: "38px" }}>
            <div style={{ position: "absolute", left: "8px", top: "6px", bottom: "6px", width: "1px", background: `linear-gradient(180deg,${gold}55,${gold}08)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {ROADMAP.map((r, i) => (
                <div key={r.phase} style={{ position: "relative", paddingBottom: i < ROADMAP.length - 1 ? "36px" : "0" }}>
                  <div style={{ position: "absolute", left: "-30px", top: "6px", width: "13px", height: "13px", borderRadius: "50%", border: `1.5px solid ${gold}`, background: bg, boxShadow: `0 0 8px ${gold}44` }} />
                  <p style={{ margin: "0 0 4px", fontFamily: sans, fontSize: "0.56rem", letterSpacing: "0.24em", textTransform: "uppercase", color: gold, fontWeight: 600 }}>{r.phase}</p>
                  <p style={{ margin: "0 0 5px", fontFamily: serif, fontSize: "1.08rem", fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>{r.title}</p>
                  <p style={{ margin: 0, fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: "rgba(255,255,255,0.34)", lineHeight: 1.7 }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ FAQ ══════════ */}
      <section style={{ padding: "110px 0", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
          <Label text="FAQ" />
          <h2 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,7vw,3.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 40px", lineHeight: 1.05 }}>
            Questions
          </h2>
          <div>
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding: "80px 24px 52px", textAlign: "center" }}>
        <img src="/mini-logo.jpg" style={{ width: "44px", height: "44px", borderRadius: "9px", objectFit: "cover", marginBottom: "18px", opacity: 0.88 }} alt="" />
        <h3 style={{ fontFamily: serif, fontSize: "1.55rem", fontWeight: 700, color: goldLight, margin: "0 0 10px", letterSpacing: "0.1em" }}>MINIONS</h3>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: "rgba(255,255,255,0.28)", margin: "0 0 32px", lineHeight: 1.85 }}>
          Cute. Bold. Mainly for the cool ones.<br />
          10,000 Minions on Ethereum. Powered by $MINO.
        </p>
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginBottom: "44px" }}>
          {[["X", "https://x.com/theminionxyz"], ["OpenSea", "#"], ["MinoList", "#minolist"], ["Mint", "#mint"]].map(([l, h]) => (
            <a
              key={l} href={h}
              style={{ fontFamily: sans, fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: `${gold}55`, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = goldLight)}
              onMouseLeave={e => (e.currentTarget.style.color = `${gold}55`)}
            >{l}</a>
          ))}
        </div>
        <div style={{ width: "36px", height: "1px", background: `linear-gradient(90deg,transparent,${gold}44,transparent)`, margin: "0 auto 20px" }} />
        <p style={{ fontFamily: sans, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${gold}30`, fontWeight: 500 }}>
          THE MINOVERSE OPENS SOON
        </p>
      </footer>

      {/* ══════════ MINOLIST MODAL ══════════ */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          }}
        >
          <div style={{
            width: "100%", maxWidth: "460px", maxHeight: "94vh", overflowY: "auto",
            background: "#0d0b07", border: `1px solid ${gold}22`, borderRadius: "16px",
            padding: "28px 22px 24px", animation: "modalIn 0.3s ease both", position: "relative",
            boxShadow: `0 40px 80px rgba(0,0,0,0.95), 0 0 60px ${gold}08`,
          }}>
            <button onClick={closeModal} style={{ position: "absolute", top: "14px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.22)", fontSize: "1.1rem", lineHeight: 1, transition: "color 0.2s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = goldLight)}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.22)")}
            >✕</button>

            {success ? (
              <div style={{ textAlign: "center", padding: "38px 0" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "stamp 0.5s cubic-bezier(0.23,1,0.32,1) both", boxShadow: `0 8px 24px ${gold}44` }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke="#0a0800" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p style={{ fontFamily: sans, fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase", color: gold, margin: "0 0 6px" }}>Application Sent</p>
                <h2 style={{ fontFamily: serif, fontSize: "1.55rem", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>You Are Under Review.</h2>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.92rem", color: "rgba(255,255,255,0.36)", margin: 0, lineHeight: 1.65 }}>
                  Selected wallets will be added before mint.
                </p>
                <button onClick={closeModal} style={{ marginTop: "26px", fontFamily: sans, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#050504", background: gold, border: "none", borderRadius: "7px", padding: "13px 30px", cursor: "pointer" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = goldLight)}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = gold)}
                >
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "22px" }}>
                  <p style={{ fontFamily: sans, fontSize: "0.55rem", letterSpacing: "0.26em", textTransform: "uppercase", color: gold, margin: "0 0 4px" }}>Minolist Application</p>
                  <h2 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0 0 4px", letterSpacing: "0.02em" }}>Claim Your Spot</h2>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.84rem", color: "rgba(255,255,255,0.33)", margin: "0 0 16px", lineHeight: 1.55 }}>
                    Complete the missions and submit your wallet for MinoList review.
                  </p>
                  <div style={{ height: "2px", background: `${gold}18`, borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "2px", background: `linear-gradient(90deg,${gold},${goldLight})`, width: `${([c1, c2, c3, c4].filter(Boolean).length / 4) * 100}%`, transition: "width 0.4s ease" }} />
                  </div>
                  <p style={{ fontFamily: sans, fontSize: "0.6rem", color: `${gold}55`, margin: "6px 0 0", letterSpacing: "0.08em" }}>
                    {[c1, c2, c3, c4].filter(Boolean).length} of 4 missions complete
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                  <FlipCard index={0} icon="𝕏" title="Who Are You?" subtitle="Mission 01 / 04" done={c1} locked={false}>
                    <p style={{ margin: "0 0 7px", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Your X handle</p>
                    <input type="text" placeholder="@yourhandle" value={twitter} onChange={e => setTwitter(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {c1 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "5px 0 0" }}>Identity confirmed</p>}
                  </FlipCard>

                  <FlipCard index={1} icon="↺" title="Complete Missions" subtitle="Mission 02 / 04" done={c2} locked={!c1}
                    onFlip={() => { window.open("https://x.com/theminionxyz", "_blank"); setTimeout(() => setTasks(p => ({ ...p, like: true })), 800); }}>
                    <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "0.78rem", color: "rgba(255,255,255,0.48)", margin: 0, lineHeight: 1.55 }}>
                      {c2 ? "Like & retweet confirmed." : 'Follow, like and retweet the pinned post. Quote with "MINIONS" and tag 2 friends.'}
                    </p>
                    {c2 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "8px 0 0" }}>Missions done</p>}
                  </FlipCard>

                  <FlipCard index={2} icon="↗" title="Verify Quote" subtitle="Mission 03 / 04" done={c3} locked={!c2}>
                    <p style={{ margin: "0 0 7px", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>Quote tweet link</p>
                    <input type="url" placeholder="https://x.com/yourhandle/status/..." value={quoteUrl} onChange={e => setQuoteUrl(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: "#e05050", margin: "4px 0 0" }}>Needs https://</p>}
                    {c3 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "4px 0 0" }}>Link verified</p>}
                  </FlipCard>

                  <FlipCard index={3} icon="◈" title="Claim Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                    <p style={{ margin: "0 0 7px", fontFamily: sans, fontSize: "0.62rem", color: `${gold}88`, letterSpacing: "0.1em", textTransform: "uppercase" }}>EVM address</p>
                    <input type="text" placeholder="0x..." value={wallet} onChange={e => setWallet(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {wallet && !isValidEvm(wallet) && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: "#e05050", margin: "4px 0 0" }}>Invalid address</p>}
                    {c4 && <p style={{ fontFamily: sans, fontSize: "0.6rem", color: gold, margin: "4px 0 0" }}>Wallet confirmed</p>}
                    <p style={{ fontFamily: sans, fontSize: "0.58rem", color: "rgba(255,255,255,0.18)", margin: "6px 0 0", lineHeight: 1.4 }}>Never share private keys or seed phrases.</p>
                  </FlipCard>
                </div>

                {err && <p style={{ fontFamily: sans, fontSize: "0.78rem", color: "#e05050", margin: "0 0 10px", fontWeight: 500 }}>{err}</p>}

                <button onClick={submit} disabled={sending || !allDone} style={{
                  width: "100%",
                  background: allDone ? gold : "rgba(255,255,255,0.04)",
                  color: allDone ? "#050504" : "rgba(255,255,255,0.18)",
                  border: `1px solid ${allDone ? gold : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "7px", padding: "15px",
                  fontFamily: sans, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: allDone && !sending ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: allDone ? `0 8px 24px ${gold}33` : "none",
                }}
                  onMouseEnter={e => { if (allDone) (e.currentTarget as HTMLButtonElement).style.background = goldLight; }}
                  onMouseLeave={e => { if (allDone) (e.currentTarget as HTMLButtonElement).style.background = gold; }}
                  onMouseDown={e => allDone && ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                  onMouseUp={e => ((e.currentTarget as HTMLButtonElement).style.transform = "")}
                >
                  {sending ? "Saving..." : allDone ? "JOIN THE MINOLIST" : "Complete all missions to unlock"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

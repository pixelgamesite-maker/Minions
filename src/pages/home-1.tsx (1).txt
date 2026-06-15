import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

/* ── Fonts: Playfair Display (editorial) + DM Sans (utility) ── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const serif   = "'Playfair Display', Georgia, serif";
const sans    = "'DM Sans', system-ui, sans-serif";
const gold    = "#c9a84c";
const goldLight = "#e2c97e";
const blue    = "#5b8fa8";   /* soft Minions blue for accents */
const blueLight = "#7aaecc";

const MINIONS = [
  "/Mini-1.jpg","/Mini-2.jpg","/Mini-3.jpg",
  "/Mini-4.jpg","/Mini-5.jpg","/Mini-6.jpg",
  "/Mini-7.jpg","/Mini-8.jpg","/Mini-9.jpg",
];

const CLASSES = [
  { name:"Regulars",   desc:"Clean, simple, and easy to love." },
  { name:"Cool Ones",  desc:"Extra style, stronger attitude, cleaner presence." },
  { name:"Wild Ones",  desc:"Loud traits and chaotic combinations." },
  { name:"Bosses",     desc:"Harder to find. Easier to notice." },
  { name:"Originals",  desc:"The rarest Minions with deeper connection to $MINO." },
];

const TRAITS = ["Hair","Outfits","Accessories","Moods","Colors","Body details","Backgrounds","Special features"];

const SYSTEMS = [
  { name:"The Lab",          desc:"Upgrade and experiment with your Minions." },
  { name:"The Arena",        desc:"Games, battles, leaderboards, and rewards." },
  { name:"The Playground",   desc:"Holder games, raffles, missions, and community events." },
  { name:"The Mino Machine", desc:"Use $MINO for spins, rerolls, mystery outcomes, and surprise rewards." },
];

const ROADMAP = [
  { phase:"Phase I",   title:"MinoList Opens",    desc:"Applications, collabs, and early access review begin." },
  { phase:"Phase II",  title:"Mint Opens",         desc:"Selected MinoList wallets mint on OpenSea." },
  { phase:"Phase III", title:"Reveal",             desc:"Minions reveal with traits, classes, and rarity." },
  { phase:"Phase IV",  title:"$MINO Details",      desc:"Tokenomics, supply, and claim mechanics are shared." },
  { phase:"Phase V",   title:"The Systems Begin",  desc:"The Lab, Arena, Playground, and Mino Machine start opening." },
];

const FAQS = [
  { q:"What is Minions?",             a:"A 10,000 supply NFT collection of cute, bold characters on Ethereum." },
  { q:"What is the mint price?",      a:"0.001 ETH." },
  { q:"Where is mint?",               a:"OpenSea." },
  { q:"What is The MinoList?",        a:"The only mint access phase." },
  { q:"Is there public mint?",        a:"If there are any Minions left from The MinoList, yes." },
  { q:"What is $MINO?",               a:"The token planned to power future Minions systems after mint." },
  { q:"When will $MINO details drop?",a:"After mint." },
  { q:"Is this financial advice?",    a:"No. Minions is a digital collectible. DYOR." },
];

function isValidEvm(a: string) { return /^0x[0-9a-fA-F]{40}$/.test(a.trim()); }
function isValidUrl(u: string) {
  try { return new URL(u.trim()).protocol === "https:"; } catch { return false; }
}

/* ── Section label — editorial dash style ── */
function Label({ text }: { text: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px" }}>
      <div style={{ height:"1px", width:"32px", background:`linear-gradient(90deg,transparent,${gold}66)` }} />
      <span style={{ fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.32em", textTransform:"uppercase", color:gold, whiteSpace:"nowrap", fontWeight:500 }}>
        {text}
      </span>
      <div style={{ height:"1px", flex:1, background:`linear-gradient(90deg,${gold}33,transparent)` }} />
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${gold}22,transparent)` }} />;
}

/* ── Flip Card — UNCHANGED ── */
function FlipCard({ index, icon, title, subtitle, done, locked, children, onFlip }: {
  index:number; icon:string; title:string; subtitle:string;
  done:boolean; locked:boolean; children?:React.ReactNode; onFlip?:()=>void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (done) setFlipped(true); }, [done]);

  function handleClick() {
    if (locked || flipped) return;
    setFlipped(true); onFlip?.();
  }

  const bg = `linear-gradient(160deg,#1a1610 0%,#0e0c08 100%)`;
  const borderCol = done ? `${gold}55` : locked ? "rgba(255,255,255,0.04)" : `${gold}33`;

  return (
    <div onClick={handleClick} style={{ perspective:"1000px", cursor: locked?"not-allowed": flipped?"default":"pointer", animation:`cardIn 0.5s ease ${0.08*index}s both` }}>
      <div style={{ position:"relative", transformStyle:"preserve-3d", transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)", transform: flipped?"rotateY(180deg)":"rotateY(0)" }}>

        {/* FRONT */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          position: flipped?"absolute":"relative", inset:0,
          background:bg, border:`1px solid ${borderCol}`, borderRadius:"12px",
          padding:"18px 14px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:"8px", minHeight:"120px", opacity: locked?0.4:1,
          boxShadow: locked?"none":`0 0 20px ${gold}11`,
        }}>
          <span style={{ fontSize:"1.4rem" }}>{locked ? "—" : icon}</span>
          <p style={{ margin:0, fontFamily:serif, fontSize:"0.9rem", fontWeight:600, color: locked?"rgba(255,255,255,0.2)":goldLight, textAlign:"center", letterSpacing:"0.04em" }}>{title}</p>
          {!locked && <p style={{ margin:0, fontFamily:sans, fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Tap to open</p>}
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          position: flipped?"relative":"absolute", inset:0,
          background: done?"linear-gradient(160deg,#121a10 0%,#0a0f08 100%)":bg,
          border:`1px solid ${done?`${gold}55`:`${gold}22`}`, borderRadius:"12px",
          padding:"14px 12px", minHeight:"120px",
          boxShadow: done?`0 0 20px ${gold}18`:"none",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
            <div>
              <p style={{ margin:0, fontFamily:serif, fontSize:"0.85rem", fontWeight:600, color:goldLight }}>{title}</p>
              <p style={{ margin:"1px 0 0", fontFamily:sans, fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{subtitle}</p>
            </div>
            {done && (
              <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:gold, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.8L8 1" stroke="#0a0c08" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Minion gallery — horizontal scroll strip ── */
function MinionStrip() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { timer.current = setTimeout(next, 3400); return () => clearTimeout(timer.current); }, [cur]);

  function next() { fade((cur + 1) % MINIONS.length); }
  function fade(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 260);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px" }}>
      {/* Main showcase */}
      <div style={{
        width:"100%", maxWidth:"380px", aspectRatio:"1/1",
        borderRadius:"4px", overflow:"hidden",
        border:`1px solid ${gold}22`,
        background:"#0a0a08",
        boxShadow:`0 0 60px rgba(0,0,0,0.6), 0 0 0 1px ${gold}11`,
      }}>
        <img src={MINIONS[cur]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity: fading?0:1, transition:"opacity 0.26s ease" }} />
      </div>

      {/* Thumbnail row */}
      <div style={{ display:"flex", gap:"8px", overflowX:"auto", padding:"0 0 4px" }}>
        {MINIONS.map((src, i) => (
          <button key={i} onClick={() => fade(i)} style={{
            width:"48px", height:"48px", borderRadius:"3px", overflow:"hidden",
            border: i === cur ? `1px solid ${gold}` : "1px solid rgba(255,255,255,0.08)",
            flexShrink:0, padding:0, cursor:"pointer",
            opacity: i === cur ? 1 : 0.45,
            transition:"all 0.2s ease",
            background:"transparent",
          }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          </button>
        ))}
      </div>

      <p style={{ fontFamily:sans, fontSize:"0.55rem", letterSpacing:"0.26em", color:`${gold}55`, margin:0, textTransform:"uppercase" }}>
        {String(cur + 1).padStart(2, "0")} / {String(MINIONS.length).padStart(2, "0")}
      </p>
    </div>
  );
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${gold}18` }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%", background:"none", border:"none", cursor:"pointer",
        padding:"20px 0", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px",
      }}>
        <span style={{
          fontFamily:serif, fontSize:"1.05rem", fontWeight:500,
          color: open ? goldLight : "rgba(255,255,255,0.7)",
          textAlign:"left", letterSpacing:"0.01em",
          transition:"color 0.2s",
        }}>{q}</span>
        <span style={{
          color:gold, fontSize:"1.2rem", flexShrink:0,
          transition:"transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)",
          lineHeight:1,
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontFamily:sans, fontSize:"0.9rem", fontWeight:300, color:"rgba(255,255,255,0.4)", padding:"0 0 20px", margin:0, lineHeight:1.75 }}>{a}</p>
      )}
    </div>
  );
}

/* ── Input style ── */
const inp: React.CSSProperties = {
  width:"100%", background:"rgba(0,0,0,0.5)",
  border:`1px solid ${gold}22`, borderRadius:"6px",
  padding:"9px 11px", fontSize:"0.8rem", color:"#fff",
  fontFamily:sans, outline:"none", transition:"border 0.2s", boxSizing:"border-box",
};

/* ════════════════════════════════════════════ MAIN ═══════════════════════════════════════════ */
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

  useEffect(() => { if (ready) localStorage.setItem("mn_v3", JSON.stringify({ tasks, wallet, twitter, quoteUrl })); }, [tasks, wallet, twitter, quoteUrl, ready]);

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
  function blurInp(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = `${gold}22`; }

  /* nav link style */
  const navLink: React.CSSProperties = {
    fontFamily:sans, fontSize:"0.65rem", letterSpacing:"0.2em",
    textTransform:"uppercase", color:"rgba(255,255,255,0.4)",
    transition:"color 0.2s", fontWeight:400,
  };

  return (
    <div style={{ background:"#060504", minHeight:"100vh", fontFamily:sans, color:"#fff", overflowX:"hidden" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.18);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${gold}33;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .nav-link:hover{color:${goldLight} !important;}
        .btn-ghost:hover{border-color:${gold}77 !important;color:${goldLight} !important;}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"18px 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: scrolled ? "rgba(6,5,4,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${gold}14` : "1px solid transparent",
        transition:"all 0.4s ease",
      }}>
        {/* Logo */}
        <a href="#home" style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <img src="/mini-logo.jpg" style={{ width:"28px", height:"28px", borderRadius:"4px", objectFit:"cover" }} alt="" />
          <span style={{ fontFamily:serif, fontSize:"0.95rem", fontWeight:700, color:"#fff", letterSpacing:"0.12em" }}>MINIONS</span>
        </a>

        {/* Nav */}
        <nav style={{ display:"flex", alignItems:"center", gap:"32px" }}>
          <a href="#minolist" className="nav-link" style={navLink}>MinoList</a>
          <a href="#mint" className="nav-link" style={navLink}>Mint</a>
          <a href="https://x.com/theminionxyz" target="_blank" rel="noopener noreferrer" className="nav-link" style={navLink}>X</a>
          <button onClick={() => setModalOpen(true)} style={{
            fontFamily:sans, fontSize:"0.62rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase",
            color:"#060504", background:gold, border:"none", borderRadius:"3px",
            padding:"10px 22px", cursor:"pointer", transition:"background 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = goldLight)}
            onMouseLeave={e => (e.currentTarget.style.background = gold)}>
            JOIN MINOLIST
          </button>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"140px 24px 100px", textAlign:"center", position:"relative",
        overflow:"hidden",
      }}>
        {/* Ambient glow */}
        <div style={{ position:"absolute", top:"38%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", borderRadius:"50%", background:`radial-gradient(circle,${blue}07 0%,transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"60%", left:"30%", width:"300px", height:"300px", borderRadius:"50%", background:`radial-gradient(circle,${gold}05 0%,transparent 70%)`, pointerEvents:"none" }} />

        {/* Pill */}
        <div style={{ animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0, marginBottom:"28px" }}>
          <span style={{
            fontFamily:sans, fontSize:"0.56rem", letterSpacing:"0.3em", textTransform:"uppercase",
            color:gold, border:`1px solid ${gold}44`, borderRadius:"999px",
            padding:"6px 18px", display:"inline-block", fontWeight:500,
          }}>
            10,000 on ETH
          </span>
        </div>

        {/* Main title — drop-cap editorial feel */}
        <h1 style={{
          fontFamily:serif, fontSize:"clamp(4.5rem,20vw,9rem)", fontWeight:900,
          color:"#fff", margin:"0", letterSpacing:"0.06em", lineHeight:0.88,
          animation: ready ? "fadeUp 0.8s ease 0.12s both" : "none", opacity: ready ? undefined : 0,
        }}>
          MINIONS
        </h1>

        {/* Editorial rule */}
        <div style={{ display:"flex", alignItems:"center", gap:"20px", margin:"28px auto", width:"100%", maxWidth:"360px",
          animation: ready ? "fadeUp 0.7s ease 0.18s both" : "none", opacity: ready ? undefined : 0 }}>
          <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,transparent,${gold}55)` }} />
          <span style={{ fontFamily:sans, fontSize:"0.5rem", letterSpacing:"0.3em", color:`${gold}88`, textTransform:"uppercase" }}>Est. 2025</span>
          <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,${gold}55,transparent)` }} />
        </div>

        <p style={{
          fontFamily:serif, fontSize:"clamp(1rem,3vw,1.25rem)", fontStyle:"italic",
          color:"rgba(255,255,255,0.42)", margin:"0 0 48px", maxWidth:"400px", lineHeight:1.7,
          animation: ready ? "fadeUp 0.7s ease 0.22s both" : "none", opacity: ready ? undefined : 0,
        }}>
          10,000 little cool Minions coming on Ethereum.
        </p>

        <div style={{
          display:"flex", gap:"14px", flexWrap:"wrap", justifyContent:"center",
          animation: ready ? "fadeUp 0.7s ease 0.3s both" : "none", opacity: ready ? undefined : 0,
        }}>
          <button onClick={() => setModalOpen(true)} style={{
            fontFamily:sans, fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase",
            color:"#060504", background:gold, border:"none", borderRadius:"3px",
            padding:"18px 44px", cursor:"pointer", transition:"all 0.2s ease",
            boxShadow:`0 12px 40px ${gold}33`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = goldLight; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = gold; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
            JOIN MINOLIST
          </button>
          <a href="#mint" className="btn-ghost" style={{
            fontFamily:sans, fontSize:"0.7rem", fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.45)", background:"transparent",
            border:"1px solid rgba(255,255,255,0.12)", borderRadius:"3px",
            padding:"18px 44px", display:"inline-block", transition:"all 0.2s ease",
          }}>
            VIEW MINT
          </a>
        </div>

        {/* Stats — editorial grid card */}
        <div style={{
          marginTop:"72px", display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          border:`1px solid ${gold}1a`, borderRadius:"4px", overflow:"hidden",
          animation: ready ? "fadeUp 0.7s ease 0.38s both" : "none", opacity: ready ? undefined : 0,
          backdropFilter:"blur(4px)",
        }}>
          {[["10,000","Supply"],["0.001 ETH","Mint Price"],["Ethereum","Chain"],["OpenSea","Launchpad"]].map(([val, lbl], i) => (
            <div key={i} style={{
              padding:"20px 22px", borderLeft: i > 0 ? `1px solid ${gold}18` : "none",
              textAlign:"center", background:"rgba(255,255,255,0.015)",
            }}>
              <p style={{ margin:0, fontFamily:serif, fontSize:"1.15rem", fontWeight:700, color:goldLight }}>{val}</p>
              <p style={{ margin:"4px 0 0", fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", fontWeight:400 }}>{lbl}</p>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:"40px", left:"50%", transform:"translateX(-50%)", animation: ready ? "fadeIn 1s ease 1.2s both" : "none", opacity: ready ? undefined : 0 }}>
          <p style={{ fontFamily:sans, fontSize:"0.5rem", letterSpacing:"0.28em", color:`${gold}44`, textTransform:"uppercase", margin:"0 0 10px" }}>Scroll</p>
          <div style={{ width:"1px", height:"36px", background:`linear-gradient(180deg,${gold}44,transparent)`, margin:"0 auto" }} />
        </div>
      </div>

      <Divider />

      {/* ══════════ MEET THE MINIONS ══════════ */}
      <section style={{ padding:"110px 0" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="The Collection" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 6px", letterSpacing:"0.01em", lineHeight:1 }}>
            Meet The Minions
          </h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", margin:"16px 0 52px", lineHeight:1.75, maxWidth:"480px" }}>
            Cute. Bold. Mainly for the cool ones.
            Minions is a 10,000 supply character collection built around simple art, clean and noticeable traits.
          </p>
          <MinionStrip />
        </div>
      </section>

      <Divider />

      {/* ══════════ THE TRAITS ══════════ */}
      <section style={{ padding:"110px 0", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="The Details" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 6px", lineHeight:1 }}>Built Different</h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", margin:"16px 0 44px", lineHeight:1.75 }}>
            Every Minion is made from a mix of outfits, hair, moods, colors, accessories, and rare details.
          </p>

          {/* 2-col trait grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", border:`1px solid ${gold}18`, borderRadius:"4px", overflow:"hidden", marginBottom:"32px" }}>
            {TRAITS.map((t, i) => (
              <div key={t} style={{
                padding:"18px 20px", background:"rgba(255,255,255,0.02)",
                borderBottom: i < TRAITS.length - 2 ? `1px solid ${gold}12` : "none",
                borderRight: i % 2 === 0 ? `1px solid ${gold}12` : "none",
                display:"flex", alignItems:"center", gap:"12px",
              }}>
                <div style={{ width:"3px", height:"3px", borderRadius:"50%", background:gold, flexShrink:0 }} />
                <span style={{ fontFamily:sans, fontSize:"0.85rem", fontWeight:400, color:"rgba(255,255,255,0.55)" }}>{t}</span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.95rem", color:`${gold}88`, lineHeight:1.75, margin:0 }}>
            Some traits are simple. Some are rare. Some make a Minion stand out immediately.<br/>
            The goal is clean identity, not overcomplication.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ THE CLASSES ══════════ */}
      <section style={{ padding:"110px 0" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="The Types" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 48px", lineHeight:1 }}>Every Minion Has A Class</h2>
          <div>
            {CLASSES.map((c, i) => (
              <div key={c.name} style={{
                padding:"26px 0", borderBottom:`1px solid ${gold}15`,
                display:"grid", gridTemplateColumns:"1fr auto",
                alignItems:"start", gap:"16px",
              }}>
                <div>
                  <p style={{ margin:"0 0 6px", fontFamily:serif, fontSize:"1.15rem", fontWeight:700, color:"#fff" }}>{c.name}</p>
                  <p style={{ margin:0, fontFamily:serif, fontStyle:"italic", fontSize:"0.95rem", color:"rgba(255,255,255,0.35)", lineHeight:1.6 }}>{c.desc}</p>
                </div>
                <span style={{ fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.22em", color:`${gold}44`, paddingTop:"5px", fontWeight:400 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ JOIN THE MINOLIST ══════════ */}
      <section id="minolist" style={{ padding:"120px 0", background:`linear-gradient(180deg,#060504 0%,#0e0c07 50%,#060504 100%)` }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px", textAlign:"center" }}>
          <Label text="Access" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 24px", lineHeight:1.1 }}>
            Join The MinoList
          </h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", margin:"0 0 14px", lineHeight:1.8, maxWidth:"480px", marginLeft:"auto", marginRight:"auto" }}>
            The MinoList is the only mint access phase.<br/>
            Apply through the website, complete missions, submit your wallet, and wait for selection.
          </p>
          <p style={{ fontFamily:sans, fontSize:"0.75rem", color:`${gold}88`, margin:"0 0 40px", letterSpacing:"0.08em" }}>
            Selected wallets mint on OpenSea.
          </p>
          <button onClick={() => setModalOpen(true)} style={{
            fontFamily:sans, fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase",
            color:"#060504", background:gold, border:"none", borderRadius:"3px",
            padding:"18px 50px", cursor:"pointer", transition:"all 0.2s ease",
            boxShadow:`0 12px 40px ${gold}33`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = goldLight; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = gold; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
            CLAIM YOUR SPOT
          </button>
        </div>
      </section>

      <Divider />

      {/* ══════════ MINT ══════════ */}
      <section style={{ padding:"110px 0" }}>
        <div id="mint" style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="The Mint" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 14px", lineHeight:1 }}>One Phase. One Mint.</h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", margin:"0 0 44px", lineHeight:1.7 }}>
            The MinoList is the mint.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", border:`1px solid ${gold}1a`, borderRadius:"4px", overflow:"hidden", marginBottom:"32px" }}>
            {[["10,000","Supply"],["0.001 ETH","Price"],["Ethereum","Chain"],["OpenSea","Launchpad"]].map(([v, l], i) => (
              <div key={i} style={{
                padding:"24px 22px", background:"rgba(255,255,255,0.018)",
                borderBottom: i < 2 ? `1px solid ${gold}14` : "none",
                borderRight: i % 2 === 0 ? `1px solid ${gold}14` : "none",
              }}>
                <p style={{ margin:0, fontFamily:serif, fontSize:"1.4rem", fontWeight:700, color:goldLight }}>{v}</p>
                <p style={{ margin:"5px 0 0", fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", fontWeight:400 }}>{l}</p>
              </div>
            ))}
          </div>

          <button disabled style={{
            width:"100%", fontFamily:sans, fontSize:"0.7rem", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.03)",
            border:`1px solid rgba(255,255,255,0.07)`, borderRadius:"3px", padding:"18px", cursor:"not-allowed",
          }}>
            MINT LOCKED
          </button>
          <p style={{ fontFamily:sans, fontSize:"0.65rem", color:`${gold}55`, textAlign:"center", margin:"14px 0 0", letterSpacing:"0.12em" }}>
            Mint link coming soon
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ THE MINO RESERVE ══════════ */}
      <section style={{ padding:"110px 0", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="Reserve" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 14px", lineHeight:1 }}>The Mino Reserve</h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", lineHeight:1.85, margin:0 }}>
            A small allocation kept for collabs, rewards, partnerships, future activations, and community support.<br/>
            This is not a public mint phase.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ $MINO ══════════ */}
      <section style={{ padding:"110px 0" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="Token" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(3.5rem,14vw,7rem)", fontWeight:900, color:goldLight, margin:"0 0 14px", letterSpacing:"0.06em", lineHeight:0.9 }}>$MINO</h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1.05rem", color:"rgba(255,255,255,0.38)", lineHeight:1.85, margin:0 }}>
            $MINO is the energy behind the Minions world.<br/>
            It is planned to power future holder systems, games, upgrades, raffles, burns, events, and community rewards.<br/>
            Full token details will be shared after mint.
          </p>
        </div>
      </section>

      <Divider />

      {/* ══════════ THE SYSTEMS ══════════ */}
      <section style={{ padding:"110px 0", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="Systems" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 48px", lineHeight:1 }}>The Systems</h2>
          <div>
            {SYSTEMS.map((s, i) => (
              <div key={s.name} style={{
                padding:"26px 0", borderBottom:`1px solid ${gold}15`,
                display:"grid", gridTemplateColumns:"1fr auto", alignItems:"start", gap:"16px",
              }}>
                <div>
                  <p style={{ margin:"0 0 6px", fontFamily:serif, fontSize:"1.1rem", fontWeight:700, color:goldLight }}>{s.name}</p>
                  <p style={{ margin:0, fontFamily:serif, fontStyle:"italic", fontSize:"0.95rem", color:"rgba(255,255,255,0.35)", lineHeight:1.65 }}>{s.desc}</p>
                </div>
                <span style={{ fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.22em", color:`${gold}44`, paddingTop:"5px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ ROADMAP ══════════ */}
      <section style={{ padding:"110px 0" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="The Plan" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 56px", lineHeight:1 }}>What Comes After Mint</h2>
          <div style={{ position:"relative" }}>
            {/* vertical timeline line */}
            <div style={{ position:"absolute", left:"7px", top:"6px", bottom:"6px", width:"1px", background:`linear-gradient(180deg,${gold}55,${gold}11)` }} />
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {ROADMAP.map((r, i) => (
                <div key={r.phase} style={{ display:"flex", gap:"28px", paddingBottom: i < ROADMAP.length - 1 ? "34px" : "0", paddingLeft:"36px", position:"relative" }}>
                  <div style={{ position:"absolute", left:"1px", top:"5px", width:"13px", height:"13px", borderRadius:"50%", border:`1.5px solid ${gold}`, background:"#060504" }} />
                  <div>
                    <p style={{ margin:"0 0 4px", fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.26em", textTransform:"uppercase", color:gold, fontWeight:500 }}>{r.phase}</p>
                    <p style={{ margin:"0 0 5px", fontFamily:serif, fontSize:"1.05rem", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{r.title}</p>
                    <p style={{ margin:0, fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.32)", lineHeight:1.65 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ FAQ ══════════ */}
      <section style={{ padding:"110px 0", background:"rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 28px" }}>
          <Label text="FAQ" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2.4rem,8vw,4rem)", fontWeight:700, color:"#fff", margin:"0 0 44px", lineHeight:1 }}>Questions</h2>
          <div>
            {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding:"80px 28px 52px", textAlign:"center" }}>
        <img src="/mini-logo.jpg" style={{ width:"40px", height:"40px", borderRadius:"4px", objectFit:"cover", marginBottom:"20px", opacity:0.9 }} alt="" />
        <h3 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:900, color:"#fff", margin:"0 0 8px", letterSpacing:"0.1em" }}>MINIONS</h3>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.28)", margin:"0 0 28px", lineHeight:1.8 }}>
          Cute. Bold. Mainly for the cool ones.<br/>
          10,000 Minions on Ethereum. Powered by $MINO.
        </p>
        <div style={{ display:"flex", gap:"28px", justifyContent:"center", marginBottom:"44px" }}>
          {[["X","https://x.com/theminionxyz"],["OpenSea","#"],["MinoList","#minolist"],["Mint","#mint"]].map(([l, h]) => (
            <a key={l} href={h} className="nav-link" style={{ fontFamily:sans, fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:`${gold}66`, transition:"color 0.2s", fontWeight:400 }}
              onMouseEnter={e => (e.currentTarget.style.color = goldLight)}
              onMouseLeave={e => (e.currentTarget.style.color = `${gold}66`)}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ width:"32px", height:"1px", background:`linear-gradient(90deg,transparent,${gold}44,transparent)`, margin:"0 auto 20px" }} />
        <p style={{ fontFamily:sans, fontSize:"0.5rem", letterSpacing:"0.3em", textTransform:"uppercase", color:`${gold}33`, fontWeight:400 }}>
          THE MINOVERSE OPENS SOON
        </p>
      </footer>

      {/* ══════════ MINOLIST MODAL — UNTOUCHED ══════════ */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) closeModal(); }} style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,0,0,0.88)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:"16px",
        }}>
          <div style={{
            width:"100%", maxWidth:"460px", maxHeight:"94vh", overflowY:"auto",
            background:"#0d0b07", border:`1px solid ${gold}22`, borderRadius:"16px",
            padding:"28px 22px 24px", animation:"modalIn 0.3s ease both", position:"relative",
            boxShadow:`0 40px 80px rgba(0,0,0,0.9), 0 0 60px ${gold}08`,
          }}>
            <button onClick={closeModal} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.22)", fontSize:"1.1rem", lineHeight:1 }}>✕</button>

            {success ? (
              <div style={{ textAlign:"center", padding:"36px 0" }}>
                <div style={{ width:"54px", height:"54px", borderRadius:"50%", background:gold, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", animation:"stamp 0.5s cubic-bezier(0.23,1,0.32,1) both", boxShadow:`0 8px 24px ${gold}44` }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke="#0a0800" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.24em", textTransform:"uppercase", color:gold, margin:"0 0 6px" }}>Application Sent</p>
                <h2 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:700, color:"#fff", margin:"0 0 10px" }}>You Are Under Review.</h2>
                <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.38)", margin:0, lineHeight:1.6 }}>
                  Selected wallets will be added before mint.
                </p>
                <button onClick={closeModal} style={{ marginTop:"24px", fontFamily:sans, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#050504", background:gold, border:"none", borderRadius:"6px", padding:"12px 28px", cursor:"pointer" }}>
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom:"22px" }}>
                  <p style={{ fontFamily:sans, fontSize:"0.55rem", letterSpacing:"0.26em", textTransform:"uppercase", color:gold, margin:"0 0 4px" }}>Minolist Application</p>
                  <h2 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:700, color:"#fff", margin:"0 0 4px", letterSpacing:"0.02em" }}>Claim Your Spot</h2>
                  <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.82rem", color:"rgba(255,255,255,0.35)", margin:"0 0 14px", lineHeight:1.5 }}>
                    Complete the missions and submit your wallet for MinoList review.
                  </p>
                  {/* progress bar */}
                  <div style={{ height:"2px", background:`${gold}18`, borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:"2px", background:`linear-gradient(90deg,${gold},${goldLight})`, width:`${([c1, c2, c3, c4].filter(Boolean).length / 4) * 100}%`, transition:"width 0.4s ease" }} />
                  </div>
                  <p style={{ fontFamily:sans, fontSize:"0.62rem", color:`${gold}66`, margin:"6px 0 0", letterSpacing:"0.08em" }}>
                    {[c1, c2, c3, c4].filter(Boolean).length} of 4 missions complete
                  </p>
                </div>

                {/* 2×2 cards */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>

                  {/* Card 1 — X Handle */}
                  <FlipCard index={0} icon="𝕏" title="Who Are You?" subtitle="Mission 01 / 04" done={c1} locked={false}>
                    <p style={{ margin:"0 0 7px", fontFamily:sans, fontSize:"0.62rem", color:`${gold}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>Your X handle</p>
                    <input type="text" placeholder="@yourhandle" value={twitter} onChange={e => setTwitter(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {c1 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:gold, margin:"5px 0 0" }}>Identity confirmed</p>}
                  </FlipCard>

                  {/* Card 2 — Like & RT */}
                  <FlipCard index={1} icon="↺" title="Complete Missions" subtitle="Mission 02 / 04" done={c2} locked={!c1}
                    onFlip={() => { window.open("https://x.com/theminionxyz", "_blank"); setTimeout(() => setTasks(p => ({ ...p, like:true })), 800); }}>
                    <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.5 }}>
                      {c2 ? "Like & retweet confirmed." : "Follow, like and retweet the pinned post on X. Quote with "MINIONS" and tag 2 friends."}
                    </p>
                    {c2 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:gold, margin:"8px 0 0" }}>Missions done</p>}
                  </FlipCard>

                  {/* Card 3 — Quote link */}
                  <FlipCard index={2} icon="↗" title="Verify Quote" subtitle="Mission 03 / 04" done={c3} locked={!c2}>
                    <p style={{ margin:"0 0 7px", fontFamily:sans, fontSize:"0.62rem", color:`${gold}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>Quote tweet link</p>
                    <input type="url" placeholder="https://x.com/yourhandle/status/..." value={quoteUrl} onChange={e => setQuoteUrl(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"#e05050", margin:"4px 0 0" }}>Needs https://</p>}
                    {c3 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:gold, margin:"4px 0 0" }}>Link verified</p>}
                  </FlipCard>

                  {/* Card 4 — Wallet */}
                  <FlipCard index={3} icon="◈" title="Claim Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                    <p style={{ margin:"0 0 7px", fontFamily:sans, fontSize:"0.62rem", color:`${gold}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>EVM address</p>
                    <input type="text" placeholder="0x..." value={wallet} onChange={e => setWallet(e.target.value)} onClick={e => e.stopPropagation()} style={inp} onFocus={focusInp} onBlur={blurInp} />
                    {wallet && !isValidEvm(wallet) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"#e05050", margin:"4px 0 0" }}>Invalid address</p>}
                    {c4 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:gold, margin:"4px 0 0" }}>Wallet confirmed</p>}
                    <p style={{ fontFamily:sans, fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", margin:"6px 0 0", lineHeight:1.4 }}>Never share private keys or seed phrases.</p>
                  </FlipCard>

                </div>

                {err && <p style={{ fontFamily:sans, fontSize:"0.78rem", color:"#e05050", margin:"0 0 10px", fontWeight:500 }}>{err}</p>}

                <button onClick={submit} disabled={sending || !allDone} style={{
                  width:"100%",
                  background: allDone ? gold : "rgba(255,255,255,0.04)",
                  color: allDone ? "#050504" : "rgba(255,255,255,0.18)",
                  border: `1px solid ${allDone ? gold : "rgba(255,255,255,0.06)"}`,
                  borderRadius:"6px", padding:"15px",
                  fontFamily:sans, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
                  cursor: allDone && !sending ? "pointer" : "not-allowed",
                  transition:"all 0.3s ease",
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

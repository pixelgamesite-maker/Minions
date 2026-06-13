import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#FF2222" }}
    >
      {/* Black border frame */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 0 10px #000",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Background image (the two zombie hands) */}
      <img
        src="/IMG_1743.JPG"
        alt="Busy Hands"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />

      {/* Navigation buttons - bottom right */}
      <div
        className="absolute flex flex-col gap-2"
        style={{ right: "4%", bottom: "18%", zIndex: 20 }}
      >
        {[
          { label: "REGISTER", path: "/register" },
          { label: "MEDIA", path: "/media" },
          { label: "CHECKER", path: "/checker" },
        ].map(({ label, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              background: "linear-gradient(180deg, #FFB800 0%, #FF8C00 100%)",
              border: "3px solid #000",
              borderRadius: "8px",
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontWeight: 900,
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              color: "#000",
              padding: "10px 28px",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #000",
              minWidth: "150px",
              textAlign: "center",
              transition: "transform 0.08s, box-shadow 0.08s",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translate(2px, 2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "1px 1px 0 #000";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "3px 3px 0 #000";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

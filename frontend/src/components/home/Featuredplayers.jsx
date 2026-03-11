import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/* --- Grade colour map ---------------------------------------- */
const GRADE_MAP = {
  A: { bg: "#10b981", glow: "rgba(16,185,129,0.35)", label: "Elite" },
  B: { bg: "#3b82f6", glow: "rgba(59,130,246,0.35)", label: "Pro" },
  C: { bg: "#f59e0b", glow: "rgba(245,158,11,0.35)", label: "Semi-Pro" },
  D: { bg: "#f97316", glow: "rgba(249,115,22,0.35)", label: "Amateur" },
  E: { bg: "#ef4444", glow: "rgba(239,68,68,0.35)", label: "Developing" },
  INCOMPLETE: { bg: "#ca8a04", glow: "rgba(202,138,4,0.3)", label: "Unrated" },
  "N/A": { bg: "#6b7280", glow: "rgba(107,114,128,0.3)", label: "No Rating" },
};
const getGrade = (g) => GRADE_MAP[g] || null;

/* --- Position colour + short label --------------------------- */
const POS_MAP = {
  FORWARD:    { color: "rgba(239,68,68,0.9)",    short: "FWD" },
  WINGER:     { color: "rgba(249,115,22,0.9)",   short: "WNG" },
  MIDFIELD:   { color: "rgba(59,130,246,0.9)",   short: "MID" },
  DEFENDER:   { color: "rgba(16,185,129,0.9)",   short: "DEF" },
  GOALKEEPER: { color: "rgba(168,85,247,0.9)",   short: "GK"  },
};

/* --- Lazy image with blur-up --------------------------------- */
const PlayerAvatar = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const fallback =
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden bg-white/5">
      <img
        src={src || fallback}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => { e.currentTarget.src = fallback; setLoaded(true); }}
        className="w-full h-full object-cover object-top transition-opacity duration-400"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      {!loaded && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.04) 100%)",
            backgroundSize: "200% 100%",
            animation: "gradientShift 1.5s ease infinite",
          }}
        />
      )}
    </div>
  );
};

/* --- Animated score bar ------------------------------------- */
const ScoreBar = ({ score, grade }) => {
  const barRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const gradeData = getGrade(grade);

  useEffect(() => {
    if (!barRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.6 },
    );
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={barRef} className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white/40 font-medium" style={{ fontSize: "10px" }}>Scout Score</span>
        <span className="text-white font-bold tabular-nums" style={{ fontSize: "10px" }}>{score}/100</span>
      </div>
      <div className="w-full rounded-full overflow-hidden bg-white/8" style={{ height: "4px" }}>
        <div
          style={{
            height: "100%",
            borderRadius: "9999px",
            width: animated ? `${score}%` : "0%",
            background: gradeData
              ? `linear-gradient(90deg, ${gradeData.bg}, ${gradeData.bg}bb)`
              : "#C4161C",
            boxShadow: gradeData ? `0 0 6px ${gradeData.glow}` : "none",
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s",
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================ */
/*                    FEATURED PLAYERS                          */
/* ============================================================ */
const FeaturedPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL || "http://localhost:5001";
        const res = await axios.get(`${base}/api/players?limit=100`);
        const all = res.data.players || res.data || [];
        const unique = Array.from(new Map(all.map((p) => [p._id, p])).values());
        const sorted = unique
          .sort((a, b) => (b.scoutReport?.totalScore || 0) - (a.scoutReport?.totalScore || 0))
          .slice(0, 6);
        setPlayers(sorted);
      } catch {
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -- LOADING -- */
  if (loading) {
    return (
      <section className="bg-[#0B0B0B] py-6" aria-label="Featured players loading">
        <div className="px-4 mb-4">
          <div className="h-6 w-40 rounded-lg mb-1.5" style={{ background: "rgba(255,255,255,0.08)", animation: "gradientShift 1.5s ease infinite" }} />
          <div className="h-3 w-52 rounded-md" style={{ background: "rgba(255,255,255,0.05)", animation: "gradientShift 1.5s ease infinite" }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl"
              style={{
                height: 260,
                background: "rgba(255,255,255,0.04)",
                animation: "gradientShift 1.5s ease infinite",
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  /* -- EMPTY -- */
  if (!players.length) {
    return (
      <section className="bg-[#0B0B0B] py-10 px-5" aria-label="Featured players">
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl m-0 mb-2">Featured Players</h2>
          <p className="text-white/40 text-sm mb-5">No players available yet.</p>
          <Link
            to="/players"
            className="inline-flex items-center px-6 py-3 rounded-xl text-white text-sm font-bold no-underline"
            style={{ background: "#C4161C" }}
          >
            Browse All Players
          </Link>
        </div>
      </section>
    );
  }

  /* -- RENDER -- */
  return (
    <section className="bg-[#0B0B0B] pt-7 pb-6" aria-label="Featured players">

      {/* -- Header -- */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2
            className="text-white font-bold m-0 leading-tight"
            style={{ fontSize: "clamp(18px,5vw,24px)" }}
          >
            Featured Players
          </h2>
          <p className="text-white/35 m-0 mt-0.5" style={{ fontSize: "11px" }}>
            Top rated talent &amp; curated profiles
          </p>
        </div>
        <Link
          to="/players"
          className="shrink-0 flex items-center justify-center font-semibold text-white px-4 rounded-lg no-underline"
          style={{
            height: "34px",
            fontSize: "12px",
            background: "#C4161C",
            boxShadow: "0 2px 12px rgba(196,22,28,0.4)",
          }}
        >
          View All
        </Link>
      </div>

      {/* -- Responsive grid: 2-col mobile / 3-col tablet+ -- */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4"
        role="list"
        aria-label="Featured players list"
      >
        {players.map((player) => {
          const gradeData = getGrade(player.scoutReport?.grade);
          const lastClub = player.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName;
          const rawPos = (player.playingPosition || "").toUpperCase().split("/")[0].trim();
          const posData =
            POS_MAP[rawPos] || { color: "rgba(107,114,128,0.85)", short: rawPos || "-" };

          return (
            <article
              key={player._id}
              role="listitem"
              aria-label={`${player.name}, ${player.playingPosition}`}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background:
                  "linear-gradient(160deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.03) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "0 6px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* -- Avatar -- */}
              <div
                className="relative w-full shrink-0"
                style={{ height: "clamp(100px,26vw,150px)" }}
              >
                <PlayerAvatar
                  src={player.profileImage}
                  alt={`Photo of ${player.name}`}
                />

                {/* Bottom fade */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "50px",
                    background:
                      "linear-gradient(to bottom,transparent,rgba(11,11,11,0.92))",
                  }}
                />

                {/* Position chip */}
                <span
                  className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-white font-bold uppercase tracking-wider"
                  style={{
                    fontSize: "8px",
                    background: posData.color,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {posData.short}
                </span>

                {/* Grade chip */}
                {gradeData && (
                  <span
                    className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-white font-bold"
                    style={{
                      fontSize: "8px",
                      background: gradeData.bg,
                      boxShadow: `0 0 8px ${gradeData.glow}`,
                    }}
                  >
                    <span>{player.scoutReport.grade}</span>
                    <span className="opacity-75">{player.scoutReport.totalScore}</span>
                  </span>
                )}
              </div>

              {/* -- Card body -- */}
              <div className="px-2.5 pt-2 pb-3 flex flex-col flex-1">
                <h3
                  className="text-white font-bold m-0 leading-snug truncate"
                  style={{ fontSize: "clamp(11px,3.2vw,14px)" }}
                >
                  {player.name}
                </h3>
                <p
                  className="text-white/50 m-0 mt-0.5 truncate"
                  style={{ fontSize: "clamp(9px,2.4vw,11px)" }}
                >
                  {lastClub || "Free Agent"}
                </p>
                <p
                  className="text-white/30 m-0 truncate"
                  style={{ fontSize: "clamp(8px,2vw,10px)" }}
                >
                  {[player.state, player.nationality].filter(Boolean).join(", ") || "-"}
                </p>

                {player.scoutReport?.totalScore > 0 && (
                  <ScoreBar
                    score={player.scoutReport.totalScore}
                    grade={player.scoutReport.grade}
                  />
                )}

                <Link
                  to={`/players/${player._id}`}
                  className="mt-auto pt-2.5 flex items-center justify-center text-white font-bold no-underline rounded-xl transition-opacity duration-200 active:opacity-80"
                  style={{
                    height: "36px",
                    fontSize: "clamp(10px,2.8vw,12px)",
                    background: "linear-gradient(135deg,#C4161C 0%,#E8242B 100%)",
                    boxShadow: "0 3px 14px rgba(196,22,28,0.4)",
                    letterSpacing: "0.01em",
                  }}
                >
                  View Profile
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedPlayers;
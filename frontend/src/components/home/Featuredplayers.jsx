import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const getGradeStyle = (grade) => {
  switch (grade) {
    case "A":
      return { bg: "#10b981", label: "Elite" };
    case "B":
      return { bg: "#3b82f6", label: "Professional" };
    case "C":
      return { bg: "#f59e0b", label: "Semi-Pro" };
    case "D":
      return { bg: "#f97316", label: "Amateur" };
    case "E":
      return { bg: "#ef4444", label: "Semi-Amateur" };
    case "INCOMPLETE":
      return { bg: "#ca8a04", label: "Incomplete Data" };
    case "N/A":
      return { bg: "#6b7280", label: "No Rating" };
    default:
      return null;
  }
};

const ImageWithFallback = ({ src, alt, className, loading }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={
        imgSrc ||
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400"
      }
      alt={alt}
      className={className}
      loading={loading}
      onError={() =>
        setImgSrc(
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
        )
      }
    />
  );
};

// ─── Random player generator ───
const RANDOM_FIRST = ["Lucas", "Aryan", "Kai", "Omar", "Renzo", "Dante", "Yuki", "Mateo", "Soren", "Ellis", "Niko", "Zain", "Pavel", "Hugo", "Rafael", "Leo", "Marco", "Andre", "Jonas", "Felix"];
const RANDOM_LAST = ["Silva", "Tanaka", "Eriksen", "Mbeki", "Rossi", "Fernandez", "Okonkwo", "Petrov", "Kim", "Alvarez", "Herrera", "Jansen", "Okoro", "Cruz", "Amir", "Diouf", "Novak", "Rodrigues", "Sato", "Werner"];
const RANDOM_POSITIONS = ["FORWARD", "MIDFIELD", "DEFENDER", "GOALKEEPER", "WINGER"];
const RANDOM_CLUBS = ["FC Barcelona Academy", "Ajax Youth", "Sporting CP B", "Borussia Dortmund II", "Santos FC Youth", "Flamengo Academy", "River Plate Youth", "PSV Academy", "Lyon Academy", "Benfica B"];
const RANDOM_CITIES = ["São Paulo", "Lagos", "Amsterdam", "Mumbai", "Tokyo", "Buenos Aires", "Berlin", "Casablanca", "Seoul", "Lisbon"];
const RANDOM_NATIONALITIES = ["Brazilian", "Nigerian", "Dutch", "Indian", "Japanese", "Argentine", "German", "Moroccan", "Korean", "Portuguese"];
const RANDOM_GRADES = ["A", "B", "C"];

function generateRandomPlayers(count = 3) {
  const players = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    let first, last, fullName;
    do {
      first = RANDOM_FIRST[Math.floor(Math.random() * RANDOM_FIRST.length)];
      last = RANDOM_LAST[Math.floor(Math.random() * RANDOM_LAST.length)];
      fullName = `${first} ${last}`;
    } while (usedNames.has(fullName));
    usedNames.add(fullName);

    const grade = RANDOM_GRADES[Math.floor(Math.random() * RANDOM_GRADES.length)];
    const score = grade === "A" ? 80 + Math.floor(Math.random() * 15)
                : grade === "B" ? 70 + Math.floor(Math.random() * 10)
                : 50 + Math.floor(Math.random() * 20);
    const idx = Math.floor(Math.random() * RANDOM_CITIES.length);

    players.push({
      _id: `random-${Date.now()}-${i}`,
      _isRandom: true,
      name: fullName,
      playingPosition: RANDOM_POSITIONS[Math.floor(Math.random() * RANDOM_POSITIONS.length)],
      profileImage: "",
      city: RANDOM_CITIES[idx],
      nationality: RANDOM_NATIONALITIES[idx],
      clubsPlayed: [{ clubName: RANDOM_CLUBS[Math.floor(Math.random() * RANDOM_CLUBS.length)] }],
      scoutReport: { totalScore: score, grade },
    });
  }
  return players;
}

const FeaturedPlayers = () => {
  const scrollRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [randomPlayers, setRandomPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Rotate random players every 30 seconds
  useEffect(() => {
    setRandomPlayers(generateRandomPlayers(3));
    const interval = setInterval(() => {
      setRandomPlayers(generateRandomPlayers(3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await axios.get(`${apiUrl}/api/players?limit=100`);
      const playersList = response.data.players || response.data || [];
      setPlayers(playersList);
    } catch (err) {
      console.error("Error fetching players:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // Top 3 real players by scout report score
  const topReal = [...players]
    .filter((p) => p.scoutReport?.totalScore > 0)
    .sort((a, b) => (b.scoutReport?.totalScore || 0) - (a.scoutReport?.totalScore || 0))
    .slice(0, 3);

  const featured = [...topReal, ...randomPlayers];

  if (loading) {
    return (
      <section
        className="w-full"
        style={{ backgroundColor: "#0B0B0B" }}
        aria-label="Featured players loading"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:py-20">
          <div className="mb-8">
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[280px] md:w-[300px] flex-shrink-0 bg-white/5 rounded h-96 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (topReal.length === 0 && randomPlayers.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#0B0B0B" }}
      aria-label="Featured players"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2
              className="m-0 text-white"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Featured Players
            </h2>
            <p className="m-0 mt-2 text-white/50" style={{ fontSize: "15px" }}>
              Top rated talent & sample profiles
            </p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/players"
              className="px-6 py-2 rounded-lg text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-red-500/50"
              style={{
                backgroundColor: "#C4161C",
                fontSize: "14px",
              }}
            >
              View All
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 md:gap-6"
          style={{ scrollbarWidth: "none" }}
          role="list"
          aria-label="Featured players list"
        >
          {featured.map((player) => (
            <div
              key={player._id}
              className="group flex w-[280px] flex-shrink-0 flex-col overflow-hidden rounded border border-white/10 no-underline transition-all duration-200 hover:border-white/20 md:w-[300px] cursor-pointer"
              style={{ backgroundColor: "#111111" }}
              role="listitem"
              aria-label={`${player.name}, ${player.playingPosition} at ${player.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName || "N/A"}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={player.profileImage}
                  alt={`Photo of ${player.name}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <span
                  className="absolute left-3 top-3 rounded px-2.5 py-1 text-white"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    backgroundColor: "rgba(0,0,0,0.7)",
                  }}
                >
                  {player.playingPosition}
                </span>
                {player._isRandom && (
                  <span
                    className="absolute left-3 bottom-3 rounded px-2 py-1 text-white"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      backgroundColor: "rgba(99,102,241,0.85)",
                    }}
                  >
                    Sample Profile
                  </span>
                )}
                {player.scoutReport?.grade && (
                  <span
                    className="absolute right-3 top-3 rounded px-2 py-1 text-white flex items-center gap-1"
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor: getGradeStyle(player.scoutReport.grade)
                        ?.bg,
                    }}
                  >
                    {player.scoutReport.grade}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        opacity: 0.85,
                      }}
                    >
                      {player.scoutReport.totalScore}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3
                  className="m-0 text-white"
                  style={{ fontSize: "16px", fontWeight: 600 }}
                >
                  {player.name}
                </h3>
                <p
                  className="m-0 mt-1 text-white/60"
                  style={{ fontSize: "13px" }}
                >
                  {player.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName || "No club"}
                </p>
                <p
                  className="m-0 mt-0.5 text-white/40"
                  style={{ fontSize: "13px" }}
                >
                  {player.city || "N/A"}, {player.nationality || "N/A"}
                </p>
                {player.scoutReport?.totalScore > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-white/40"
                        style={{ fontSize: "11px" }}
                      >
                        Scout Score
                      </span>
                      <span
                        className="text-white font-semibold"
                        style={{ fontSize: "11px" }}
                      >
                        {player.scoutReport.totalScore}/100
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: "4px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${player.scoutReport.totalScore}%`,
                          backgroundColor: getGradeStyle(
                            player.scoutReport.grade,
                          )?.bg,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-end border-t border-white/5 pt-3">
                  {player._isRandom ? (
                    <span
                      className="rounded px-3 py-1.5 text-white/50"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Sample
                    </span>
                  ) : (
                    <Link
                      to="/players"
                      className="rounded px-3 py-1.5 text-white no-underline"
                      style={{
                        backgroundColor: "#C4161C",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlayers;

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

const FeaturedPlayers = () => {
  const scrollRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
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
      // Set mock data as fallback
      setPlayers([
        {
          _id: "1",
          name: "Alex Martinez",
          playingPosition: "Forward",
          profileImage:
            "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400",
          clubsPlayed: [{ clubName: "Manchester United" }],
          city: "Manchester",
          nationality: "Spain",
          featured: true,
        },
        {
          _id: "2",
          name: "Carlos Fernandez",
          playingPosition: "Midfielder",
          profileImage:
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400",
          clubsPlayed: [{ clubName: "Barcelona FC" }],
          city: "Barcelona",
          nationality: "Brazil",
          featured: true,
        },
        {
          _id: "3",
          name: "David Thompson",
          playingPosition: "Defender",
          profileImage:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400",
          clubsPlayed: [{ clubName: "Liverpool FC" }],
          city: "Liverpool",
          nationality: "England",
          featured: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const featured = players.filter((p) => p.featured);

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

  if (featured.length === 0) {
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
              Highlighted talent from our database
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
                  <span
                    className="rounded px-3 py-1.5 text-white"
                    style={{
                      backgroundColor: "#C4161C",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    View Profile
                  </span>
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

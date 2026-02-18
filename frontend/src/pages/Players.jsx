import { useState, useEffect } from "react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import FloatingShapes from "../components/common/FloatingShapes";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("name");

  const [filters, setFilters] = useState({
    position: "",
    ageMin: "",
    ageMax: "",
    heightMin: "",
    heightMax: "",
    city: "",
    searchQuery: "",
  });

  const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
    "Winger",
    "Striker",
  ];

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, players, sortBy]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/players?limit=100`);
      const playersList = response.data.players || response.data || [];
      setPlayers(playersList);
      setFilteredPlayers(playersList);
    } catch (err) {
      console.error("Error fetching players:", err);
      setPlayers([]);
      setFilteredPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...players];

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (player) =>
          player.name?.toLowerCase().includes(q) ||
          player.playingPosition?.toLowerCase().includes(q) ||
          player.city?.toLowerCase().includes(q) ||
          player.nationality?.toLowerCase().includes(q),
      );
    }

    if (filters.position) {
      filtered = filtered.filter((player) =>
        player.playingPosition
          ?.toLowerCase()
          .includes(filters.position.toLowerCase()),
      );
    }

    if (filters.ageMin) {
      filtered = filtered.filter(
        (player) => player.age >= parseInt(filters.ageMin),
      );
    }
    if (filters.ageMax) {
      filtered = filtered.filter(
        (player) => player.age <= parseInt(filters.ageMax),
      );
    }

    if (filters.heightMin) {
      filtered = filtered.filter(
        (player) => player.height >= parseInt(filters.heightMin),
      );
    }
    if (filters.heightMax) {
      filtered = filtered.filter(
        (player) => player.height <= parseInt(filters.heightMax),
      );
    }

    if (filters.city) {
      filtered = filtered.filter((player) =>
        player.city?.toLowerCase().includes(filters.city.toLowerCase()),
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "age") return (a.age || 0) - (b.age || 0);
      if (sortBy === "height") return (b.height || 0) - (a.height || 0);
      return 0;
    });

    setFilteredPlayers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      position: "",
      ageMin: "",
      ageMax: "",
      heightMin: "",
      heightMax: "",
      city: "",
      searchQuery: "",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <FloatingShapes />

      {/* Header Section */}
      <div className="relative pt-32 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Player <span className="text-red-500">Database</span>
              </h1>
              <p className="text-gray-400 text-lg">
                {filteredPlayers.length} player
                {filteredPlayers.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px]">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    handleFilterChange("searchQuery", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm cursor-pointer"
              >
                <option value="name" className="bg-gray-900">
                  Name
                </option>
                <option value="age" className="bg-gray-900">
                  Age
                </option>
                <option value="height" className="bg-gray-900">
                  Height
                </option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-red-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-red-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block w-full lg:w-72 shrink-0`}
            >
              <div className="lg:sticky lg:top-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-red-500" />
                    <h3 className="text-xl font-bold">Filters</h3>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    Clear All
                  </button>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Position
                  </label>
                  <select
                    value={filters.position}
                    onChange={(e) =>
                      handleFilterChange("position", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">
                      All Positions
                    </option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos} className="bg-gray-900">
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Age Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageMin}
                      onChange={(e) =>
                        handleFilterChange("ageMin", e.target.value)
                      }
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageMax}
                      onChange={(e) =>
                        handleFilterChange("ageMax", e.target.value)
                      }
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                  </div>
                </div>

                {/* Height Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Height (cm)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.heightMin}
                      onChange={(e) =>
                        handleFilterChange("heightMin", e.target.value)
                      }
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.heightMax}
                      onChange={(e) =>
                        handleFilterChange("heightMax", e.target.value)
                      }
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., London"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              </div>
            </aside>

            {/* Players Grid */}
            <main className="flex-1">
              {loading ? (
                <LoadingSkeleton count={6} type="card" />
              ) : filteredPlayers.length === 0 ? (
                <EmptyState
                  icon={MagnifyingGlassIcon}
                  title="No Players Found"
                  message="Try adjusting your filters or search query"
                  action={
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-lg shadow-red-500/50"
                    >
                      Clear Filters
                    </button>
                  }
                />
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredPlayers.map((player) => (
                    <PlayerCard
                      key={player._id}
                      player={player}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grade badge color helper
const getGradeStyle = (grade) => {
  switch (grade) {
    case "A":
      return { bg: "bg-emerald-500", text: "text-white", label: "Elite" };
    case "B":
      return { bg: "bg-blue-500", text: "text-white", label: "Professional" };
    case "C":
      return { bg: "bg-amber-500", text: "text-white", label: "Semi-Pro" };
    case "D":
      return { bg: "bg-orange-500", text: "text-white", label: "Amateur" };
    case "E":
      return { bg: "bg-red-500", text: "text-white", label: "Semi-Amateur" };
    default:
      return null;
  }
};

// Player Card Component
const PlayerCard = ({ player, viewMode }) => {
  const getPositionColor = (position) => {
    const colors = {
      goalkeeper: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
      defender: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      midfielder: "bg-green-500/20 text-green-400 border-green-500/40",
      forward: "bg-red-500/20 text-red-400 border-red-500/40",
      winger: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      striker: "bg-red-500/20 text-red-400 border-red-500/40",
    };
    return (
      colors[position?.toLowerCase()] ||
      "bg-gray-500/20 text-gray-400 border-gray-500/40"
    );
  };

  const currentClub = player.clubsPlayed?.[0]?.clubName;

  if (viewMode === "list") {
    // Calculate experience from career_history or clubsPlayed
    const getExperience = () => {
      if (
        Array.isArray(player.career_history) &&
        player.career_history.length > 0
      ) {
        const years = player.career_history.reduce((total, entry) => {
          const start = entry.startYear || 0;
          const end = entry.endYear || new Date().getFullYear();
          return total + (end - start);
        }, 0);
        return `${years} yrs`;
      }
      if (player.clubsPlayed && player.clubsPlayed.length > 0) {
        return `${player.clubsPlayed.length}+ yrs`;
      }
      return "N/A";
    };

    return (
      <div className="group bg-[#1a1a1a] border border-white/10 rounded-2xl px-4 py-3 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Thumbnail Image - Circular */}
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 bg-gray-800">
            <img
              src={
                player.profileImage ||
                "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400"
              }
              alt={player.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + Position */}
          <div className="w-36 shrink-0">
            <h3 className="text-base font-bold text-white mb-1.5 truncate">
              {player.name}
            </h3>
            <span
              className={`text-xs px-2.5 py-1 rounded font-semibold ${
                player.playingPosition?.toLowerCase() === "midfielder"
                  ? "bg-green-600 text-white"
                  : player.playingPosition?.toLowerCase() === "striker" ||
                      player.playingPosition?.toLowerCase() === "forward"
                    ? "bg-red-600 text-white"
                    : player.playingPosition?.toLowerCase() === "defender"
                      ? "bg-blue-600 text-white"
                      : player.playingPosition?.toLowerCase() === "goalkeeper"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-600 text-white"
              }`}
            >
              {player.playingPosition}
            </span>
          </div>

          {/* Club */}
          <div className="w-40 shrink-0 hidden lg:block">
            <p className="text-xs text-gray-500 mb-1">Club</p>
            <p className="text-sm text-gray-200 truncate">
              {currentClub || "—"}
            </p>
          </div>

          {/* Location */}
          <div className="w-36 shrink-0 hidden lg:block">
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm text-gray-200 truncate">
              {player.city
                ? `${player.city}${player.nationality ? `, ${player.nationality}` : ""}`
                : "—"}
            </p>
          </div>

          {/* Age */}
          <div className="w-16 shrink-0 hidden md:block">
            <p className="text-xs text-gray-500 mb-1">Age</p>
            <p className="text-base text-white font-semibold">
              {player.age || "—"}
            </p>
          </div>

          {/* Experience */}
          <div className="w-20 shrink-0 hidden md:block">
            <p className="text-xs text-gray-500 mb-1">Experience</p>
            <p className="text-base text-white font-semibold">
              {getExperience()}
            </p>
          </div>

          {/* Scout Grade */}
          {player.scoutReport?.grade && (
            <div className="w-20 shrink-0 hidden md:block text-center">
              <p className="text-xs text-gray-500 mb-1">Grade</p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${getGradeStyle(player.scoutReport.grade)?.bg} ${getGradeStyle(player.scoutReport.grade)?.text}`}
                >
                  {player.scoutReport.grade}
                </span>
                <span className="text-sm text-white font-semibold">
                  {player.scoutReport.totalScore}
                </span>
              </div>
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {player.email && (
              <a
                href={`mailto:${player.email}`}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                title={`Email ${player.name}`}
              >
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
            {player.mobileNumber && (
              <a
                href={`tel:${player.mobileNumber}`}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                title={`Call ${player.name}`}
              >
                <PhoneIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
            <a
              href={player.transferMarketLink || "#"}
              target={player.transferMarketLink ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
              title="External Link"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
            </a>

            {/* View Profile Button */}
            <button
              className="ml-1 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: "#C4161C" }}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={
            player.profileImage ||
            "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400"
          }
          alt={player.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Position Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-3 py-1.5 rounded-md font-semibold text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            {player.playingPosition}
          </span>
        </div>

        {/* Scout Grade Badge */}
        {player.scoutReport?.grade && (
          <div className="absolute top-3 right-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md ${getGradeStyle(player.scoutReport.grade)?.bg}`}
            >
              <span className="text-xs font-bold text-white">
                {player.scoutReport.grade}
              </span>
              <span className="text-[10px] font-semibold text-white/80">
                {player.scoutReport.totalScore}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1">{player.name}</h3>

        {currentClub && (
          <p className="text-sm text-gray-400 mb-1">{currentClub}</p>
        )}

        {player.city && (
          <p className="text-sm text-gray-500">
            {player.city}
            {player.nationality ? `, ${player.nationality}` : ""}
          </p>
        )}

        {/* Scout Report Score Bar */}
        {player.scoutReport?.totalScore > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Scout Score</span>
              <span className="text-xs font-semibold text-white">
                {player.scoutReport.totalScore}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getGradeStyle(player.scoutReport.grade)?.bg}`}
                style={{ width: `${player.scoutReport.totalScore}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {getGradeStyle(player.scoutReport.grade)?.label}
            </p>
          </div>
        )}

        {/* Bottom Row: Icons + View Profile */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {player.email && (
              <a
                href={`mailto:${player.email}`}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                title={`Email ${player.name}`}
              >
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
            {player.mobileNumber && (
              <a
                href={`tel:${player.mobileNumber}`}
                className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                title={`Call ${player.name}`}
              >
                <PhoneIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
            {player.transferMarketLink && (
              <a
                href={player.transferMarketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                title="Transfer Market"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
              </a>
            )}
            {!player.transferMarketLink && (
              <span className="p-2 border border-white/10 rounded-lg">
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
              </span>
            )}
          </div>
          <button
            className="px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#C4161C" }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Players;

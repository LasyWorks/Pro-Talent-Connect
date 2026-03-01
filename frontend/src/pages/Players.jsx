import { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  XMarkIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GLASS = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const GLASS_HOVER = {
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
};

const POSITIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Winger",
  "Striker",
];

const POSITION_COLORS = {
  goalkeeper: {
    bg: "rgba(234,179,8,0.15)",
    color: "#EAB308",
    border: "rgba(234,179,8,0.3)",
  },
  defender: {
    bg: "rgba(59,130,246,0.15)",
    color: "#60A5FA",
    border: "rgba(59,130,246,0.3)",
  },
  midfielder: {
    bg: "rgba(34,197,94,0.15)",
    color: "#4ADE80",
    border: "rgba(34,197,94,0.3)",
  },
  forward: {
    bg: "rgba(251,146,60,0.15)",
    color: "#FB923C",
    border: "rgba(251,146,60,0.3)",
  },
  winger: {
    bg: "rgba(168,85,247,0.15)",
    color: "#C084FC",
    border: "rgba(168,85,247,0.3)",
  },
  striker: {
    bg: "rgba(251,146,60,0.15)",
    color: "#FB923C",
    border: "rgba(251,146,60,0.3)",
  },
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const formatPlayerId = (id) => {
  if (!id || id.toString().toUpperCase().startsWith("TEMP")) return null;
  return id;
};

const getGradeStyle = (grade) => {
  const map = {
    A: { color: "#34D399", label: "Elite" },
    B: { color: "#60A5FA", label: "Professional" },
    C: { color: "#FBBF24", label: "Semi-Pro" },
    D: { color: "#FB923C", label: "Amateur" },
    E: { color: "#F87171", label: "Semi-Amateur" },
    INCOMPLETE: { color: "#9CA3AF", label: "Incomplete" },
    "N/A": { color: "#6B7280", label: "No Rating" },
  };
  return map[grade] || null;
};

const getPositionStyle = (position) =>
  POSITION_COLORS[position?.toLowerCase()] || {
    bg: "rgba(107,114,128,0.15)",
    color: "#9CA3AF",
    border: "rgba(107,114,128,0.3)",
  };

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/6 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
          }}
        >
          {title.toUpperCase()}
        </span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium"
    style={{
      background: "rgba(196,22,28,0.15)",
      border: "1px solid rgba(196,22,28,0.35)",
      color: "#FCA5A5",
    }}
  >
    {label}
    <button
      onClick={onRemove}
      className="hover:text-white transition-colors"
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <XMarkIcon className="w-3 h-3" />
    </button>
  </span>
);

const ScoreBar = ({ score, grade }) => {
  const style = getGradeStyle(grade);
  const isHigh = score > 75;
  const barColor = isHigh ? "#C4161C" : style?.color || "#6B7280";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          SCOUT SCORE
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: isHigh ? "#FCA5A5" : "rgba(255,255,255,0.65)",
          }}
        >
          {score}
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 400,
            }}
          >
            /100
          </span>
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse" style={GLASS}>
    <div
      style={{
        aspectRatio: "3/4",
        maxHeight: "260px",
        background: "rgba(255,255,255,0.05)",
      }}
    />
    <div className="p-5 space-y-3">
      <div
        className="h-4 rounded w-2/3"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="h-3 rounded w-1/2"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      <div
        className="h-3 rounded w-1/3 mt-4"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      <div
        className="h-1 rounded-full mt-4"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="h-10 rounded-xl mt-4"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  </div>
);

const NoResults = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <MagnifyingGlassIcon
        className="w-7 h-7"
        style={{ color: "rgba(255,255,255,0.2)" }}
      />
    </div>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: 600,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "'Playfair Display', serif",
      }}
      className="mb-2"
    >
      No players found
    </h3>
    <p
      style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.3)",
        lineHeight: 1.6,
      }}
      className="mb-6 max-w-xs"
    >
      Try adjusting your filters or search query to find matching players.
    </p>
    <button
      onClick={onReset}
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "#FCA5A5",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      Reset all filters â†’
    </button>
  </div>
);

// â”€â”€â”€ Player Card (Grid) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PlayerCardGrid = ({ player, onViewProfile }) => {
  const [hovered, setHovered] = useState(false);
  const currentClub =
    player.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName;
  const posStyle = getPositionStyle(player.playingPosition);
  const gradeStyle = player.scoutReport?.grade
    ? getGradeStyle(player.scoutReport.grade)
    : null;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
      style={{
        ...GLASS,
        ...(hovered ? GLASS_HOVER : {}),
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image â€” 3:4 ratio */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "3/4", maxHeight: "260px" }}
      >
        <img
          src={player.profileImage || DEFAULT_IMAGE}
          alt={player.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Position badge top-left */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-md font-semibold"
            style={{
              background: posStyle.bg,
              color: posStyle.color,
              border: `1px solid ${posStyle.border}`,
              backdropFilter: "blur(8px)",
              fontSize: "11px",
            }}
          >
            {player.playingPosition || "â€”"}
          </span>
        </div>
        {/* Grade badge top-right */}
        {gradeStyle && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2 py-1 rounded-md font-bold"
              style={{
                background: "rgba(0,0,0,0.6)",
                color: gradeStyle.color,
                backdropFilter: "blur(8px)",
                fontSize: "11px",
              }}
            >
              {player.scoutReport.grade}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <h3
            className="text-white truncate mb-1"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: 1.3,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {player.name}
          </h3>
          {currentClub && (
            <p
              className="truncate"
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.5,
              }}
            >
              {currentClub}
            </p>
          )}
          {player.city && (
            <p
              className="truncate"
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.28)",
                marginTop: "2px",
              }}
            >
              {player.city}
              {player.nationality ? `, ${player.nationality}` : ""}
            </p>
          )}
        </div>

        {player.scoutReport?.totalScore > 0 && (
          <ScoreBar
            score={player.scoutReport.totalScore}
            grade={player.scoutReport.grade}
          />
        )}

        <div className="flex-1" />

        <div>
          {/* Icon row */}
          <div className="flex items-center gap-2 mb-3">
            {player.email && (
              <a
                href={`mailto:${player.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title={`Email ${player.name}`}
              >
                <EnvelopeIcon
                  className="w-3.5 h-3.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                />
              </a>
            )}
            {player.mobileNumber && (
              <a
                href={`tel:${player.mobileNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title={`Call ${player.name}`}
              >
                <PhoneIcon
                  className="w-3.5 h-3.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                />
              </a>
            )}
            {player.transferMarketLink && (
              <a
                href={player.transferMarketLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                title="View on Transfer Market"
              >
                <ArrowTopRightOnSquareIcon
                  className="w-3.5 h-3.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                />
              </a>
            )}
            <button
              className="flex items-center justify-center rounded-lg ml-auto transition-colors hover:bg-white/10"
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
              title="Save player"
            >
              <BookmarkIcon
                className="w-3.5 h-3.5"
                style={{ color: "rgba(255,255,255,0.35)" }}
              />
            </button>
          </div>
          {/* CTA */}
          <button
            onClick={() => onViewProfile(player)}
            className="w-full font-semibold text-white rounded-xl transition-all duration-200"
            style={{
              height: "48px",
              fontSize: "14px",
              fontWeight: 600,
              background: "#C4161C",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#a81219";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#C4161C";
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// â”€â”€â”€ Player Card (List) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PlayerCardList = ({ player, onViewProfile }) => {
  const [hovered, setHovered] = useState(false);
  const currentClub =
    player.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName;
  const posStyle = getPositionStyle(player.playingPosition);
  const gradeStyle = player.scoutReport?.grade
    ? getGradeStyle(player.scoutReport.grade)
    : null;

  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-5 transition-all duration-200"
      style={{
        ...GLASS,
        ...(hovered
          ? {
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.08)",
            }
          : {}),
        height: "72px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <img
          src={player.profileImage || DEFAULT_IMAGE}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name + position */}
      <div className="min-w-0 w-40 shrink-0">
        <p
          className="text-white truncate"
          style={{
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: 1.3,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {player.name}
        </p>
        <span
          className="inline-block mt-0.5 px-2 py-0.5 rounded"
          style={{
            background: posStyle.bg,
            color: posStyle.color,
            fontSize: "11px",
            fontWeight: 500,
          }}
        >
          {player.playingPosition || "â€”"}
        </span>
      </div>

      {/* Club */}
      <div className="min-w-0 w-36 shrink-0 hidden lg:block">
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Club</p>
        <p
          className="truncate"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
        >
          {currentClub || "â€”"}
        </p>
      </div>

      {/* Location */}
      <div className="min-w-0 w-32 shrink-0 hidden xl:block">
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          Location
        </p>
        <p
          className="truncate"
          style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
        >
          {player.city
            ? `${player.city}${player.nationality ? `, ${player.nationality}` : ""}`
            : "â€”"}
        </p>
      </div>

      {/* Age */}
      <div className="w-12 shrink-0 hidden md:block">
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Age</p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {player.age || "â€”"}
        </p>
      </div>

      {/* Score */}
      {gradeStyle && (
        <div className="w-20 shrink-0 hidden md:block">
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Score
          </p>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: gradeStyle.color,
            }}
          >
            {player.scoutReport?.totalScore ?? "â€”"}
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                fontWeight: 400,
              }}
            >
              {" "}
              {player.scoutReport?.grade}
            </span>
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        {player.email && (
          <a
            href={`mailto:${player.email}`}
            className="items-center justify-center rounded-lg hidden sm:flex transition-colors hover:bg-white/10"
            style={{
              width: "34px",
              height: "34px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title={`Email ${player.name}`}
          >
            <EnvelopeIcon
              className="w-3.5 h-3.5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            />
          </a>
        )}
        {player.mobileNumber && (
          <a
            href={`tel:${player.mobileNumber}`}
            className="items-center justify-center rounded-lg hidden sm:flex transition-colors hover:bg-white/10"
            style={{
              width: "34px",
              height: "34px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title={`Call ${player.name}`}
          >
            <PhoneIcon
              className="w-3.5 h-3.5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            />
          </a>
        )}
        <button
          onClick={() => onViewProfile(player)}
          className="font-semibold text-white rounded-xl transition-all duration-200"
          style={{
            height: "36px",
            padding: "0 16px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#C4161C",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#a81219";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#C4161C";
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

// â”€â”€â”€ Player Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PlayerDetailModal = ({ player, onClose }) => {
  if (!player) return null;
  const gradeStyle = player.scoutReport?.grade
    ? getGradeStyle(player.scoutReport.grade)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative p-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex items-center justify-center rounded-xl transition-colors hover:bg-white/10"
            style={{
              width: "36px",
              height: "36px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <XMarkIcon
              className="w-5 h-5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            />
          </button>
          <div className="flex items-start gap-4">
            <img
              src={player.profileImage || DEFAULT_IMAGE}
              alt={player.name}
              className="w-20 h-20 rounded-xl object-cover"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <div>
              <h2
                className="text-white mb-1"
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {player.name}
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                {player.playingPosition}
              </p>
              {formatPlayerId(player.playerId) && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.22)",
                    marginTop: "2px",
                  }}
                >
                  ID: {formatPlayerId(player.playerId)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <SectionLabel text="Basic Information" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Age", value: player.age },
              {
                label: "Height",
                value: player.height ? `${player.height} cm` : null,
              },
              {
                label: "Weight",
                value: player.weight ? `${player.weight} kg` : null,
              },
              { label: "Preferred Foot", value: player.preferredFoot },
              { label: "Nationality", value: player.nationality },
              { label: "City", value: player.city },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "4px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: value
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(255,255,255,0.18)",
                  }}
                >
                  {value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          {/* Scout Report */}
          {player.scoutReport && (
            <>
              <SectionLabel text="Scout Report" />
              <div
                className="rounded-xl p-5 mb-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}
                  >
                    Overall Score
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: gradeStyle?.color || "#fff",
                      }}
                    >
                      {player.scoutReport.totalScore}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      /100
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        background: gradeStyle
                          ? `${gradeStyle.color}22`
                          : "rgba(255,255,255,0.06)",
                        color: gradeStyle?.color || "#fff",
                      }}
                    >
                      {player.scoutReport.grade}
                    </span>
                  </div>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden mb-2"
                  style={{
                    height: "4px",
                    background: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${player.scoutReport.totalScore}%`,
                      background: gradeStyle?.color || "#6B7280",
                    }}
                  />
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  {gradeStyle?.label}
                </p>
              </div>
              <div
                className="rounded-xl p-5 space-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  className="uppercase tracking-widest mb-3"
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.12em",
                  }}
                >
                  Score Breakdown
                </p>
                {[
                  {
                    label: "Age Prospect",
                    max: 5,
                    score: player.scoutReport.ageScore,
                    missing: !player.age,
                  },
                  {
                    label: "Physical Profile",
                    max: 5,
                    score: player.scoutReport.physicalScore,
                    missing: !player.height || !player.weight,
                  },
                  {
                    label: "Transfer Market",
                    max: 7.5,
                    score: player.scoutReport.transferMarketScore,
                    missing: !player.transferMarketLink,
                  },
                  {
                    label: "Competition Level",
                    max: 50,
                    score: player.scoutReport.competitionScore,
                    missing: !player.competitions?.length,
                  },
                  {
                    label: "Championship Bonus",
                    max: "â€”",
                    score: player.scoutReport.championshipBonus,
                    missing: !player.competitions?.length,
                  },
                  {
                    label: "State League",
                    max: 2,
                    score: player.scoutReport.stateLeagueBonus,
                    missing: !player.stateLeague,
                  },
                  {
                    label: "Club Reputation",
                    max: 3,
                    score: player.scoutReport.clubReputationBonus,
                    missing: !player.clubsPlayed?.length && !player.clubTier,
                  },
                  {
                    label: "Speed (Sprint 30m)",
                    max: 2,
                    score: player.scoutReport.speedScore,
                    missing: !player.sprint30m,
                  },
                  {
                    label: "Mentality",
                    max: 2,
                    score: player.scoutReport.mentalityAssessment,
                    missing: player.mentalityScore == null,
                  },
                ].map(({ label, max, score, missing }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0"
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      {label}
                    </span>
                    {missing ? (
                      <span
                        style={{
                          fontSize: "12px",
                          fontStyle: "italic",
                          color: "rgba(255,255,255,0.18)",
                        }}
                      >
                        Not provided
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        {score}
                        {max !== "â€”" && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.22)",
                              fontWeight: 400,
                            }}
                          >
                            /{max}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Leagues Won */}
          {player.competitions?.filter((c) => c.result === "Champion").length >
            0 && (
            <>
              <SectionLabel text="ðŸ† Leagues Won" />
              <div className="space-y-2">
                {player.competitions
                  .filter((c) => c.result === "Champion")
                  .map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center rounded-xl p-4"
                      style={{
                        background: "rgba(234,179,8,0.07)",
                        border: "1px solid rgba(234,179,8,0.18)",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "2px",
                          }}
                        >
                          {c.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#EAB308",
                          }}
                        >
                          Champion
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "2px",
                          }}
                        >
                          {c.year}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Runner-Up */}
          {player.competitions?.filter((c) => c.result === "Runner-up").length >
            0 && (
            <>
              <SectionLabel text="ðŸ¥ˆ Runner-Up" />
              <div className="space-y-2">
                {player.competitions
                  .filter((c) => c.result === "Runner-up")
                  .map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center rounded-xl p-4"
                      style={{
                        background: "rgba(107,114,128,0.07)",
                        border: "1px solid rgba(107,114,128,0.18)",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          {c.name}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "2px",
                          }}
                        >
                          {c.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        >
                          Runner-Up
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.3)",
                            marginTop: "2px",
                          }}
                        >
                          {c.year}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Club History */}
          {player.clubsPlayed?.length > 0 && (
            <>
              <SectionLabel text="Club History" />
              <div className="space-y-2">
                {[...player.clubsPlayed].reverse().map((club, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      {club.clubName}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {club.duration}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Contact */}
          <SectionLabel text="Contact Information" />
          <div className="space-y-2">
            {player.email && (
              <div
                className="flex items-center gap-3 rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <EnvelopeIcon
                  className="w-5 h-5 shrink-0"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <a
                  href={`mailto:${player.email}`}
                  style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                  className="hover:text-white transition-colors"
                >
                  {player.email}
                </a>
              </div>
            )}
            {player.mobileNumber && (
              <div
                className="flex items-center gap-3 rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <PhoneIcon
                  className="w-5 h-5 shrink-0"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                />
                <a
                  href={`tel:${player.mobileNumber}`}
                  style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
                  className="hover:text-white transition-colors"
                >
                  {player.mobileNumber}
                </a>
              </div>
            )}
          </div>

          {/* Scouting Notes */}
          {player.scouting_notes && (
            <>
              <SectionLabel text="Scouting Notes" />
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.7,
                  }}
                >
                  {player.scouting_notes}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable modal section label
const SectionLabel = ({ text }) => (
  <p
    className="uppercase tracking-widest"
    style={{
      fontSize: "11px",
      fontWeight: 500,
      color: "rgba(255,255,255,0.28)",
      letterSpacing: "0.12em",
    }}
  >
    {text}
  </p>
);

// â”€â”€â”€ Main Players Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const [filters, setFilters] = useState({
    position: "",
    ageMin: "",
    ageMax: "",
    heightMin: "",
    heightMax: "",
    city: "",
    searchQuery: "",
  });

  const fetchPlayers = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPlayers({ limit: 100, signal });
      const playersList = response.data.players || response.data || [];
      if (!signal.aborted) {
        setPlayers(playersList);
        setFilteredPlayers(playersList);
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error("Error fetching players:", err);
        setError("Failed to load players. Please try again.");
        setPlayers([]);
        setFilteredPlayers([]);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchPlayers(ac.signal);
    return () => ac.abort();
  }, [fetchPlayers]);

  useEffect(() => {
    applyFilters();
  }, [filters, players, sortBy]);

  const applyFilters = () => {
    let result = [...players];
    const q = filters.searchQuery.toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.playingPosition?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.nationality?.toLowerCase().includes(q),
      );
    }
    if (filters.position)
      result = result.filter((p) =>
        p.playingPosition
          ?.toLowerCase()
          .includes(filters.position.toLowerCase()),
      );
    if (filters.ageMin)
      result = result.filter((p) => p.age >= parseInt(filters.ageMin));
    if (filters.ageMax)
      result = result.filter((p) => p.age <= parseInt(filters.ageMax));
    if (filters.heightMin)
      result = result.filter((p) => p.height >= parseInt(filters.heightMin));
    if (filters.heightMax)
      result = result.filter((p) => p.height <= parseInt(filters.heightMax));
    if (filters.city)
      result = result.filter((p) =>
        p.city?.toLowerCase().includes(filters.city.toLowerCase()),
      );
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "score")
        return (
          (b.scoutReport?.totalScore || 0) - (a.scoutReport?.totalScore || 0)
        );
      if (sortBy === "age") return (a.age || 0) - (b.age || 0);
      if (sortBy === "position")
        return (a.playingPosition || "").localeCompare(b.playingPosition || "");
      return 0;
    });
    setFilteredPlayers(result);
  };

  const clearFilters = () =>
    setFilters({
      position: "",
      ageMin: "",
      ageMax: "",
      heightMin: "",
      heightMax: "",
      city: "",
      searchQuery: "",
    });

  const set = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleViewProfile = (player) => {
    setSelectedPlayer(player);
    setShowPlayerModal(true);
  };

  const activeChips = [
    filters.position && {
      key: "position",
      label: `Position: ${filters.position}`,
    },
    (filters.ageMin || filters.ageMax) && {
      key: "age",
      label: `Age: ${filters.ageMin || "any"}â€“${filters.ageMax || "any"}`,
    },
    filters.city && { key: "city", label: `City: ${filters.city}` },
    (filters.heightMin || filters.heightMax) && {
      key: "height",
      label: `Height: ${filters.heightMin || "any"}â€“${filters.heightMax || "any"} cm`,
    },
  ].filter(Boolean);

  const removeChip = (key) => {
    if (key === "age") {
      set("ageMin", "");
      set("ageMax", "");
    } else if (key === "height") {
      set("heightMin", "");
      set("heightMax", "");
    } else set(key, "");
  };

  const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(160deg, #0a0a0f 0%, #0d0d14 50%, #0a0a0b 100%)",
      }}
    >
      {/* Ambient glow â€” 30% dimmer than before */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-160 h-95 rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(196,22,28,0.22) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* â”€â”€ Header â”€â”€ */}
      <div className="relative pt-32 pb-8 px-4 sm:px-6">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <p
                className="uppercase tracking-widest mb-2"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.28)",
                  letterSpacing: "0.16em",
                }}
              >
                Pro Talent Connect
              </p>
              <h1
                className="text-white"
                style={{
                  fontSize: "clamp(36px, 5vw, 48px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Player <span style={{ color: "#C4161C" }}>Database</span>
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.32)",
                  marginTop: "8px",
                  lineHeight: 1.5,
                }}
              >
                {loading
                  ? "Loading playersâ€¦"
                  : `${filteredPlayers.length} verified player${filteredPlayers.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search â€” Fitts's Law: 48px height */}
              <div
                className="relative"
                style={{ minWidth: "260px", flex: "1 1 260px" }}
              >
                <MagnifyingGlassIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                />
                <input
                  type="text"
                  placeholder="Search by name, position, city..."
                  value={filters.searchQuery}
                  onChange={(e) => set("searchQuery", e.target.value)}
                  style={{
                    width: "100%",
                    height: "48px",
                    paddingLeft: "48px",
                    paddingRight: "16px",
                    ...GLASS,
                    borderRadius: "14px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                  }}
                  className="placeholder:text-white/25 focus:border-white/20 transition-all"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: "48px",
                  padding: "0 16px",
                  ...GLASS,
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.65)",
                  outline: "none",
                  cursor: "pointer",
                  minWidth: "140px",
                }}
              >
                <option value="name" className="bg-gray-900">
                  Sort: Name
                </option>
                <option value="score" className="bg-gray-900">
                  Sort: Score
                </option>
                <option value="position" className="bg-gray-900">
                  Sort: Position
                </option>
                <option value="age" className="bg-gray-900">
                  Sort: Age
                </option>
              </select>

              {/* View Toggle */}
              <div
                className="flex items-center p-1 gap-1 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {[
                  { mode: "grid", Icon: Squares2X2Icon },
                  { mode: "list", Icon: ListBulletIcon },
                ].map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className="flex items-center justify-center rounded-lg transition-all duration-200"
                    style={{
                      width: "36px",
                      height: "36px",
                      background:
                        viewMode === mode
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      border:
                        viewMode === mode
                          ? "1px solid rgba(255,255,255,0.12)"
                          : "1px solid transparent",
                      cursor: "pointer",
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color:
                          viewMode === mode ? "#fff" : "rgba(255,255,255,0.3)",
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="lg:hidden flex items-center gap-2 rounded-xl px-4 transition-all duration-200"
                style={{
                  height: "48px",
                  ...GLASS,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                }}
              >
                Filters
                {activeChips.length > 0 && (
                  <span
                    className="flex items-center justify-center w-5 h-5 rounded-full"
                    style={{
                      background: "#C4161C",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.28)",
                  fontWeight: 500,
                }}
              >
                Active:
              </span>
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  onRemove={() => removeChip(chip.key)}
                />
              ))}
              <button
                onClick={clearFilters}
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.28)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto 32px", padding: "0 24px" }}
      >
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* â”€â”€ Main Content â”€â”€ */}
      <div className="relative px-4 sm:px-6 pb-24">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="flex gap-8">
            {/* â”€â”€ Filter Sidebar â”€â”€ */}
            <aside
              className={`${showFilters ? "block" : "hidden"} lg:block shrink-0`}
              style={{ width: "232px" }}
            >
              <div
                className="lg:sticky"
                style={{
                  top: "96px",
                  ...GLASS,
                  borderRadius: "20px",
                  padding: "0 20px",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-center justify-between py-5">
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    Filters
                  </span>
                  {activeChips.length > 0 && (
                    <button
                      onClick={clearFilters}
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.3)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Reset all
                    </button>
                  )}
                </div>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.05)",
                  }}
                />

                <FilterSection title="Position">
                  <select
                    value={filters.position}
                    onChange={(e) => set("position", e.target.value)}
                    style={{
                      ...inputStyle,
                      color: filters.position
                        ? "#fff"
                        : "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="" className="bg-gray-900">
                      All Positions
                    </option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p} className="bg-gray-900">
                        {p}
                      </option>
                    ))}
                  </select>
                </FilterSection>

                <FilterSection title="Age Range">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageMin}
                      onChange={(e) => set("ageMin", e.target.value)}
                      style={{ ...inputStyle, width: "50%" }}
                      className="placeholder:text-white/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageMax}
                      onChange={(e) => set("ageMax", e.target.value)}
                      style={{ ...inputStyle, width: "50%" }}
                      className="placeholder:text-white/20"
                    />
                  </div>
                </FilterSection>

                <FilterSection title="Location">
                  <input
                    type="text"
                    placeholder="e.g. London"
                    value={filters.city}
                    onChange={(e) => set("city", e.target.value)}
                    style={inputStyle}
                    className="placeholder:text-white/20"
                  />
                </FilterSection>

                {/* Advanced */}
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="w-full flex items-center justify-between py-4"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ADVANCED
                  </span>
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 text-white/25 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </button>

                {showAdvanced && (
                  <div className="pb-5">
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.25)",
                        marginBottom: "10px",
                      }}
                    >
                      Height (cm)
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.heightMin}
                        onChange={(e) => set("heightMin", e.target.value)}
                        style={{ ...inputStyle, width: "50%" }}
                        className="placeholder:text-white/20"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.heightMax}
                        onChange={(e) => set("heightMax", e.target.value)}
                        style={{ ...inputStyle, width: "50%" }}
                        className="placeholder:text-white/20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* â”€â”€ Player Grid / List â”€â”€ */}
            <main className="flex-1 min-w-0">
              {loading ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-3"
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) =>
                    viewMode === "grid" ? (
                      <SkeletonCard key={i} />
                    ) : (
                      <div
                        key={i}
                        className="rounded-2xl animate-pulse"
                        style={{ height: "72px", ...GLASS }}
                      />
                    ),
                  )}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p
                    style={{
                      fontSize: "15px",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      const ac = new AbortController();
                      fetchPlayers(ac.signal);
                    }}
                    className="mt-4"
                    style={{
                      fontSize: "14px",
                      color: "#FCA5A5",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Try again
                  </button>
                </div>
              ) : filteredPlayers.length === 0 ? (
                <NoResults onReset={clearFilters} />
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlayers.map((player) => (
                    <PlayerCardGrid
                      key={player._id}
                      player={player}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlayers.map((player) => (
                    <PlayerCardList
                      key={player._id}
                      player={player}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {showPlayerModal && (
        <PlayerDetailModal
          player={selectedPlayer}
          onClose={() => setShowPlayerModal(false)}
        />
      )}
    </div>
  );
};

export default Players;

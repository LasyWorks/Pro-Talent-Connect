import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowTopRightOnSquareIcon,
  BookmarkIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  TrophyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ScaleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

/* ═══ Design Tokens ════════════════════════════════════════ */
const T = {
  labelText:
    "text-[10px] font-semibold uppercase tracking-[0.09em] text-gray-500",
  sectionTitle: "text-sm font-semibold text-white",
};
const card = "bg-[#111115] border border-white/[0.07] rounded-xl";
const tH =
  "text-[10px] font-semibold uppercase tracking-wider text-gray-500 px-4 py-3 text-left";
const tD = "px-4 py-3 text-sm text-gray-400";
const tDW = "px-4 py-3 text-sm font-semibold text-gray-100";

/* ═══ Data Meta ════════════════════════════════════════════ */
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400";

const POSITION_COLORS = {
  goalkeeper: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  defender: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  midfielder: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
  },
  forward: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
  winger: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  striker: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
};

const GRADE_META = {
  A: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Elite",
    bar: "#34D399",
  },
  B: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Professional",
    bar: "#60A5FA",
  },
  C: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Semi-Pro",
    bar: "#FBBF24",
  },
  D: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Amateur",
    bar: "#FB923C",
  },
  E: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Semi-Amateur",
    bar: "#F87171",
  },
  INCOMPLETE: {
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    label: "Incomplete",
    bar: "#9CA3AF",
  },
  "N/A": {
    color: "text-gray-500",
    bg: "bg-gray-800",
    border: "border-gray-700",
    label: "Unrated",
    bar: "#6B7280",
  },
};

const posStyle = (pos) =>
  POSITION_COLORS[pos?.toLowerCase()] || {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
  };
const gradeStyle = (g) => GRADE_META[g] || GRADE_META["N/A"];

/* ═══ Primitives ═══════════════════════════════════════════ */

/** Status badge */
const Badge = ({ label, variant = "gray" }) => {
  const v = {
    gray: "bg-gray-800/80 text-gray-400   border-gray-700",
    green: "bg-green-500/10 text-green-400  border-green-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    gold: "bg-amber-400/10 text-amber-300  border-amber-400/20",
    red: "bg-red-500/10   text-red-400    border-red-500/20",
    blue: "bg-blue-500/10  text-blue-400   border-blue-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${v[variant] || v.gray}`}
    >
      {label}
    </span>
  );
};

/** Labelled stat cell */
const StatItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className={T.labelText}>{label}</p>
    <p
      className={`text-sm font-semibold leading-snug ${value ? "text-white" : "text-gray-600 italic"}`}
    >
      {value || "—"}
    </p>
  </div>
);

/** Horizontal attribute bar */
const RatingBar = ({ label, value, max, color }) => {
  const pct = max
    ? Math.min(Math.round((value / max) * 100), 100)
    : Math.min(Math.round(value), 100);
  const barColor =
    color || (pct >= 70 ? "#34D399" : pct >= 40 ? "#FBBF24" : "#F87171");
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400">{label}</span>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: barColor }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

/** Card section with optional header */
const Section = ({ title, sub, children, className = "" }) => (
  <div className={`${card} overflow-hidden ${className}`}>
    {title && (
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <p className={T.sectionTitle}>{title}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

/* ─── SVG Radar Chart ─────────────────────────────────────── */
const RadarChart = ({ axes }) => {
  const SIZE = 200;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 75;
  const LEVELS = 4;
  const n = axes.length;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (r, i) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  });

  // Grid polygons
  const gridPolygons = Array.from({ length: LEVELS }, (_, l) => {
    const r = (R * (l + 1)) / LEVELS;
    return Array.from({ length: n }, (_, i) => {
      const p = point(r, i);
      return `${p.x},${p.y}`;
    }).join(" ");
  });

  // Spoke lines
  const spokes = Array.from({ length: n }, (_, i) => {
    const outer = point(R, i);
    return `M${CX},${CY} L${outer.x},${outer.y}`;
  });

  // Data polygon
  const dataPath = axes
    .map((ax, i) => {
      const r = R * (ax.value / 100);
      const p = point(r, i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridPolygons.map((pts, l) => (
        <polygon
          key={l}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      ))}
      {/* Spokes */}
      {spokes.map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      ))}
      {/* Data */}
      <polygon
        points={dataPath}
        fill="rgba(196,22,28,0.18)"
        stroke="#C4161C"
        strokeWidth={1.5}
      />
      {/* Dots */}
      {axes.map((ax, i) => {
        const r = R * (ax.value / 100);
        const p = point(r, i);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#C4161C" />;
      })}
      {/* Labels */}
      {axes.map((ax, i) => {
        const p = point(R + 18, i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="rgba(255,255,255,0.45)"
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
};

/* ═══ Tab Bar ═══════════════════════════════════════════════ */
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "scout", label: "Scout Report" },
  { id: "career", label: "Career" },
  { id: "competitions", label: "Competitions" },
  { id: "analytics", label: "Analytics" },
];

const TabBar = ({ active, setActive }) => (
  <nav className="flex overflow-x-auto gap-0 scrollbar-none">
    {TABS.map((t) => (
      <button
        key={t.id}
        onClick={() => setActive(t.id)}
        className={`
          px-5 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px
          transition-colors duration-150 focus:outline-none
          ${
            active === t.id
              ? "border-[#C4161C] text-white"
              : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
          }
        `}
      >
        {t.label}
      </button>
    ))}
  </nav>
);

/* ═══ Overview Tab  ─ 70/30 Layout ═════════════════════════ */
const OverviewTab = ({ player, onDownload, onWatchlist, watchlisted }) => {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const report = player.scoutReport;
  const gStyle = report?.grade ? gradeStyle(report.grade) : gradeStyle("N/A");
  const score = report?.totalScore ?? 0;
  const recentComps = [...(player.competitions || [])].slice(-5).reverse();

  const skillBars = report
    ? [
        { label: "Age Prospect", value: report.ageScore ?? 0, max: 5 },
        { label: "Physical Profile", value: report.physicalScore ?? 0, max: 5 },
        {
          label: "Competition Level",
          value: (report.competitionScore ?? 0) / 10,
          max: 5,
        },
        { label: "Speed", value: report.speedScore ?? 0, max: 2 },
        { label: "Mentality", value: report.mentalityAssessment ?? 0, max: 2 },
        {
          label: "Club Reputation",
          value: report.clubReputationBonus ?? 0,
          max: 3,
        },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
      {/* ── LEFT COLUMN ── */}
      <div className="space-y-5 min-w-0">
        {/* 1. Rating Overview */}
        {report && (
          <div className={card + " p-5"}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className={T.labelText}>Overall Scout Rating</p>
                <div className="flex items-end gap-2 mt-2">
                  <span
                    className={`text-[56px] leading-none font-black tabular-nums ${gStyle.color}`}
                  >
                    {score}
                  </span>
                  <span className="text-gray-600 text-xl mb-2">/100</span>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold border ${gStyle.bg} ${gStyle.color} ${gStyle.border}`}
              >
                Grade {report.grade} — {gStyle.label}
              </span>
            </div>
            {/* Master progress bar — 8px height (thicker) */}
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, backgroundColor: gStyle.bar }}
              />
            </div>
            <p className="text-[11px] text-gray-600 text-right">
              {score}% of maximum score
            </p>
            {/* Skill breakdown bars */}
            {skillBars.length > 0 && (
              <div className="mt-5 pt-5 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {skillBars.map((s) => (
                  <RatingBar
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    max={s.max}
                    color={gStyle.bar}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Competition Performance Table */}
        {recentComps.length > 0 && (
          <div className={card + " overflow-hidden"}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <p className={T.sectionTitle}>Competition Performance</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Last {recentComps.length} competitions
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className={tH}>Competition</th>
                    <th className={tH + " hidden sm:table-cell"}>Type</th>
                    <th className={tH + " text-center"}>Year</th>
                    <th className={tH + " text-right"}>Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentComps.map((c, i) => (
                    <tr
                      key={i}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className={tDW}>{c.name}</td>
                      <td className={tD + " hidden sm:table-cell"}>
                        {c.type || "—"}
                      </td>
                      <td className={tD + " text-center"}>{c.year || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        {c.result === "Champion" ? (
                          <Badge label="Champion" variant="gold" />
                        ) : c.result === "Runner-up" ? (
                          <Badge label="Runner-up" variant="yellow" />
                        ) : (
                          <Badge
                            label={c.result || "Participant"}
                            variant="gray"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Scouting Summary */}
        {player.scouting_notes && (
          <div className={card + " overflow-hidden"}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <p className={T.sectionTitle}>Scouting Summary</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scout analysis & assessment notes
                </p>
              </div>
              <button
                onClick={() => setNotesExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
              >
                {notesExpanded ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
                {notesExpanded ? "Collapse" : "Expand"}
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="border-l-2 border-[#C4161C]/40 pl-4 bg-[#C4161C]/[0.04] py-3 rounded-r-lg">
                <p
                  className={`text-sm text-gray-300 leading-relaxed ${!notesExpanded ? "line-clamp-3" : ""}`}
                >
                  {player.scouting_notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Performance Indicators */}
        {report && (
          <div className={card + " overflow-hidden"}>
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className={T.sectionTitle}>Performance Indicators</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Metric-level score breakdown
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className={tH}>Metric</th>
                    <th className={tH + " hidden md:table-cell"}>Progress</th>
                    <th className={tH + " text-right"}>Score</th>
                    <th className={tH + " text-right"}>Max</th>
                    <th className={tH + " text-right"}>%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    {
                      label: "Age Prospect",
                      score: report.ageScore,
                      max: 5,
                      missing: !player.age,
                    },
                    {
                      label: "Physical Profile",
                      score: report.physicalScore,
                      max: 5,
                      missing: !player.height || !player.weight,
                    },
                    {
                      label: "Transfer Market",
                      score: report.transferMarketScore,
                      max: 7.5,
                      missing: !player.transferMarketLink,
                    },
                    {
                      label: "Competition Level",
                      score: report.competitionScore,
                      max: 50,
                      missing: !player.competitions?.length,
                    },
                    {
                      label: "Championship Bonus",
                      score: report.championshipBonus,
                      max: "—",
                      missing: !player.competitions?.length,
                    },
                    {
                      label: "State League",
                      score: report.stateLeagueBonus,
                      max: 2,
                      missing: !player.stateLeague,
                    },
                    {
                      label: "Club Reputation",
                      score: report.clubReputationBonus,
                      max: 3,
                      missing: !player.clubsPlayed?.length,
                    },
                    {
                      label: "Speed (30m Sprint)",
                      score: report.speedScore,
                      max: 2,
                      missing: !player.sprint30m,
                    },
                    {
                      label: "Mentality",
                      score: report.mentalityAssessment,
                      max: 2,
                      missing: player.mentalityScore == null,
                    },
                  ].map((b, i) => {
                    const pct =
                      b.max !== "—" && !b.missing
                        ? Math.min(Math.round((b.score / b.max) * 100), 100)
                        : null;
                    const barColor =
                      pct == null
                        ? "#374151"
                        : pct >= 70
                          ? "#34D399"
                          : pct >= 40
                            ? "#FBBF24"
                            : "#F87171";
                    return (
                      <tr
                        key={i}
                        className={`hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? "bg-white/[0.015]" : ""}`}
                      >
                        <td className={tDW}>{b.label}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {b.missing ? (
                            <span className="text-xs text-gray-700 italic">
                              Not provided
                            </span>
                          ) : (
                            <div className="w-28 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: barColor,
                                }}
                              />
                            </div>
                          )}
                        </td>
                        <td className={tDW + " text-right"}>
                          {b.missing ? "—" : b.score}
                        </td>
                        <td className={tD + " text-right text-gray-600"}>
                          {b.max}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold">
                          {pct != null ? (
                            <span style={{ color: barColor }}>{pct}%</span>
                          ) : (
                            <span className="text-gray-700">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10 bg-gray-800/30">
                    <td
                      colSpan={2}
                      className="px-4 py-3.5 text-sm font-semibold text-white"
                    >
                      Total
                    </td>
                    <td colSpan={3} className="px-4 py-3.5 text-right">
                      <span
                        className={`text-base font-black tabular-nums ${gStyle.color}`}
                      >
                        {report.totalScore}
                      </span>
                      <span className="text-gray-600 text-sm font-normal">
                        {" "}
                        /100
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="space-y-4">
        {/* Personal Details */}
        <div className={card + " overflow-hidden"}>
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className={T.sectionTitle}>Personal Details</p>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            <StatItem
              label="Age"
              value={player.age ? `${player.age} years` : null}
            />
            <StatItem label="Nationality" value={player.nationality} />
            <StatItem label="City" value={player.city} />
            <StatItem label="State League" value={player.stateLeague || null} />
            <StatItem label="Preferred Foot" value={player.preferredFoot} />
          </div>
        </div>

        {/* Physical Attributes */}
        <div className={card + " overflow-hidden"}>
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <p className={T.sectionTitle}>Physical Attributes</p>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            <StatItem
              label="Height"
              value={player.height ? `${player.height} cm` : null}
            />
            <StatItem
              label="Weight"
              value={player.weight ? `${player.weight} kg` : null}
            />
            <StatItem
              label="Sprint 30m"
              value={player.sprint30m ? `${player.sprint30m}s` : null}
            />
            <StatItem
              label="Mentality Score"
              value={
                player.mentalityScore != null
                  ? String(player.mentalityScore)
                  : null
              }
            />
          </div>
        </div>

        {/* Contact Information */}
        {(player.email || player.mobileNumber) && (
          <div className={card + " overflow-hidden"}>
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className={T.sectionTitle}>Contact Information</p>
            </div>
            <div className="p-4 space-y-2">
              {player.email && (
                <a
                  href={`mailto:${player.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0B0B0D] flex items-center justify-center shrink-0">
                    <EnvelopeIcon className="w-4 h-4 text-gray-500 group-hover:text-[#C4161C] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className={T.labelText}>Email</p>
                    <p className="text-xs text-gray-300 group-hover:text-white transition-colors truncate mt-0.5">
                      {player.email}
                    </p>
                  </div>
                </a>
              )}
              {player.mobileNumber && (
                <a
                  href={`tel:${player.mobileNumber}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0B0B0D] flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-4 h-4 text-gray-500 group-hover:text-[#C4161C] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className={T.labelText}>Phone</p>
                    <p className="text-xs text-gray-300 group-hover:text-white transition-colors mt-0.5">
                      {player.mobileNumber}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className={card + " p-4 space-y-2"}>
          <p className={T.labelText + " mb-3"}>Quick Actions</p>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#C4161C] hover:bg-[#A81319] text-white text-xs font-bold transition-colors">
            <ScaleIcon className="w-4 h-4" />
            Compare Player
          </button>
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 border border-white/[0.08] text-gray-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download Report
          </button>
          {player.email && (
            <a
              href={`mailto:${player.email}?subject=Contact Request — ${player.name}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 border border-white/[0.08] text-gray-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Request Contact
            </a>
          )}
          <button
            onClick={onWatchlist}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-semibold transition-colors ${
              watchlisted
                ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15"
                : "bg-gray-800 hover:bg-gray-700 border-white/[0.08] text-gray-400 hover:text-white"
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
            {watchlisted ? "Watchlisted" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══ Scout Report Tab ══════════════════════════════════════ */
const ScoutReportTab = ({ player }) => {
  const report = player.scoutReport;
  if (!report) {
    return (
      <div className={card + " p-16 text-center"}>
        <ExclamationCircleIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500">
          No scout report available for this player.
        </p>
      </div>
    );
  }

  const gStyle = gradeStyle(report.grade);
  const breakdown = [
    {
      label: "Age Prospect",
      score: report.ageScore,
      max: 5,
      missing: !player.age,
    },
    {
      label: "Physical Profile",
      score: report.physicalScore,
      max: 5,
      missing: !player.height || !player.weight,
    },
    {
      label: "Transfer Market",
      score: report.transferMarketScore,
      max: 7.5,
      missing: !player.transferMarketLink,
    },
    {
      label: "Competition Level",
      score: report.competitionScore,
      max: 50,
      missing: !player.competitions?.length,
    },
    {
      label: "Championship Bonus",
      score: report.championshipBonus,
      max: "—",
      missing: !player.competitions?.length,
    },
    {
      label: "State League",
      score: report.stateLeagueBonus,
      max: 2,
      missing: !player.stateLeague,
    },
    {
      label: "Club Reputation",
      score: report.clubReputationBonus,
      max: 3,
      missing: !player.clubsPlayed?.length,
    },
    {
      label: "Speed (Sprint 30m)",
      score: report.speedScore,
      max: 2,
      missing: !player.sprint30m,
    },
    {
      label: "Mentality",
      score: report.mentalityAssessment,
      max: 2,
      missing: player.mentalityScore == null,
    },
  ];

  const provided = breakdown.filter((b) => !b.missing).length;
  const completeness = Math.round((provided / breakdown.length) * 100);

  return (
    <div className="space-y-5">
      {/* Summary hero */}
      <div className={card + " p-6"}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <p className={T.labelText}>Overall Score</p>
            <div className="flex items-end gap-2 mt-2">
              <span
                className={`text-[56px] leading-none font-black tabular-nums ${gStyle.color}`}
              >
                {report.totalScore}
              </span>
              <span className="text-gray-600 text-xl mb-2">/100</span>
            </div>
          </div>
          <div>
            <p className={T.labelText}>Grade</p>
            <div className="mt-2">
              <span
                className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold border ${gStyle.bg} ${gStyle.color} ${gStyle.border}`}
              >
                Grade {report.grade} — {gStyle.label}
              </span>
            </div>
          </div>
          <div>
            <p className={T.labelText}>Profile Completeness</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-2xl font-black tabular-nums text-white">
                {completeness}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-blue-500/80"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${report.totalScore}%`,
              backgroundColor: gStyle.bar,
            }}
          />
        </div>
      </div>

      {/* Breakdown table */}
      <div className={card + " overflow-hidden"}>
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className={T.sectionTitle}>Score Breakdown</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Individual metric scores contributing to total
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className={tH}>Metric</th>
                <th className={tH + " hidden sm:table-cell"}>Progress</th>
                <th className={tH + " text-right"}>Score</th>
                <th className={tH + " text-right"}>Max</th>
                <th className={tH + " text-right"}>%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {breakdown.map((b, i) => {
                const pct =
                  b.max !== "—" && !b.missing
                    ? Math.min(Math.round((b.score / b.max) * 100), 100)
                    : null;
                const barColor =
                  pct == null
                    ? "#374151"
                    : pct >= 70
                      ? "#34D399"
                      : pct >= 40
                        ? "#FBBF24"
                        : "#F87171";
                return (
                  <tr
                    key={i}
                    className={`hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? "bg-white/[0.015]" : ""}`}
                  >
                    <td className={tDW}>{b.label}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {b.missing ? (
                        <span className="text-xs text-gray-700 italic">
                          Not provided
                        </span>
                      ) : (
                        <div className="w-28 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className={tDW + " text-right"}>
                      {b.missing ? "—" : b.score}
                    </td>
                    <td className={tD + " text-right text-gray-600"}>
                      {b.max}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      {pct != null ? (
                        <span style={{ color: barColor }}>{pct}%</span>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-gray-800/30">
                <td
                  colSpan={2}
                  className="px-4 py-3.5 text-sm font-semibold text-white"
                >
                  Total
                </td>
                <td colSpan={3} className="px-4 py-3.5 text-right">
                  <span
                    className={`text-base font-black tabular-nums ${gStyle.color}`}
                  >
                    {report.totalScore}
                  </span>
                  <span className="text-gray-600 text-sm font-normal">
                    {" "}
                    /100
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ═══ Career Tab ════════════════════════════════════════════ */
const CareerTab = ({ player }) => {
  const clubs = [...(player.clubsPlayed || [])].reverse();
  const hasClubs = clubs.length > 0;

  return (
    <div className="space-y-5">
      {/* Club History */}
      <div className={card + " overflow-hidden"}>
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h2 className={T.sectionTitle}>Club History</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Career timeline — most recent first
          </p>
        </div>
        {!hasClubs ? (
          <p className="text-gray-600 text-sm text-center py-10">
            No club history recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className={tH}>#</th>
                  <th className={tH}>Club</th>
                  <th className={tH + " text-right"}>Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {clubs.map((club, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm text-gray-600 w-10 tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                          <TrophyIcon className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-100">
                          {club.clubName}
                        </span>
                        {i === 0 && <Badge label="Current" variant="green" />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-400 text-right tabular-nums">
                      {club.duration || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Competitions Summary */}
      {player.competitions?.length > 0 && (
        <div className={card + " overflow-hidden"}>
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h2 className={T.sectionTitle}>Competition History</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {player.competitions.length} competition
              {player.competitions.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className={tH}>Competition</th>
                  <th className={tH + " hidden sm:table-cell"}>Type</th>
                  <th className={tH + " text-center"}>Year</th>
                  <th className={tH + " text-right"}>Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {player.competitions.map((c, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.025] transition-colors"
                  >
                    <td className={tDW}>{c.name}</td>
                    <td className={tD + " hidden sm:table-cell text-gray-500"}>
                      {c.type}
                    </td>
                    <td
                      className={tD + " text-center text-gray-500 tabular-nums"}
                    >
                      {c.year}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.result === "Champion" ? (
                        <Badge label="Champion" variant="gold" />
                      ) : c.result === "Runner-up" ? (
                        <Badge label="Runner-up" variant="yellow" />
                      ) : (
                        <Badge
                          label={c.result || "Participant"}
                          variant="gray"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Competitions Tab (paginated) ────────────────────────── */
const PAGE_SIZE = 10;
const CompetitionsTab = ({ player }) => {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("all");

  const all = player.competitions || [];
  const types = ["all", ...new Set(all.map((c) => c.type).filter(Boolean))];
  const filtered =
    filter === "all" ? all : all.filter((c) => c.type === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const current = filtered.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className={card + " px-4 py-3 flex flex-wrap items-center gap-2"}>
        <span className={T.labelText + " mr-1"}>Type:</span>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => {
              setFilter(t);
              setPage(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === t
                ? "bg-[#C4161C]/10 text-red-400 border border-[#C4161C]/20"
                : "text-gray-400 hover:bg-white/[0.04]"
            }`}
          >
            {t === "all"
              ? `All (${all.length})`
              : `${t} (${all.filter((c) => c.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={card + " overflow-hidden"}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className={T.sectionTitle}>Competitions</h2>
          <span className="text-xs text-gray-500">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        {current.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-10">
            No competitions found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className={tH}>#</th>
                  <th className={tH}>Competition</th>
                  <th className={tH + " hidden sm:table-cell"}>Type</th>
                  <th className={tH + " text-center"}>Year</th>
                  <th className={tH + " text-right"}>Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {current.map((c, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 w-9 tabular-nums">
                      {page * PAGE_SIZE + i + 1}
                    </td>
                    <td className={tDW}>{c.name}</td>
                    <td className={tD + " hidden sm:table-cell text-gray-500"}>
                      {c.type}
                    </td>
                    <td
                      className={tD + " text-center text-gray-500 tabular-nums"}
                    >
                      {c.year}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {c.result === "Champion" ? (
                        <Badge label="Champion" variant="gold" />
                      ) : c.result === "Runner-up" ? (
                        <Badge label="Runner-up" variant="yellow" />
                      ) : (
                        <Badge
                          label={c.result || "Participant"}
                          variant="gray"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.07]">
            <p className="text-xs text-gray-500">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Analytics Tab ───────────────────────────────────────── */
const AnalyticsTab = ({ player }) => {
  const report = player.scoutReport;

  // Build radar axes from available subscores (normalize 0-100)
  const radarAxes = report
    ? [
        {
          label: "Age",
          value: Math.min(((report.ageScore ?? 0) / 5) * 100, 100),
        },
        {
          label: "Physical",
          value: Math.min(((report.physicalScore ?? 0) / 5) * 100, 100),
        },
        {
          label: "Speed",
          value: Math.min(((report.speedScore ?? 0) / 2) * 100, 100),
        },
        {
          label: "Mentality",
          value: Math.min(((report.mentalityAssessment ?? 0) / 2) * 100, 100),
        },
        {
          label: "Club",
          value: Math.min(((report.clubReputationBonus ?? 0) / 3) * 100, 100),
        },
        {
          label: "Competition",
          value: Math.min(((report.competitionScore ?? 0) / 50) * 100, 100),
        },
      ]
    : [];

  // Strengths & weaknesses
  const attributes = report
    ? [
        {
          label: "Age Prospect",
          present: !!player.age,
          score: report.ageScore,
          max: 5,
        },
        {
          label: "Physical Build",
          present: !!(player.height && player.weight),
          score: report.physicalScore,
          max: 5,
        },
        {
          label: "Speed",
          present: !!player.sprint30m,
          score: report.speedScore,
          max: 2,
        },
        {
          label: "Mentality",
          present: player.mentalityScore != null,
          score: report.mentalityAssessment,
          max: 2,
        },
        {
          label: "Club Reputation",
          present: !!player.clubsPlayed?.length,
          score: report.clubReputationBonus,
          max: 3,
        },
        {
          label: "Competition Level",
          present: !!player.competitions?.length,
          score: report.competitionScore,
          max: 50,
        },
        {
          label: "Transfer Market",
          present: !!player.transferMarketLink,
          score: report.transferMarketScore,
          max: 7.5,
        },
        {
          label: "State League",
          present: !!player.stateLeague,
          score: report.stateLeagueBonus,
          max: 2,
        },
      ]
    : [];

  const strengths = attributes.filter(
    (a) => a.present && a.score / a.max >= 0.6,
  );
  const weaknesses = attributes.filter(
    (a) => !a.present || (a.present && a.score / a.max < 0.3),
  );

  if (!report) {
    return (
      <div className={card + " p-12 text-center"}>
        <ChartBarIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Radar chart + score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={card + " p-5"}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Skill Radar
          </h2>
          <RadarChart axes={radarAxes} />
        </div>

        {/* Performance bar breakdown */}
        <div className={card + " p-5"}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Attribute Breakdown
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Age Prospect",
                val: Math.min(((report.ageScore ?? 0) / 5) * 100, 100),
              },
              {
                label: "Physical",
                val: Math.min(((report.physicalScore ?? 0) / 5) * 100, 100),
              },
              {
                label: "Competition Level",
                val: Math.min(((report.competitionScore ?? 0) / 50) * 100, 100),
              },
              {
                label: "Speed",
                val: Math.min(((report.speedScore ?? 0) / 2) * 100, 100),
              },
              {
                label: "Mentality",
                val: Math.min(
                  ((report.mentalityAssessment ?? 0) / 2) * 100,
                  100,
                ),
              },
              {
                label: "Club Reputation",
                val: Math.min(
                  ((report.clubReputationBonus ?? 0) / 3) * 100,
                  100,
                ),
              },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(val)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      backgroundColor:
                        val >= 70
                          ? "#34D399"
                          : val >= 40
                            ? "#FBBF24"
                            : "#F87171",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className={card + " p-5"}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Strengths
          </h2>
          <div className="space-y-2">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircleIcon className="w-4 h-4 text-green-400 shrink-0" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm text-gray-300">{s.label}</span>
                  <span className="text-xs font-semibold text-green-400">
                    {Math.round((s.score / s.max) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses / Gaps */}
      {weaknesses.length > 0 && (
        <div className={card + " p-5"}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Data Gaps & Weak Areas
          </h2>
          <div className="space-y-2">
            {weaknesses.map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <ExclamationCircleIcon className="w-4 h-4 text-orange-400 shrink-0" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm text-gray-400">{w.label}</span>
                  {!w.present ? (
                    <Badge label="Missing data" variant="gray" />
                  ) : (
                    <span className="text-xs font-semibold text-orange-400">
                      {Math.round((w.score / w.max) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison readiness */}
      <div className={card + " p-5"}>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Comparison Readiness
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Profile Complete",
              ready: attributes.filter((a) => a.present).length >= 5,
            },
            { label: "Scout Score", ready: (report.totalScore ?? 0) > 0 },
            { label: "Club History", ready: !!player.clubsPlayed?.length },
            { label: "Competition Data", ready: !!player.competitions?.length },
          ].map(({ label, ready }) => (
            <div
              key={label}
              className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex flex-col items-center gap-2"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${ready ? "bg-green-500/10" : "bg-gray-700/50"}`}
              >
                {ready ? (
                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ExclamationCircleIcon className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <p className="text-[10px] text-center text-gray-500 leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Loading Skeleton ────────────────────────────────────── */
const DetailSkeleton = () => (
  <div className="animate-pulse space-y-5 p-6">
    {/* Header hero skeleton */}
    <div className="flex gap-5 items-start">
      <div className="w-24 h-24 rounded-xl bg-white/[0.05] shrink-0" />
      <div className="hidden sm:flex w-20 h-20 rounded-xl bg-white/[0.03] shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-7 bg-white/[0.05] rounded-lg w-48" />
        <div className="h-4 bg-white/[0.04] rounded-lg w-64" />
        <div className="h-3 bg-white/[0.03] rounded-full w-40 mt-2" />
      </div>
    </div>
    {/* Tabs skeleton */}
    <div className="flex gap-5 border-b border-white/[0.06] pb-1">
      {[80, 60, 64, 90, 68].map((w, i) => (
        <div
          key={i}
          className="h-4 bg-white/[0.04] rounded"
          style={{ width: w }}
        />
      ))}
    </div>
    {/* 70/30 grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5">
      <div className="space-y-4">
        <div className="h-36 bg-white/[0.04] rounded-xl" />
        <div className="h-48 bg-white/[0.04] rounded-xl" />
        <div className="h-28 bg-white/[0.04] rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-44 bg-white/[0.04] rounded-xl" />
        <div className="h-32 bg-white/[0.04] rounded-xl" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const PlayerDetailPage = ({ player, onClose, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [watchlisted, setWatchlisted] = useState(false);

  // Reset tab when player changes
  useEffect(() => {
    setActiveTab("overview");
    setWatchlisted(false);
  }, [player?._id]);

  // Escape to go back
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!player && !isLoading) return null;

  const currentClub =
    player?.clubsPlayed?.[player.clubsPlayed.length - 1]?.clubName;
  const pStyle = player ? posStyle(player.playingPosition) : {};
  const gStyle = player?.scoutReport?.grade
    ? gradeStyle(player.scoutReport.grade)
    : null;

  const handleDownloadReport = () => {
    if (!player) return;
    const txt = [
      `PLAYER REPORT — Pro Talent Connect`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `---`,
      `Name: ${player.name}`,
      `Position: ${player.playingPosition}`,
      `Age: ${player.age || "—"}`,
      `Nationality: ${player.nationality || "—"}`,
      `City: ${player.city || "—"}`,
      `Club: ${currentClub || "—"}`,
      `Height: ${player.height ? player.height + " cm" : "—"}`,
      `Weight: ${player.weight ? player.weight + " kg" : "—"}`,
      `Preferred Foot: ${player.preferredFoot || "—"}`,
      ``,
      `Scout Score: ${player.scoutReport?.totalScore ?? "—"}/100 (Grade ${player.scoutReport?.grade ?? "—"})`,
      ``,
      `Clubs: ${player.clubsPlayed?.map((c) => c.clubName).join(", ") || "—"}`,
      `Competitions: ${player.competitions?.map((c) => `${c.name} (${c.result || "Participant"})`).join(", ") || "—"}`,
      ``,
      `Notes: ${player.scouting_notes || "—"}`,
    ].join("\n");

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${player.name?.replace(/\s+/g, "_")}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      {isLoading ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <DetailSkeleton />
        </div>
      ) : (
        <>
          {/* ── Sticky Header ── */}
          <div className="sticky top-0 z-20">
            {/* Top bar */}
            <div className="border-b border-white/[0.07] bg-[#0B0B0D]/95 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to players
                </button>
                <div className="flex items-center gap-2">
                  {player.transferMarketLink && (
                    <a
                      href={player.transferMarketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                      Transfer Market
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Player identity */}
            <div className="bg-[#0E0E12] border-b border-white/[0.07]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-start gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={player.profileImage || DEFAULT_IMAGE}
                    alt={player.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />
                  {gStyle && (
                    <div
                      className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold ${gStyle.bg} ${gStyle.color} ${gStyle.border}`}
                    >
                      {player.scoutReport.grade}
                    </div>
                  )}
                </div>

                {/* Score box — visible sm+ */}
                {player.scoutReport?.totalScore > 0 && gStyle && (
                  <div
                    className={`hidden sm:flex w-20 h-20 rounded-xl border flex-col items-center justify-center shrink-0 ${gStyle.bg} ${gStyle.border}`}
                  >
                    <span
                      className={`text-3xl font-black tabular-nums leading-none ${gStyle.color}`}
                    >
                      {player.scoutReport.totalScore}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">
                      /100
                    </span>
                  </div>
                )}

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                      {player.name}
                    </h1>
                    {player.playingPosition && (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                      >
                        {player.playingPosition}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500 mb-3">
                    {currentClub && (
                      <span className="font-semibold text-gray-200">
                        {currentClub}
                      </span>
                    )}
                    {player.age && <span>{player.age} years</span>}
                    {player.nationality && <span>{player.nationality}</span>}
                    {player.city && <span>{player.city}</span>}
                    {player.preferredFoot && (
                      <span>{player.preferredFoot} foot</span>
                    )}
                  </div>

                  {player.scoutReport?.totalScore > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-3 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${player.scoutReport.totalScore}%`,
                            backgroundColor: gStyle?.bar || "#9CA3AF",
                          }}
                        />
                      </div>
                      <span
                        className={`text-sm font-bold tabular-nums ${gStyle?.color}`}
                      >
                        {player.scoutReport.totalScore}/100
                      </span>
                      <span className="text-xs text-gray-500">
                        {gStyle?.label}
                      </span>
                    </div>
                  )}

                  {/* Primary action buttons */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                    <button
                      onClick={handleDownloadReport}
                      className="h-8 px-4 rounded-lg bg-[#C4161C] hover:bg-[#a81218] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                    >
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      Download Report
                    </button>
                    <button
                      onClick={() => setWatchlisted((v) => !v)}
                      className={`h-8 px-4 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        watchlisted
                          ? "bg-[#C4161C]/10 border-[#C4161C]/30 text-red-400 hover:bg-[#C4161C]/20"
                          : "bg-white/[0.04] border-white/[0.07] text-gray-300 hover:bg-white/[0.08]"
                      }`}
                    >
                      <BookmarkIcon className="w-3.5 h-3.5" />
                      {watchlisted ? "Watchlisted" : "Add to Watchlist"}
                    </button>
                    {player.email && (
                      <a
                        href={`mailto:${player.email}`}
                        className="h-8 px-4 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs font-semibold text-gray-300 hover:bg-white/[0.08] transition-colors flex items-center gap-1.5"
                      >
                        <EnvelopeIcon className="w-3.5 h-3.5" />
                        Request Contact
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="bg-[#0B0B0D] border-b border-white/[0.07]">
              <div className="max-w-6xl mx-auto">
                <TabBar active={activeTab} setActive={setActiveTab} />
              </div>
            </div>
          </div>

          {/* ── Page Content ── */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
            {activeTab === "overview" && <OverviewTab player={player} />}
            {activeTab === "scout" && <ScoutReportTab player={player} />}
            {activeTab === "career" && <CareerTab player={player} />}
            {activeTab === "competitions" && (
              <CompetitionsTab player={player} />
            )}
            {activeTab === "analytics" && <AnalyticsTab player={player} />}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailPage;

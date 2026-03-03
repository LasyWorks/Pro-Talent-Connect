import { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  ScaleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { T, card, tH, tD, tDW, gradeStyle } from "./tokens";
import { Badge, StatItem, RatingBar } from "./primitives";

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
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, backgroundColor: gStyle.bar }}
              />
            </div>
            <p className="text-[11px] text-gray-600 text-right">
              {score}% of maximum score
            </p>
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
            {/* Mobile: competition card list */}
            <div className="sm:hidden divide-y divide-white/[0.04]">
              {recentComps.map((c, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-100 truncate">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {[c.type, c.year].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  {c.result === "Champion" ? (
                    <Badge label="Champion" variant="gold" />
                  ) : c.result === "Runner-up" ? (
                    <Badge label="Runner-up" variant="yellow" />
                  ) : (
                    <Badge label={c.result || "Participant"} variant="gray" />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: competition table */}
            <div className="hidden sm:block overflow-x-auto">
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
            {/* Mobile: metric stat cards grid */}
            <div className="sm:hidden p-4 grid grid-cols-2 gap-3">
              {[
                { label: "Age Prospect",  score: report.ageScore,            max: 5,    missing: !player.age },
                { label: "Physical",      score: report.physicalScore,        max: 5,    missing: !player.height || !player.weight },
                { label: "Transfer Mkt",  score: report.transferMarketScore,  max: 7.5,  missing: !player.transferMarketLink },
                { label: "Competition",   score: report.competitionScore,     max: 50,   missing: !player.competitions?.length },
                { label: "Championship",  score: report.championshipBonus,    max: "—",  missing: !player.competitions?.length },
                { label: "State League",  score: report.stateLeagueBonus,     max: 2,    missing: !player.stateLeague },
                { label: "Club Rep.",     score: report.clubReputationBonus,  max: 3,    missing: !player.clubsPlayed?.length },
                { label: "Speed (30m)",   score: report.speedScore,           max: 2,    missing: !player.sprint30m },
                { label: "Mentality",     score: report.mentalityAssessment,  max: 2,    missing: player.mentalityScore == null },
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
                  <div
                    key={i}
                    className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]"
                  >
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-snug">
                      {b.label}
                    </p>
                    {b.missing ? (
                      <p className="text-xs text-gray-700 mt-2 italic">—</p>
                    ) : (
                      <>
                        <div className="flex items-end justify-between mt-2 mb-1.5">
                          <span className="text-lg font-black tabular-nums text-white leading-none">
                            {b.score}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            /{b.max}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              {/* Total score chip */}
              <div
                className={`col-span-2 rounded-xl p-3 border flex items-center justify-between ${gStyle.bg} ${gStyle.border}`}
              >
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Total Score
                </span>
                <span
                  className={`text-xl font-black tabular-nums ${gStyle.color}`}
                >
                  {report.totalScore}
                  <span className="text-sm font-normal text-gray-600">
                    /100
                  </span>
                </span>
              </div>
            </div>

            {/* Desktop: metric table */}
            <div className="hidden sm:block overflow-x-auto">
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
          <div className="p-5 grid grid-cols-2 sm:grid-cols-1 gap-4">
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
          <div className="p-5 grid grid-cols-2 sm:grid-cols-1 gap-4">
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

        {/* Quick Actions — desktop only; mobile uses sticky bottom bar */}
        <div className={`${card} p-4 space-y-2 hidden sm:block`}>
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

export default OverviewTab;

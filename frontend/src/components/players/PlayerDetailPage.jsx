import { useState, useEffect, lazy, Suspense } from "react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  BookmarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { DEFAULT_IMAGE, posStyle, gradeStyle } from "./playerDetail/tokens";
import DetailSkeleton from "./playerDetail/DetailSkeleton";
import TabBar from "./playerDetail/TabBar";
import OverviewTab from "./playerDetail/OverviewTab";

// -- Lazy-load non-initial tabs (each becomes its own JS chunk) -
const ScoutReportTab  = lazy(() => import("./playerDetail/ScoutReportTab"));
const CareerTab       = lazy(() => import("./playerDetail/CareerTab"));
const CompetitionsTab = lazy(() => import("./playerDetail/CompetitionsTab"));
const AnalyticsTab    = lazy(() => import("./playerDetail/AnalyticsTab"));

// -- Skeleton shown while a lazy tab chunk downloads ------------
const TabFallback = () => (
  <div className="animate-pulse space-y-4 py-4">
    <div className="h-40 bg-white/[0.04] rounded-xl" />
    <div className="h-56 bg-white/[0.04] rounded-xl" />
    <div className="h-28 bg-white/[0.04] rounded-xl" />
  </div>
);

/* -----------------------------------------------------------
   MAIN COMPONENT
----------------------------------------------------------- */
const PlayerDetailPage = ({ player, onClose, isLoading = false }) => {
  const [activeTab, setActiveTab]     = useState("overview");
  const [watchlisted, setWatchlisted] = useState(false);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
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
      `PLAYER REPORT � Pro Talent Connect`,
      `Generated: ${new Date().toLocaleDateString()}`,
      `---`,
      `Name: ${player.name}`,
      `Position: ${player.playingPosition}`,
      `Age: ${player.age || "�"}`,
      `Nationality: ${player.nationality || "�"}`,
      `City: ${player.city || "�"}`,
      `Club: ${currentClub || "�"}`,
      `Height: ${player.height ? player.height + " cm" : "�"}`,
      `Weight: ${player.weight ? player.weight + " kg" : "�"}`,
      `Preferred Foot: ${player.preferredFoot || "�"}`,
      ``,
      `Scout Score: ${player.scoutReport?.totalScore ?? "�"}/100 (Grade ${player.scoutReport?.grade ?? "�"})`,
      ``,
      `Clubs: ${player.clubsPlayed?.map((c) => c.clubName).join(", ") || "�"}`,
      `Competitions: ${player.competitions?.map((c) => `${c.name} (${c.result || "Participant"})`).join(", ") || "�"}`,
      ``,
      `Notes: ${player.scouting_notes || "�"}`,
    ].join("\n");

    const blob = new Blob([txt], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
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
          {/* -- Sticky Header -- */}
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
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-start gap-3 sm:gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={player.profileImage || DEFAULT_IMAGE}
                    alt={player.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover border border-white/10"
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

                {/* Score box � visible sm+ */}
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
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

                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1 text-sm text-gray-500 mb-3">
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

                  {/* Primary action buttons — desktop only; mobile uses sticky bottom bar */}
                  <div className="hidden sm:flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
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
            <div key={player?._id} className="bg-[#0B0B0D] border-b border-white/[0.07]">
              <div className="max-w-6xl mx-auto">
                <TabBar active={activeTab} setActive={setActiveTab} />
              </div>
            </div>
          </div>

          {/* -- Page Content -- */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
            {/* Overview is eagerly loaded � always the first visible tab */}
            {activeTab === "overview" && (
              <OverviewTab
                player={player}
                onDownload={handleDownloadReport}
                onWatchlist={() => setWatchlisted((v) => !v)}
                watchlisted={watchlisted}
              />
            )}

            {/* Remaining tabs are lazy-loaded on first click */}
            <Suspense fallback={<TabFallback />}>
              {activeTab === "scout"        && <ScoutReportTab  player={player} />}
              {activeTab === "career"       && <CareerTab       player={player} />}
              {activeTab === "competitions" && <CompetitionsTab player={player} />}
              {activeTab === "analytics"    && <AnalyticsTab    player={player} />}
            </Suspense>
          </div>

          {/* ── Mobile sticky bottom action bar ─────────────────────── */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0D]/96 backdrop-blur-md border-t border-white/[0.09] px-4 py-3 flex gap-2">
            <button
              onClick={handleDownloadReport}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#C4161C] hover:bg-[#a81218] text-white text-xs font-bold transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => setWatchlisted((v) => !v)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                watchlisted
                  ? "bg-[#C4161C]/10 border-[#C4161C]/30 text-red-400"
                  : "bg-white/[0.05] border-white/[0.1] text-gray-300"
              }`}
            >
              <BookmarkIcon className="w-4 h-4" />
              {watchlisted ? "Saved" : "Watchlist"}
            </button>
            {player.email && (
              <a
                href={`mailto:${player.email}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-gray-300 text-xs font-bold transition-colors hover:bg-white/[0.08]"
              >
                <EnvelopeIcon className="w-4 h-4" />
                Contact
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailPage;

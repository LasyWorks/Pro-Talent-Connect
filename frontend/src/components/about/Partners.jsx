import { useState, useEffect } from "react";

export const STORAGE_KEY = "ptc_partners";

export const loadPartners = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null; // signals to use DEFAULT_PARTNERS
};

/* ─── Inline SVG social-media icons ─── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

/* ─── Default partner data ─── */
export const DEFAULT_PARTNERS = [
  {
    id: 1,
    name: "Elite Scout Network",
    type: "Scouting Agency",
    description:
      "A premier scouting agency operating across Europe and Africa, identifying top emerging football talent for elite clubs.",
    avatar: "ESN",
    avatarColor: "from-red-500/30 to-red-900/30",
    borderColor: "border-red-500/20",
    accentColor: "text-red-400",
    social: {
      instagram: { handle: "@elitescoutnetwork", url: "https://instagram.com/elitescoutnetwork" },
      twitter:   { handle: "@EliteScoutNet",     url: "https://x.com/EliteScoutNet" },
      linkedin:  { handle: "Elite Scout Network", url: "https://linkedin.com/company/elite-scout-network" },
      website:   { handle: "elitescoutnetwork.com", url: "https://elitescoutnetwork.com" },
    },
  },
  {
    id: 2,
    name: "Global Football Academy",
    type: "Football Academy",
    description:
      "World-class training academy developing youth talent into professional-grade players through structured coaching programs.",
    avatar: "GFA",
    avatarColor: "from-blue-500/30 to-blue-900/30",
    borderColor: "border-blue-500/20",
    accentColor: "text-blue-400",
    social: {
      instagram: { handle: "@globalfootballacademy", url: "https://instagram.com/globalfootballacademy" },
      youtube:   { handle: "GFA Official",            url: "https://youtube.com/@globalfootballacademy" },
      facebook:  { handle: "Global Football Academy", url: "https://facebook.com/globalfootballacademy" },
      website:   { handle: "gfa-official.com",        url: "https://gfa-official.com" },
    },
  },
  {
    id: 3,
    name: "ProSports Management",
    type: "Sports Agency",
    description:
      "Full-service sports management firm handling player contracts, brand deals, and career development for professional athletes.",
    avatar: "PSM",
    avatarColor: "from-purple-500/30 to-purple-900/30",
    borderColor: "border-purple-500/20",
    accentColor: "text-purple-400",
    social: {
      instagram: { handle: "@prosportsmanagement", url: "https://instagram.com/prosportsmanagement" },
      twitter:   { handle: "@ProSportsMgmt",      url: "https://x.com/ProSportsMgmt" },
      linkedin:  { handle: "ProSports Management", url: "https://linkedin.com/company/prosports-management" },
      website:   { handle: "prosportsmgmt.com",    url: "https://prosportsmgmt.com" },
    },
  },
  {
    id: 4,
    name: "AfriFootball Hub",
    type: "Football Network",
    description:
      "Pan-African football network connecting domestic leagues, clubs and players to international opportunities across the continent.",
    avatar: "AFH",
    avatarColor: "from-green-500/30 to-green-900/30",
    borderColor: "border-green-500/20",
    accentColor: "text-green-400",
    social: {
      instagram: { handle: "@afrifootballhub", url: "https://instagram.com/afrifootballhub" },
      twitter:   { handle: "@AfriFootballHub", url: "https://x.com/AfriFootballHub" },
      youtube:   { handle: "AfriFootball Hub", url: "https://youtube.com/@afrifootballhub" },
      facebook:  { handle: "AfriFootball Hub", url: "https://facebook.com/afrifootballhub" },
    },
  },
  {
    id: 5,
    name: "TalentBridge Sports",
    type: "Talent Platform",
    description:
      "Digital platform specialising in bridging grassroots talent to professional clubs via data-driven player assessment tools.",
    avatar: "TBS",
    avatarColor: "from-orange-500/30 to-orange-900/30",
    borderColor: "border-orange-500/20",
    accentColor: "text-orange-400",
    social: {
      instagram: { handle: "@talentbridgesports", url: "https://instagram.com/talentbridgesports" },
      linkedin:  { handle: "TalentBridge Sports", url: "https://linkedin.com/company/talentbridge-sports" },
      twitter:   { handle: "@TalentBridgeSP",     url: "https://x.com/TalentBridgeSP" },
      website:   { handle: "talentbridgesports.com", url: "https://talentbridgesports.com" },
    },
  },
  {
    id: 6,
    name: "ClubConnect International",
    type: "Club Network",
    description:
      "International club network facilitating player transfers, trial opportunities, and partnership agreements between clubs across 30+ countries.",
    avatar: "CCI",
    avatarColor: "from-cyan-500/30 to-cyan-900/30",
    borderColor: "border-cyan-500/20",
    accentColor: "text-cyan-400",
    social: {
      instagram: { handle: "@clubconnectintl",       url: "https://instagram.com/clubconnectintl" },
      twitter:   { handle: "@ClubConnectInt",         url: "https://x.com/ClubConnectInt" },
      linkedin:  { handle: "ClubConnect International", url: "https://linkedin.com/company/clubconnect-international" },
      website:   { handle: "clubconnectintl.com",     url: "https://clubconnectintl.com" },
    },
  },
];

/* ─── Social button config ─── */
export const SOCIAL_CONFIG = {
  instagram: { Icon: InstagramIcon, label: "Instagram", hoverClass: "hover:bg-pink-500/20 hover:border-pink-500/40 hover:text-pink-400" },
  twitter:   { Icon: TwitterXIcon,  label: "X / Twitter", hoverClass: "hover:bg-white/15 hover:border-white/30 hover:text-white" },
  linkedin:  { Icon: LinkedInIcon,  label: "LinkedIn", hoverClass: "hover:bg-blue-500/20 hover:border-blue-500/40 hover:text-blue-400" },
  facebook:  { Icon: FacebookIcon,  label: "Facebook", hoverClass: "hover:bg-blue-600/20 hover:border-blue-600/40 hover:text-blue-300" },
  youtube:   { Icon: YoutubeIcon,   label: "YouTube", hoverClass: "hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400" },
  website:   { Icon: GlobeIcon,     label: "Website", hoverClass: "hover:bg-white/10 hover:border-white/20 hover:text-white" },
};

/* ─── Single partner card ─── */
const PartnerCard = ({ partner }) => (
  <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    {/* Liquid glass shine */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    {/* Header: avatar + name + type */}
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${partner.avatarColor} border ${partner.borderColor} flex items-center justify-center shrink-0`}>
        <span className={`text-sm font-bold tracking-wide ${partner.accentColor}`}>{partner.avatar}</span>
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-white leading-tight truncate">{partner.name}</h3>
        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${partner.accentColor}`}>
          {partner.type}
        </span>
      </div>
    </div>

    {/* Description */}
    <p className="text-sm leading-relaxed text-gray-400 grow">{partner.description}</p>

    {/* Social media buttons */}
    <div className="flex flex-wrap gap-2 pt-1 border-t border-white/8">
      {Object.entries(partner.social).map(([platform, data]) => {
        const cfg = SOCIAL_CONFIG[platform];
        if (!cfg) return null;
        const { Icon, label, hoverClass } = cfg;
        return (
          <a
            key={platform}
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${partner.name} on ${label}`}
            title={data.handle}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium transition-all duration-200 ${hoverClass} group/btn`}
          >
            <Icon />
            <span className="hidden sm:inline truncate max-w-[90px]">{data.handle}</span>
          </a>
        );
      })}
    </div>
  </div>
);

/* ─── Section ─── */
const Partners = () => {
  const [partners, setPartners] = useState(() => loadPartners() ?? DEFAULT_PARTNERS);

  useEffect(() => {
    const refresh = () => setPartners(loadPartners() ?? DEFAULT_PARTNERS);
    window.addEventListener("storage", (e) => { if (e.key === STORAGE_KEY) refresh(); });
    window.addEventListener("ptc_partners_updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ptc_partners_updated", refresh);
    };
  }, []);

  return (
  <section className="relative py-16 md:py-24 lg:py-28 px-4">
    {/* Background ambiance */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "9s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-72 h-72 bg-black/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "3s" }}
      />
    </div>

    <div className="max-w-6xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 border border-white/20 rounded-xl mb-5">
          {/* handshake icon via inline SVG so we don't depend on lucide being installed */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white/80">
            <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.78-.78a5.4 5.4 0 000-7.65z" />
          </svg>
        </div>
        <h2
          className="text-3xl md:text-4xl font-semibold mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 36px)" }}
        >
          Our <span className="text-[#FF3B3B]">Partners &amp; Collaborators</span>
        </h2>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          We work alongside an exceptional network of scouting agencies, football academies,
          sports management firms and club networks — all united by a shared mission to elevate football talent worldwide.
        </p>
      </div>

      {/* Partner cards grid */}
      {partners.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No partners listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}

      {/* Collaboration CTA */}
      <div className="mt-14 relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B3B]/5 via-transparent to-[#FF3B3B]/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF3B3B]/30 to-transparent" />
        <h3 className="text-xl font-semibold text-white mb-2">Want to Collaborate?</h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-5">
          We're always open to new partnerships with clubs, academies, agencies and organisations
          that share our vision of talent-first football discovery.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF3B3B] hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
        >
          Get in Touch
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  </section>
  );
};

export default Partners;

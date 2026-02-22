import { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const POSITIONS = ["FORWARD", "MIDFIELD", "DEFENDER", "GOALKEEPER", "WINGER"];
const AGE_GROUPS = ["U13", "U15", "U17", "U19", "Senior"];
const GENDERS = ["Male", "Female", "Other"];
const FEET = ["Left", "Right", "Both"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COMPETITION_TYPES = [
  "National Team", "Santosh Trophy", "I-League Senior", "I-League 2", "I-League 3",
  "State Franchise League", "Elite Youth I-League", "National Youth Championships",
  "Foreign Exposure", "RFDL", "State League", "State Youth League", "District League", "Other",
];
const COMP_RESULTS = ["Champion", "Runner-up", "Third", "Participant", ""];
const STATE_LEAGUES = [
  "", "Calcutta Premier Division", "Mizoram PL", "BDFA Super Division", "Goa Pro League",
  "Kerala PL", "Shillong PL", "Assam PL", "INAL", "Delhi PL", "Mumbai Elite",
];
const CLUB_TIERS = ["", "Tier 1", "Tier 2", "Tier 3"];

const gradeColors = {
  A: "bg-emerald-500/20 text-emerald-400", B: "bg-blue-500/20 text-blue-400",
  C: "bg-amber-500/20 text-amber-400", D: "bg-orange-500/20 text-orange-400",
  E: "bg-red-500/20 text-red-400", "N/A": "bg-gray-500/20 text-gray-400",
  INCOMPLETE: "bg-yellow-500/20 text-yellow-400",
};

const inputCls = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none text-sm text-white";
const selectCls = inputCls + " appearance-none";

const Field = ({ label, children, span = 1 }) => (
  <div className={span === 2 ? "col-span-2" : ""}>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    {children}
  </div>
);

const emptyForm = {
  name: "", age: "", age_group: "Senior", playingPosition: "FORWARD",
  alternativePosition: "", preferredFoot: "Right", transferMarketLink: "",
  playerId: "", dateOfBirth: "", nationality: "Indian", weight: "", height: "",
  gender: "Male", jersey_no: "", size: "M", city: "", address: "",
  mobileNumber: "", email: "", profileImage: "", scouting_notes: "",
  career_history: "", plId: "", stateLeague: "", clubTier: "",
  sprint30m: "", sprint50m: "", mentalityScore: 0, featured: false,
  competitions: [], clubsPlayed: [],
};

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPlayer, setViewPlayer] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [posFilter, setPosFilter] = useState("");

  useEffect(() => { fetchPlayers(); }, [page, posFilter]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (posFilter) params.playingPosition = posFilter;
      if (search) params.name = search;
      const res = await api.getPlayers(params);
      const data = res.data;
      setPlayers(data.players || data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPlayers();
  };

  const openCreate = () => {
    setEditingPlayer(null);
    setFormData({ ...emptyForm });
    setError("");
    setShowModal(true);
  };

  const openEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name || "",
      age: player.age || "",
      age_group: player.age_group || "Senior",
      playingPosition: player.playingPosition || "FORWARD",
      alternativePosition: player.alternativePosition || "",
      preferredFoot: player.preferredFoot || "Right",
      transferMarketLink: player.transferMarketLink || "",
      playerId: player.playerId || "",
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.slice(0, 10) : "",
      nationality: player.nationality || "Indian",
      weight: player.weight || "",
      height: player.height || "",
      gender: player.gender || "Male",
      jersey_no: player.jersey_no || "",
      size: player.size || "M",
      city: player.city || "",
      address: player.address || "",
      mobileNumber: player.mobileNumber || "",
      email: player.email || "",
      profileImage: player.profileImage || "",
      scouting_notes: player.scouting_notes || "",
      career_history: player.career_history || "",
      plId: player.plId || "",
      stateLeague: player.stateLeague || "",
      clubTier: player.clubTier || "",
      sprint30m: player.sprint30m || "",
      sprint50m: player.sprint50m || "",
      mentalityScore: player.mentalityScore || 0,
      featured: player.featured || false,
      competitions: player.competitions || [],
      clubsPlayed: player.clubsPlayed || [],
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Auto-calculate age from dateOfBirth
      let calculatedAge = formData.age ? Number(formData.age) : undefined;
      if (formData.dateOfBirth && !calculatedAge) {
        const dob = new Date(formData.dateOfBirth);
        const today = new Date();
        calculatedAge = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) calculatedAge--;
      }

      const payload = {
        ...formData,
        age: calculatedAge,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        jersey_no: formData.jersey_no ? Number(formData.jersey_no) : undefined,
        sprint30m: formData.sprint30m ? Number(formData.sprint30m) : undefined,
        sprint50m: formData.sprint50m ? Number(formData.sprint50m) : undefined,
        mentalityScore: Number(formData.mentalityScore),
      };

      // Remove undefined/empty optional fields so Joi doesn't choke on them
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === "") delete payload[key];
      });
      // Restore required fields that may be empty strings
      if (!payload.name) payload.name = formData.name;
      if (!payload.playerId) payload.playerId = formData.playerId;
      if (!payload.email) payload.email = formData.email;
      if (!payload.mobileNumber) payload.mobileNumber = formData.mobileNumber;

      if (editingPlayer) {
        await api.updatePlayer(editingPlayer._id, payload);
      } else {
        await api.createPlayer(payload);
      }
      setShowModal(false);
      fetchPlayers();
    } catch (err) {
      // Show field-level validation errors if available
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const msgs = data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        setError(msgs);
      } else {
        setError(data?.message || err.message || "Failed to save player");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete player "${name}"? This is a soft delete.`)) return;
    try {
      await api.deletePlayer(id);
      fetchPlayers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete player");
    }
  };

  const addCompetition = () => {
    setFormData(prev => ({
      ...prev,
      competitions: [...prev.competitions, { name: "", type: "Other", year: new Date().getFullYear(), result: "Participant" }],
    }));
  };

  const removeCompetition = (idx) => {
    setFormData(prev => ({
      ...prev,
      competitions: prev.competitions.filter((_, i) => i !== idx),
    }));
  };

  const updateCompetition = (idx, field, val) => {
    setFormData(prev => {
      const comps = [...prev.competitions];
      comps[idx] = { ...comps[idx], [field]: field === "year" ? Number(val) : val };
      return { ...prev, competitions: comps };
    });
  };

  const addClub = () => {
    setFormData(prev => ({
      ...prev,
      clubsPlayed: [...prev.clubsPlayed, { clubName: "", clubLogo: "", duration: "" }],
    }));
  };

  const removeClub = (idx) => {
    setFormData(prev => ({
      ...prev,
      clubsPlayed: prev.clubsPlayed.filter((_, i) => i !== idx),
    }));
  };

  const updateClub = (idx, field, val) => {
    setFormData(prev => {
      const clubs = [...prev.clubsPlayed];
      clubs[idx] = { ...clubs[idx], [field]: val };
      return { ...prev, clubsPlayed: clubs };
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">Player Management</h3>
          <p className="text-sm text-gray-400">{pagination.totalResults || players.length} players total</p>
        </div>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-red-500 text-white w-48"
            />
          </form>
          <select value={posFilter} onChange={(e) => { setPosFilter(e.target.value); setPage(1); }} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none">
            <option value="">All Positions</option>
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-all">
            <PlusIcon className="w-4 h-4" /> Add Player
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto" /></div>
      ) : players.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No players found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Player</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Position</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">ID</th>
                <th className="text-left py-3 px-3 text-gray-400 font-medium">Location</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Grade</th>
                <th className="text-center py-3 px-3 text-gray-400 font-medium">Score</th>
                <th className="text-right py-3 px-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.profileImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100"}
                        className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        alt=""
                      />
                      <div>
                        <p className="font-medium text-white">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{player.playingPosition}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs font-mono text-gray-400">
                      {player.playerId?.startsWith("TEMP") ? "No ID" : player.playerId}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{player.city || "N/A"}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${gradeColors[player.scoutReport?.grade] || gradeColors["N/A"]}`}>
                      {player.scoutReport?.grade || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-gray-300">{player.scoutReport?.totalScore || 0}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setViewPlayer(player); setShowViewModal(true); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="View">
                        <EyeIcon className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => openEdit(player)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Edit">
                        <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => handleDelete(player._id, player.name)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all" title="Delete">
                        <TrashIcon className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400">Page {pagination.currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-all">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{viewPlayer.name}</h3>
              <button onClick={() => setShowViewModal(false)}><XMarkIcon className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Position", viewPlayer.playingPosition],
                  ["Player ID", viewPlayer.playerId],
                  ["Age", viewPlayer.age],
                  ["DOB", viewPlayer.dateOfBirth?.slice(0, 10)],
                  ["Height", viewPlayer.height ? `${viewPlayer.height} cm` : "N/A"],
                  ["Weight", viewPlayer.weight ? `${viewPlayer.weight} kg` : "N/A"],
                  ["City", viewPlayer.city],
                  ["Nationality", viewPlayer.nationality],
                  ["Email", viewPlayer.email],
                  ["Phone", viewPlayer.mobileNumber],
                  ["Grade", viewPlayer.scoutReport?.grade],
                  ["Score", viewPlayer.scoutReport?.totalScore],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white/5 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{l}</p>
                    <p className="text-white">{v || "N/A"}</p>
                  </div>
                ))}
              </div>
              {viewPlayer.clubsPlayed?.length > 0 && (
                <div>
                  <p className="text-gray-400 mb-1 font-medium">Clubs</p>
                  {viewPlayer.clubsPlayed.map((c, i) => (
                    <p key={i} className="text-gray-300">{c.clubName} ({c.duration})</p>
                  ))}
                </div>
              )}
              {viewPlayer.competitions?.length > 0 && (
                <div>
                  <p className="text-gray-400 mb-1 font-medium">Competitions ({viewPlayer.competitions.length})</p>
                  {viewPlayer.competitions.map((c, i) => (
                    <p key={i} className="text-gray-300">{c.name} — {c.type} ({c.year}) {c.result && `• ${c.result}`}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold">{editingPlayer ? "Edit Player" : "Add New Player"}</h3>
              <button onClick={() => setShowModal(false)}><XMarkIcon className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Basic Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full Name *" span={2}>
                    <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Player ID *">
                    <input required value={formData.playerId} onChange={e => setFormData(p => ({ ...p, playerId: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="PL ID">
                    <input value={formData.plId} onChange={e => setFormData(p => ({ ...p, plId: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Date of Birth *">
                    <input type="date" required value={formData.dateOfBirth} onChange={e => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Age">
                    <input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Age Group">
                    <select value={formData.age_group} onChange={e => setFormData(p => ({ ...p, age_group: e.target.value }))} className={selectCls}>
                      {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Gender *">
                    <select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))} className={selectCls}>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="Nationality">
                    <input value={formData.nationality} onChange={e => setFormData(p => ({ ...p, nationality: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="City">
                    <input value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* Physical & Position */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Position & Physical</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Field label="Playing Position *">
                    <select value={formData.playingPosition} onChange={e => setFormData(p => ({ ...p, playingPosition: e.target.value }))} className={selectCls}>
                      {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Alt. Position">
                    <input value={formData.alternativePosition} onChange={e => setFormData(p => ({ ...p, alternativePosition: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Preferred Foot">
                    <select value={formData.preferredFoot} onChange={e => setFormData(p => ({ ...p, preferredFoot: e.target.value }))} className={selectCls}>
                      {FEET.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                  <Field label="Height (cm)">
                    <input type="number" value={formData.height} onChange={e => setFormData(p => ({ ...p, height: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Weight (kg)">
                    <input type="number" value={formData.weight} onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Jersey No">
                    <input type="number" min="0" max="99" value={formData.jersey_no} onChange={e => setFormData(p => ({ ...p, jersey_no: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Size">
                    <select value={formData.size} onChange={e => setFormData(p => ({ ...p, size: e.target.value }))} className={selectCls}>
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Contact</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email *">
                    <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Mobile Number *">
                    <input required value={formData.mobileNumber} onChange={e => setFormData(p => ({ ...p, mobileNumber: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Address" span={2}>
                    <input value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* Scout Report Inputs */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Scout Report Data</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Field label="Transfer Market Link">
                    <input value={formData.transferMarketLink} onChange={e => setFormData(p => ({ ...p, transferMarketLink: e.target.value }))} className={inputCls} placeholder="https://..." />
                  </Field>
                  <Field label="State League">
                    <select value={formData.stateLeague} onChange={e => setFormData(p => ({ ...p, stateLeague: e.target.value }))} className={selectCls}>
                      {STATE_LEAGUES.map(s => <option key={s} value={s}>{s || "None"}</option>)}
                    </select>
                  </Field>
                  <Field label="Club Tier">
                    <select value={formData.clubTier} onChange={e => setFormData(p => ({ ...p, clubTier: e.target.value }))} className={selectCls}>
                      {CLUB_TIERS.map(t => <option key={t} value={t}>{t || "Auto-detect"}</option>)}
                    </select>
                  </Field>
                  <Field label="Sprint 30m (sec)">
                    <input type="number" step="0.1" value={formData.sprint30m} onChange={e => setFormData(p => ({ ...p, sprint30m: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Sprint 50m (sec)">
                    <input type="number" step="0.1" value={formData.sprint50m} onChange={e => setFormData(p => ({ ...p, sprint50m: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Mentality Score">
                    <select value={formData.mentalityScore} onChange={e => setFormData(p => ({ ...p, mentalityScore: Number(e.target.value) }))} className={selectCls}>
                      <option value={0}>0 – No data</option>
                      <option value={1}>1 – Good</option>
                      <option value={2}>2 – Strong</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* Competitions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Competitions ({formData.competitions.length})</h4>
                  <button type="button" onClick={addCompetition} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                    <PlusIcon className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.competitions.map((comp, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-white/5 rounded-lg p-2">
                      <div className="col-span-4">
                        <label className="text-[10px] text-gray-500">Name</label>
                        <input value={comp.name} onChange={e => updateCompetition(idx, "name", e.target.value)} className={inputCls} />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-500">Type</label>
                        <select value={comp.type} onChange={e => updateCompetition(idx, "type", e.target.value)} className={selectCls}>
                          {COMPETITION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500">Year</label>
                        <input type="number" value={comp.year} onChange={e => updateCompetition(idx, "year", e.target.value)} className={inputCls} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] text-gray-500">Result</label>
                        <select value={comp.result} onChange={e => updateCompetition(idx, "result", e.target.value)} className={selectCls}>
                          {COMP_RESULTS.map(r => <option key={r} value={r}>{r || "N/A"}</option>)}
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button type="button" onClick={() => removeCompetition(idx)} className="p-1 hover:bg-red-500/20 rounded"><TrashIcon className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clubs Played */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Clubs Played ({formData.clubsPlayed.length})</h4>
                  <button type="button" onClick={addClub} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                    <PlusIcon className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formData.clubsPlayed.map((club, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-white/5 rounded-lg p-2">
                      <div className="col-span-5">
                        <label className="text-[10px] text-gray-500">Club Name</label>
                        <input value={club.clubName} onChange={e => updateClub(idx, "clubName", e.target.value)} className={inputCls} />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-500">Duration</label>
                        <input value={club.duration} onChange={e => updateClub(idx, "duration", e.target.value)} className={inputCls} placeholder="2020-2022" />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] text-gray-500">Logo URL</label>
                        <input value={club.clubLogo} onChange={e => updateClub(idx, "clubLogo", e.target.value)} className={inputCls} />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button type="button" onClick={() => removeClub(idx)} className="p-1 hover:bg-red-500/20 rounded"><TrashIcon className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Additional</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Profile Image URL">
                    <input value={formData.profileImage} onChange={e => setFormData(p => ({ ...p, profileImage: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Scouting Notes">
                    <textarea rows={2} value={formData.scouting_notes} onChange={e => setFormData(p => ({ ...p, scouting_notes: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Career History">
                    <textarea rows={2} value={formData.career_history} onChange={e => setFormData(p => ({ ...p, career_history: e.target.value }))} className={inputCls} />
                  </Field>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded bg-white/5 border-white/10 text-red-500" />
                    <span className="text-gray-300">Featured Player</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-all disabled:opacity-50">
                  {saving ? "Saving..." : editingPlayer ? "Update Player" : "Create Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManagement;

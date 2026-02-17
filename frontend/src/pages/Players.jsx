import { useState, useEffect } from 'react';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { 
  LinkedInLogoIcon, 
  InstagramLogoIcon 
} from '@radix-ui/react-icons';
import axios from 'axios';
import FloatingShapes from '../components/common/FloatingShapes';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  // Filter states
  const [filters, setFilters] = useState({
    position: '',
    ageMin: '',
    ageMax: '',
    heightMin: '',
    heightMax: '',
    city: '',
    minExperience: '',
    searchQuery: ''
  });

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker'];

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, players, sortBy]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.get(`${apiUrl}/api/players`);
      const playersList = response.data.players || response.data || [];
      setPlayers(playersList);
      setFilteredPlayers(playersList);
    } catch (err) {
      console.error('Error fetching players:', err);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockPlayers = [
      {
        _id: '1',
        name: 'Alex Martinez',
        playingPosition: 'Goalkeeper',
        age: 25,
        height: 188,
        city: 'Madrid',
        nationality: 'Spain',
        profileImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
        email: 'alex@example.com',
        mobileNumber: '+34 123 456 789',
        clubsPlayed: [{ clubName: 'Madrid FC Academy', duration: '2020-2024' }]
      },
      {
        _id: '2',
        name: 'Carlos Fernandez',
        playingPosition: 'Midfielder',
        age: 24,
        height: 178,
        city: 'Barcelona',
        nationality: 'Spain',
        profileImage: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400',
        email: 'carlos@example.com',
        mobileNumber: '+34 123 456 790',
        clubsPlayed: [{ clubName: 'Valencia Academy', duration: '2019-2024' }]
      },
      {
        _id: '3',
        name: 'David Thompson',
        playingPosition: 'Defender',
        age: 26,
        height: 185,
        city: 'New York',
        nationality: 'USA',
        profileImage: 'https://images.unsplash.com/photo-1577212017184-80cc0da11082?w=400',
        email: 'david@example.com',
        mobileNumber: '+1 555 123 4567',
        clubsPlayed: [{ clubName: 'United Academy', duration: '2018-2024' }]
      },
      {
        _id: '4',
        name: 'James Rodriguez',
        playingPosition: 'Midfielder',
        age: 23,
        height: 180,
        city: 'London',
        nationality: 'England',
        profileImage: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
        email: 'james@example.com',
        mobileNumber: '+44 20 1234 5678',
        clubsPlayed: [{ clubName: 'Manchester Academy', duration: '2020-2024' }]
      },
      {
        _id: '5',
        name: 'Marcus Silva',
        playingPosition: 'Forward',
        age: 22,
        height: 183,
        city: 'Rio de Janeiro',
        nationality: 'Brazil',
        profileImage: 'https://images.unsplash.com/photo-1594649781961-5c56f04f6e7f?w=400',
        email: 'marcus@example.com',
        mobileNumber: '+55 21 98765 4321',
        clubsPlayed: [{ clubName: 'Academy', duration: '2019-2024' }]
      },
      {
        _id: '6',
        name: 'Michael Brown',
        playingPosition: 'Forward',
        age: 27,
        height: 182,
        city: 'Los Angeles',
        nationality: 'USA',
        profileImage: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=400',
        email: 'michael@example.com',
        mobileNumber: '+1 555 987 6543',
        clubsPlayed: [{ clubName: 'LA Academy', duration: '2017-2024' }]
      }
    ];
    setPlayers(mockPlayers);
    setFilteredPlayers(mockPlayers);
  };

  const applyFilters = () => {
    let filtered = [...players];

    // Search query
    if (filters.searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        player.playingPosition?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        player.city?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Position filter
    if (filters.position) {
      filtered = filtered.filter(player =>
        player.playingPosition?.toLowerCase().includes(filters.position.toLowerCase())
      );
    }

    // Age filter
    if (filters.ageMin) {
      filtered = filtered.filter(player => player.age >= parseInt(filters.ageMin));
    }
    if (filters.ageMax) {
      filtered = filtered.filter(player => player.age <= parseInt(filters.ageMax));
    }

    // Height filter
    if (filters.heightMin) {
      filtered = filtered.filter(player => player.height >= parseInt(filters.heightMin));
    }
    if (filters.heightMax) {
      filtered = filtered.filter(player => player.height <= parseInt(filters.heightMax));
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(player =>
        player.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'age') {
        return a.age - b.age;
      } else if (sortBy === 'height') {
        return (b.height || 0) - (a.height || 0);
      }
      return 0;
    });

    setFilteredPlayers(filtered);
  };

  const clearFilters = () => {
    setFilters({
      position: '',
      ageMin: '',
      ageMax: '',
      heightMin: '',
      heightMax: '',
      city: '',
      minExperience: '',
      searchQuery: ''
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
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
                {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} found
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
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 backdrop-blur-sm cursor-pointer"
              >
                <option value="name" className="bg-gray-900">Name</option>
                <option value="age" className="bg-gray-900">Age</option>
                <option value="height" className="bg-gray-900">Height</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
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
                showFilters ? 'block' : 'hidden'
              } lg:block w-full lg:w-72 flex-shrink-0`}
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
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
                  >
                    <option value="" className="bg-gray-900">All Positions</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos} className="bg-gray-900">{pos}</option>
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
                      onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageMax}
                      onChange={(e) => handleFilterChange('ageMax', e.target.value)}
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
                      onChange={(e) => handleFilterChange('heightMin', e.target.value)}
                      className="w-1/2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.heightMax}
                      onChange={(e) => handleFilterChange('heightMax', e.target.value)}
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
                    placeholder="e.g., Los Angeles"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                {/* Min Experience */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Min Experience (years)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minExperience}
                    onChange={(e) => handleFilterChange('minExperience', e.target.value)}
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
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredPlayers.map((player) => (
                    <PlayerCard key={player._id} player={player} viewMode={viewMode} />
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

// Player Card Component
const PlayerCard = ({ player, viewMode }) => {
  const getPositionColor = (position) => {
    const colors = {
      goalkeeper: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      defender: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      midfielder: 'bg-green-500/20 text-green-400 border-green-500/40',
      forward: 'bg-red-500/20 text-red-400 border-red-500/40',
      winger: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      striker: 'bg-red-500/20 text-red-400 border-red-500/40',
    };
    const key = position?.toLowerCase() || '';
    return colors[key] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
            <img
              src={player.profileImage || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'}
              alt={player.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-red-500 transition-colors duration-300">
              {player.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getPositionColor(player.playingPosition)}`}>
                {player.playingPosition}
              </span>
              {player.age && (
                <span className="text-xs text-gray-400">
                  {player.age} years
                </span>
              )}
            </div>
            {player.clubsPlayed?.[0]?.clubName && (
              <p className="text-sm text-gray-400 truncate">
                {player.clubsPlayed[0].clubName}
              </p>
            )}
            {player.city && (
              <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{player.city}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`https://linkedin.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 group/btn"
              title="LinkedIn"
            >
              <LinkedInLogoIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
            </a>
            <a
              href={`tel:${player.mobileNumber}`}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-green-500 hover:border-green-500 transition-all duration-300 group/btn"
              title="Call"
            >
              <PhoneIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
            </a>
            <a
              href={`https://instagram.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group/btn"
              title="Instagram"
            >
              <InstagramLogoIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden relative">
        <img
          src={player.profileImage || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'}
          alt={player.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Position Badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-xs px-3 py-1.5 rounded-full border font-semibold backdrop-blur-md ${getPositionColor(player.playingPosition)}`}>
            {player.playingPosition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
          {player.name}
        </h3>

        {player.clubsPlayed?.[0]?.clubName && (
          <p className="text-sm text-gray-400 mb-3">
            {player.clubsPlayed[0].clubName}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {player.city && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPinIcon className="w-4 h-4" />
              <span>{player.city}, {player.nationality || 'Unknown'}</span>
            </div>
          )}
          {player.age && player.height && (
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Age: {player.age}</span>
              <span>•</span>
              <span>Height: {player.height}cm</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          <a
            href={`https://linkedin.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-500 hover:border-blue-500 transition-all duration-300 flex items-center justify-center group/btn"
            title="LinkedIn"
          >
            <LinkedInLogoIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />
          </a>
          <a
            href={`tel:${player.mobileNumber}`}
            className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-green-500 hover:border-green-500 transition-all duration-300 flex items-center justify-center group/btn"
            title="Call"
          >
            <PhoneIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />
          </a>
          <a
            href={`https://instagram.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 flex items-center justify-center group/btn"
            title="Instagram"
          >
            <InstagramLogoIcon className="w-5 h-5 text-gray-400 group-hover/btn:text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Players;

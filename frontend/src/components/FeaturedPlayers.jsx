import { useState, useEffect } from 'react';
import { ArrowRightIcon, MapPinIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const FeaturedPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/players`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      
      const data = await response.json();
      // Backend returns { players: [...], currentPage, totalPages, totalResults }
      const playersList = data.players || [];
      // Get first 3 players for featured section
      setPlayers(playersList.slice(0, 3));
      setError(null);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Players</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Players</h2>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Unable to load players: {error}</p>
            <button
              onClick={fetchPlayers}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Players</h2>
          <a
            href="#players"
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors duration-300 group"
          >
            View All
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player._id}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20"
            >
              {/* Player Image */}
              <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {player.profileImage ? (
                  <img
                    src={player.profileImage}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                {/* Position Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  {player.position}
                </div>
              </div>

              {/* Player Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                  {player.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-400">
                  {player.nationality && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-red-500" />
                      <span>{player.nationality}</span>
                    </div>
                  )}
                  
                  {player.rating && (
                    <div className="flex items-center gap-2">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />
                      <span>Rating: {player.rating}</span>
                    </div>
                  )}
                  
                  {player.club && (
                    <div className="text-gray-500 text-xs">
                      Club: {player.club}
                    </div>
                  )}
                </div>

                {/* View Profile Button */}
                <button className="mt-4 w-full py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {players.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No featured players available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPlayers;

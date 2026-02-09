
import React, { useState, useEffect, useMemo } from 'react';
import { Channel, AppRoute } from './types';
import { fetchAndParseM3U, filterChannels } from './services/iptvService';
import { IPTV_SOURCES, CATEGORIES } from './constants';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import ChannelCard from './components/ChannelCard';

const FAVORITES_KEY = 'openstream_favorites';

const App: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Channel[]>([]);

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      const results = await Promise.all([
        fetchAndParseM3U(IPTV_SOURCES.CATEGORY_NEWS),
        fetchAndParseM3U(IPTV_SOURCES.CATEGORY_MOVIES),
        fetchAndParseM3U(IPTV_SOURCES.CATEGORY_SPORTS),
        fetchAndParseM3U(IPTV_SOURCES.CATEGORY_MUSIC),
        fetchAndParseM3U(IPTV_SOURCES.CATEGORY_ENTERTAINMENT),
      ]);
      
      const combined = results.flat().filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);
      setChannels(combined);
      setLoading(false);
    };

    loadChannels();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(saved);
  };

  const filteredChannels = useMemo(() => {
    if (currentRoute === AppRoute.FAVORITES) {
      return filterChannels(favorites, searchQuery, selectedCategory);
    }
    return filterChannels(channels, searchQuery, selectedCategory);
  }, [channels, favorites, searchQuery, selectedCategory, currentRoute]);

  const featuredChannel = useMemo(() => {
    if (channels.length === 0) return null;
    return channels.find(c => c.category.toLowerCase() === 'news') || channels[0];
  }, [channels]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsMinimized(false);
  };

  const handleNextChannel = () => {
    if (!selectedChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(c => c.url === selectedChannel.url);
    const nextIndex = (currentIndex + 1) % filteredChannels.length;
    setSelectedChannel(filteredChannels[nextIndex]);
  };

  const handlePrevChannel = () => {
    if (!selectedChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(c => c.url === selectedChannel.url);
    const prevIndex = (currentIndex - 1 + filteredChannels.length) % filteredChannels.length;
    setSelectedChannel(filteredChannels[prevIndex]);
  };

  // Sync favorites when video player close/action might have modified them
  const handlePlayerClose = () => {
    setSelectedChannel(null);
    setIsMinimized(false);
    loadFavorites();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLegalClick={() => setCurrentRoute(AppRoute.LEGAL)}
        onHomeClick={() => {
          setCurrentRoute(AppRoute.HOME);
          setSearchQuery('');
          setSelectedCategory('all');
        }}
        onFavoritesClick={() => {
          setCurrentRoute(AppRoute.FAVORITES);
          loadFavorites();
          setSearchQuery('');
        }}
      />

      <main className="flex-1 pb-20">
        {currentRoute === AppRoute.HOME && !searchQuery && selectedCategory === 'all' && (
          <>
            {/* Hero Section */}
            {featuredChannel && (
              <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                <img 
                  src={`https://picsum.photos/seed/${featuredChannel.name}/1920/1080`} 
                  alt="Featured Background" 
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute bottom-0 left-0 p-6 md:p-16 z-20 max-w-2xl">
                  <span className="bg-red-600 text-xs font-black px-2 py-1 rounded mb-4 inline-block tracking-tighter uppercase">FEATURED LIVE</span>
                  <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none">{featuredChannel.name}</h1>
                  <p className="text-slate-300 md:text-xl mb-8 line-clamp-2 md:line-clamp-3">
                    Watch the latest {featuredChannel.category.toLowerCase()} streams from around the world. High-quality, free-to-air, and fully legal streaming.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleChannelSelect(featuredChannel)}
                      className="bg-white text-black px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Watch Now
                    </button>
                    <button 
                      onClick={() => setCurrentRoute(AppRoute.LEGAL)}
                      className="bg-slate-800/80 backdrop-blur text-white px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-slate-700 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Preview Row if on Home */}
            {favorites.length > 0 && (
              <section className="px-6 md:px-16 mt-12 relative z-30">
                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  My Favorites
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {favorites.slice(0, 6).map(channel => (
                    <ChannelCard key={channel.url + 'fav'} channel={channel} onClick={handleChannelSelect} />
                  ))}
                  {favorites.length > 6 && (
                    <div 
                      onClick={() => setCurrentRoute(AppRoute.FAVORITES)}
                      className="flex items-center justify-center bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:bg-slate-900 hover:border-red-600 transition-all group"
                    >
                      <span className="font-bold text-slate-500 group-hover:text-red-500">View All ({favorites.length})</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Content Rows */}
            <div className="px-6 md:px-16 mt-12 relative z-30 space-y-12">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                const catChannels = channels.filter(ch => ch.category.toLowerCase().includes(cat.id));
                if (catChannels.length === 0) return null;
                return (
                  <section key={cat.id}>
                    <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                      {cat.name}
                      <span className="text-slate-500 text-sm font-medium">{catChannels.length} Channels</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {catChannels.slice(0, 12).map(channel => (
                        <ChannelCard key={channel.url} channel={channel} onClick={handleChannelSelect} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}

        {/* Favorites Page / Search Results / All Channels */}
        {(currentRoute === AppRoute.FAVORITES || searchQuery || currentRoute !== AppRoute.HOME || selectedCategory !== 'all') && currentRoute !== AppRoute.LEGAL && (
          <div className="pt-24 px-6 md:px-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
                  {currentRoute === AppRoute.FAVORITES && (
                     <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                  )}
                  {currentRoute === AppRoute.FAVORITES ? 'My List' : searchQuery ? `Search results for "${searchQuery}"` : selectedCategory !== 'all' ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Browse All Channels'}
                </h2>
                <p className="text-slate-500 mt-2">Showing {filteredChannels.length} results</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-slate-400 font-medium">Scanning live sources...</p>
              </div>
            ) : filteredChannels.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                {filteredChannels.map(channel => (
                  <ChannelCard key={channel.url} channel={channel} onClick={handleChannelSelect} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold mb-2">
                  {currentRoute === AppRoute.FAVORITES ? "You haven't added any favorites yet." : "No Channels Found"}
                </h3>
                {currentRoute === AppRoute.FAVORITES ? (
                  <button 
                    onClick={() => setCurrentRoute(AppRoute.HOME)}
                    className="mt-6 text-red-500 font-bold hover:underline"
                  >
                    Browse trending channels
                  </button>
                ) : (
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                    className="mt-6 text-red-500 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {currentRoute === AppRoute.LEGAL && (
          <div className="pt-24 px-6 md:px-16 max-w-4xl mx-auto">
             <h1 className="text-4xl font-black mb-8">Legal Compliance</h1>
             <p className="text-slate-300 leading-relaxed mb-8">
               OpenStream OTT is an aggregator application. We do not host any video content. All streams are played directly from their respective source servers.
             </p>
             <button 
              onClick={() => setCurrentRoute(AppRoute.HOME)}
              className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200"
             >
               Back to Home
             </button>
          </div>
        )}
      </main>

      {/* Persistent Video Player Overlay */}
      {selectedChannel && (
        <VideoPlayer 
          channel={selectedChannel} 
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(true)}
          onExpand={() => setIsMinimized(false)}
          onClose={handlePlayerClose}
          onNext={handleNextChannel}
          onPrevious={handlePrevChannel}
        />
      )}

      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 text-center">
        <span className="text-xl font-black tracking-tighter">OPENSTREAM OTT</span>
      </footer>
    </div>
  );
};

export default App;

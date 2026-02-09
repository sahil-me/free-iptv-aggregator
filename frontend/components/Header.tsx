
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLegalClick: () => void;
  onHomeClick: () => void;
  onFavoritesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, onLegalClick, onHomeClick, onFavoritesClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 md:px-16 py-4 flex items-center justify-between ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-10">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-red-600 text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter">OPENSTREAM</span>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <button onClick={onHomeClick} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Home</button>
          <button onClick={onFavoritesClick} className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            My List
          </button>
          <button onClick={() => setSearchQuery('')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Live TV</button>
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative group hidden sm:block">
          <input 
            type="text" 
            placeholder="Search channels..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:bg-slate-900 w-40 md:w-64 transition-all"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button 
          onClick={onLegalClick}
          className="text-slate-400 hover:text-white transition-colors"
          title="Legal Disclaimer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-xs font-bold shadow-lg shadow-red-600/20">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;

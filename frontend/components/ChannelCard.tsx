
import React from 'react';
import { Channel } from '../types';
import { FALLBACK_LOGO } from '../constants';

interface ChannelCardProps {
  channel: Channel;
  onClick: (channel: Channel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onClick }) => {
  return (
    <div 
      onClick={() => onClick(channel)}
      className="group relative flex flex-col gap-2 cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="aspect-video w-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700 group-hover:border-red-600 relative">
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.name} 
              className="max-w-full max-h-full object-contain filter drop-shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_LOGO; }}
            />
          ) : (
            <div className="text-slate-500 font-bold text-center">
              <div className="text-2xl mb-1">{channel.name.charAt(0)}</div>
              <div className="text-[10px] uppercase tracking-widest">{channel.category}</div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 rounded-full p-3 shadow-xl">
            <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="bg-red-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Live</span>
        </div>
      </div>
      <div className="px-1">
        <h3 className="text-sm font-semibold truncate text-slate-100 group-hover:text-red-500 transition-colors">{channel.name}</h3>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{channel.category}</p>
      </div>
    </div>
  );
};

export default ChannelCard;
